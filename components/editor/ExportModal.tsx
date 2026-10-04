'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileDown, Book, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { buildPrintHTML } from '@/lib/print';
import { checkBook } from '@/lib/preflight';
import { getTemplate } from '@/lib/templates';
import type { BookData, BookPage } from '@/types';

interface ExportModalProps {
  bookData: BookData;
  templateId: string;
  pages: BookPage[];
  onClose: () => void;
}

type ExportState = 'idle' | 'generating' | 'done' | 'error';

export default function ExportModal({ bookData, templateId, pages, onClose }: ExportModalProps) {
  const [pdfState, setPdfState] = useState<ExportState>('idle');
  const [epubState, setEpubState] = useState<ExportState>('idle');
  const template = getTemplate(templateId);
  const issues = checkBook(bookData);
  const hasErrors = issues.some(issue => issue.severity === 'error');

  const handleExportPdf = async () => {
    setPdfState('generating');
    try {
      // Build the print HTML
      const printHtml = buildPrintHTML(bookData, template);

      // Open in new window + trigger print
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) throw new Error('Popup blocked');

      printWindow.document.write(printHtml);
      printWindow.document.close();

      await printWindow.document.fonts.ready;
      printWindow.focus();
      printWindow.print();
      setPdfState('done');
    } catch (err) {
      console.error(err);
      setPdfState('error');
    }
  };

  const handleExportEpub = async () => {
    if (hasErrors) { setEpubState('error'); return; }
    setEpubState('generating');
    try {
      const { generateEpub } = await import('@/lib/epub');
      const blob = await generateEpub(bookData, template);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookData.title.replace(/\s+/g, '-').toLowerCase()}.epub`;
      a.click();
      URL.revokeObjectURL(url);
      setEpubState('done');
    } catch (err) {
      console.error(err);
      setEpubState('error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-lg rounded-2xl overflow-hidden"
          style={{
            background: '#16142A',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Export your book
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {bookData.title} · {bookData.metadata.wordCount.toLocaleString()} words
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-4">
            {/* Template info */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-8 h-10 rounded shrink-0"
                style={{ background: template.paperColor, border: '1px solid rgba(0,0,0,0.1)' }}
              />
              <div>
                <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {template.name} template
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {template.pageSize.toUpperCase()} · {bookData.chapters.length} chapters · ~{bookData.metadata.estimatedPages} pages
                </div>
              </div>
            </div>

            {/* Export options */}
            <div className="grid grid-cols-2 gap-3">
              {/* PDF */}
              <ExportButton
                icon={<FileDown size={18} />}
                title="Print / PDF proof"
                description="Open a full-size print proof and save as PDF."
                note="Review pagination before publishing"
                state={pdfState}
                accentColor="rgba(124,58,237,0.7)"
                onClick={handleExportPdf}
              />

              {/* EPUB */}
              <ExportButton
                icon={<Book size={18} />}
                title="EPUB"
                description="For Kindle, Apple Books, and all e-readers."
                note="Reflowable EPUB 3; validate before publishing"
                state={epubState}
                accentColor="rgba(212,168,83,0.7)"
                onClick={handleExportEpub}
              />
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-sm font-medium" style={{ color: '#F0EEFE' }}>Document checks</p>
              <p className="text-xs mt-2" style={{ color: '#9D9AB8' }}>These checks review content, not printer approval or EPUB certification.</p>
              {issues.length === 0 ? <p className="text-xs mt-3" style={{ color: '#4ADE80' }}>No content issues found.</p> : issues.map(issue => (
                <p key={issue.id} className="text-xs mt-2" style={{ color: issue.severity === 'error' ? '#FCA5A5' : '#FDE68A' }}>{issue.message}</p>
              ))}
              <button className="mt-4 text-xs underline" style={{ color: '#F0EEFE' }} onClick={() => {
                const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, bookData, templateId }, null, 2)], { type: 'application/json' }));
                const link = document.createElement('a'); link.href = url; link.download = 'booksane-backup.json'; link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}>Download editable backup</button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────
//  EXPORT BUTTON
// ─────────────────────────────────────────

function ExportButton({
  icon,
  title,
  description,
  note,
  state,
  accentColor,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  note: string;
  state: ExportState;
  accentColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={state === 'generating'}
      className="flex flex-col gap-3 p-4 rounded-xl text-left transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${state === 'done' ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
        cursor: state === 'generating' ? 'wait' : 'pointer',
        opacity: state === 'generating' ? 0.7 : 1,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${accentColor}30`, color: 'var(--text-primary)' }}
      >
        {state === 'generating' ? (
          <Loader2 size={18} className="animate-spin" />
        ) : state === 'done' ? (
          <CheckCircle2 size={18} color="#4ADE80" />
        ) : (
          icon
        )}
      </div>

      <div>
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {state === 'error' ? 'Export failed. Review the checks and try again.' : state === 'done' ? (title.startsWith('Print') ? 'Print dialog opened. Save your proof there.' : 'EPUB downloaded.') : description}
        </div>
        <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
          {note}
        </div>
      </div>
    </button>
  );
}
