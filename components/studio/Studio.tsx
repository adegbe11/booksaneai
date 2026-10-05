'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, BookOpen, Check, ChevronRight, Download, FileText, FolderOpen, LayoutTemplate, Loader2, Plus, Search, Settings2, ShieldCheck, Upload, X, StickyNote, Superscript, Replace, Bold, Italic, List, Quote, Undo2, Redo2, Table2, Minus, Copy, Trash2, History, Eye, PenLine, ImagePlus } from 'lucide-react';
import { studioExtensions } from '@/lib/studio/extensions';
import { documentHtml, documentText, newProject, newSection, projectWords, studioChecks, words, type StudioProject, type StudioSection } from '@/lib/studio/model';
import { listProjects, saveProject, projectSnapshots, type ProjectSnapshot } from '@/lib/studio/store';
import { importFile, migrateRecent } from '@/lib/studio/import';
import { STORE_NAMES, studioEpub, type EpubTarget } from '@/lib/studio/publication';
import type { RecentBook } from '@/types';
import { StartingChoices, BookSetup, ImportWelcome, WorkflowHelp, ContextGuide } from './FirstBook';
import DesignStudio from './DesignStudio';
import Navigator, { todayKey } from './Navigator';
import Library from './Library';
import PublishingPanel from './PublishingPanel';
import FindReplace from './FindReplace';
import BoxSetDialog from './BoxSetDialog';
import './studio.css';

function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000); }
function filename(project: StudioProject) { return project.title.replace(/[^\p{L}\p{N} _-]/gu, '').trim().replace(/\s+/g, '-') || 'book'; }
function Logo() { return <span className="studio-logo"><span className="logo-symbol"><BookOpen size={19}/></span>booksane<span className="studio-label">STUDIO</span></span>; }

export default function Studio() {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [project, setProject] = useState<StudioProject | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState<'write' | 'design'>('write');
  const [panel, setPanel] = useState<'details' | 'checks' | 'history'>('details');
  const [saveState, setSaveState] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [query, setQuery] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [guideVisible, setGuideVisible] = useState(true);
  const [sampleActive, setSampleActive] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>([]);
  const [editorEpoch, setEditorEpoch] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const latest = useRef<StudioProject | null>(null);
  const snapshotTime = useRef(0);

  useEffect(() => {
    const protect = (event: BeforeUnloadEvent) => { if (latest.current && saveState !== 'Saved on this device') { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', protect);
    return () => window.removeEventListener('beforeunload', protect);
  }, [saveState]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await listProjects();
        const legacy = JSON.parse(localStorage.getItem('booksane_recent') || '[]') as RecentBook[];
        if (Array.isArray(legacy)) for (const book of legacy) {
          if (book.bookData && !all.some(p => p.id === `legacy-${book.id}`)) { const recovered = migrateRecent(book); await saveProject(recovered, true); all.push(recovered); }
        }
        if (alive) setProjects(all.sort((a, b) => b.updatedAt - a.updatedAt));
      } catch { if (alive) setNotice('Local storage is unavailable. Download a project backup before leaving.'); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    latest.current = project;
    if (!project) return;
    setSaveState('Saving…');
    const timer = setTimeout(async () => {
      try {
        const checkpoint = Date.now() - snapshotTime.current > 30000;
        await saveProject(project, checkpoint);
        if (checkpoint) snapshotTime.current = Date.now();
        if (latest.current?.id === project.id && latest.current.revision === project.revision) setSaveState('Saved on this device');
        setProjects(prev => [project, ...prev.filter(p => p.id !== project.id)]);
      } catch (error) { setSaveState('Save failed'); setNotice(error instanceof Error ? error.message : 'Could not save. Download a project backup.'); }
    }, 500);
    return () => clearTimeout(timer);
  }, [project]);

  const change = useCallback((update: (p: StudioProject) => StudioProject) => setProject(prev => prev ? { ...update(prev), revision: prev.revision + 1, updatedAt: Date.now() } : prev), []);
  useEffect(() => {
    if (!project || (!project.goals?.target && !project.goals?.daily)) return;
    const key = todayKey();
    if (project.goals.history?.[key] !== undefined) return;
    change(p => ({ ...p, goals: { ...p.goals, history: { ...Object.fromEntries(Object.entries(p.goals?.history || {}).slice(-60)), [key]: projectWords(p) } } }));
  }, [project, change]);
  function open(p: StudioProject) { setProject(p); latest.current = p; setSampleActive(false); try { setGuideVisible(localStorage.getItem(`booksane-guide-hidden-${p.id}`) !== 'yes'); } catch { setGuideVisible(true); } setSelectedId(p.sections.find(s => s.kind === 'chapter')?.id || p.sections[0]?.id || ''); setEditorEpoch(e => e + 1); setMode('write'); setPanel('details'); snapshotTime.current = 0; }
  async function back() { if (project) { try { await saveProject(project, true); } catch { setNotice('Saving failed. Download your project before closing.'); return; } } setProject(null); latest.current = null; }
  async function handleFile(file?: File) {
    if (!file) return; setImporting(true);
    try { const imported = await importFile(file); open(imported); setImportOpen(false); setReportOpen(!!imported.importReport); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Could not import this file.'); }
    finally { setImporting(false); if (fileRef.current) fileRef.current.value = ''; }
  }
  const selected = project?.sections.find(s => s.id === selectedId);
  const findings = project ? studioChecks(project) : [];
  const add = (kind: StudioSection['kind']) => { const section = newSection(kind, kind === 'chapter' ? `Chapter ${(project?.sections.filter(s => s.kind === 'chapter').length || 0) + 1}` : kind === 'part' ? `Part ${(project?.sections.filter(s => s.kind === 'part').length || 0) + 1}` : kind === 'frontmatter' ? 'Dedication' : 'Acknowledgments'); change(p => { const order = { frontmatter: 0, part: 1, chapter: 1, backmatter: 2 }; const sections = [...p.sections]; const index = sections.findIndex(s => order[s.kind] > order[kind]); sections.splice(index < 0 ? sections.length : index, 0, section); return { ...p, sections }; }); setSelectedId(section.id); };
  function move(direction: number) { change(p => { const sections = [...p.sections]; const i = sections.findIndex(s => s.id === selectedId); const next = i + direction; const g = (k: string) => k === 'part' ? 'chapter' : k; if (next < 0 || next >= sections.length || g(sections[next].kind) !== g(sections[i].kind)) return p; [sections[i], sections[next]] = [sections[next], sections[i]]; return { ...p, sections }; }); }
  async function history() { setPanel('history'); if (project) { try { setSnapshots(await projectSnapshots(project.id)); } catch { setNotice('Could not load version history.'); } } }

  return <div className={`booksane-studio workspace-mode-${mode}`}>
    <input ref={fileRef} type="file" accept=".docx,.txt,.booksane,.json" hidden onChange={e => void handleFile(e.target.files?.[0])}/>
    {notice && <div className="studio-notice" role="alert"><span>{notice}</span><button aria-label="Dismiss message" onClick={() => setNotice('')}><X size={16}/></button></div>}
    {setupOpen && <BookSetup close={() => setSetupOpen(false)} create={(title, author) => { const book = newProject(); book.title = title; book.author = author; setSetupOpen(false); open(book); }}/>} 
    {findOpen && project && <FindReplace project={project} close={() => setFindOpen(false)} apply={(next, count) => { change(() => next); setEditorEpoch(e => e + 1); setFindOpen(false); setNotice(`Replaced ${count} ${count === 1 ? 'match' : 'matches'}.`); }}/>}
    {boxOpen && <BoxSetDialog projects={projects} close={() => setBoxOpen(false)} create={book => { setBoxOpen(false); open(book); }}/>}
    {importOpen && <ImportWelcome busy={importing} close={() => setImportOpen(false)} choose={() => fileRef.current?.click()} importFile={file => void handleFile(file)}/>}
    {!project ? <>
      <Library projects={projects} loading={loading} query={query} setQuery={setQuery} open={open} create={() => setSetupOpen(true)} importBook={() => setImportOpen(true)} sample={() => { open(newProject(true)); setSampleActive(true); }} boxSet={() => setBoxOpen(true)}/>
    </> : <>
      <header className="workspace-header"><button className="icon-button" aria-label="Back to library" onClick={() => void back()}><ArrowLeft size={18}/></button><Logo/><span className="header-divider"/><div className="header-book-title">{project.title}<span className="save-label"><span className={`status-dot ${saveState === 'Save failed' ? 'error' : ''}`}/>{saveState}</span></div><div className="workspace-modes"><button className={mode === 'write' ? 'active' : ''} onClick={() => setMode('write')}><PenLine size={14}/>Write</button><button className={mode === 'design' ? 'active' : ''} onClick={() => { setMode('design'); setPanel('details'); }}><LayoutTemplate size={14}/>Design</button></div><button className="icon-button find-trigger" aria-label="Find and replace" title="Find and replace" onClick={() => setFindOpen(true)}><Replace size={17}/></button><button className="workspace-help icon-button" aria-label="Getting started help" title="Getting started help" onClick={() => setHelpOpen(true)}><BookOpen size={17}/></button><button className="primary export-trigger" onClick={() => setExportOpen(true)}><Download size={15}/>Export book</button></header>
      {mode === 'design' ? <div className="workspace-body design"><DesignStudio project={project} change={change} selectedId={selectedId} select={setSelectedId}/></div> : <div className="workspace-body">
        <Navigator project={project} selectedId={selectedId} select={setSelectedId} add={add} reorder={sections => change(p => ({ ...p, sections }))} findings={findings.length} openChecks={() => setPanel('checks')} importReport={project.importReport ? () => setReportOpen(true) : undefined}/>
        <main className="studio-canvas">
          {guideVisible && <ContextGuide mode={mode} hasWords={projectWords(project) > 0} sample={sampleActive} hide={() => { setGuideVisible(false); try { localStorage.setItem(`booksane-guide-hidden-${project.id}`, 'yes'); } catch {} }} help={() => setHelpOpen(true)} next={() => { if (mode === 'write') { setMode('design'); setPanel('details'); } else setExportOpen(true); }}/>}
          {mode === 'write' ? selected ? <><div className="canvas-breadcrumb"><span>{project.title}</span><ChevronRight size={13}/><span>{selected.title}</span><div className="section-tools"><button aria-label="Move section up" onClick={() => move(-1)}><ArrowUp size={14}/></button><button aria-label="Move section down" onClick={() => move(1)}><ArrowDown size={14}/></button><button aria-label="Duplicate section" onClick={() => { const duplicate = { ...selected, id: crypto.randomUUID(), title: `${selected.title} (copy)` }; change(p => { const sections = [...p.sections]; sections.splice(sections.findIndex(s => s.id === selected.id) + 1, 0, duplicate); return { ...p, sections }; }); setSelectedId(duplicate.id); }}><Copy size={14}/></button><button aria-label="Delete section" disabled={project.sections.length <= 1} onClick={() => { if (!window.confirm(`Delete “${selected.title}”? Saved versions remain in history.`)) return; const next = project.sections.filter(s => s.id !== selected.id); change(p => ({ ...p, sections: next })); setSelectedId(next[0]?.id || ''); }}><Trash2 size={14}/></button></div></div>
            <ManuscriptEditor key={`${selected.id}-${editorEpoch}`} section={selected} onTitle={title => change(p => ({ ...p, sections: p.sections.map(s => s.id === selected.id ? { ...s, title } : s) }))} onDocument={document => change(p => ({ ...p, sections: p.sections.map(s => s.id === selected.id ? { ...s, document } : s) }))}/>
          </> : <div className="no-section"><FileText size={28}/><h2>Your manuscript starts here.</h2><button className="primary" onClick={() => add('chapter')}>Add a chapter</button></div> : null}
          <div className="canvas-status"><span>{selected ? `${words(documentText(selected.document)).toLocaleString()} words in this section` : 'Book preview'}</span><span>{mode === 'write' ? 'Your manuscript, beautifully focused.' : 'Measured layout · local fonts'}</span></div>
        </main>
        <aside className="studio-inspector"><div className="inspector-tabs"><button className={panel === 'details' ? 'active' : ''} onClick={() => setPanel('details')}><Settings2 size={15}/>Details</button><button className={panel === 'checks' ? 'active' : ''} onClick={() => setPanel('checks')}><ShieldCheck size={15}/>Review</button><button aria-label="Version history" className={panel === 'history' ? 'active' : ''} onClick={() => void history()}><History size={15}/></button></div>
          {panel === 'details' ? <div className="inspector-content"><div className="book-metadata"><span className="eyebrow">BOOK DETAILS</span><h2>Your book.</h2><p className="inspector-description">Use a working title. You can change these details at any time.</p><label>Book title<input aria-label="Book title" value={project.title} onChange={e => change(p => ({ ...p, title: e.target.value }))}/></label><label>Subtitle<input value={project.subtitle} onChange={e => change(p => ({ ...p, subtitle: e.target.value }))} placeholder="Optional"/></label><label>Author / pen name<input aria-label="Author name" value={project.author} onChange={e => change(p => ({ ...p, author: e.target.value }))} placeholder="Your name"/></label><label>Language<select value={project.language} onChange={e => change(p => ({ ...p, language: e.target.value }))}><option value="en">English</option><option value="fr">French</option><option value="es">Spanish</option><option value="de">German</option><option value="pt">Portuguese</option></select></label>
            </div><PublishingPanel project={project} change={change}/><button className="preview-link" onClick={() => setMode('design')}>Design & preview your book <ArrowRight size={14}/></button>
          </div> : panel === 'checks' ? <div className="inspector-content"><div className="review-icon"><ShieldCheck size={26}/></div><h2>Review your manuscript.</h2><p className="inspector-description">Content checks for this revision. Export validation is a separate step.</p>{findings.length ? findings.map((f, i) => <button className={`finding ${f.level}`} key={i} onClick={() => { if (f.sectionId) { setSelectedId(f.sectionId); setMode('write'); } }}><span className="finding-dot"/>{f.message}{f.sectionId && <ChevronRight size={14}/>}</button>) : <div className="checks-good"><Check size={18}/>No content issues found.</div>}<div className="review-note"><strong>What we check</strong><p>Title, author, empty sections, and image descriptions. Printer approval and full EPUB accessibility require additional validation.</p></div><button className="secondary" onClick={() => setExportOpen(true)}>Review exports <ArrowRight size={14}/></button></div> : <div className="inspector-content"><span className="eyebrow">VERSION HISTORY</span><h2>Version history.</h2><p className="inspector-description">Up to ten local checkpoints. Restoring creates a new current revision.</p><button className="secondary" onClick={async () => { try { await saveProject(project, true); await history(); setNotice('Checkpoint saved.'); } catch { setNotice('Could not save a checkpoint. Download a project backup.'); } }}><Plus size={14}/>Save checkpoint</button>{snapshots.map(snapshot => <button className="snapshot" key={snapshot.id} onClick={() => { change(() => ({ ...snapshot.project, revision: project.revision, id: project.id })); setSelectedId(snapshot.project.sections[0]?.id || ''); setEditorEpoch(e => e + 1); setNotice('Version restored. Your next save creates a new revision.'); }}><History size={15}/><span>{new Date(snapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<small>{projectWords(snapshot.project).toLocaleString()} words · Revision {snapshot.project.revision}</small></span><Undo2 size={14}/></button>)}</div>}
        </aside>
      </div>}
      {helpOpen && <WorkflowHelp mode={mode} sample={sampleActive} close={() => setHelpOpen(false)} write={() => { setMode('write'); setGuideVisible(true); }} design={() => { setMode('design'); setPanel('details'); setGuideVisible(true); }} exportBook={() => setExportOpen(true)}/>}
      {exportOpen && <ExportDialog project={project} close={() => setExportOpen(false)} notify={setNotice}/>}
      {reportOpen && project.importReport && <div className="studio-modal-backdrop"><div className="studio-modal" role="dialog" aria-modal="true" aria-label="Import report"><button className="modal-close" aria-label="Close import report" onClick={() => setReportOpen(false)}><X size={18}/></button><span className="eyebrow">MANUSCRIPT IMPORT</span><h2>Review your import.</h2><p>{project.importReport.filename}</p><div className="import-counts"><div><strong>{project.importReport.sourceWords.toLocaleString()}</strong><span>source words</span></div><div><strong>{project.importReport.importedWords.toLocaleString()}</strong><span>imported body words</span></div></div><p className="small-note">Chapter headings are stored separately. Word counts can differ; compare the manuscript with your original.</p>{project.importReport.messages.map((message, i) => <p className="import-message" key={i}>{message}</p>)}<button className="primary" onClick={() => setReportOpen(false)}>Review manuscript <ArrowRight size={14}/></button></div></div>}
    </>}
  </div>;
}

function ManuscriptEditor({ section, onTitle, onDocument }: { section: StudioSection; onTitle: (title: string) => void; onDocument: (document: StudioSection['document']) => void }) {
  const imageRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({ extensions: studioExtensions(), content: section.document as JSONContent, immediatelyRender: false, onUpdate: ({ editor }) => onDocument(editor.getJSON()), editorProps: { attributes: { class: 'manuscript-prose', 'aria-label': 'Chapter content' } } });
  const tool = (label: string, icon: React.ReactNode, action: () => void, active = false) => <button type="button" title={label} aria-label={label} className={active ? 'active' : ''} onClick={action} disabled={!editor}>{icon}</button>;
  return <><div className="writing-toolbar"><select aria-label="Paragraph style" value={editor?.isActive('heading', { level: 2 }) ? 'heading' : 'body'} onChange={e => e.target.value === 'heading' ? editor?.chain().focus().toggleHeading({ level: 2 }).run() : editor?.chain().focus().setParagraph().run()}><option value="body">Body text</option><option value="heading">Subheading</option></select><span/>{tool('Bold', <Bold size={16}/>, () => { editor?.chain().focus().toggleBold().run(); }, editor?.isActive('bold'))}{tool('Italic', <Italic size={16}/>, () => { editor?.chain().focus().toggleItalic().run(); }, editor?.isActive('italic'))}{tool('Bullet list', <List size={17}/>, () => { editor?.chain().focus().toggleBulletList().run(); }, editor?.isActive('bulletList'))}{tool('Quote', <Quote size={16}/>, () => { editor?.chain().focus().toggleBlockquote().run(); })}{tool('Scene break', <Minus size={17}/>, () => { editor?.chain().focus().setHorizontalRule().run(); })}{tool('Callout box', <StickyNote size={16}/>, () => { if (editor?.isActive('callout')) editor.chain().focus().lift('callout').run(); else editor?.chain().focus().wrapIn('callout').run(); }, editor?.isActive('callout'))}{tool('Footnote', <Superscript size={16}/>, () => { if (!editor) return; if (editor.isActive('footnote')) { const current = String(editor.getAttributes('footnote').note || ''); const note = window.prompt('Edit footnote', current); if (note !== null) editor.chain().focus().updateAttributes('footnote', { note: note.slice(0, 4000) }).run(); return; } const note = window.prompt('Footnote text', ''); if (note) editor.chain().focus().insertContent({ type: 'footnote', attrs: { note: note.slice(0, 4000) } }).run(); }, editor?.isActive('footnote'))}{tool('Insert table', <Table2 size={16}/>, () => { editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); })}{tool('Insert image', <ImagePlus size={16}/>, () => imageRef.current?.click())}<span/>{tool('Undo', <Undo2 size={16}/>, () => { editor?.chain().focus().undo().run(); })}{tool('Redo', <Redo2 size={16}/>, () => { editor?.chain().focus().redo().run(); })}<small>Every word has a place.</small></div><input type="file" accept="image/png,image/jpeg" ref={imageRef} hidden onChange={e => { const file = e.target.files?.[0]; if (!file || file.size > 5 * 1024 * 1024) { window.alert('Choose a PNG or JPEG image smaller than 5 MB.'); return; } const reader = new FileReader(); reader.onload = () => { const alt = window.prompt('Describe this image for readers using assistive technology.', '') || ''; editor?.chain().focus().setImage({ src: String(reader.result), alt }).run(); }; reader.readAsDataURL(file); e.target.value = ''; }}/><div className="manuscript-scroll"><article className="manuscript-sheet"><span className="eyebrow">{section.kind === 'chapter' ? 'CHAPTER' : section.kind === 'frontmatter' ? 'FRONT MATTER' : 'BACK MATTER'}</span><input aria-label="Section title" className="section-title-input" value={section.title} onChange={e => onTitle(e.target.value)}/><div className="manuscript-rule"/><EditorContent editor={editor}/><span className="end-mark">✦</span></article></div></>;
}

function ExportDialog({ project, close, notify }: { project: StudioProject; close: () => void; notify: (message: string) => void }) {
  const [busy, setBusy] = useState('');
  const [result, setResult] = useState('');
  const [target, setTarget] = useState<EpubTarget>('universal');
  const [pdfxReady, setPdfxReady] = useState(false);
  useEffect(() => { fetch('/api/publish/pdf').then(r => r.json()).then(d => setPdfxReady(!!d.pdfx)).catch(() => {}); }, []);
  const findings = studioChecks(project);
  async function run(kind: 'pdf' | 'pdfx' | 'epub' | 'project') {
    setBusy(kind); setResult('');
    try {
      if (kind === 'project') download(new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' }), `${filename(project)}.booksane`);
      if (kind === 'epub') download(await studioEpub(project, target), `${filename(project)}${target === 'universal' ? '' : '-' + target}.epub`);
      if (kind === 'pdf' || kind === 'pdfx') { const response = await fetch(kind === 'pdfx' ? '/api/publish/pdf?format=pdfx' : '/api/publish/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(project) }); if (!response.ok) { const error = await response.json(); throw new Error(error.error || 'PDF export failed.'); } download(await response.blob(), `${filename(project)}-interior${kind === 'pdfx' ? '-pdfx1a' : ''}.pdf`); }
      setResult(kind === 'project' ? 'Editable project downloaded. Import it to restore your book.' : kind === 'epub' ? 'EPUB downloaded. Run EPUBCheck and review it in your reader before publishing.' : kind === 'pdfx' ? 'PDF/X-1a downloaded. Run it through your printer’s preflight before ordering.' : 'PDF downloaded from the measured layout. Review the interior against your printer’s requirements.');
    } catch (error) { setResult(error instanceof Error ? error.message : 'Export failed. Your manuscript is unchanged.'); }
    finally { setBusy(''); }
  }
  return <div className="studio-modal-backdrop"><div className="studio-modal export-modal" role="dialog" aria-modal="true" aria-label="Export book"><button className="modal-close" aria-label="Close export" onClick={close}><X size={18}/></button><span className="eyebrow">FROM MANUSCRIPT TO PUBLICATION</span><h2>Download your book.</h2><p>{project.title} · Revision {project.revision} · {projectWords(project).toLocaleString()} words</p><div className="export-options"><button disabled={!!busy || findings.some(f => f.level === 'error')} onClick={() => void run('pdf')}><BookOpen size={24}/><strong>Print interior · PDF</strong><span>Measured PDF with page numbers, running heads, and contents.</span><small>{busy === 'pdf' ? 'Composing PDF…' : 'Download PDF'}<ArrowRight size={14}/></small></button>{pdfxReady && <button disabled={!!busy || findings.some(f => f.level === 'error')} onClick={() => void run('pdfx')}><BookOpen size={24}/><strong>Print interior · PDF/X-1a</strong><span>For printers that ask for PDF/X, such as IngramSpark. Black ink text, CMYK.</span><small>{busy === 'pdfx' ? 'Converting…' : 'Download PDF/X-1a'}<ArrowRight size={14}/></small></button>}<button disabled={!!busy || findings.some(f => f.level === 'error')} onClick={() => void run('epub')}><FileText size={24}/><strong>Reading edition · EPUB</strong><span>Reflowable EPUB with every section and embedded images.</span><small>{busy === 'epub' ? 'Building EPUB…' : 'Download EPUB'}<ArrowRight size={14}/></small></button></div><label className="epub-target">Ebook store<select aria-label="Ebook store" value={target} onChange={e => setTarget(e.target.value as EpubTarget)}><option value="universal">All stores</option>{(Object.keys(STORE_NAMES) as (keyof typeof STORE_NAMES)[]).map(s => <option key={s} value={s}>{STORE_NAMES[s]}</option>)}</select></label><div className="export-review"><ShieldCheck size={20}/><div><strong>{findings.length ? `${findings.length} items to review` : 'Content checks passed'}</strong><p>{findings.length ? findings.slice(0, 3).map(f => f.message).join(' ') : 'Your title, author, sections, and image descriptions have been checked.'}</p></div></div><p className="small-note">Check every file with your printer or store before you publish.</p><button className="backup-button" disabled={!!busy} onClick={() => void run('project')}><FolderOpen size={17}/>Download editable project <Download size={15}/></button>{result && <p className="export-result" role="status">{result}</p>}<button className="report-download" onClick={() => { download(new Blob([JSON.stringify({ project: project.title, revision: project.revision, generatedAt: new Date().toISOString(), contentFindings: findings, validation: { epubcheck: 'not run', accessibility: 'not reviewed', pdfx: 'not certified', printerApproval: 'not checked' } }, null, 2)], { type: 'application/json' }), `${filename(project)}-review.json`); notify('Export review downloaded.'); }}>Download this revision’s review record</button></div></div>;
}
