import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Check, FileDown, FileText, FolderOpen, ShieldCheck } from 'lucide-react';
import { DropBox, Reveal, ToolTabs } from '@/components/site/Interactive';
import './site.css';

const THEME_STRIP = ['heritage', 'romance', 'thriller', 'fantasy', 'memoir', 'mystery', 'sci-fi', 'devotional', 'gothic', 'business', 'young-adult', 'literary'];
const SHOWCASE = [
  ['heritage', 'Classic fiction'], ['romance', 'Romance'], ['thriller', 'Thriller'], ['fantasy', 'Fantasy'],
  ['memoir', 'Memoir'], ['devotional', 'Faith and devotional'], ['business', 'Business'], ['childrens', 'Children’s'],
];
const FAQS = [
  ['What is Booksane?', 'Booksane is a place to write, design and export a book. You bring a manuscript, choose a look, and download a print PDF and an ebook.'],
  ['Is it free?', 'Yes. Booksane is free while it is in early access.'],
  ['Do I need an account?', 'No. Open the studio and start. Your books are saved in your browser on your device.'],
  ['Where are my books saved?', 'In your browser, on your device. You can download an editable copy of any book at any time and open it again later.'],
  ['Which files can I bring in?', 'Word (.docx) and plain text files. Booksane splits the manuscript into chapters and shows you a report of what came across.'],
  ['Which files do I get?', 'A print-ready PDF interior with your fonts built in, an EPUB ebook, and an editable Booksane project file.'],
  ['Can I use the files on Amazon KDP and other stores?', 'Booksane makes standard PDF and EPUB files. Always check your files against the store’s current requirements before you publish.'],
  ['Does it work on Windows and Mac?', 'Yes. Booksane runs in your web browser, so it works on Windows, Mac, Linux and Chromebook.'],
  ['How many designs are there?', '18 themes, one for each popular genre, plus a builder where you can change fonts, chapter openings, ornaments, scene breaks and page layout.'],
];

export default function HomePage() {
  return <div className="site">
    <header className="nav">
      <Link href="/" className="brand"><span className="brand-mark"><BookOpen size={18}/></span>booksane</Link>
      <nav className="nav-links" aria-label="Main"><a href="#tools">Features</a><a href="#themes">Themes</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></nav>
      <Link href="/editor" className="btn btn-light btn-sm">Open studio</Link>
    </header>

    <section className="hero">
      <div className="hero-glow" aria-hidden="true"/>
      <div className="hero-copy">
        <h1>Your manuscript.<br/><span>A beautiful book.</span></h1>
        <p>Write, design and export print-ready books and ebooks in one place. In your browser, on any computer.</p>
        <Link href="/editor" className="btn btn-primary btn-lg">Start your book <ArrowRight size={18}/></Link>
        <span className="hero-note"><ShieldCheck size={15}/>Free during early access · No account needed</span>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <img className="hero-page hero-page-l" src="/site/theme-romance.webp" alt=""/>
        <div className="hero-window"><div className="window-bar"><i/><i/><i/></div><img src="/site/design.webp" alt=""/></div>
        <img className="hero-page hero-page-r" src="/site/theme-fantasy.webp" alt=""/>
      </div>
    </section>

    <section className="feature-cards wrap">
      <Reveal className="fc fc-big"><span className="chip">Themes</span><h2>18 themes, one for every genre</h2><p>From classic fiction to thrillers, romance, memoir and devotionals. Each one is a complete book design.</p><a href="#themes" className="btn btn-light">See the themes</a><img src="/site/theme-heritage.webp" alt="" className="fc-art"/></Reveal>
      <div className="fc-col">
        <Reveal className="fc fc-small" delay={0.06}><span className="chip chip-new">New</span><h3>Instant two-page spread</h3><p>See every change on facing pages the moment you make it.</p><ArrowUpRight className="fc-arrow" size={18}/></Reveal>
        <Reveal className="fc fc-small" delay={0.12}><span className="chip chip-hot">Print and ebook</span><h3>One manuscript, every edition</h3><p>A PDF for print and an EPUB for ebook stores, from the same book.</p><ArrowUpRight className="fc-arrow" size={18}/></Reveal>
      </div>
    </section>

    <section className="prompt-band">
      <Reveal className="wrap prompt-inner">
        <span className="prompt-mark"><BookOpen size={22}/></span>
        <h2>Bring your manuscript.<br/><span>Booksane does the layout.</span></h2>
        <DropBox/>
        <p className="muted">Word and text files. Your manuscript stays on your device.</p>
      </Reveal>
    </section>

    <section className="wrap section" id="tools">
      <Reveal className="section-head center"><h2>Everything you need to make a book</h2><p>Write it, design it, check it and send it to print, without learning page-layout software.</p></Reveal>
      <Reveal><ToolTabs/></Reveal>
    </section>

    <section className="wrap section">
      <Reveal className="section-head center"><h2>The essentials, built in</h2></Reveal>
      <div className="essentials">
        {[['theme-literary', '18 trim sizes', 'Every common paperback size, from pocket to letter.'], ['theme-mystery', '17 book fonts', 'Open-licence fonts, built into every PDF.'], ['theme-young-adult', 'Ebook edition', 'A reflowable EPUB with your chapters and images.'], ['theme-gothic', 'Print PDF', 'Page numbers, running heads and a real contents page.']].map(([img, title, body], i) =>
          <Reveal key={title} className="ess" delay={i * 0.05}><div className="ess-art"><img src={`/site/${img}.webp`} alt=""/></div><h3>{title}</h3><p>{body}</p></Reveal>)}
      </div>
    </section>

    <section className="wrap section rows">
      <Reveal className="row"><div className="row-copy"><h2>Chapter openings that look professionally set</h2><p>Drop caps, small-cap first lines, ornaments and chapter labels in words, numbers or Roman numerals.</p><Link href="/editor" className="text-link">Try the themes <ArrowRight size={17}/></Link></div><div className="row-art paper"><img src="/site/opening-heritage.webp" alt="A chapter opening with a drop cap and small capitals"/></div></Reveal>
      <Reveal className="row row-flip"><div className="row-copy"><h2>Every choice is yours</h2><p>Change the text font, heading font, alignment, scene breaks, paragraph style, running heads and page numbers. Go back to the theme in one click.</p><Link href="/editor" className="text-link">Customise a book <ArrowRight size={17}/></Link></div><div className="row-art tall"><img src="/site/customise.webp" alt="The customise panel in Booksane"/></div></Reveal>
    </section>

    <section className="dark-band" id="themes">
      <div className="wrap dark-inner">
        <Reveal className="dark-copy"><h2>One book.<br/>Every format.</h2><p>Your manuscript stays the same while the design changes around it. Download the edition you need, whenever you need it.</p>
          <ul className="dark-points"><li><FileDown size={18}/>PDF for print</li><li><FileText size={18}/>EPUB for ebook stores</li><li><FolderOpen size={18}/>Editable project file</li></ul>
          <Link href="/editor" className="btn btn-primary">Start your book <ArrowRight size={17}/></Link></Reveal>
      </div>
      <div className="strip" aria-hidden="true"><div className="strip-track">{[...THEME_STRIP, ...THEME_STRIP].map((t, i) => <img key={i} src={`/site/theme-${t}.webp`} alt=""/>)}</div></div>
    </section>

    <section className="pricing wrap section" id="pricing">
      <Reveal className="section-head center"><h2>Simple pricing</h2><p>Everything is free while Booksane is in early access.</p></Reveal>
      <div className="plans">
        <Reveal className="plan"><h3>Writer</h3><p className="plan-sub">For your first book</p><div className="price">Free</div><Link href="/editor" className="btn btn-outline">Start free</Link><ul><li><Check size={15}/>Unlimited books</li><li><Check size={15}/>Write and import Word files</li><li><Check size={15}/>PDF and EPUB export</li></ul></Reveal>
        <Reveal className="plan plan-hot" delay={0.06}><span className="plan-flag">Early access</span><h3>Studio</h3><p className="plan-sub">Every feature, while we grow</p><div className="price">Free</div><Link href="/editor" className="btn btn-primary">Open the studio</Link><ul><li><Check size={15}/>All 18 themes and the builder</li><li><Check size={15}/>17 fonts and 18 trim sizes</li><li><Check size={15}/>Two-page spread and ebook preview</li><li><Check size={15}/>Version history and backups</li></ul></Reveal>
        <Reveal className="plan" delay={0.12}><h3>Teams</h3><p className="plan-sub">For publishers and studios</p><div className="price price-soon">Coming soon</div><span className="btn btn-outline btn-disabled">Not yet available</span><ul><li><Check size={15}/>Shared books</li><li><Check size={15}/>House styles</li><li><Check size={15}/>Batch exports</li></ul></Reveal>
      </div>
    </section>

    <section className="wrap section">
      <Reveal className="section-head center"><h2>Books you can make with Booksane</h2><p>Real pages, laid out by Booksane from the same manuscript.</p><Link href="/editor" className="btn btn-primary">Make yours</Link></Reveal>
      <div className="showcase">{SHOWCASE.map(([t, label], i) => <Reveal key={t} className="show-card" delay={(i % 4) * 0.05}><img src={`/site/theme-${t}.webp`} alt={`${label} theme`}/><span>{label}</span></Reveal>)}</div>
    </section>

    <section className="wrap section faq" id="faq">
      <Reveal className="section-head center"><h2>Questions</h2></Reveal>
      <div className="faq-list">{FAQS.map(([q, a]) => <details key={q}><summary>{q}<span aria-hidden="true"/></summary><p>{a}</p></details>)}</div>
    </section>

    <section className="cta-band">
      <div className="wrap cta-inner">
        <div><h2>Your book is ready<br/>when you are.</h2><Link href="/editor" className="btn btn-light btn-lg">Start your book <ArrowRight size={18}/></Link></div>
        <div className="cta-art"><img src="/site/design-romance.webp" alt=""/></div>
      </div>
    </section>

    <footer className="footer">
      <div className="wrap footer-cols">
        <div><Link href="/" className="brand brand-dark"><span className="brand-mark"><BookOpen size={16}/></span>booksane</Link><p>Write, design and export your book.</p></div>
        <div><h4>Product</h4><Link href="/editor">Studio</Link><a href="#themes">Themes</a><a href="#pricing">Pricing</a></div>
        <div><h4>Help</h4><a href="#faq">Questions</a><Link href="/editor">Sample book</Link></div>
      </div>
      <div className="wrap footer-base">© 2026 Booksane</div>
    </footer>
  </div>;
}
