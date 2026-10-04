'use client';

import { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Columns2, Smartphone } from 'lucide-react';
import { documentHtml, escape, type StudioProject } from '@/lib/studio/model';
import { publicationCss } from '@/lib/studio/publication';
import { TRIMS, chapterLabel, chapterOpening, coverSize, fontStack, resolveDesign } from '@/lib/studio/themes';
import { DesignControls, ThemeGallery, TrimSelect } from './DesignControls';
import { DEVICES, EbookPreview, MeasuredPages, trimLabel, type Device } from './BookPreview';
import type { ReaderTheme } from '@/lib/studio/publication';

type View = 'spread' | 'pages' | 'ebook';

function inches(value: string): number { const n = parseFloat(value); return value.endsWith('mm') ? n / 25.4 : n; }

/** Two facing pages drawn instantly with the book's real CSS: the end of the previous section and the chapter opening. */
function spreadHtml(project: StudioProject, chapterId: string): string {
  const d = resolveDesign(project.design);
  const [w, h] = TRIMS[project.design.trim].size.split(' ').map(v => Math.round(inches(v) * 96));
  const index = Math.max(0, project.sections.findIndex(s => s.id === chapterId));
  const section = project.sections[index];
  const previous = index > 0 ? project.sections[index - 1] : null;
  const chapterNo = project.sections.slice(0, index + 1).filter(s => s.kind === 'chapter').length;
  const label = section?.kind === 'chapter' ? chapterLabel(d.label, chapterNo) : '';
  const right = section ? `<section class="book-section ${section.kind}"><header class="section-head">${label ? `<div class="section-label">${label}</div>` : ''}<h1>${escape(section.title)}</h1></header>${section.kind === 'chapter' ? chapterOpening(documentHtml(section.document), d) : documentHtml(section.document)}</section>` : '';
  const left = previous ? `<section class="book-section ${previous.kind} tail">${documentHtml(previous.document)}</section>` : '';
  const pageNo = 2 * index + 4;
  const head = d.runningHead === 'none' ? ['', ''] : d.runningHead === 'title-chapter' ? [project.title, section?.title || ''] : [project.author, project.title];
  const num = (n: number, side: 'l' | 'r') => d.pageNumber === 'none' ? '' : `<div class="pn ${d.pageNumber === 'outer' ? side : ''}">${n}</div>`;
  return `<!doctype html><html lang="${escape(project.language)}"><head><meta charset="utf-8"><style>${publicationCss(project)}
  html,body{margin:0;height:100%;background:transparent;overflow:hidden}
  .stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
  .spread{display:flex;transform-origin:center;filter:drop-shadow(0 18px 40px rgba(20,30,25,.22));transition:transform .25s}
  .page{position:relative;width:${w}px;height:${h}px;background:#fff;overflow:hidden;padding:${0.75 * 96}px ${0.65 * 96}px ${0.8 * 96}px ${0.75 * 96}px}
  .page.l{padding-left:${0.65 * 96}px;padding-right:${0.75 * 96}px;border-radius:4px 0 0 4px;background:linear-gradient(90deg,#fff 88%,#f1f1ee)}
  .page.r{border-radius:0 4px 4px 0;background:linear-gradient(90deg,#ecece8,#fff 9%)}
  .flow{height:100%;overflow:hidden;display:flex;flex-direction:column}.page.l .flow{justify-content:flex-end}
  .rh{position:absolute;top:${0.38 * 96}px;font:8pt ${fontStack(d.body)};color:#888}.page.l .rh{left:${0.65 * 96}px}.page.r .rh{right:${0.65 * 96}px}
  .pn{position:absolute;bottom:${0.4 * 96}px;left:0;right:0;text-align:center;font:9pt ${fontStack(d.body)};color:#666}.pn.l{text-align:left;left:${0.65 * 96}px}.pn.r{text-align:right;right:${0.65 * 96}px}
  .empty{display:flex;height:100%;align-items:center;justify-content:center;color:#bbb;font:italic 11pt ${fontStack(d.body)}}
  </style></head><body><div class="stage"><div class="spread" id="spread">
  <div class="page l">${left && head[0] ? `<div class="rh">${escape(head[0])}</div>` : ''}<div class="flow">${left || '<div class="empty"></div>'}</div>${left ? num(pageNo, 'l') : ''}</div>
  <div class="page r"><div class="flow">${right}</div>${num(pageNo + 1, 'r')}</div>
  </div></div><script>function fit(){var s=document.getElementById('spread');var k=Math.min((innerWidth-48)/${2 * w},(innerHeight-40)/${h},1.6);s.style.transform='scale('+k+')'}addEventListener('resize',fit);fit();</script></body></html>`;
}

export default function DesignStudio({ project, change, selectedId, select }: { project: StudioProject; change: (fn: (p: StudioProject) => StudioProject) => void; selectedId: string; select: (id: string) => void }) {
  const [view, setView] = useState<View>('spread');
  const [pages, setPages] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [device, setDevice] = useState<Device>('iphone');
  const [reader, setReader] = useState<ReaderTheme>('white');
  const [textSize, setTextSize] = useState(17);
  const chapters = project.sections.filter(s => s.kind === 'chapter');
  const current = project.sections.find(s => s.id === selectedId)?.kind === 'chapter' ? selectedId : chapters[0]?.id || project.sections[0]?.id || '';
  const at = chapters.findIndex(s => s.id === current);
  const html = useMemo(() => spreadHtml(project, current), [project, current]);
  const setDesign = (design: StudioProject['design']) => change(p => ({ ...p, design }));
  const status = failed ? 'Layout failed. Try a simpler manuscript.' : pages ? `${pages} measured pages · ${trimLabel(project).replace('A5 · ', 'A5 · ')}` : 'Measuring pages…';
  return <div className="design-studio">
    <aside className="ds-themes" aria-label="Themes">
      <div className="ds-head"><span className="eyebrow">THEMES</span><h2>Find your book’s look.</h2><p>Pick a theme. Your words stay the same.</p></div>
      <ThemeGallery design={project.design} select={theme => setDesign({ ...project.design, theme })}/>
    </aside>
    <main className="ds-stage">
      <div className="ds-toolbar">
        <div className="ds-seg" role="tablist" aria-label="Preview">
          <button role="tab" aria-selected={view === 'spread'} className={view === 'spread' ? 'on' : ''} onClick={() => setView('spread')}><Columns2 size={14}/>Spread</button>
          <button role="tab" aria-selected={view === 'pages'} className={view === 'pages' ? 'on' : ''} onClick={() => setView('pages')}><BookOpen size={14}/>Print</button>
          <button role="tab" aria-selected={view === 'ebook'} className={view === 'ebook' ? 'on' : ''} onClick={() => setView('ebook')}><Smartphone size={14}/>eBook</button>
        </div>
        <span className="ds-status">{status}</span>
      </div>
      {view === 'ebook' && <div className="ds-subbar">
        <div className="ds-seg small" role="group" aria-label="Device">{(Object.keys(DEVICES) as Device[]).map(k => <button key={k} aria-pressed={device === k} className={device === k ? 'on' : ''} onClick={() => setDevice(k)}>{DEVICES[k].label}</button>)}</div>
        <div className="ds-seg small" role="group" aria-label="Reading colours">{(['white', 'sepia', 'dark'] as ReaderTheme[]).map(k => <button key={k} aria-pressed={reader === k} className={reader === k ? 'on' : ''} onClick={() => setReader(k)}>{k[0].toUpperCase() + k.slice(1)}</button>)}</div>
        <div className="ds-seg small" role="group" aria-label="Text size"><button aria-label="Smaller text" onClick={() => setTextSize(n => Math.max(13, n - 2))}>A−</button><button aria-label="Larger text" onClick={() => setTextSize(n => Math.min(27, n + 2))}>A+</button></div>
      </div>}
      <div className="ds-canvas">
        {view === 'spread' && <iframe title="Book spread" className="spread-frame" sandbox="allow-scripts allow-same-origin" srcDoc={html}/>}
        {view === 'ebook' && <EbookPreview project={project} device={device} reader={reader} size={textSize}/>}
        <MeasuredPages project={project} sectionId={current} hidden={view !== 'pages'} onPages={(n, e) => { setPages(n); setFailed(e); }}/>
      </div>
      {view === 'spread' && chapters.length > 0 && <div className="ds-pager">
        <button aria-label="Previous chapter" disabled={at <= 0} onClick={() => select(chapters[at - 1].id)}><ChevronLeft size={16}/></button>
        <span>{chapters[at]?.title || ''}<small>Chapter {at + 1} of {chapters.length}</small></span>
        <button aria-label="Next chapter" disabled={at >= chapters.length - 1} onClick={() => select(chapters[at + 1].id)}><ChevronRight size={16}/></button>
      </div>}
    </main>
    <aside className="ds-custom" aria-label="Customise">
      <div className="ds-head"><span className="eyebrow">CUSTOMISE</span><h2>Make it yours.</h2></div>
      <TrimSelect design={project.design} change={setDesign}/>
      <DesignControls design={project.design} change={setDesign}/>
      <CoverCard project={project} pages={pages} change={change}/>
    </aside>
  </div>;
}

function CoverCard({ project, pages, change }: { project: StudioProject; pages: number | null; change: (fn: (p: StudioProject) => StudioProject) => void }) {
  const [binding, setBinding] = useState<'paperback' | 'hardcover'>('paperback');
  const paper = project.publishing?.paper || 'white';
  const head = <div className="cover-head"><span className="builder-title">Cover size</span><div className="ds-seg small" role="group" aria-label="Binding">{(['paperback', 'hardcover'] as const).map(b => <button key={b} aria-pressed={binding === b} className={binding === b ? 'on' : ''} onClick={() => setBinding(b)}>{b === 'paperback' ? 'Paperback' : 'Hardcover'}</button>)}</div></div>;
  if (!pages) return <div className="cover-card">{head}<p className="cover-wait">Measuring pages…</p></div>;
  const inch = (n: number) => `${n.toFixed(3)} in`;
  const mm = (n: number) => `${(n * 25.4).toFixed(1)} mm`;
  if (binding === 'hardcover') {
    const count = pages + (pages % 2);
    return <div className="cover-card">{head}
      <dl>
        <div><dt>Pages</dt><dd>{count}</dd></div>
        <div><dt>Wrap</dt><dd>0.51 in<small>15 mm past each edge</small></dd></div>
        <div><dt>Spine hinge</dt><dd>0.4 in<small>10 mm each side</small></dd></div>
      </dl>
      <a className="cover-link" href="https://kdp.amazon.com/en_US/cover-calculator" target="_blank" rel="noopener noreferrer">Exact hardcover size on Amazon KDP</a>
    </div>;
  }
  const c = coverSize(project.design.trim, pages, paper);
  return <div className="cover-card">{head}
    <label>Paper<select aria-label="Paper" value={paper} onChange={e => change(p => ({ ...p, publishing: { ...(p.publishing || {}), paper: e.target.value as 'white' | 'cream' } }))}><option value="white">White</option><option value="cream">Cream</option></select></label>
    <dl>
      <div><dt>Pages</dt><dd>{c.pages}</dd></div>
      <div><dt>Spine width</dt><dd>{inch(c.spine)}<small>{mm(c.spine)}</small></dd></div>
      <div><dt>Full cover</dt><dd>{c.width.toFixed(3)} × {c.height.toFixed(3)} in<small>{mm(c.width)} × {mm(c.height)}</small></dd></div>
    </dl>
    <p className="cover-note">{c.spineText ? 'Spine text fits.' : 'Spine text needs 79+ pages.'} Amazon KDP paperback · 0.125 in bleed</p>
  </div>;
}
