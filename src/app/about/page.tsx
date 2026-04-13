import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Booksane',
  description: 'Booksane is the fastest, most beautiful book formatting tool in the world.',
};

export default function AboutPage() {
  return (
    <div style={{ background: '#0A0910', minHeight: '100vh', color: '#fff' }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: '#FFE500', border: '2px solid #000', boxShadow: '3px 3px 0 #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000', fontFamily: 'serif' }}>B</div>
          <span style={{ fontWeight: 900, fontSize: 13, color: '#fff', letterSpacing: '0.06em' }}>BOOKSANE</span>
        </Link>
        <Link href="/editor" style={{ background: '#FFE500', border: '2px solid #000', boxShadow: '3px 3px 0 #000', padding: '10px 22px', fontWeight: 800, fontSize: 13, color: '#000', textDecoration: 'none' }}>
          Open Editor →
        </Link>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 40px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#FFE500', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>About Booksane</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>
          We believe every author deserves<br />
          <span style={{ color: '#FFE500' }}>a beautifully formatted book.</span>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: 580 }}>
          Professional book formatting used to cost hundreds of dollars and take weeks. We changed that. Booksane turns your raw manuscript into a publish-ready book in under three seconds — for free.
        </p>
      </div>

      {/* Story */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ borderLeft: '3px solid #FFE500', paddingLeft: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>The Problem We Solved</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            Authors pour years into writing a book. Then they hit a wall: formatting. Vellum costs $249.99 and only works on Mac. Reedsy is slow and web-only. Atticus is decent but complicated. Most authors give up and pay a formatter $200–$500 on Fiverr.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
            Booksane was built to eliminate that wall entirely. Paste your text. Pick a template. Export your book. That&apos;s it.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid #FF2D78', paddingLeft: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>What We Built</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            A full publishing pipeline in the browser. 10 professional templates designed for fiction, nonfiction, romance, thriller, and business. Export to EPUB for ebook stores, print-ready PDF for Amazon KDP and IngramSpark, and Word (.docx) for editing. Front matter, back matter, chapter headings, drop caps, table of contents — all automatic.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid #00FF7F', paddingLeft: 28, marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Our Mission</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
            To give every author on earth — regardless of budget, platform, or technical skill — the tools to publish a book that looks as good as anything from a traditional publisher. Free, forever.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
          {[
            { num: '56,362+', label: 'Books formatted' },
            { num: '10', label: 'Templates' },
            { num: 'Free', label: 'Always' },
            { num: '< 3s', label: 'To format' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px', flex: '1 1 140px' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#FFE500', marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px', background: '#FF2D78', border: '3px solid #000', boxShadow: '5px 5px 0 #000' }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 20 }}>
            Ready to format your book?
          </p>
          <Link href="/editor" style={{ background: '#FFE500', border: '2px solid #000', boxShadow: '4px 4px 0 #000', padding: '14px 32px', fontWeight: 900, fontSize: 15, color: '#000', textDecoration: 'none', display: 'inline-block' }}>
            Open the Editor →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} Booksane. All rights reserved. · <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.3)' }}>Privacy</Link> · <Link href="/terms" style={{ color: 'rgba(255,255,255,0.3)' }}>Terms</Link>
        </p>
      </div>
    </div>
  );
}
