'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { getTemplate, templates } from '@/lib/templates';
import type { BookData, BookPage } from '@/types';

interface ExportModalProps {
  bookData: BookData;
  templateId: string;
  pages: BookPage[];
  onClose: () => void;
  onTemplateChange?: (id: string) => void;
}

type ExportState = 'idle' | 'generating' | 'done' | 'error';

// Map trim size values to CSS page sizes
const TRIM_SIZE_CSS: Record<string, string> = {
  '5x8': '5in 8in',
  '5.5x8.5': '5.5in 8.5in',
  '6x9': '6in 9in',
  'digest': '5.06in 7.81in',
  'mass': '4.25in 6.87in',
  'a5': '148mm 210mm',
  '7x10': '7in 10in',
  '8.5x11': '8.5in 11in',
};

const TRIM_SIZES = [
  { value: '5x8', label: '5" × 8" — Trade Paperback (popular fiction)' },
  { value: '5.5x8.5', label: '5.5" × 8.5" — Trade Paperback' },
  { value: '6x9', label: '6" × 9" — Standard Trade (most common)' },
  { value: 'digest', label: '5.06" × 7.81" — Digest' },
  { value: 'mass', label: '4.25" × 6.87" — Mass Market Paperback' },
  { value: 'a5', label: 'A5 — 5.83" × 8.27" (European standard)' },
  { value: '7x10', label: '7" × 10" — Large Format / Textbook' },
  { value: '8.5x11', label: '8.5" × 11" — Workbook / Large Format' },
];

const PLATFORMS = [
  {
    id: 'kdp',
    name: 'Amazon KDP',
    sub: 'Kindle + Print-on-Demand',
    color: '#FF9900',
    formats: ['EPUB', 'PDF'],
    url: 'https://kdp.amazon.com/en_US/title-setup/kindle/new/details',
  },
  {
    id: 'ingram',
    name: 'IngramSpark',
    sub: 'Global print + ebook distribution',
    color: '#00518A',
    formats: ['EPUB', 'PDF'],
    url: 'https://myaccount.ingramspark.com/Titles/Create',
  },
  {
    id: 'apple',
    name: 'Apple Books',
    sub: 'iOS, Mac & iPad readers',
    color: '#555',
    formats: ['EPUB'],
    url: 'https://authors.apple.com',
  },
  {
    id: 'kobo',
    name: 'Kobo Writing Life',
    sub: 'Rakuten Kobo e-readers',
    color: '#e51937',
    formats: ['EPUB'],
    url: 'https://www.kobo.com/us/en/p/writinglife',
  },
  {
    id: 'bn',
    name: 'Barnes & Noble Press',
    sub: 'Nook ebook + print',
    color: '#1A5C38',
    formats: ['EPUB', 'PDF'],
    url: 'https://press.barnesandnoble.com',
  },
  {
    id: 'd2d',
    name: 'Draft2Digital',
    sub: 'Multi-store distribution',
    color: '#2D2D2D',
    formats: ['EPUB'],
    url: 'https://www.draft2digital.com',
  },
  {
    id: 'smash',
    name: 'Smashwords',
    sub: 'Ebook retail + library',
    color: '#CC3300',
    formats: ['EPUB', 'DOCX'],
    url: 'https://www.smashwords.com/upload',
  },
  {
    id: 'pd',
    name: 'PublishDrive',
    sub: 'AI-powered distribution',
    color: '#6B46C1',
    formats: ['EPUB'],
    url: 'https://publishdrive.com',
  },
];

const SECTION_DIVIDER = (
  <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', flexShrink: 0 }} />
);

const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 10,
};

export default function ExportModal({
  bookData,
  templateId,
  pages,
  onClose,
  onTemplateChange,
}: ExportModalProps) {
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [dropCaps, setDropCaps] = useState(true);
  const [hideChapterNumbers, setHideChapterNumbers] = useState(false);
  const [trimSize, setTrimSize] = useState('6x9');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateId);
  const [epubSelected, setEpubSelected] = useState(true);
  const [pdfSelected, setPdfSelected] = useState(true);
  const [wordSelected, setWordSelected] = useState(false);

  const template = getTemplate(selectedTemplateId);

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id);
    onTemplateChange?.(id);
  };

  const [publishingTo, setPublishingTo] = useState<string | null>(null);

  const handlePublishTo = async (platform: typeof PLATFORMS[0]) => {
    setPublishingTo(platform.id);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const slug = bookData.title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
      const needsEpub = platform.formats.includes('EPUB');
      const needsPdf = platform.formats.includes('PDF');
      const needsDocx = platform.formats.includes('DOCX');

      if (needsEpub) {
        const { generateEpub } = await import('@/lib/epub');
        const blob = await generateEpub(bookData, template);
        zip.file(`${slug}.epub`, blob);
      }
      if (needsPdf) {
        const pdfBlob = await generatePdfBlob(bookData, template, pages, trimSize);
        zip.file(`${slug}.pdf`, pdfBlob);
      }
      if (needsDocx) {
        const { generateDocx } = await import('@/lib/docx-export');
        const blob = await generateDocx(bookData, template);
        zip.file(`${slug}.docx`, blob);
      }

      zip.file('README.txt', buildReadme(bookData, { epub: needsEpub, pdf: needsPdf, word: needsDocx }));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-${platform.id}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      // Open platform upload page
      window.open(platform.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
    } finally {
      setPublishingTo(null);
    }
  };

  const handleExport = async () => {
    if (!epubSelected && !pdfSelected && !wordSelected) return;
    setExportState('generating');
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const slug = bookData.title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');

      // ── EPUB
      if (epubSelected) {
        const { generateEpub } = await import('@/lib/epub');
        const blob = await generateEpub(bookData, template);
        zip.file(`${slug}.epub`, blob);
      }

      // ── Word (.docx)
      if (wordSelected) {
        const { generateDocx } = await import('@/lib/docx-export');
        const blob = await generateDocx(bookData, template);
        zip.file(`${slug}.docx`, blob);
      }

      // ── PDF (via jsPDF + html2canvas)
      if (pdfSelected) {
        const pdfBlob = await generatePdfBlob(bookData, template, pages, trimSize);
        zip.file(`${slug}.pdf`, pdfBlob);
      }

      // ── README
      zip.file('README.txt', buildReadme(bookData, { epub: epubSelected, pdf: pdfSelected, word: wordSelected }));

      // ── Download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-formatted.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setExportState('done');
    } catch (err) {
      console.error(err);
      setExportState('error');
    }
  };

  const selectedCount = [epubSelected, pdfSelected, wordSelected].filter(Boolean).length;
  const exportButtonText =
    exportState === 'generating'
      ? 'Building your ZIP...'
      : exportState === 'done'
      ? '✓ ZIP Downloaded!'
      : exportState === 'error'
      ? '✗ Error — Try Again'
      : `Export ${selectedCount > 1 ? `${selectedCount} formats` : 'Book'} as ZIP →`;

  const nothingSelected = !epubSelected && !pdfSelected && !wordSelected;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.7)',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: 680,
            maxHeight: '93vh',
            overflowY: 'auto',
            background: '#FFFFFF',
            border: '3px solid #000',
            boxShadow: '8px 8px 0 #000',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── HEADER ── */}
          <div
            style={{
              background: '#000',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderBottom: '3px solid #000',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Mini book cover */}
              <div style={{
                width: 36,
                height: 50,
                background: template.paperColor,
                border: '2px solid #FFE500',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
                overflow: 'hidden',
                boxShadow: '3px 3px 0 #FFE500',
              }}>
                <div style={{
                  fontFamily: template.headingFont,
                  color: template.headingColor,
                  fontSize: 4.5,
                  fontWeight: 700,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                }}>{bookData.title}</div>
                <div style={{
                  fontFamily: template.bodyFont,
                  color: template.inkColor,
                  fontSize: 3.5,
                  textAlign: 'center',
                  marginTop: 2,
                  opacity: 0.7,
                }}>{bookData.author}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    background: '#FFE500',
                    border: '1.5px solid #FFE500',
                    color: '#000',
                    fontSize: 8,
                    fontWeight: 900,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                  }}>Export</span>
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                  {bookData.title}
                </h2>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: '3px 0 0', fontWeight: 500 }}>
                  {bookData.author} · {bookData.metadata.wordCount.toLocaleString()} words
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.25)',
                cursor: 'pointer',
                color: '#fff',
                flexShrink: 0,
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FFE500';
                (e.currentTarget as HTMLElement).style.borderColor = '#FFE500';
                (e.currentTarget as HTMLElement).style.color = '#000';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* ── SECTION: CHOOSE TEMPLATE ── */}
          <div style={{ borderBottom: '2px solid #000' }}>
            <div style={{
              padding: '14px 24px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}>
              <div style={{
                background: '#000',
                color: '#FFE500',
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '4px 10px',
              }}>01</div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#000', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Template
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 0,
              borderTop: '1.5px solid #eee',
            }}>
              {templates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateSelect(tmpl.id)}
                    style={{
                      height: 72,
                      background: isSelected ? tmpl.paperColor : '#fafafa',
                      border: 'none',
                      borderRight: '1.5px solid #eee',
                      borderBottom: isSelected ? '3px solid #000' : '3px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      padding: '8px 6px',
                      transition: 'all 0.12s',
                      position: 'relative',
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: 4, right: 4,
                        width: 7, height: 7,
                        background: '#000',
                        borderRadius: '50%',
                      }} />
                    )}
                    <span style={{
                      fontFamily: tmpl.headingFont,
                      color: tmpl.headingColor,
                      fontSize: 9,
                      fontWeight: 700,
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}>
                      Ch. One
                    </span>
                    <span style={{
                      fontSize: 7.5,
                      color: isSelected ? '#000' : '#999',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}>
                      {tmpl.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SECTION: SETTINGS ROW ── */}
          <div style={{ borderBottom: '2px solid #000', padding: '14px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                background: '#000', color: '#FFE500',
                fontSize: 8, fontWeight: 900, letterSpacing: '0.14em',
                textTransform: 'uppercase', padding: '4px 10px',
              }}>02</div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#000', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Settings
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {/* Trim size */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Trim Size
                </div>
                <select
                  value={trimSize}
                  onChange={(e) => setTrimSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#000',
                    background: '#fff',
                    border: '2px solid #000',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23000' strokeWidth='2' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: 36,
                  }}
                >
                  {TRIM_SIZES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Drop caps toggle */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                padding: '10px 12px',
                border: dropCaps ? '2px solid #000' : '2px solid #ddd',
                background: dropCaps ? '#FFE500' : '#fafafa',
                boxShadow: dropCaps ? '2px 2px 0 #000' : 'none',
                transition: 'all 0.1s',
                userSelect: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={dropCaps}
                  onChange={(e) => setDropCaps(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: 16, height: 16,
                  border: '2px solid #000',
                  background: dropCaps ? '#000' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {dropCaps && <div style={{ width: 6, height: 6, background: '#FFE500' }} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#000', lineHeight: 1.3 }}>
                  Drop Caps
                </span>
              </label>

              {/* Hide chapter numbers toggle */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                padding: '10px 12px',
                border: hideChapterNumbers ? '2px solid #000' : '2px solid #ddd',
                background: hideChapterNumbers ? '#FFE500' : '#fafafa',
                boxShadow: hideChapterNumbers ? '2px 2px 0 #000' : 'none',
                transition: 'all 0.1s',
                userSelect: 'none',
                gridColumn: 'span 2',
              }}>
                <input
                  type="checkbox"
                  checked={hideChapterNumbers}
                  onChange={(e) => setHideChapterNumbers(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: 16, height: 16,
                  border: '2px solid #000',
                  background: hideChapterNumbers ? '#000' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {hideChapterNumbers && <div style={{ width: 6, height: 6, background: '#FFE500' }} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#000', lineHeight: 1.3 }}>
                  Hide Chapter Numbers
                </span>
              </label>
            </div>
          </div>

          {/* ── SECTION: EXPORT FORMAT ── */}
          <div style={{ borderBottom: '2px solid #000', padding: '14px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                background: '#000', color: '#FFE500',
                fontSize: 8, fontWeight: 900, letterSpacing: '0.14em',
                textTransform: 'uppercase', padding: '4px 10px',
              }}>03</div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#000', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Formats
              </span>
              <span style={{ fontSize: 10, color: '#999', fontWeight: 600, marginLeft: 2 }}>
                — all go into your ZIP
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {/* EPUB */}
              <button
                onClick={() => setEpubSelected((v) => !v)}
                style={{
                  padding: '14px 14px',
                  background: epubSelected ? '#000' : '#fafafa',
                  border: '2px solid #000',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s',
                  boxShadow: epubSelected ? '3px 3px 0 #FFE500' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  background: epubSelected ? '#FFE500' : '#eee',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 10,
                  fontSize: 12, fontWeight: 900, color: '#000',
                }}>E</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: epubSelected ? '#FFE500' : '#111', marginBottom: 4, letterSpacing: '-0.01em' }}>
                  EPUB
                </div>
                <div style={{ fontSize: 9, color: epubSelected ? 'rgba(255,255,255,0.55)' : '#999', lineHeight: 1.5, fontWeight: 500 }}>
                  Kindle · Apple Books · Kobo · all e-readers
                </div>
                {epubSelected && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 18, height: 18,
                    background: '#FFE500',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 900, color: '#000',
                  }}>✓</div>
                )}
              </button>

              {/* PDF */}
              <button
                onClick={() => setPdfSelected((v) => !v)}
                style={{
                  padding: '14px 14px',
                  background: pdfSelected ? '#000' : '#fafafa',
                  border: '2px solid #000',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s',
                  boxShadow: pdfSelected ? '3px 3px 0 #FFE500' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  background: pdfSelected ? '#FF2D78' : '#eee',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 10,
                  fontSize: 12, fontWeight: 900, color: '#fff',
                }}>P</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: pdfSelected ? '#FFE500' : '#111', marginBottom: 4, letterSpacing: '-0.01em' }}>
                  Print PDF
                </div>
                <div style={{ fontSize: 9, color: pdfSelected ? 'rgba(255,255,255,0.55)' : '#999', lineHeight: 1.5, fontWeight: 500 }}>
                  KDP Print · IngramSpark · POD
                </div>
                {pdfSelected && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 18, height: 18,
                    background: '#FFE500',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 900, color: '#000',
                  }}>✓</div>
                )}
              </button>

              {/* DOCX */}
              <button
                onClick={() => setWordSelected((v) => !v)}
                style={{
                  padding: '14px 14px',
                  background: wordSelected ? '#000' : '#fafafa',
                  border: '2px solid #000',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s',
                  boxShadow: wordSelected ? '3px 3px 0 #FFE500' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  background: '#2B5CE6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 10,
                  fontSize: 12, fontWeight: 900, color: '#fff',
                }}>W</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: wordSelected ? '#FFE500' : '#111', marginBottom: 4, letterSpacing: '-0.01em' }}>
                  Word
                </div>
                <div style={{ fontSize: 9, color: wordSelected ? 'rgba(255,255,255,0.55)' : '#999', lineHeight: 1.5, fontWeight: 500 }}>
                  Microsoft Word · Google Docs
                </div>
                {wordSelected && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 18, height: 18,
                    background: '#FFE500',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 900, color: '#000',
                  }}>✓</div>
                )}
              </button>
            </div>
          </div>

          {/* ── SECTION: DISTRIBUTE TO PLATFORM ── */}
          <div style={{ borderBottom: '2px solid #000', padding: '14px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                background: '#000', color: '#FFE500',
                fontSize: 8, fontWeight: 900, letterSpacing: '0.14em',
                textTransform: 'uppercase', padding: '4px 10px',
              }}>04</div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#000', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Publish Directly To
              </span>
            </div>
            <p style={{ fontSize: 10, color: '#888', margin: '0 0 12px', fontWeight: 500 }}>
              Downloads the right files + opens the platform's upload page
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {PLATFORMS.map((p) => {
                const isLoading = publishingTo === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePublishTo(p)}
                    disabled={!!publishingTo}
                    style={{
                      display: 'flex',
                      alignItems: 'stretch',
                      background: '#fff',
                      border: '2px solid #000',
                      overflow: 'hidden',
                      cursor: publishingTo ? 'not-allowed' : 'pointer',
                      opacity: publishingTo && !isLoading ? 0.4 : 1,
                      textAlign: 'left',
                      padding: 0,
                      transition: 'all 0.1s',
                      boxShadow: isLoading ? '3px 3px 0 #000' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!publishingTo) {
                        (e.currentTarget as HTMLElement).style.boxShadow = `3px 3px 0 ${p.color}`;
                        (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = isLoading ? '3px 3px 0 #000' : 'none';
                      (e.currentTarget as HTMLElement).style.transform = '';
                    }}
                  >
                    {/* Color stripe */}
                    <div style={{ width: 6, background: p.color, flexShrink: 0 }} />
                    <div style={{ padding: '10px 12px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 11, fontWeight: 800, color: '#000', marginBottom: 2,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {isLoading ? '⏳ Preparing…' : p.name}
                      </div>
                      <div style={{
                        fontSize: 9, color: '#888', marginBottom: 6,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontWeight: 500,
                      }}>
                        {p.sub}
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.formats.map(f => (
                          <span key={f} style={{
                            fontSize: 8, fontWeight: 800,
                            background: p.color,
                            color: '#fff',
                            padding: '2px 6px',
                            letterSpacing: '0.04em',
                          }}>{f}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{
                      padding: '0 12px',
                      display: 'flex', alignItems: 'center',
                      fontSize: 16, color: '#000', flexShrink: 0,
                      fontWeight: 900,
                    }}>→</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SECTION: DOWNLOAD ZIP ── */}
          <div style={{ padding: '20px 24px', background: '#000' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                background: '#FFE500', color: '#000',
                fontSize: 8, fontWeight: 900, letterSpacing: '0.14em',
                textTransform: 'uppercase', padding: '4px 10px',
              }}>05</div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Download ZIP
              </span>
            </div>

            <button
              onClick={handleExport}
              disabled={exportState === 'generating' || nothingSelected}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: exportState === 'done'
                  ? '#00C853'
                  : exportState === 'error'
                  ? '#FF2D78'
                  : nothingSelected
                  ? '#555'
                  : '#FFE500',
                border: '2px solid',
                borderColor: exportState === 'done' ? '#00C853' : exportState === 'error' ? '#FF2D78' : nothingSelected ? '#555' : '#FFE500',
                boxShadow: exportState === 'generating' || nothingSelected ? 'none' : '4px 4px 0 #FFE500',
                fontSize: 15,
                fontWeight: 900,
                color: exportState === 'done' || exportState === 'error' ? '#fff' : '#000',
                cursor: exportState === 'generating' || nothingSelected ? 'not-allowed' : 'pointer',
                opacity: nothingSelected ? 0.4 : 1,
                transition: 'all 0.1s',
                letterSpacing: '0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
              onMouseEnter={(e) => {
                if (exportState !== 'generating' && !nothingSelected) {
                  (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #FFE500';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = exportState === 'generating' || nothingSelected ? 'none' : '4px 4px 0 #FFE500';
              }}
            >
              {exportState === 'generating' ? (
                <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Building your ZIP…</>
              ) : exportState === 'done' ? (
                <>✓ ZIP Downloaded!</>
              ) : exportState === 'error' ? (
                <>✗ Error — Try Again</>
              ) : (
                <>
                  <span style={{
                    background: '#000', color: '#FFE500',
                    fontSize: 10, fontWeight: 900,
                    padding: '3px 8px', letterSpacing: '0.06em',
                  }}>
                    {selectedCount} {selectedCount === 1 ? 'FORMAT' : 'FORMATS'}
                  </span>
                  Export as ZIP →
                </>
              )}
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
              {['Free forever', 'No watermarks', 'Pro quality'].map(tag => (
                <span key={tag} style={{
                  fontSize: 9, fontWeight: 700,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ color: '#FFE500', fontSize: 8 }}>✦</span> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────
//  PDF HTML BUILDER
// ─────────────────────────────────────────

function buildPrintHTML(
  bookData: BookData,
  template: ReturnType<typeof getTemplate>,
  pages: BookPage[],
  trimSize = '6x9'
): string {
  const pageSize = TRIM_SIZE_CSS[trimSize] ?? '6in 9in';
  const pageContents = pages.map((p) => p.content).join('\n<div class="page-break"></div>\n');

  // ── Build front matter HTML
  const year = new Date().getFullYear();

  const titlePageHtml = `
<div class="front-page title-page">
  <div class="title-page-inner">
    <div class="fp-title">${escapeHtml(bookData.title)}</div>
    ${bookData.subtitle ? `<div class="fp-subtitle">${escapeHtml(bookData.subtitle)}</div>` : ''}
    <div class="fp-author">${escapeHtml(bookData.author || '')}</div>
  </div>
</div>`;

  const copyrightPageHtml = `
<div class="page-break"></div>
<div class="front-page copyright-page">
  <div class="copyright-inner">
    <p>Copyright © ${year} ${escapeHtml(bookData.author || 'the Author')}</p>
    <p>All rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the publisher.</p>
    <p style="margin-top:1em">Formatted with <em>Booksane</em>.</p>
  </div>
</div>`;

  const dedicationHtml = bookData.dedication ? `
<div class="page-break"></div>
<div class="front-page dedication-page">
  <div class="dedication-inner">
    <p class="dedication-text">${escapeHtml(bookData.dedication)}</p>
  </div>
</div>` : '';

  const epigraphHtml = bookData.epigraph ? `
<div class="page-break"></div>
<div class="front-page epigraph-page">
  <div class="epigraph-inner">
    <p class="epigraph-quote">"${escapeHtml(bookData.epigraph)}"</p>
    ${bookData.epigraphAttribution ? `<p class="epigraph-attr">— ${escapeHtml(bookData.epigraphAttribution)}</p>` : ''}
  </div>
</div>` : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeHtml(bookData.title)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=Merriweather:ital,wght@0,300;0,400;1,300&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @page {
    size: ${pageSize};
    margin: ${template.pageMarginV} ${template.pageMarginH};
  }

  html, body {
    font-family: ${template.bodyFont};
    font-size: ${template.bodySize};
    line-height: ${template.lineHeight};
    color: ${template.inkColor};
    background: ${template.paperColor};
  }

  /* ── Front matter pages ── */
  .front-page {
    page-break-before: always;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${template.pageMarginV} ${template.pageMarginH};
  }
  .front-page:first-child { page-break-before: avoid; }

  .title-page .title-page-inner { text-align: center; }
  .fp-title {
    font-family: ${template.headingFont};
    font-size: 2.6em;
    font-weight: ${template.headingWeight};
    color: ${template.headingColor};
    line-height: 1.2;
    margin-bottom: 0.4em;
    text-transform: ${template.headingTransform};
  }
  .fp-subtitle {
    font-family: ${template.headingFont};
    font-size: 1.2em;
    color: ${template.accentColor};
    font-style: italic;
    margin-bottom: 2em;
  }
  .fp-author {
    font-family: ${template.bodyFont};
    font-size: 1.1em;
    color: ${template.inkColor};
    margin-top: 3em;
  }

  .copyright-page { align-items: flex-end; }
  .copyright-inner {
    font-size: 0.72em;
    color: ${template.inkColor};
    opacity: 0.7;
    line-height: 1.7;
    max-width: 36em;
  }
  .copyright-inner p { margin-bottom: 0.5em; }

  .dedication-page .dedication-inner { text-align: center; max-width: 28em; }
  .dedication-text { font-style: italic; font-size: 1.05em; line-height: 1.9; color: ${template.inkColor}; }

  .epigraph-page .epigraph-inner { max-width: 28em; }
  .epigraph-quote { font-style: italic; font-size: 1em; line-height: 1.9; color: ${template.inkColor}; margin-bottom: 0.5em; }
  .epigraph-attr { font-size: 0.85em; color: ${template.accentColor}; text-align: right; }

  /* ── Body pages ── */
  .book-page {
    background: ${template.paperColor};
    padding: ${template.pageMarginV} ${template.pageMarginH};
    position: relative;
  }

  .page-break { page-break-before: always; }

  p {
    margin: 0;
    text-indent: ${template.paragraphStyle === 'indent' ? template.textIndent : '0'};
    margin-bottom: ${template.paragraphStyle === 'spaced' ? template.paragraphSpacing : '0'};
  }

  .chapter-start { padding-top: ${template.chapterStartMargin}; }

  .chapter-number {
    display: block;
    font-family: ${template.headingFont};
    font-weight: ${template.headingWeight};
    text-align: ${template.headingAlign};
    color: ${template.accentColor};
    font-size: ${template.chapterNumberSize};
    margin-bottom: 0.4em;
  }

  .chapter-heading {
    font-family: ${template.headingFont};
    font-size: ${template.headingSize};
    font-weight: ${template.headingWeight};
    text-align: ${template.headingAlign};
    text-transform: ${template.headingTransform};
    color: ${template.headingColor};
    margin-bottom: 1.5em;
  }

  .section-break {
    text-align: center;
    color: ${template.accentColor};
    margin: 1.5em 0;
    opacity: 0.5;
  }

  @media print {
    .watermark { display: none; }
  }
</style>
</head>
<body>
${titlePageHtml}
${copyrightPageHtml}
${dedicationHtml}
${epigraphHtml}
<div class="page-break"></div>
${pageContents}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────
//  PDF BLOB GENERATOR (jsPDF + html2canvas)
// ─────────────────────────────────────────

async function generatePdfBlob(
  bookData: BookData,
  template: ReturnType<typeof getTemplate>,
  pages: BookPage[],
  trimSize: string
): Promise<Blob> {
  const { default: jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');

  // Trim size → inches → points (1in = 72pt)
  const TRIM_PX: Record<string, [number, number]> = {
    '5x8':     [360, 576],
    '5.5x8.5': [396, 612],
    '6x9':     [432, 648],
    'digest':  [364.3, 562.3],
    'mass':    [306, 494.6],
    'a5':      [419.5, 595.3],
    '7x10':    [504, 720],
    '8.5x11':  [612, 792],
  };
  const [ptW, ptH] = TRIM_PX[trimSize] ?? [432, 648];

  // Render the book HTML into a hidden off-screen container
  const printHtml = buildPrintHTML(bookData, template, pages, trimSize);

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:-9999px;top:0;width:${ptW * (96/72)}px;background:#fff;`;
  container.innerHTML = printHtml;
  document.body.appendChild(container);

  // Wait for fonts / images
  await new Promise(r => setTimeout(r, 800));

  const pdf = new jsPDF({ unit: 'pt', format: [ptW, ptH], orientation: 'portrait' });

  // Capture each "page" div separately
  const pageDivs = container.querySelectorAll<HTMLElement>('.book-page, .front-page');
  const elements = pageDivs.length > 0 ? Array.from(pageDivs) : [container];

  for (let i = 0; i < elements.length; i++) {
    if (i > 0) pdf.addPage([ptW, ptH]);
    const canvas = await html2canvas(elements[i] as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: template.paperColor || '#ffffff',
      logging: false,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    pdf.addImage(imgData, 'JPEG', 0, 0, ptW, ptH);
  }

  document.body.removeChild(container);
  return pdf.output('blob');
}

// ─────────────────────────────────────────
//  README BUILDER
// ─────────────────────────────────────────

function buildReadme(
  bookData: BookData,
  formats: { epub: boolean; pdf: boolean; word: boolean }
): string {
  const slug = bookData.title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const lines = [
    `${bookData.title}`,
    `by ${bookData.author || 'Unknown Author'}`,
    `Formatted with Booksane — booksane.com`,
    ``,
    `─────────────────────────────────────────`,
    `FILES IN THIS ZIP`,
    `─────────────────────────────────────────`,
  ];
  if (formats.epub) lines.push(
    ``,
    `📚 ${slug}.epub`,
    `   E-book file. Upload to Amazon KDP, Apple Books, Kobo, Barnes & Noble`,
    `   Press, Draft2Digital, Smashwords, or any EPUB-compatible platform.`,
  );
  if (formats.pdf) lines.push(
    ``,
    `🖨  ${slug}.pdf`,
    `   Print-ready PDF. Upload directly to Amazon KDP Print, IngramSpark,`,
    `   or any print-on-demand service. Check trim size matches your order.`,
  );
  if (formats.word) lines.push(
    ``,
    `📝 ${slug}.docx`,
    `   Editable Word document. Open in Microsoft Word or Google Docs for`,
    `   further editing or submission to agents and publishers.`,
  );
  lines.push(
    ``,
    `─────────────────────────────────────────`,
    `PUBLISHING CHECKLIST`,
    `─────────────────────────────────────────`,
    ``,
    `  Amazon KDP     → Upload .epub (eBook) or .pdf (Print)`,
    `  IngramSpark    → Upload .epub + .pdf`,
    `  Apple Books    → Upload .epub`,
    `  Kobo           → Upload .epub`,
    `  Draft2Digital  → Upload .epub`,
    ``,
    `Good luck with your book!`,
    `— The Booksane Team`,
  );
  return lines.join('\n');
}
