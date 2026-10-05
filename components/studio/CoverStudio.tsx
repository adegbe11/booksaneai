'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Box, Check, Download, Grid2x2, ImagePlus, Loader2, Maximize, ShieldCheck, Trash2, Upload } from 'lucide-react';
import type { StudioProject } from '@/lib/studio/model';
import { FONTS, fontStack } from '@/lib/studio/themes';
import {
  COVER_FONTS, COVER_STYLES, PALETTES, PRINTERS, STYLE_NAMES, canvasBlob, checkUpload, coverImages, coverWords, defaultCover, drawFront, drawWrap,
  ebookCanvas, hasLightEdges, isbnDigits, loadCoverFonts, loadImage, mockupCanvas, wrapColours, wrapGeometry, wrapPdf,
  type CoverCheck, type CoverImages, type CoverSettings, type CoverStyle, type Printer,
} from '@/lib/studio/cover';
import { MeasuredPages } from './BookPreview';

type View = 'front' | 'wrap' | '3d';

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
const slug = (p: StudioProject) => (p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'book').slice(0, 60);

/** Reads an image file, shrinking it so the long side is at most `max` pixels. */
async function readImage(file: File, max: number): Promise<string> {
  if (!/^image\/(png|jpeg)$/.test(file.type)) throw new Error('Choose a JPG or PNG image.');
  if (file.size > 40 * 1024 * 1024) throw new Error('Choose an image smaller than 40 MB.');
  const src = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = () => reject(new Error('Could not read that image.')); r.readAsDataURL(file); });
  const img = await loadImage(src);
  const k = Math.min(1, max / Math.max(img.width, img.height));
  if (k === 1 && src.length < 24_000_000) return src;
  const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.92);
}

function useImages(s: CoverSettings) {
  const want = `${s.photo?.length}|${s.mode}|${s.image?.length}|${s.authorPhoto?.length}`;
  const [state, setState] = useState<{ key: string; imgs: CoverImages }>({ key: '', imgs: {} });
  useEffect(() => { let live = true; void coverImages(s).then(imgs => { if (live) setState({ key: want, imgs }); }); return () => { live = false; }; }, [want]); // eslint-disable-line react-hooks/exhaustive-deps
  return state.key === want ? state.imgs : null;
}

function StyleThumb({ project, s, style, ready, imgs }: { project: StudioProject; s: CoverSettings; style: CoverStyle; ready: boolean; imgs: CoverImages | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const words = coverWords(project);
  useEffect(() => {
    const c = ref.current; if (!c || !ready || !imgs) return;
    const ctx = c.getContext('2d')!; const r = { x: 0, y: 0, w: c.width, h: c.height };
    ctx.clearRect(0, 0, c.width, c.height);
    drawFront(ctx, r, r, { words, settings: { ...s, mode: 'design', style }, photo: imgs.photo });
  }, [ready, imgs, style, s.palette, s.font, words.title, words.subtitle, words.author, words.series]); // eslint-disable-line react-hooks/exhaustive-deps
  return <canvas ref={ref} width={180} height={288} aria-hidden="true"/>;
}

export default function CoverStudio({ project, change, proof }: { project: StudioProject; change: (fn: (p: StudioProject) => StudioProject) => void; proof: () => void }) {
  const s = project.cover || defaultCover();
  const set = (patch: Partial<CoverSettings>) => change(p => ({ ...p, cover: { ...(p.cover || defaultCover()), ...patch } }));
  const [view, setView] = useState<View>('front');
  const [guides, setGuides] = useState(true);
  const [pages, setPages] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [checks, setChecks] = useState<CoverCheck[]>([]);
  const imgs = useImages(s);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const words = coverWords(project);
  const printer: Printer = s.printer || 'kdp';
  const paper = project.publishing?.paper || 'white';
  const geometry = pages ? wrapGeometry(project.design.trim, pages, paper, printer) : null;
  const isbn = isbnDigits(s.isbn);
  const { thumb: _thumb, ...look } = s; // eslint-disable-line @typescript-eslint/no-unused-vars
  const key = JSON.stringify([look, words]);

  // Only what changes the page count re-measures the book; cover edits do not.
  const interior = useMemo(() => ({ ...project, cover: undefined }), [project.sections, project.design, project.title, project.subtitle, project.author, project.publishing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void loadCoverFonts().then(() => setReady(true)); }, []);

  useEffect(() => {
    if (s.mode !== 'upload' || !imgs?.upload) { setChecks([]); return; }
    setChecks(checkUpload(imgs.upload.width, imgs.upload.height, project.design.trim, hasLightEdges(imgs.upload)));
  }, [imgs, s.mode, project.design.trim]);

  // The preview.
  useEffect(() => {
    const out = canvas.current; if (!out || !ready || !imgs) return;
    let src: HTMLCanvasElement;
    if (view === 'wrap') {
      if (!geometry) return;
      src = document.createElement('canvas'); src.width = Math.round(geometry.width * 110); src.height = Math.round(geometry.height * 110);
      drawWrap(src.getContext('2d')!, geometry, 110, { words, settings: s, ...imgs, guides });
    } else {
      const front = ebookCanvas(words, s, imgs);
      src = view === '3d' ? mockupCanvas(front, wrapColours(s, imgs.upload).bg, 1400, 1400) : front;
    }
    out.width = src.width; out.height = src.height;
    out.getContext('2d')!.drawImage(src, 0, 0);
  }, [key, imgs, ready, view, guides, geometry?.width, geometry?.spineText]); // eslint-disable-line react-hooks/exhaustive-deps

  // A small copy of the front for the library shelf and the ebook preview.
  useEffect(() => {
    if (!ready || !imgs) return;
    const t = setTimeout(() => {
      const front = ebookCanvas(words, s, imgs);
      const c = document.createElement('canvas'); c.width = 400; c.height = Math.round(400 * front.height / front.width);
      c.getContext('2d')!.drawImage(front, 0, 0, c.width, c.height);
      const thumb = c.toDataURL('image/jpeg', 0.82);
      if (thumb !== project.cover?.thumb) set({ thumb });
    }, 700);
    return () => clearTimeout(t);
  }, [key, imgs, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  async function upload(file: File | undefined, field: 'image' | 'photo' | 'authorPhoto') {
    if (!file) return;
    setError('');
    try {
      const src = await readImage(file, field === 'authorPhoto' ? 800 : field === 'photo' ? 3600 : 6000);
      set(field === 'image' ? { image: src, mode: 'upload' } : { [field]: src });
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not read that image.'); }
  }

  async function run(kind: 'ebook' | 'print' | '3d' | 'story') {
    if (!imgs) return;
    setBusy(kind); setError('');
    try {
      const front = ebookCanvas(words, s, imgs);
      if (kind === 'ebook') save(await canvasBlob(front, 'image/jpeg', 0.92), `${slug(project)}-ebook-cover.jpg`);
      if (kind === 'print' && geometry) save(await wrapPdf(geometry, { words, settings: s, ...imgs }, project.title), `${slug(project)}-print-cover-${printer}.pdf`);
      if (kind === '3d') save(await canvasBlob(mockupCanvas(front, wrapColours(s, imgs.upload).bg, 1600, 1600), 'image/png'), `${slug(project)}-3d.png`);
      if (kind === 'story') save(await canvasBlob(mockupCanvas(front, wrapColours(s, imgs.upload).bg, 1080, 1920, PALETTES[s.palette][0]), 'image/png'), `${slug(project)}-story.png`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not make that file.'); }
    finally { setBusy(''); }
  }

  const status = useMemo(() => {
    if (view !== 'wrap') return s.mode === 'upload' ? 'Your cover' : '1600 × 2560 px · Kindle size';
    if (!geometry) return 'Measuring pages…';
    return `${geometry.pages} pages · spine ${geometry.spine.toFixed(3)} in · ${geometry.width.toFixed(3)} × ${geometry.height.toFixed(3)} in`;
  }, [view, geometry, s.mode]);

  const notes: string[] = [];
  if (view === 'wrap' && geometry && !geometry.spineText) notes.push(`Spine text starts at ${PRINTERS[printer].spineText} pages.`);
  if (s.isbn && !isbn) notes.push('That ISBN is not valid.');
  if (printer === 'ingram' && !isbn) notes.push('IngramSpark needs an ISBN barcode.');

  return <div className="design-studio cover-studio">
    <aside className="ds-themes" aria-label="Cover designs">
      <div className="ds-head"><span className="eyebrow">COVERS</span><h2>Dress your book.</h2></div>
      <div className="cover-styles">
        <button className={`cover-style upload-tile ${s.mode === 'upload' ? 'on' : ''}`} aria-pressed={s.mode === 'upload'} onClick={() => (s.image ? set({ mode: 'upload' }) : fileRef.current?.click())}>
          {s.image ? <img src={s.image} alt=""/> : <span className="upload-face"><Upload size={22}/>Upload</span>}
          <span>My own</span>
        </button>
        {COVER_STYLES.map(style => <button key={style} className={`cover-style ${s.mode === 'design' && s.style === style ? 'on' : ''}`} aria-pressed={s.mode === 'design' && s.style === style} onClick={() => set({ mode: 'design', style })}>
          <StyleThumb project={project} s={s} style={style} ready={ready} imgs={imgs}/>
          <span>{STYLE_NAMES[style]}</span>
        </button>)}
      </div>
    </aside>

    <main className="ds-stage">
      <div className="ds-toolbar">
        <div className="ds-seg" role="tablist" aria-label="Cover view">
          <button role="tab" aria-selected={view === 'front'} className={view === 'front' ? 'on' : ''} onClick={() => setView('front')}><Maximize size={14}/>Front</button>
          <button role="tab" aria-selected={view === 'wrap'} className={view === 'wrap' ? 'on' : ''} onClick={() => setView('wrap')}><Grid2x2 size={14}/>Full cover</button>
          <button role="tab" aria-selected={view === '3d'} className={view === '3d' ? 'on' : ''} onClick={() => setView('3d')}><Box size={14}/>3D</button>
        </div>
        {view === 'wrap' && <label className="guide-toggle"><input type="checkbox" checked={guides} onChange={e => setGuides(e.target.checked)}/>Guides</label>}
        <span className="ds-status">{status}</span>
      </div>
      <div className={`ds-canvas cover-canvas view-${view}`}>
        {(!ready || !imgs || (view === 'wrap' && !geometry)) && <p className="cover-wait"><Loader2 size={16} className="spin"/>{view === 'wrap' && !geometry ? 'Measuring pages…' : 'Drawing your cover…'}</p>}
        <canvas ref={canvas} className="cover-preview" aria-label={view === 'wrap' ? 'Full cover preview' : view === '3d' ? '3D book preview' : 'Front cover preview'} role="img"/>
        {view === 'wrap' && guides && geometry && <ul className="guide-key" aria-label="Guides"><li className="k-trim">Trim</li><li className="k-safe">Keep text inside</li><li className="k-spine">Spine</li></ul>}
      </div>
      {notes.length > 0 && <div className="cover-notes">{notes.map(n => <p key={n}><AlertCircle size={14}/>{n}</p>)}</div>}
      <MeasuredPages project={interior} sectionId="" hidden onPages={n => setPages(n)}/>
    </main>

    <aside className="ds-custom" aria-label="Cover settings">
      <div className="ds-head"><span className="eyebrow">CUSTOMISE</span><h2>Make it yours.</h2></div>
      <div className="cover-words">
        <label>Title<input aria-label="Cover title" value={project.title} onChange={e => change(p => ({ ...p, title: e.target.value }))}/></label>
        <label>Subtitle<input aria-label="Cover subtitle" value={project.subtitle} placeholder="Optional" onChange={e => change(p => ({ ...p, subtitle: e.target.value }))}/></label>
        <label>Author<input aria-label="Cover author" value={project.author} placeholder="Your name" onChange={e => change(p => ({ ...p, author: e.target.value }))}/></label>
      </div>

      {s.mode === 'design' ? <>
        <div className="builder-block">
          <span className="builder-title">Colours</span>
          <div className="palette-row" role="radiogroup" aria-label="Colours">
            {PALETTES.map(([bg, ink, accent], i) => <button key={i} role="radio" aria-checked={s.palette === i} aria-label={`Colours ${i + 1}`} className={s.palette === i ? 'on' : ''} style={{ background: bg }} onClick={() => set({ palette: i })}><i style={{ background: accent }}/><b style={{ background: ink }}/></button>)}
          </div>
        </div>
        <label className="builder-block">Title font
          <select aria-label="Title font" value={s.font} onChange={e => set({ font: e.target.value as CoverSettings['font'] })} style={{ fontFamily: fontStack(s.font) }}>
            {COVER_FONTS.map(f => <option key={f} value={f} style={{ fontFamily: fontStack(f) }}>{FONTS[f].label}</option>)}
          </select>
        </label>
        <div className="builder-block">
          <span className="builder-title">Background photo</span>
          {s.photo ? <div className="photo-row"><img src={s.photo} alt=""/><button className="secondary" onClick={() => photoRef.current?.click()}>Change</button><button className="icon-button" aria-label="Remove background photo" onClick={() => set({ photo: undefined })}><Trash2 size={15}/></button></div>
            : <button className="secondary" onClick={() => photoRef.current?.click()}><ImagePlus size={15}/>Add a photo</button>}
        </div>
      </> : <div className="builder-block">
        <span className="builder-title">Your cover</span>
        <button className="secondary" onClick={() => fileRef.current?.click()}><Upload size={15}/>{s.image ? 'Replace cover' : 'Upload cover'}</button>
        {checks.length > 0 && <ul className="cover-checks">{checks.map(c => <li key={c.message} className={c.ok ? 'ok' : 'warn'}>{c.ok ? <Check size={14}/> : <AlertCircle size={14}/>}{c.message}</li>)}</ul>}
        <label className="check-row"><input type="checkbox" checked={!!s.border} onChange={e => set({ border: e.target.checked })}/>Thin grey border on the ebook cover</label>
      </div>}

      <div className="builder-block back-block">
        <span className="builder-title">Back cover</span>
        <label>Blurb<textarea aria-label="Back cover blurb" rows={6} maxLength={3000} value={s.blurb || ''} placeholder="What the book is about" onChange={e => set({ blurb: e.target.value })}/></label>
        <label>About the author<textarea aria-label="About the author" rows={3} maxLength={1200} value={s.bio || ''} onChange={e => set({ bio: e.target.value })}/></label>
        {s.authorPhoto ? <div className="photo-row round"><img src={s.authorPhoto} alt=""/><button className="secondary" onClick={() => authorRef.current?.click()}>Change</button><button className="icon-button" aria-label="Remove author photo" onClick={() => set({ authorPhoto: undefined })}><Trash2 size={15}/></button></div>
          : <button className="secondary" onClick={() => authorRef.current?.click()}><ImagePlus size={15}/>Author photo</button>}
        <label>ISBN<input aria-label="ISBN" inputMode="numeric" value={s.isbn || ''} placeholder="978…" onChange={e => set({ isbn: e.target.value.slice(0, 20) })}/>{isbn && <small className="isbn-ok"><Check size={12}/>Barcode added</small>}</label>
        <div className="two-up">
          <label>Printer<select aria-label="Printer" value={printer} onChange={e => set({ printer: e.target.value as Printer })}>{(Object.keys(PRINTERS) as Printer[]).map(k => <option key={k} value={k}>{PRINTERS[k].name}</option>)}</select></label>
          <label>Paper<select aria-label="Cover paper" value={paper} onChange={e => change(p => ({ ...p, publishing: { ...(p.publishing || {}), paper: e.target.value as 'white' | 'cream' } }))}><option value="white">White</option><option value="cream">Cream</option></select></label>
        </div>
      </div>

      <div className="builder-block cover-downloads">
        <span className="builder-title">Download</span>
        <button className="primary" disabled={!!busy || !imgs || !ready} onClick={() => void run('ebook')}>{busy === 'ebook' ? <Loader2 size={15} className="spin"/> : <Download size={15}/>}eBook cover · JPG</button>
        <button className="primary" disabled={!!busy || !imgs || !ready || !geometry} onClick={() => void run('print')}>{busy === 'print' ? <Loader2 size={15} className="spin"/> : <Download size={15}/>}{geometry ? 'Print cover · PDF' : 'Measuring pages…'}</button>
        <div className="two-up">
          <button className="secondary" disabled={!!busy || !imgs || !ready} onClick={() => void run('3d')}>3D book</button>
          <button className="secondary" disabled={!!busy || !imgs || !ready} onClick={() => void run('story')}>Story post</button>
        </div>
        <button className="secondary" onClick={proof}><ShieldCheck size={15}/>Print proof check</button>
        {error && <p className="cover-error" role="alert">{error}</p>}
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden aria-label="Upload cover image" onChange={e => { void upload(e.target.files?.[0], 'image'); e.target.value = ''; }}/>
      <input ref={photoRef} type="file" accept="image/png,image/jpeg" hidden aria-label="Upload background photo" onChange={e => { void upload(e.target.files?.[0], 'photo'); e.target.value = ''; }}/>
      <input ref={authorRef} type="file" accept="image/png,image/jpeg" hidden aria-label="Upload author photo" onChange={e => { void upload(e.target.files?.[0], 'authorPhoto'); e.target.value = ''; }}/>
    </aside>
  </div>;
}
