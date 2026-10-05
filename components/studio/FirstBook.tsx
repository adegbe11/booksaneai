'use client';
import { Booksy } from '@/components/site/Drawings';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, FileText, HelpCircle, PenLine, Upload, X } from 'lucide-react';
import type { StudioProject } from '@/lib/studio/model';

export function StartingChoices({ returning, create, importBook, sample }: { returning: boolean; create: () => void; importBook: () => void; sample: () => void }) {
  return <section className="starting-choices" aria-label="Start your book">
    <div className="starting-heading"><span className="eyebrow">{returning ? 'YOUR PUBLISHING WORKSPACE' : 'WELCOME TO BOOKSANE'}</span><h1>{returning ? 'What would you like to work on?' : 'Let’s make your first book.'}</h1><p>Turn a manuscript into a print interior and an eBook.<br/>Start with your words. We’ll guide you through the rest.</p></div>
    <div className="starting-paths">
      <button className="starting-path recommended" aria-label="Import manuscript" onClick={importBook}><span className="path-icon"><Upload size={24}/></span><span className="path-copy"><strong>I have a manuscript</strong><span>Bring a Word document or text file.<br/>Review the chapters, then design your book.</span><small>Import manuscript <ArrowRight size={15}/></small></span></button>
      <button className="starting-path" aria-label="Create a book" onClick={create}><span className="path-icon"><PenLine size={24}/></span><span className="path-copy"><strong>I’m starting from scratch</strong><span>Give your book a working title.<br/>Start writing in a clean chapter.</span><small>Create a book <ArrowRight size={15}/></small></span></button>
    </div>
    <div className="sample-invitation"><BookOpen size={19}/><div><strong>Want to see how it works first?</strong><span>Try writing, design, and export with an editable sample.</span></div><button onClick={sample}>Open sample book <ArrowRight size={15}/></button></div>
    <ol className="workflow-map" aria-label="The publishing workflow"><li><span>1</span><div><strong>Manuscript</strong><small>Your words and chapters</small></div></li><li><span>2</span><div><strong>Design</strong><small>See your book’s pages</small></div></li><li><span>3</span><div><strong>Export</strong><small>Download PDF and EPUB</small></div></li></ol>
  </section>;
}

function useDialog(ref: React.RefObject<HTMLDialogElement | null>, close: () => void) {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const trigger = document.activeElement as HTMLElement | null;
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>('input')?.focus();
    return () => { dialog.close(); if (trigger?.isConnected) trigger.focus(); };
  }, [ref]);
  return { onCancel: (event: React.SyntheticEvent) => { event.preventDefault(); close(); } };
}

export function BookSetup({ create, close }: { create: (title: string, author: string) => void; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const events = useDialog(ref, close);
  return <dialog ref={ref} {...events} className="studio-modal setup-dialog" aria-labelledby="setup-heading"><button type="button" className="modal-close" aria-label="Cancel book setup" onClick={close}><X size={19}/></button><Booksy pose="point" size={92} className="dialog-buddy"/><span className="eyebrow">NEW BOOK</span><h2 id="setup-heading">Every book starts somewhere.</h2><p>A working title is enough. You can change these details later.</p><form onSubmit={e => { e.preventDefault(); create(title.trim() || 'Untitled book', author.trim()); }}><label>Working title<input aria-label="Working title" placeholder="What’s your book called?" value={title} maxLength={250} onChange={e => setTitle(e.target.value)}/></label><label>Author or pen name <small>Optional</small><input aria-label="Setup author name" placeholder="Your name" value={author} maxLength={250} onChange={e => setAuthor(e.target.value)}/></label><div className="setup-next"><PenLine size={18}/><span>Next: a blank chapter, ready for your first sentence.</span></div><button className="primary" type="submit">Start writing <ArrowRight size={16}/></button><button className="setup-skip" type="button" onClick={() => create('Untitled book', '')}>Skip setup and open a blank book</button></form></dialog>;
}

export function ImportWelcome({ choose, importFile, busy, close }: { choose: () => void; importFile: (file: File) => void; busy: boolean; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [dragging, setDragging] = useState(false);
  const events = useDialog(ref, close);
  return <dialog ref={ref} {...events} className="studio-modal setup-dialog" aria-labelledby="import-heading"><button className="modal-close" aria-label="Cancel import" onClick={close}><X size={19}/></button><Booksy pose="read" size={92} className="dialog-buddy"/><span className="eyebrow">IMPORT</span><h2 id="import-heading">Bring your words.</h2><p>Choose a Word document, text file, or saved Booksane project.</p><button className={`import-dropzone ${dragging ? 'dragging' : ''}`} disabled={busy} onClick={choose} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file && !busy) importFile(file); }}><Upload size={29}/><strong>{busy ? 'Reading your manuscript…' : 'Drop a file here, or choose a file'}</strong><span>DOCX · TXT · .booksane project</span></button><div className="import-preparation"><strong>For the cleanest Word import</strong><p>Use Heading 1 for chapter titles. Bold, italic, lists, tables, and embedded PNG/JPEG images are supported.</p><p>We’ll show an import report. Check your chapter boundaries and compare with your original before designing.</p></div><p className="local-explanation">Imports are processed in this browser. Books are saved on this device; download a project backup to keep another copy.</p></dialog>;
}

export function WorkflowHelp({ mode, close, design, write, exportBook, sample }: { mode: 'write' | 'design'; close: () => void; design: () => void; write: () => void; exportBook: () => void; sample: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const events = useDialog(ref, close);
  return <dialog ref={ref} {...events} className="studio-modal setup-dialog workflow-help" aria-labelledby="help-heading"><button className="modal-close" aria-label="Close workflow help" onClick={close}><X size={19}/></button><Booksy pose="cheer" size={92} className="dialog-buddy"/><span className="eyebrow">QUICK GUIDE</span><h2 id="help-heading">One book. Three simple stages.</h2><p>{sample ? 'You’re working in an editable sample. Try changing a sentence or a style to see what happens.' : 'Use these stages in any order. Your manuscript stays editable throughout.'}</p><div className="help-stages"><button className={mode === 'write' ? 'current' : ''} onClick={() => { close(); write(); }}><span>1</span><div><strong>Write & organize</strong><p>Edit your words in the middle. Select chapters on the left. Front matter comes before the story; back matter comes after.</p></div><ArrowRight size={16}/></button><button className={mode === 'design' ? 'current' : ''} onClick={() => { close(); design(); }}><span>2</span><div><strong>Design & preview</strong><p>Choose a style and book size. Print shows measured pages; eBook shows how the text flows for reading.</p></div><ArrowRight size={16}/></button><button onClick={() => { close(); exportBook(); }}><span>3</span><div><strong>Review & export</strong><p>Check the content findings. Download a PDF for print or EPUB for eBooks, and keep an editable project backup.</p></div><ArrowRight size={16}/></button></div><p className="local-explanation">Autosave stays in this browser on this device. It does not sync to other devices.</p><button className="primary" onClick={close}>Got it. Let me try. <Check size={16}/></button></dialog>;
}

export function ContextGuide({ mode, hasWords, sample, hide, help, next }: { mode: 'write' | 'design'; hasWords: boolean; sample: boolean; hide: () => void; help: () => void; next: () => void }) {
  return <div className="context-guide" role="region" aria-label="Next step guidance"><div className="context-guide-number">{mode === 'write' ? '1' : '2'}</div><div><strong>{mode === 'design' ? 'See what your reader will see.' : sample ? 'Try a sentence. This sample is yours to explore.' : hasWords ? 'Review your chapters, then see your book.' : 'Start with your chapter title and a few words.'}</strong><p>{mode === 'design' ? 'Choose a style on the right. Switch between print pages and eBook above.' : 'Write in the page below. Use the chapter list on the left to organize your book.'}</p><div className="context-guide-actions"><button onClick={next}>{mode === 'write' ? 'Next: design your book' : 'Next: review exports'}<ArrowRight size={14}/></button><button onClick={help}><HelpCircle size={14}/>Quick guide</button></div></div><button className="context-guide-dismiss" aria-label="Hide getting-started guidance" title="Hide guidance; reopen it from Help" onClick={hide}><X size={16}/></button></div>;
}

export function StyleChoices({ project, select }: { project: StudioProject; select: (theme: StudioProject['design']['theme']) => void }) {
  return <div className="style-choices" aria-label="Book styles">{([
    ['literary', 'Literary', 'Classic serif. Quiet, centered openings.'],
    ['modern', 'Modern', 'Clean sans serif. Simple, left-aligned openings.'],
    ['editorial', 'Editorial', 'Serif text. Uppercase openings.'],
  ] as const).map(([theme, label, description]) => <button aria-pressed={project.design.theme === theme} aria-label={`${label} book style`} key={theme} className={`style-choice ${project.design.theme === theme ? 'selected' : ''}`} onClick={() => select(theme)}><div className={`style-page ${theme}`} aria-hidden="true"><small>CHAPTER ONE</small><strong>A new beginning</strong><p>The morning light found its way through the open window. A story was waiting to be told.</p><span>1</span></div><div><strong>{label}</strong><small>{description}</small></div>{project.design.theme === theme && <Check size={15}/>}</button>)}</div>;
}

