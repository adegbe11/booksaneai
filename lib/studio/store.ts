import { readProject, type StudioProject } from './model';

export interface ProjectSnapshot { id: string; projectId: string; savedAt: number; project: StudioProject }
let database: Promise<IDBDatabase> | undefined;
function db(): Promise<IDBDatabase> {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open('booksane-studio', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('projects', { keyPath: 'id' });
      const snapshots = request.result.createObjectStore('snapshots', { keyPath: 'id' });
      snapshots.createIndex('projectId', 'projectId');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => { database = undefined; reject(request.error); };
  });
  return database;
}
export async function listProjects(): Promise<StudioProject[]> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const request = database.transaction('projects').objectStore('projects').getAll();
    request.onsuccess = () => resolve(request.result.map(readProject).sort((a: StudioProject, b: StudioProject) => b.updatedAt - a.updatedAt));
    request.onerror = () => reject(request.error);
  });
}
export async function saveProject(project: StudioProject, snapshot = false): Promise<void> {
  readProject(project);
  const database = await db();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['projects', 'snapshots'], 'readwrite');
    const projects = transaction.objectStore('projects');
    const current = projects.get(project.id);
    current.onsuccess = () => {
      const previous = current.result as StudioProject | undefined;
      if (previous && previous.revision > project.revision) { transaction.abort(); return; }
      projects.put(project);
      if (snapshot) {
        const snapshots = transaction.objectStore('snapshots');
        snapshots.put({ id: crypto.randomUUID(), projectId: project.id, savedAt: Date.now(), project });
        const all = snapshots.index('projectId').getAll(project.id);
        all.onsuccess = () => (all.result as ProjectSnapshot[]).sort((a, b) => b.savedAt - a.savedAt).slice(10).forEach(s => snapshots.delete(s.id));
      }
    };
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Could not save this project.'));
    transaction.onabort = () => reject(new Error('A newer revision exists. Download your backup before reopening the project.'));
  });
}
export async function projectSnapshots(projectId: string): Promise<ProjectSnapshot[]> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const request = database.transaction('snapshots').objectStore('snapshots').index('projectId').getAll(projectId);
    request.onsuccess = () => resolve(request.result.sort((a: ProjectSnapshot, b: ProjectSnapshot) => b.savedAt - a.savedAt));
    request.onerror = () => reject(request.error);
  });
}
