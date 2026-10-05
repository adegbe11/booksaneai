'use client';

import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { ALL_FIXES, FIX_LABELS, type FixKind, type FixReport } from '@/lib/studio/autofix';
import { themeById } from '@/lib/studio/themes';
import { Booksy } from '@/components/site/Drawings';

/** What Booksane cleaned up, one switch per kind of fix. Switching one off re-runs the clean-up without it. */
export default function TidyDialog({ report, on, toggle, undoAll, close, importInfo }: {
  report: FixReport; on: FixKind[]; toggle: (k: FixKind) => void; undoAll: () => void; close: () => void;
  importInfo?: { filename: string; sourceWords: number; importedWords: number; messages: string[] };
}) {
  // Show every kind that found something in the full run, so switching one off doesn't hide it.
  const rows = ALL_FIXES.filter(k => report.counts[k] > 0 || !on.includes(k));
  const total = rows.filter(k => on.includes(k)).reduce((n, k) => n + report.counts[k], 0);
  return <div className="studio-modal-backdrop"><div className="studio-modal tidy-modal" role="dialog" aria-modal="true" aria-label={importInfo ? "Import report" : "Cleaned up"}>
    <button className="modal-close" aria-label="Close" onClick={close}><X size={18}/></button>
    <Booksy pose="cheer" size={92} className="dialog-buddy"/>
    <span className="eyebrow">{importInfo ? 'IMPORTED' : 'TIDY UP'}</span>
    <h2>{rows.length ? `I cleaned up ${total.toLocaleString()} ${total === 1 ? 'thing' : 'things'}.` : 'Your manuscript was already clean.'}</h2>
    {importInfo && <p>{importInfo.filename} · {importInfo.sourceWords.toLocaleString()} words</p>}
    {rows.length > 0 && <ul className="tidy-list">
      {rows.map(k => {
        const n = report.counts[k];
        const active = on.includes(k);
        const label = k === 'theme' && report.theme ? `${themeById(report.theme).name} theme picked` : `${n.toLocaleString()} ${FIX_LABELS[k][n === 1 ? 1 : 0]}`;
        return <li key={k} className={active ? 'on' : ''}>
          <span className="tidy-tick">{active ? <Check size={14}/> : null}</span>
          <span className="tidy-label">{active ? label : FIX_LABELS[k][0].replace(/^\w/, c => c.toUpperCase())}</span>
          <button className="tidy-switch" role="switch" aria-checked={active} aria-label={`${FIX_LABELS[k][0]}: ${active ? 'on' : 'off'}`} onClick={() => toggle(k)}><i/></button>
        </li>;
      })}
    </ul>}
    {importInfo?.messages.map((m, i) => <p className="import-message" key={i}>{m}</p>)}
    <div className="tidy-actions">
      <button className="primary" onClick={close}>See my book <ArrowRight size={16}/></button>
      {rows.length > 0 && <button className="tidy-undo" onClick={undoAll}><RotateCcw size={14}/>Undo all</button>}
    </div>
  </div></div>;
}
