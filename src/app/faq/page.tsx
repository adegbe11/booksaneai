'use client';

import Link from 'next/link';
import { useState } from 'react';

const FAQS = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What is Booksane?',
        a: 'Booksane is a free, browser-based book formatting tool. You paste your manuscript, pick a template, and instantly get a professionally formatted book ready to export as EPUB, PDF, or Word (.docx). No account required, no software to install.',
      },
      {
        q: 'Is Booksane really free?',
        a: 'Yes. Completely free. No credit card, no account, no watermarks on your exported files. We believe every author deserves professional formatting regardless of budget.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No account needed. Open the editor, paste your text, and start formatting immediately. Your recent books are saved locally in your browser.',
      },
      {
        q: 'What file formats can I import?',
        a: 'You can paste plain text directly, or import .txt and .docx (Word) files. Booksane automatically detects chapter breaks, headings, and structure from your text.',
      },
    ],
  },
  {
    category: 'Formatting & Templates',
    items: [
      {
        q: 'How many templates are available?',
        a: 'Booksane includes 10 professionally designed templates covering fiction, literary fiction, romance, thriller, business, memoir, fantasy, and more. Each template controls fonts, spacing, headings, chapter styles, and page layout.',
      },
      {
        q: 'Can I customise the templates?',
        a: 'You can switch between templates at any time and preview the result instantly. Deep customisation (custom fonts, custom colors) is on the roadmap.',
      },
      {
        q: 'Does Booksane automatically detect chapters?',
        a: 'Yes. Booksane\'s parser scans your text for chapter headings, numbers, and scene breaks. It handles patterns like "Chapter One", "CHAPTER 1", "Part II", and more. You can also write your book directly in the editor from scratch.',
      },
      {
        q: 'What front matter does Booksane include?',
        a: 'All exports include a title page, copyright page, and table of contents automatically. If you\'ve added a dedication or epigraph in the editor, those are included too. Back matter like Acknowledgments and About the Author can be added via the navigator.',
      },
      {
        q: 'What trim sizes are supported for PDF?',
        a: 'Booksane supports 8 standard print sizes: 5×8", 5.5×8.5", 6×9" (most common), Digest (5.06×7.81"), Mass Market Paperback (4.25×6.87"), A5, 7×10", and 8.5×11". You choose the trim size in the Export modal before downloading.',
      },
    ],
  },
  {
    category: 'Exporting',
    items: [
      {
        q: 'What export formats does Booksane support?',
        a: 'Three formats: EPUB 3.0 (for ebook stores), Print PDF (for Amazon KDP, IngramSpark, and print-on-demand), and Word (.docx) for editing in Microsoft Word or Google Docs.',
      },
      {
        q: 'Is the EPUB compatible with Amazon Kindle?',
        a: 'Yes. Booksane generates valid EPUB 3.0 files that work on Kindle, Apple Books, Kobo, Nook, and all major e-readers. For Amazon KDP specifically, you upload the EPUB directly and KDP converts it.',
      },
      {
        q: 'Is the PDF print-ready for KDP and IngramSpark?',
        a: 'The PDF is generated via your browser\'s print engine with correct trim size dimensions and margins. It works well for most KDP and IngramSpark submissions. For books with full-bleed images or precise CMYK color requirements, a dedicated design tool may be better suited.',
      },
      {
        q: 'Can I export to multiple formats at once?',
        a: 'Yes. In the Export modal, toggle on any combination of EPUB, Print PDF, and Word — then click Export Book to download all selected formats.',
      },
      {
        q: 'Are there watermarks on exported files?',
        a: 'No watermarks. Your exported EPUB, PDF, and Word files are clean and ready to publish.',
      },
    ],
  },
  {
    category: 'Privacy & Data',
    items: [
      {
        q: 'Is my manuscript safe?',
        a: 'Completely. All formatting is done in your browser. Your text is never sent to our servers. We have no access to your manuscript content whatsoever.',
      },
      {
        q: 'Where are my books saved?',
        a: 'Recent books are saved in your browser\'s localStorage — on your device only. Clearing your browser data removes them. We do not store your books in the cloud.',
      },
      {
        q: 'Do you sell my data?',
        a: 'No. We do not sell, share, or monetise user data. See our Privacy Policy for full details.',
      },
    ],
  },
  {
    category: 'Publishing',
    items: [
      {
        q: 'Which stores can I publish to after formatting?',
        a: 'You can upload your Booksane-formatted files to Amazon KDP, IngramSpark, Apple Books, Kobo, Barnes & Noble Press, Draft2Digital, Smashwords, and PublishDrive — among others.',
      },
      {
        q: 'Do I keep the rights to my book?',
        a: 'Yes, 100%. Booksane does not claim any rights to your content. You own your manuscript and everything you create with Booksane.',
      },
      {
        q: 'Can I use Booksane for commercial publishing?',
        a: 'Absolutely. There are no restrictions on using Booksane-formatted books for commercial sale. Thousands of authors have published books formatted with Booksane on major platforms.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => setOpenIndex(prev => prev === key ? null : key);

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

      {/* Header */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 24px 48px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#FFE500', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Help</div>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 16 }}>
          Frequently Asked<br />
          <span style={{ color: '#FFE500' }}>Questions</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 520 }}>
          Everything you need to know about formatting and publishing your book with Booksane.
        </p>
      </div>

      {/* FAQ sections */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
        {FAQS.map((section) => (
          <div key={section.category} style={{ marginBottom: 56 }}>
            {/* Category label */}
            <div style={{
              display: 'inline-block',
              background: '#FFE500',
              border: '2px solid #000',
              boxShadow: '3px 3px 0 #000',
              padding: '5px 14px',
              fontSize: 11,
              fontWeight: 900,
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 20,
            }}>
              {section.category}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = openIndex === key;
                return (
                  <div
                    key={key}
                    style={{
                      border: isOpen ? '2px solid #FFE500' : '1px solid rgba(255,255,255,0.08)',
                      background: isOpen ? 'rgba(255,229,0,0.04)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <button
                      onClick={() => toggle(key)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '18px 20px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 700, color: isOpen ? '#FFE500' : '#fff', lineHeight: 1.4 }}>
                        {item.q}
                      </span>
                      <span style={{
                        fontSize: 20,
                        fontWeight: 300,
                        color: isOpen ? '#FFE500' : 'rgba(255,255,255,0.3)',
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.15s',
                        lineHeight: 1,
                      }}>
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 20px 20px' }}>
                        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div style={{
          background: '#FF2D78',
          border: '3px solid #000',
          boxShadow: '5px 5px 0 #000',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
        }}>
          <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>Still have questions?</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>We&apos;re happy to help. Reach out and we&apos;ll reply within 48 hours.</p>
          <a
            href="mailto:hello@booksane.com"
            style={{
              background: '#FFE500',
              border: '2px solid #000',
              boxShadow: '4px 4px 0 #000',
              padding: '12px 28px',
              fontWeight: 900,
              fontSize: 14,
              color: '#000',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Email Us →
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} Booksane. ·{' '}
          <Link href="/about" style={{ color: 'rgba(255,255,255,0.3)' }}>About</Link> ·{' '}
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.3)' }}>Privacy</Link> ·{' '}
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.3)' }}>Terms</Link>
        </p>
      </div>
    </div>
  );
}
