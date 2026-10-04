'use client';

import { useEffect, useRef, useState } from 'react';
import type { StudioProject } from '@/lib/studio/model';
import { ebookHtml, printHtml, type ReaderTheme } from '@/lib/studio/publication';
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

export type Device = 'kindle' | 'iphone' | 'ipad';
export const DEVICES: Record<Device, { label: string; w: number; h: number; radius: number; bezel: number }> = {
  kindle: { label: 'Kindle', w: 360, h: 480, radius: 14, bezel: 22 },
  iphone: { label: 'iPhone', w: 300, h: 650, radius: 46, bezel: 11 },
  ipad: { label: 'iPad', w: 460, h: 620, radius: 28, bezel: 16 },
};

export function EbookPreview({ project, device = 'iphone', reader = 'white', size = 17 }: { project: StudioProject; device?: Device; reader?: ReaderTheme; size?: number }) {
  const d = DEVICES[device];
  return <div className="ebook-preview-scroll"><div className={`ebook-device device-${device}`} style={{ width: d.w + d.bezel * 2, height: d.h + d.bezel * 2, padding: d.bezel, borderRadius: d.radius }}><iframe title="eBook preview" className="ebook-frame" style={{ borderRadius: Math.max(4, d.radius - d.bezel) }} sandbox="" srcDoc={ebookHtml(project, reader, device === 'kindle' ? size - 1 : size)}/></div></div>;
}
