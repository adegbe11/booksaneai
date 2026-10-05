import Link from 'next/link';
import { ArrowRight, BookOpen, Check, Chrome, Laptop, Minus, Monitor, Terminal } from 'lucide-react';
import { DropBox, Reveal } from '@/components/site/Interactive';
import { Arrow, Booksy, Ring, Shelf, Sparkle, Squiggle } from '@/components/site/Drawings';
import './site.css';

const THEME_STRIP = ['heritage', 'romance', 'thriller', 'fantasy', 'memoir', 'mystery', 'sci-fi', 'devotional', 'gothic', 'business', 'young-adult', 'literary'];
const COMPARE: string[][] = [
  ['Works on', 'Any computer, in the browser', 'Mac only', 'Windows, Mac, Linux, Chromebook'],
  ['Price', 'Free in early access', '$249.99', '$147'],
  ['Device preview', 'yes', 'yes', 'yes'],
  ['Store-specific ebooks', 'yes', 'yes', 'no'],
  ['Box sets', 'yes', 'yes', 'no'],
  ['Footnotes', 'yes', 'yes', 'yes'],
  ['Callout boxes', 'yes', 'no', 'yes'],
  ['Large print', 'yes', 'yes', 'yes'],
  ['Version history', 'yes', 'no', 'Coming soon'],
  ['PDF/X for IngramSpark', 'yes', 'yes', 'no'],
  ['Cover size calculator', 'yes', 'no', 'no'],
];
const FAQS = [
  ['What is Booksane?', 'A place to write, design and export your book. You bring the words, pick a look, and download a print PDF and an ebook.'],
  ['Is it really free?', 'Yes. Booksane is free while it’s in early access.'],
  ['Do I need an account?', 'No. Open the studio and start. Your books are saved in your browser, on your device.'],
  ['Can I bring my Word document?', 'Yes. Drop in a .docx or a text file. Booksane finds your chapters and shows you what came across.'],
  ['Will my files work on Amazon KDP?', 'Booksane makes standard PDF and EPUB files, plus PDF/X for printers that ask for it. Always check your files with the store before you publish.'],
  ['Does it work on Windows?', 'Yes. Booksane runs in your web browser, so it works on Windows, Mac, Linux and Chromebook.'],
  ['What if I want to change the design later?', 'Change it any time. Your words stay the same; only the look changes.'],
];

export default function HomePage() {
  return <div className="site">
    <header className="nav wrap">
      <Link href="/" className="brand"><span className="brand-mark"><BookOpen size={17}/></span>booksane</Link>
      <nav className="nav-links" aria-label="Main"><a href="#how">How it works</a><a href="#looks">Looks</a><a href="#compare">Compare</a><a href="#faq">FAQ</a></nav>
      <Link href="/editor" className="btn btn-green btn-sm">Open the studio</Link>
    </header>

    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1>Write it. Format it.<br/><span className="hl">Love how it looks.<Squiggle className="hl-line"/></span></h1>
          <p>Booksane turns your manuscript into a print-ready paperback and a beautiful ebook. Right in your browser, on any computer.</p>
          <div className="hero-cta">
            <Link href="/editor" className="btn btn-green btn-lg">Start your book <ArrowRight size={18}/></Link>
            <span className="hand hand-free">it’s free!<Arrow className="arrow-free" flip/></span>
          </div>
          <ul className="platforms" aria-label="Works on"><li><Monitor size={16}/>Windows</li><li><Laptop size={16}/>Mac</li><li><Terminal size={16}/>Linux</li><li><Chrome size={16}/>Chromebook</li></ul>
        </div>
        <div className="hero-buddy">
          <div className="bubble">Hi! I’m Booksy.<br/>Let’s make your book.</div>
          <Booksy pose="wave" size={250} className="buddy-float"/>
          <Sparkle className="sp sp-1"/><Sparkle className="sp sp-2" color="#e4572e"/>
        </div>
      </div>
      <Shelf className="hero-shelf"/>
    </section>

    <section className="wrap product">
      <Reveal className="product-frame">
        <img src="/site/design.webp" alt="Choosing a theme in the Booksane studio"/>
        <span className="hand note n1">pick a look<Arrow className="na"/></span>
        <span className="hand note n2">see both pages, live<Arrow className="na" flip/></span>
        <span className="hand note n3">change anything<Arrow className="na" flip/></span>
      </Reveal>
    </section>

    <section className="wrap section" id="how">
      <Reveal className="head center"><h2>What can Booksane do for you?</h2></Reveal>
      <div className="three">
        {([['read', 'Write', 'A calm editor with chapters, parts, footnotes and word goals. Or drop in your Word file.'],
          ['point', 'Design', 'Pick one of 18 genre looks and tweak fonts, chapter openings and page layout.'],
          ['cheer', 'Publish', 'Download a print PDF, ebooks for every store, and the exact size of your cover.']] as const).map(([pose, t, b], i) =>
          <Reveal key={t} className="card" delay={i * 0.08}><Booksy pose={pose} size={110}/><h3>{t}</h3><p>{b}</p></Reveal>)}
      </div>
    </section>

    <section className="wrap section split">
      <Reveal className="split-copy">
        <span className="kicker">Step 1</span>
        <h2>Bring your words</h2>
        <p>Already wrote it? Drop in your Word file and Booksane finds the chapters for you, with a report of what came across. Starting fresh? Just type.</p>
        <DropBox/>
      </Reveal>
      <Reveal className="split-art"><div className="shot tilt-l"><img src="/site/write.webp" alt="Writing a chapter in Booksane"/></div><span className="hand note n4">drag chapters<Arrow className="na" flip/></span></Reveal>
    </section>

    <section className="wrap section split flip">
      <Reveal className="split-copy">
        <span className="kicker">Step 2</span>
        <h2>Pick a look you <span className="ringed">love<Ring/></span></h2>
        <p>Romance, thriller, fantasy, memoir, devotional and more. Click a theme and watch every page change. Drop caps, ornaments and chapter labels come built in.</p>
        <Link href="/editor" className="text-link">Try the themes <ArrowRight size={17}/></Link>
      </Reveal>
      <Reveal className="split-art"><div className="page-stack"><img src="/site/theme-romance.webp" alt=""/><img src="/site/theme-heritage.webp" alt=""/><img src="/site/theme-thriller.webp" alt=""/></div></Reveal>
    </section>

    <section className="wrap section split">
      <Reveal className="split-copy">
        <span className="kicker">Step 3</span>
        <h2>See it, then send it</h2>
        <p>Preview your ebook on a Kindle, iPhone or iPad. Check every printed page. Then download files that are ready to upload.</p>
        <ul className="ticks"><li><Check size={17}/>Print PDF with your fonts built in</li><li><Check size={17}/>Ebooks for Kindle, Apple, Kobo and more</li><li><Check size={17}/>PDF/X for IngramSpark</li><li><Check size={17}/>Your cover’s spine width</li></ul>
      </Reveal>
      <Reveal className="split-art"><div className="shot tilt-r"><img src="/site/ebook.webp" alt="Previewing the ebook on a phone in Booksane"/></div></Reveal>
    </section>

    <section className="looks" id="looks">
      <Reveal className="wrap head center"><h2>18 looks. One click each.</h2><p>Real pages, laid out by Booksane from the same manuscript.</p></Reveal>
      <div className="strip" aria-hidden="true"><div className="strip-track">{[...THEME_STRIP, ...THEME_STRIP].map((t, i) => <img key={i} src={`/site/theme-${t}.webp`} alt=""/>)}</div></div>
    </section>

    <section className="wrap section stores">
      <Reveal className="head center"><h2>Your files work where readers shop</h2></Reveal>
      <Reveal><ul className="store-list">{['Amazon Kindle', 'Apple Books', 'Kobo', 'Barnes & Noble', 'Google Play Books', 'Draft2Digital', 'IngramSpark'].map(s => <li key={s}>{s}</li>)}</ul></Reveal>
    </section>

    <section className="wrap section" id="compare">
      <Reveal className="head center"><h2>How Booksane compares</h2></Reveal>
      <Reveal className="compare">
        <table>
          <thead><tr><th/><th className="us">Booksane</th><th>Vellum</th><th>Atticus</th></tr></thead>
          <tbody>{COMPARE.map(([row, ...cells]) => <tr key={row}><th scope="row">{row}</th>{cells.map((c, i) => <td key={i} className={i === 0 ? 'us' : ''}>{c === 'yes' ? <Check size={18} className="yes" aria-label="Yes"/> : c === 'no' ? <Minus size={16} className="no" aria-label="Not listed"/> : c}</td>)}</tr>)}</tbody>
        </table>
        <p className="src">From each product’s own website, October 2026. A dash means we didn’t find it listed.</p>
        <Booksy pose="point" size={120} className="compare-buddy"/>
      </Reveal>
    </section>

    <section className="sane">
      <Reveal className="wrap sane-inner">
        <Booksy pose="cheer" size={200}/>
        <div>
          <h2>Stay sane. We’ll handle the fiddly bits.</h2>
          <p>Page numbers, running heads, a contents page that matches, chapters that start on the right page, lonely lines at the top of a page. Booksane takes care of them so you can get back to writing.</p>
        </div>
      </Reveal>
    </section>

    <section className="wrap section price">
      <Reveal className="price-card">
        <span className="kicker">Pricing</span>
        <h2>Free while we’re in early access</h2>
        <p>Every feature, unlimited books, no account.</p>
        <Link href="/editor" className="btn btn-green btn-lg">Start your book <ArrowRight size={18}/></Link>
      </Reveal>
    </section>

    <section className="wrap section faq" id="faq">
      <Reveal className="head center"><h2>Questions</h2></Reveal>
      <div className="faq-list">{FAQS.map(([q, a]) => <details key={q}><summary>{q}<span aria-hidden="true"/></summary><p>{a}</p></details>)}</div>
    </section>

    <section className="final">
      <div className="wrap final-inner">
        <Booksy pose="read" size={170}/>
        <h2>Your book is waiting.</h2>
        <Link href="/editor" className="btn btn-green btn-lg">Start your book <ArrowRight size={18}/></Link>
      </div>
      <Shelf className="final-shelf"/>
    </section>

    <footer className="footer">
      <div className="wrap footer-row">
        <Link href="/" className="brand"><span className="brand-mark"><BookOpen size={15}/></span>booksane</Link>
        <nav aria-label="Footer"><Link href="/editor">Studio</Link><a href="#looks">Looks</a><a href="#compare">Compare</a><a href="#faq">Questions</a></nav>
        <span>© 2026 Booksane</span>
      </div>
    </footer>
  </div>;
}
