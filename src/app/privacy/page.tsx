import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Booksane',
  description: 'How Booksane handles your data.',
};

export default function PrivacyPage() {
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

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 80px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#FFE500', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Legal</div>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 48 }}>Last updated: January 2026</p>

        {[
          {
            title: '1. What We Collect',
            body: 'Booksane is a client-side tool. Your manuscript text is processed entirely in your browser and is never sent to our servers. We do not collect, store, or transmit your book content. We may collect anonymous usage data (such as which templates are most popular) to improve the product.'
          },
          {
            title: '2. Local Storage',
            body: 'Booksane uses your browser\'s localStorage to save your recent books so you can return to them. This data lives exclusively on your device. Clearing your browser data removes it permanently. We have no access to it.'
          },
          {
            title: '3. Cookies',
            body: 'We do not use tracking cookies. We may use essential session cookies required for the website to function. We do not use advertising or analytics cookies without your consent.'
          },
          {
            title: '4. Third-Party Services',
            body: 'Our website is hosted on Vercel. When you visit Booksane, Vercel may collect standard server logs (IP address, browser type, pages visited) as part of their infrastructure. We do not sell or share your data with any third parties for advertising purposes.'
          },
          {
            title: '5. Exports & Downloads',
            body: 'When you export a book (EPUB, PDF, or DOCX), the file is generated entirely in your browser and downloaded directly to your device. No copy is retained on our servers.'
          },
          {
            title: '6. Children\'s Privacy',
            body: 'Booksane is not directed to children under 13. We do not knowingly collect personal information from children.'
          },
          {
            title: '7. Changes to This Policy',
            body: 'We may update this policy from time to time. We will notify users of significant changes by posting a notice on the website. Continued use of Booksane after changes constitutes acceptance.'
          },
          {
            title: '8. Contact',
            body: 'Questions about this policy? Email us at hello@booksane.com and we\'ll respond within 48 hours.'
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: '#FFE500' }}>{section.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>{section.body}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} Booksane. · <Link href="/about" style={{ color: 'rgba(255,255,255,0.3)' }}>About</Link> · <Link href="/terms" style={{ color: 'rgba(255,255,255,0.3)' }}>Terms</Link>
        </p>
      </div>
    </div>
  );
}
