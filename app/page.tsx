import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, History, LayoutTemplate, ShieldCheck } from 'lucide-react';
import '@/components/studio/studio.css';
import './home.css';

export default function HomePage() {
  return <div className="booksane-studio booksane-home">
    <header className="library-header"><Link href="/" className="home-brand"><span className="logo-symbol"><BookOpen size={19}/></span><span>booksane</span><small>STUDIO</small></Link><Link href="/editor" className="secondary">Open your studio <ArrowRight size={15}/></Link></header>
    <main className="home-main">
      <section className="home-hero"><div><span className="eyebrow">FROM MANUSCRIPT TO SOMETHING MEANINGFUL</span><h1>From manuscript<br/>to beautiful<br/><em>book.</em></h1><p>Import a Word manuscript or start writing. Organize your chapters, choose a style, and download a print PDF or eBook.</p><Link href="/editor" className="primary">Start your book <ArrowRight size={17}/></Link><span className="home-caption">Start with a blank page, a DOCX, or our sample book.</span></div><div className="library-art" aria-hidden="true"><div className="art-lines"/><div className="art-book"><div className="cover-kicker">THE EVERYDAY COLLECTION</div><div className="cover-rule"/><h2>The Art<br/>of Paying<br/><em>Attention</em></h2><div className="cover-bottom">ALEX MORGAN<span>BOOKSANE EDITIONS / 01</span></div></div><span className="art-caption">Designed for the life of a book.</span></div></section>
      <section className="home-principle"><span className="eyebrow">THE BOOKSANE IDEA</span><h2>Beautiful pages.<br/>Clear decisions.</h2><p>Bookmaking deserves more than a download button. See what your import preserved, review the manuscript, and keep an editable copy of every book. Confidence comes from knowing your work.</p></section>
      <section className="home-features" aria-label="Studio capabilities">{[
        {Icon:FileText,title:'A place for every word',body:'Rich text, chapters, front matter, and back matter. Import DOCX and TXT with a report you can review.'},
        {Icon:LayoutTemplate,title:'Design with the pages in view',body:'Three typographic directions, four trim sizes, and measured print pagination. Preview a reflowable reading edition too.'},
        {Icon:History,title:'Room to change your mind',body:'Local autosaving and version checkpoints. Download an editable project and bring it back whenever you need it.'},
        {Icon:ShieldCheck,title:'Publish with your eyes open',body:'Export a PDF interior or EPUB, with revision-specific content checks. Review exported files in your reader and with your printer.'},
      ].map(({Icon,title,body})=><article key={title}><Icon size={23}/><h3>{title}</h3><p>{body}</p></article>)}</section>
      <section className="home-close"><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>Make something<br/>you’re proud to publish.</h2><Link href="/editor" className="primary">Step inside the studio <ArrowRight size={17}/></Link><p>This version saves books in this browser on this device.<br/>Keep project backups. PDF export is composed by the local application server.</p></section>
    </main><footer className="library-footer home-footer"><span>Booksane Studio</span><span>Your manuscript. Your decisions. Your book.</span></footer>
  </div>;
}
