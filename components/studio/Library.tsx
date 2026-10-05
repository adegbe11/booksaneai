'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Library as LibraryIcon, Loader2, PenLine, Search, Sparkles, Upload } from 'lucide-react';
import { projectWords, type StudioProject } from '@/lib/studio/model';
import { themeById, fontStack, FONTS } from '@/lib/studio/themes';
import { Booksy, Shelf, Squiggle } from '@/components/site/Drawings';
import '@/app/site.css';
import './library.css';

const COVERS = ['#2f8a62', '#e4572e', '#2f4b7a', '#b7832f', '#7a3e5d', '#256f4f', '#c4553b', '#3d6b8a'];
function hue(id: string) { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COVERS[h % COVERS.length]; }
function when(t: number) {
  const days = Math.floor((Date.now() - t) / 86400000);
  return days <= 0 ? 'Edited today' : days === 1 ? 'Edited yesterday' : days < 7 ? `Edited ${days} days ago` : `Edited ${new Date(t).toLocaleDateString()}`;
}
const chunk = <T,>(list: T[], n: number) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));

function Cover({ book, open }: { book: StudioProject; open: () => void }) {
  const t = themeById(book.design.theme);
  const font = FONTS[t.heading].kind === 'script' ? t.body : t.heading;
  const colour = hue(book.id);
  const w = projectWords(book);
  return <button className="lib-book" onClick={open} aria-label={`${book.title} by ${book.author || 'you'}, ${w.toLocaleString()} words`}>
    {book.cover?.thumb ? <span className="lib-cover has-art"><img src={book.cover.thumb} alt=""/><span className="lib-spine"/></span> : <span className="lib-cover" style={{ background: colour }}>
      <span className="lib-spine"/>
      <span className="lib-cover-title" style={{ fontFamily: fontStack(font) }}>{book.title}</span>
      <span className="lib-cover-rule"/>
      <span className="lib-cover-author">{book.author || 'Your name'}</span>
    </span>}
    <span className="lib-tag"><strong>{book.title}</strong><small>{w.toLocaleString()} words · {when(book.updatedAt)}</small></span>
  </button>;
}

export default function Library({ projects, loading, query, setQuery, create, importBook, sample, boxSet, open }: {
  projects: StudioProject[]; loading: boolean; query: string; setQuery: (q: string) => void; open: (b: StudioProject) => void;
  create: () => void; importBook: () => void; sample: () => void; boxSet: () => void;
}) {
  const returning = projects.length > 0;
  const shown = projects.filter(p => `${p.title} ${p.author}`.toLowerCase().includes(query.toLowerCase()));
  const words = projects.reduce((n, p) => n + projectWords(p), 0);
  return <div className="site lib">
    <header className="nav wrap">
      <Link href="/" className="brand"><span className="brand-mark"><BookOpen size={17}/></span>booksane</Link>
      <span className="lib-badge">Studio</span>
      <Link href="/" className="lib-about">About Booksane <ArrowRight size={15}/></Link>
    </header>

    <section className="wrap lib-hero">
      <div className="lib-hero-copy">
        <h1>{returning ? <>Welcome back to <span className="hl">your library.<Squiggle className="hl-line"/></span></> : <>Let’s make your <span className="hl">first book.<Squiggle className="hl-line"/></span></>}</h1>
        {returning && <p className="lib-stats">{projects.length} {projects.length === 1 ? 'book' : 'books'} · {words.toLocaleString()} words written</p>}
      </div>
      <div className="lib-hero-buddy">
        <div className="bubble">{returning ? 'Which book today?' : 'Pick a door. I’ll help.'}</div>
        <Booksy pose={returning ? 'read' : 'wave'} size={180} className="buddy-float"/>
      </div>
    </section>

    <section className="wrap lib-start" aria-label="Start your book">
      <button className="lib-door lib-door-main" aria-label="Import manuscript" onClick={importBook}><span className="lib-door-icon"><Upload size={22}/></span><strong>I have a manuscript</strong><span>Drop in a Word or text file.</span><small>Import manuscript <ArrowRight size={15}/></small></button>
      <button className="lib-door" aria-label="Create a book" onClick={create}><span className="lib-door-icon"><PenLine size={22}/></span><strong>Start from scratch</strong><span>A clean first chapter.</span><small>Create a book <ArrowRight size={15}/></small></button>
      <button className="lib-door lib-door-sun" aria-label="Open sample book" onClick={sample}><span className="lib-door-icon"><Sparkles size={22}/></span><strong>Just looking</strong><span>Play with a sample book.</span><small>Open sample book <ArrowRight size={15}/></small></button>
    </section>

    <section className="wrap lib-shelves" aria-label="Your library">
      <div className="lib-shelf-head">
        <h2>Your bookshelf <span>{projects.length}</span></h2>
        <div className="lib-shelf-tools">
          {projects.length >= 2 && <button className="lib-pill" onClick={boxSet}><LibraryIcon size={15}/>Make a box set</button>}
          {returning && <label className="lib-search"><Search size={15}/><input aria-label="Search books" placeholder="Find a book" value={query} onChange={e => setQuery(e.target.value)}/></label>}
        </div>
      </div>
      {loading ? <p className="lib-empty"><Loader2 size={18} className="spin"/> Opening your library…</p>
        : !returning ? <div className="lib-shelf lib-shelf-empty"><div className="lib-row"><span className="hand lib-empty-note">your books will live here</span></div><div className="lib-plank"/></div>
        : shown.length === 0 ? <p className="lib-empty">No book matches “{query}”.</p>
        : chunk(shown, 5).map((row, i) => <div className="lib-shelf" key={i}><div className="lib-row">{row.map(b => <Cover key={b.id} book={b} open={() => open(b)}/>)}</div><div className="lib-plank"/></div>)}
    </section>

    <ol className="wrap lib-steps" aria-label="The publishing workflow">
      <li><span>1</span><strong>Write</strong><small>your words and chapters</small></li>
      <li><span>2</span><strong>Design</strong><small>pick a look you love</small></li>
      <li><span>3</span><strong>Cover</strong><small>front, spine and back</small></li>
      <li><span>4</span><strong>Export</strong><small>print PDF and ebooks</small></li>
    </ol>
    <p className="wrap lib-saved">Books are saved in this browser, on this device. Download a backup from Export.</p>
    <Shelf className="lib-footer-shelf"/>
  </div>;
}
