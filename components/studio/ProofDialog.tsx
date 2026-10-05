'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, Check, Loader2, X, XCircle } from 'lucide-react';
import type { StudioProject } from '@/lib/studio/model';
import { PRINTERS, loadImage, type Printer } from '@/lib/studio/cover';
import { inspectLayout, proofCheck, RULES, type CoverFacts, type Fix, type LayoutFacts, type ProofItem } from '@/lib/studio/proof';
import { Booksy } from '@/components/site/Drawings';
import { MeasuredPages } from './BookPreview';

export type ProofGo = { mode: 'write' | 'design' | 'cover'; sectionId?: string };

/** Lays the book out, then runs the printer's upload checks on the real pages and the cover. */
export default function ProofDialog({ project, change, close, go }: { project: StudioProject; change: (fn: (p: StudioProject) => StudioProject) => void; close: () => void; go: (to: ProofGo) => void }) {
  const [printer, setPrinter] = useState<Printer>(project.cover?.printer || 'kdp');
  const [facts, setFacts] = useState<LayoutFacts | null>(null);
  const [cover, setCover] = useState<CoverFacts | null>(null);
  const [pdfx, setPdfx] = useState(false);
  useEffect(() => { fetch('/api/publish/pdf').then(r => r.json()).then(d => setPdfx(!!d.pdfx)).catch(() => {}); }, []);
  const interior = useMemo(() => ({ ...project, cover: undefined }), [project.sections, project.design, project.title, project.subtitle, project.author, project.publishing]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setFacts(null); }, [interior]);
  useEffect(() => {
    const c = project.cover;
    if (!c) { setCover({ mode: 'none' }); return; }
    if (c.mode === 'design' || !c.image) { setCover({ mode: 'design' }); return; }
    loadImage(c.image).then(img => setCover({ mode: 'upload', width: img.width, height: img.height })).catch(() => setCover({ mode: 'none' }));
  }, [project.cover?.mode, project.cover?.image]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [close]);

  const items = facts && cover ? proofCheck(project, facts, printer, cover, { pdfx }) : null;
  const fails = items?.filter(i => i.level === 'fail').length || 0;
  const warns = items?.filter(i => i.level === 'warn').length || 0;
  const name = PRINTERS[printer].name;

  function fix(item: ProofItem) {
    const f: Fix | undefined = item.fix;
    if (f === 'gutter' && facts) { const need = RULES[printer].gutter(facts.pages + (facts.pages % 2)); change(p => ({ ...p, design: { ...p.design, gutter: Math.max(0.75, need) } })); return; }
    if (f === 'endpage') { change(p => ({ ...p, design: { ...p.design, endBlank: true } })); return; }
    if (f === 'cover' || f === 'isbn') go({ mode: 'cover' });
    else if (f === 'trim') go({ mode: 'design' });
    else if (f === 'author' || item.sectionId) go({ mode: 'write', sectionId: item.sectionId });
  }
  const label: Record<Fix, string> = { endpage: 'Add a blank page', gutter: 'Fix it', cover: 'Go to Cover', isbn: 'Go to Cover', trim: 'Change size', author: 'Add it' };

  const row = (item: ProofItem, i: number) => <li key={i} className={`proof-${item.level}`}>
    <span className="proof-icon">{item.level === 'pass' ? <Check size={14}/> : item.level === 'warn' ? <AlertCircle size={14}/> : <XCircle size={14}/>}</span>
    <span className="proof-text"><strong>{item.title}</strong>{(item.detail || item.pages) && <small>{item.detail}{item.pages?.length ? `${item.detail ? ' ' : ''}Page${item.pages.length > 1 ? 's' : ''} ${item.pages.length > 6 ? `${item.pages.slice(0, 6).join(', ')} and ${item.pages.length - 6} more` : item.pages.join(', ')}.` : ''}</small>}</span>
    {item.level !== 'pass' && (item.fix || item.sectionId) && <button className="proof-fix" onClick={() => fix(item)}>{item.fix ? label[item.fix] : 'Show me'}<ArrowRight size={13}/></button>}
  </li>;

  return <div className="studio-modal-backdrop"><div className="studio-modal proof-modal" role="dialog" aria-modal="true" aria-label="Print proof check">
    <button className="modal-close" aria-label="Close" onClick={close}><X size={18}/></button>
    <Booksy pose={items && !fails ? 'cheer' : 'read'} size={92} className="dialog-buddy"/>
    <span className="eyebrow">PROOF CHECK</span>
    <h2>{!items ? 'Checking every page…' : fails ? `${fails} ${fails === 1 ? 'thing' : 'things'} to fix for ${name}.` : `Ready for ${name}.`}</h2>
    <div className="ds-seg small proof-printers" role="group" aria-label="Printer">{(Object.keys(PRINTERS) as Printer[]).map(k => <button key={k} aria-pressed={printer === k} className={printer === k ? 'on' : ''} onClick={() => setPrinter(k)}>{PRINTERS[k].name}</button>)}</div>
    {!items ? <p className="proof-wait"><Loader2 size={16} className="spin"/>Laying out your book the way the printer will…</p> : <div className="proof-scroll">
      {warns > 0 && <p className="proof-summary">{warns} {warns === 1 ? 'thing' : 'things'} to look at.</p>}
      {(['interior', 'cover'] as const).map(area => <section key={area} className="proof-group"><h3>{area === 'interior' ? 'Inside pages' : 'Cover'}</h3><ul>{items.filter(i => i.area === area).sort((a, b) => order[a.level] - order[b.level]).map(row)}</ul></section>)}
    </div>}
    <MeasuredPages project={interior} sectionId="" hidden onLayout={doc => setFacts(inspectLayout(doc))}/>
  </div></div>;
}
const order = { fail: 0, warn: 1, pass: 2 };
