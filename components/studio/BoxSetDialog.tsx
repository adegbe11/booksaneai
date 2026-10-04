'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { boxSet, projectWords, type StudioProject } from '@/lib/studio/model';

export default function BoxSetDialog({ projects, create, close }: { projects: StudioProject[]; create: (book: StudioProject) => void; close: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const toggle = (id: string) => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const books = picked.map(id => projects.find(p => p.id === id)!).filter(Boolean);
  return <div className="studio-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="studio-modal boxset-modal" role="dialog" aria-modal="true" aria-label="Make a box set">
      <button className="modal-close" aria-label="Close box set" onClick={close}><X size={18}/></button>
      <span className="eyebrow">SEVERAL BOOKS IN ONE</span><h2>Make a box set</h2>
      <p>Pick the books in the order they should appear. Each becomes a part. Your original books stay as they are.</p>
      <label>Box set title<input aria-label="Box set title" placeholder="The Complete Series" value={title} onChange={e => setTitle(e.target.value)}/></label>
      <div className="boxset-list">{projects.map(p => { const n = picked.indexOf(p.id); return <button key={p.id} className={`boxset-item ${n >= 0 ? 'on' : ''}`} aria-pressed={n >= 0} onClick={() => toggle(p.id)}><span className="boxset-num">{n >= 0 ? n + 1 : ''}</span><span>{p.title}<small>{projectWords(p).toLocaleString()} words</small></span></button>; })}</div>
      <button className="primary" disabled={books.length < 2} onClick={() => create(boxSet(books, title.trim() || 'Box Set'))}>Create box set of {books.length || ''} {books.length === 1 ? 'book' : 'books'}</button>
    </div>
  </div>;
}
