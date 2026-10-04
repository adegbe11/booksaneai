'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { findInProject, replaceInProject, type StudioProject } from '@/lib/studio/model';

export default function FindReplace({ project, apply, close }: { project: StudioProject; apply: (next: StudioProject, count: number) => void; close: () => void }) {
  const [find, setFind] = useState('');
  const [replacement, setReplacement] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); }; window.addEventListener('keydown', esc); return () => window.removeEventListener('keydown', esc); }, [close]);
  const count = findInProject(project, find, matchCase);
  return <div className="studio-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="studio-modal find-modal" role="dialog" aria-modal="true" aria-label="Find and replace">
      <button className="modal-close" aria-label="Close find and replace" onClick={close}><X size={18}/></button>
      <span className="eyebrow">WHOLE BOOK</span><h2>Find and replace</h2>
      <label>Find<input ref={input} aria-label="Find text" value={find} onChange={e => setFind(e.target.value)}/></label>
      <label>Replace with<input aria-label="Replace with" value={replacement} onChange={e => setReplacement(e.target.value)}/></label>
      <label className="check-label"><input type="checkbox" checked={matchCase} onChange={e => setMatchCase(e.target.checked)}/>Match capitals</label>
      <p className="find-count" role="status">{find ? `${count} ${count === 1 ? 'match' : 'matches'} in this book` : 'Type a word or phrase.'}</p>
      <button className="primary" disabled={!find || !count} onClick={() => apply(replaceInProject(project, find, replacement, matchCase), count)}>Replace all</button>
    </div>
  </div>;
}
