import { readProject, type StudioProject } from './model';

export interface ProjectSnapshot { id: string; projectId: string; savedAt: number; project: StudioProject }
const MAX_SNAPSHOTS = 10;
let database: Promise<IDBDatabase> | undefined;

function db(): Promise<IDBDatabase> {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open('booksane-studio', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('projects', { keyPath: 'id' });
      const snapshots = request.result.createObjectStore('snapshots', { keyPath: 'id' });
      snapshots.createIndex('projectId', 'projectId');
    };
    request.onsuccess = () => {
      const connection = request.result;
      // The browser can close the connection (site data cleared, low storage, another tab upgrading).
      // Forget it so the next save opens a fresh one instead of failing forever.
      connection.onclose = () => { database = undefined; };
      connection.onversionchange = () => { connection.close(); database = undefined; };
      resolve(connection);
    };
    request.onerror = () => { database = undefined; reject(request.error); };
    request.onblocked = () => { database = undefined; reject(new Error('Booksane is open in another tab that needs closing first.')); };
  });
  return database;
}

/** Runs an operation, reopening the database once if the old connection was closed underneath us. */
async function withDb<T>(run: (connection: IDBDatabase) => Promise<T>): Promise<T> {
  try {
    return await run(await db());
  } catch (error) {
    if (error instanceof DOMException && error.name === 'InvalidStateError') {
      database = undefined;
      return run(await db());
    }
    throw error;
  }
}

/** Asks the browser not to clear Booksane's storage when space runs low. Harmless if refused. */
export function keepStorage() {
  try { void navigator.storage?.persist?.(); } catch { /* not supported */ }
}

export function listProjects(): Promise<StudioProject[]> {
  return withDb(connection => new Promise((resolve, reject) => {
    const request = connection.transaction('projects').objectStore('projects').getAll();
    request.onsuccess = () => resolve(request.result.map(readProject).sort((a: StudioProject, b: StudioProject) => b.updatedAt - a.updatedAt));
    request.onerror = () => reject(request.error);
  }));
}

class StaleRevision extends Error {}

function write(connection: IDBDatabase, project: StudioProject, snapshot: boolean, keep: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = connection.transaction(['projects', 'snapshots'], 'readwrite');
    let stale = false;
    const projects = transaction.objectStore('projects');
    const current = projects.get(project.id);
    current.onsuccess = () => {
      const previous = current.result as StudioProject | undefined;
      if (previous && previous.revision > project.revision) { stale = true; transaction.abort(); return; }
      projects.put(project);
      if (snapshot) {
        const snapshots = transaction.objectStore('snapshots');
        snapshots.put({ id: crypto.randomUUID(), projectId: project.id, savedAt: Date.now(), project });
        const all = snapshots.index('projectId').getAll(project.id);
        all.onsuccess = () => (all.result as ProjectSnapshot[]).sort((a, b) => b.savedAt - a.savedAt).slice(keep).forEach(s => snapshots.delete(s.id));
      }
    };
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(stale ? new StaleRevision('A newer version of this book is open in another tab. Download a backup before reopening it.') : transaction.error || new Error('Could not save this book.'));
  });
}

/** Removes every checkpoint of a book except the newest `keep`. Used to free space. */
function trimSnapshots(connection: IDBDatabase, projectId: string, keep: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = connection.transaction('snapshots', 'readwrite');
    const store = transaction.objectStore('snapshots');
    const all = store.index('projectId').getAll(projectId);
    all.onsuccess = () => (all.result as ProjectSnapshot[]).sort((a, b) => b.savedAt - a.savedAt).slice(keep).forEach(s => store.delete(s.id));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function saveProject(project: StudioProject, snapshot = false): Promise<void> {
  readProject(project);
  try {
    await withDb(connection => write(connection, project, snapshot, MAX_SNAPSHOTS));
  } catch (error) {
    // Out of space: make room by keeping fewer checkpoints of this book, then save without a new one.
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      await withDb(connection => trimSnapshots(connection, project.id, 2));
      try { await withDb(connection => write(connection, project, false, 2)); return; }
      catch { throw new Error('Your device is out of space for Booksane. Download a backup from Export, then free some space.'); }
    }
    throw error;
  }
}

export function projectSnapshots(projectId: string): Promise<ProjectSnapshot[]> {
  return withDb(connection => new Promise((resolve, reject) => {
    const request = connection.transaction('snapshots').objectStore('snapshots').index('projectId').getAll(projectId);
    request.onsuccess = () => resolve(request.result.sort((a: ProjectSnapshot, b: ProjectSnapshot) => b.savedAt - a.savedAt));
    request.onerror = () => reject(request.error);
  }));
}

/** Test hook: closes the current connection the way a browser might. */
export async function _closeConnectionForTests() { (await db()).close(); }
