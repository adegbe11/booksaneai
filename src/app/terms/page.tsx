import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Booksane',
  description: 'Terms and conditions for using Booksane.',
};

export default function TermsPage() {
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
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 48 }}>Last updated: January 2026</p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing and using Booksane ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.'
          },
          {
            title: '2. Description of Service',
            body: 'Booksane is a free, browser-based book formatting tool that converts raw manuscript text into professionally formatted EPUB, PDF, and DOCX files. The Service is provided "as is" and may be updated, modified, or discontinued at any time without notice.'
          },
          {
            title: '3. Your Content',
            body: 'You retain full ownership of all content you format using Booksane. Booksane does not claim any rights over your manuscripts, books, or any content you create using the Service. Since all processing is done client-side in your browser, your content is never transmitted to or stored on our servers.'
          },
          {
            title: '4. Acceptable Use',
            body: 'You agree to use Booksane only for lawful purposes. You may not use the Service to format content that infringes on intellectual property rights, contains illegal material, or violates any applicable laws. You are solely responsible for the content you format and distribute.'
          },
          {
            title: '5. Intellectual Property',
            body: 'The Booksane platform, templates, code, and design are the intellectual property of Booksane. The templates are licensed to you for use in formatting your own books for personal and commercial publication. You may not resell, redistribute, or sublicense the templates or the formatting tool itself.'
          },
          {
            title: '6. Disclaimer of Warranties',
            body: 'Booksane is provided without warranties of any kind, either express or implied. We do not guarantee that the Service will be error-free, uninterrupted, or that exported files will meet the requirements of any specific publisher or platform. Always verify your exported files before submitting to Amazon KDP, IngramSpark, or other publishers.'
          },
          {
            title: '7. Limitation of Liability',
            body: 'To the maximum extent permitted by law, Booksane shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including any loss of data, profits, or revenue.'
          },
          {
            title: '8. Changes to Terms',
            body: 'We reserve the right to modify these Terms at any time. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.'
          },
          {
            title: '9. Contact',
            body: 'If you have questions about these Terms, contact us at hello@booksane.com.'
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
          © {new Date().getFullYear()} Booksane. · <Link href="/about" style={{ color: 'rgba(255,255,255,0.3)' }}>About</Link> · <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.3)' }}>Privacy</Link>
        </p>
      </div>
    </div>
  );
}
