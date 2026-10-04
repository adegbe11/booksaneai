'use client';

import { useEffect, useRef, useState } from 'react';
import { documentHtml, type StudioProject } from '@/lib/studio/model';
import { printHtml } from '@/lib/studio/publication';
import { TRIMS } from '@/lib/studio/themes';

export function trimLabel(project: StudioProject) { return TRIMS[project.design.trim].label; }

/** The measured book: every page laid out by the same engine that makes the PDF. */
export function MeasuredPages({ project, sectionId, hidden = false, onPages }: { project: StudioProject; sectionId: string; hidden?: boolean; onPages?: (pages: number | null, error: boolean) => void }) {
  const [html, setHtml] = useState('');
  const [pages, setPages] = useState<number | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const report = useRef(onPages);
  report.current = onPages;
  useEffect(() => {
    if (!pages || hidden) return;
    const index = project.sections.findIndex(section => section.id === sectionId);
    const page = frame.current?.contentDocument?.querySelector(`.pagedjs_pages #section-${index}`)?.closest('.pagedjs_page');
    const preview = frame.current?.contentWindow;
    if (page && preview) preview.scrollTo(0, page.getBoundingClientRect().top + preview.scrollY - 24);
  }, [pages, hidden, sectionId, project.sections]);
  useEffect(() => { setPages(null); report.current?.(null, false); const timer = setTimeout(() => setHtml(printHtml(project)), 650); return () => clearTimeout(timer); }, [project]);
  useEffect(() => {
    const listen = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'booksane-layout') { setPages(event.data.pages); report.current?.(event.data.pages, false); }
      if (event.data?.type === 'booksane-layout-error') report.current?.(null, true);
    };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, []);
  return <iframe ref={frame} title="Measured book preview" className={hidden ? 'measure-frame' : 'print-preview-frame'} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined} sandbox="allow-scripts allow-same-origin" srcDoc={html}/>;
}

export function EbookPreview({ project }: { project: StudioProject }) {
  return <div className="ebook-preview-scroll"><div className="ebook-device"><article className="ebook-sheet"><span className="eyebrow">READING EDITION</span><h1>{project.title}</h1><p className="ebook-author">{project.author}</p>{project.sections.map(s => <section key={s.id}><h2>{s.title}</h2><div dangerouslySetInnerHTML={{ __html: documentHtml(s.document) }}/></section>)}</article></div></div>;
}
