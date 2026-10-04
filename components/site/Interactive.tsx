'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/** Fades content up the first time it scrolls into view. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '0px 0px -60px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${on ? 'rv-on' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
}

const TABS = [
  { id: 'write', label: 'Write', title: 'A calm place to write.', body: 'Chapters, front matter and back matter, all in order. Bring in a Word file and see exactly what came across.', img: '/site/write.webp', alt: 'Writing a chapter in Booksane' },
  { id: 'design', label: 'Design', title: 'Change the whole look in one click.', body: 'Pick a theme and every page updates on a real two-page spread. Then fine-tune fonts, openings and ornaments.', img: '/site/design.webp', alt: 'Choosing a theme in Booksane' },
  { id: 'preview', label: 'Preview', title: 'See it the way readers will.', body: 'Every printed page, laid out by the same engine that makes your PDF. Switch to the ebook to see the reading edition.', img: '/site/print.webp', alt: 'Print preview in Booksane' },
  { id: 'export', label: 'Export', title: 'Files ready to upload.', body: 'A print PDF with your fonts built in, an EPUB for ebook stores, and an editable copy of your book.', img: '/site/export.webp', alt: 'Exporting a book from Booksane' },
];

export function ToolTabs() {
  const [at, setAt] = useState(0);
  const t = TABS[at];
  return <div className="tabs-wrap">
    <div className="pill-tabs" role="tablist" aria-label="Booksane tools">
      {TABS.map((x, i) => <button key={x.id} role="tab" aria-selected={i === at} className={i === at ? 'on' : ''} onClick={() => setAt(i)}>{x.label}</button>)}
    </div>
    <div className="tab-panel" role="tabpanel" key={t.id}>
      <div className="tab-shot"><img src={t.img} alt={t.alt}/></div>
      <div className="tab-copy">
        <h3>{t.title}</h3>
        <p>{t.body}</p>
        <Link href="/editor" className="text-link">Open the studio <ArrowRight size={17}/></Link>
      </div>
    </div>
  </div>;
}

export function DropBox() {
  const [over, setOver] = useState(false);
  return <Link href="/editor" className={`dropbox ${over ? 'over' : ''}`} onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={e => { e.preventDefault(); window.location.href = '/editor'; }}>
    <span className="dropbox-text">Drop your Word file here, or start writing</span>
    <span className="dropbox-btn"><ArrowRight size={18}/></span>
  </Link>;
}
