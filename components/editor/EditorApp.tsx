'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, FileDown } from 'lucide-react';
import PaperbackPreview from './PaperbackPreview';
import EbookPreview from './EbookPreview';
import ExportModal from './ExportModal';
import Navigator, { buildNavItems } from './Navigator';
import type { NavItem, NavMode, StyleCategory } from './Navigator';
import ChapterEditor from './ChapterEditor';
import { formatBook, DEMO_TEXT, detectGenre, countWords } from '@/lib/formatter';
import { getDefaultCoverForGenre } from '@/lib/covers';
import { getTemplate } from '@/lib/templates';
import { paginateBook } from '@/lib/paginator';
import type { BookData, BookPage, PreviewMode, TrimSize, Genre, CoverConfig, RecentBook } from '@/types';

const GENRE_COLOR_MAP: Record<string, string> = {
  religious: '#0A1628', romance: '#4A0E28', thriller: '#090909',
  business: '#F8F7F4', memoir: '#F7F2EA', selfhelp: '#FFE500',
  poetry: '#F0EEF8', scifi: '#0D1B3E', fiction: '#1A1828', academic: '#F2F2F0',
};

interface EditorAppProps {
  initialBook?: RecentBook;
  initialText?: string;
  initialFilename?: string;
  onGoHome?: () => void;
}

export default function EditorApp({ initialText = '', initialFilename = '', initialBook, onGoHome }: EditorAppProps) {
  const projectId = useRef(initialBook?.id || crypto.randomUUID());
  const [saveStatus, setSaveStatus] = useState('Saving…');
  // ─── core state (preserved) ───
  const [rawText, setRawText] = useState('');
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic-novel');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('paperback');
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [ebookFontSize, setEbookFontSize] = useState(16);
  // trimSize kept for potential future use / ExportModal compatibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [trimSize, setTrimSize] = useState<TrimSize>('6x9');
  const [bookTitle, setBookTitle] = useState('');
  const [coverConfig, setCoverConfig] = useState<CoverConfig>({ type: 'template', templateId: 'clean' });
  const [detectedGenre, setDetectedGenre] = useState<Genre>('fiction');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // ─── new UI state ───
  const [selectedItemId, setSelectedItemId] = useState('title-page');
  const [navMode, setNavMode] = useState<NavMode>('contents');
  const [styleCategory, setStyleCategory] = useState<StyleCategory>('Popular');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (initialBook?.bookData) {
      setRawText(initialBook.rawText);
      setBookData(initialBook.bookData);
      setBookTitle(initialBook.bookData.title);
      setSelectedTemplateId(initialBook.selectedTemplateId || 'classic-novel');
      setCoverConfig(initialBook.coverConfig || { type: 'template', templateId: 'clean' });
      setDetectedGenre(initialBook.bookData.genre || 'fiction');
      return;
    }
    if (isEditingTitle) titleInputRef.current?.select();
  }, [isEditingTitle]);

  // ─── initial load ───
  useEffect(() => {
    if (!initialText) {
      setBookData({ title: 'Untitled Book', author: '', genre: 'fiction', chapters: [{ id: 'chapter-1', number: 1, title: 'Chapter One', content: '', wordCount: 0 }], metadata: { wordCount: 0, estimatedPages: 0 } });
      setBookTitle('Untitled Book');
      setSelectedItemId('chapter-chapter-1');
      return;
    }
    const textToLoad = initialText;
    handleFormat(textToLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── auto-save to localStorage when bookData changes ───
  useEffect(() => {
    if (!bookData) return;
    try {
      const stored = JSON.parse(localStorage.getItem('booksane_recent') || '[]') as RecentBook[];
      const existing = stored.findIndex(b => b.id === projectId.current);

      const entry: RecentBook = {
        id: projectId.current,
        title: bookData.title,
        author: bookData.author,
        wordCount: bookData.metadata.wordCount,
        genre: detectedGenre,
        coverColor: GENRE_COLOR_MAP[detectedGenre] ?? '#1A1828',
        lastModified: Date.now(),
        rawText,
        bookData,
        selectedTemplateId,
        coverConfig,
      };

      const updated = existing >= 0
        ? [entry, ...stored.filter((_, i) => i !== existing)]
        : [entry, ...stored];

      localStorage.setItem('booksane_recent', JSON.stringify(updated.slice(0, 8)));
      setSaveStatus('Saved on this device');
    } catch {
      setSaveStatus('Could not save — download a backup');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookData, rawText, detectedGenre, selectedTemplateId, coverConfig]);

  // ─── re-paginate when template or bookData changes ───
  useEffect(() => {
    if (bookData) {
      const template = getTemplate(selectedTemplateId);
      setPages(paginateBook(bookData, template, coverConfig));
      setCurrentSpread(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId, bookData]);

  // ─── re-paginate when coverConfig changes ───
  useEffect(() => {
    if (bookData) {
      const template = getTemplate(selectedTemplateId);
      setPages(paginateBook(bookData, template, coverConfig));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverConfig]);

  // ─── handleFormat (preserved) ───
  const handleFormat = useCallback((text: string) => {
    if (!text.trim()) return;
    setRawText(text);
    try {
      const data = formatBook(text);
      const genre = detectGenre(text);
      const template = getTemplate(selectedTemplateId);

      setBookData(data);
      setDetectedGenre(genre);

      setCoverConfig(prev => {
        if (prev.type === 'uploaded') return prev;
        return { type: 'template', templateId: getDefaultCoverForGenre(genre) };
      });

      setPages(paginateBook(data, template, coverConfig));
      setCurrentSpread(0);
      setBookTitle(prev => prev || data.title);

      // Auto-select first chapter in navigator
      const navItems = buildNavItems(data);
      const firstChapter = navItems.find(item => item.type === 'chapter');
      if (firstChapter) {
        setSelectedItemId(firstChapter.id);
      }
    } catch (err) {
      console.error('Format error:', err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId]);

  // ─── handleFixMyBook (preserved) ───
  const handleFixMyBook = useCallback(() => {
    if (!bookData) return;
    setIsProcessing(true);
    setTimeout(() => {
      try {
        // Rebuild the preview from the edited document; never re-import stale source text.
        const data = bookData;
        if (!data) return;
        const genre = data.genre || detectedGenre;
        const template = getTemplate(selectedTemplateId);

        setBookData(data);
        setDetectedGenre(genre);
        setCoverConfig(prev => {
          if (prev.type === 'uploaded') return prev;
          return { type: 'template', templateId: getDefaultCoverForGenre(genre) };
        });
        setPages(paginateBook(data, template, coverConfig));
        setCurrentSpread(0);
      } finally {
        setIsProcessing(false);
      }
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawText, selectedTemplateId, bookData, detectedGenre, coverConfig]);

  // ─── nav selection ───
  const handleSelectNavItem = useCallback((item: NavItem) => {
    setSelectedItemId(item.id);
    if (item.type === 'chapter' && item.chapterIdx !== undefined && bookData) {
      const chId = bookData.chapters[item.chapterIdx]?.id;
      if (chId) {
        const pageIdx = pages.findIndex(p => p.chapterId === chId);
        if (pageIdx >= 0) setCurrentSpread(Math.floor(pageIdx / 2));
      }
    }
  }, [pages, bookData]);

  // ─── chapter content update ───
  const handleUpdateChapterContent = useCallback((chapterIdx: number, newContent: string) => {
    setBookData(prev => {
      if (!prev) return prev;
      const chapters = [...prev.chapters];
      const wordCount = countWords(newContent.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' '));
      chapters[chapterIdx] = { ...chapters[chapterIdx], content: newContent, wordCount };
      const totalWords = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
      return { ...prev, chapters, metadata: { ...prev.metadata, wordCount: totalWords, estimatedPages: Math.ceil(totalWords / 280) } };
    });
  }, []);

  const totalSpreads = Math.ceil(pages.length / 2);
  const displayTitle = bookTitle || bookData?.title || 'Untitled Book';

  // Build current selected nav item
  const navItems = buildNavItems(bookData);
  const selectedItem = navItems.find(item => item.id === selectedItemId) ?? null;

  // Word count
  const wordCount = bookData?.metadata.wordCount ?? 0;

  return (
    <div
      style={{
        background: '#F5F2EC',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ─── TOP BAR ─── */}
      <div
        style={{
          height: 52,
          background: '#F0EDE7',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
        }}
      >
        {/* Back + Logo */}
        <button
          onClick={() => onGoHome?.()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={13} color="#999" />
          <div
            style={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFE500',
              border: '1.5px solid rgba(0,0,0,0.4)',
              fontSize: 11,
              fontWeight: 900,
              color: '#000',
              fontFamily: 'serif',
              flexShrink: 0,
            }}
          >
            B
          </div>
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.1)', flexShrink: 0 }} />

        {/* Editable title */}
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            value={bookTitle || bookData?.title || ''}
            onChange={(e) => { setBookTitle(e.target.value); setBookData(prev => prev ? { ...prev, title: e.target.value } : prev); }}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            style={{
              fontSize: 13,
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: '1.5px solid #FFE500',
              outline: 'none',
              color: '#1a1a1a',
              minWidth: 140,
              maxWidth: 260,
            }}
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            title="Click to rename"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#1a1a1a',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              maxWidth: 220,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {displayTitle}
          </button>
        )}

        {/* Edited status */}
        <input
          aria-label="Author or pen name"
          placeholder="Author / pen name"
          value={bookData?.author || ''}
          onChange={event => { const author = event.target.value; setBookData(prev => prev ? { ...prev, author } : prev); }}
          style={{ width: 130, padding: '5px 7px', fontSize: 11, color: '#333', background: '#fff8', border: '1px solid #0002', borderRadius: 3 }}
        />
        <span role="status" style={{ fontSize: 11, color: '#666', flexShrink: 0 }}>{saveStatus}</span>

        {/* Genre badge */}
        {detectedGenre && detectedGenre !== 'fiction' && (
          <span
            style={{
              fontSize: 9,
              background: 'rgba(0,0,0,0.07)',
              color: '#555',
              border: '1px solid rgba(0,0,0,0.15)',
              padding: '2px 8px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              flexShrink: 0,
            }}
          >
            {detectedGenre}
          </span>
        )}

        <div style={{ flex: 1 }} />

        {/* Word count */}
        <span style={{ fontSize: 11, color: '#999', flexShrink: 0 }}>
          {wordCount.toLocaleString()} Words
        </span>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.1)', flexShrink: 0 }} />

        {/* Export button */}
        <button
          onClick={() => setShowExportModal(true)}
          disabled={!bookData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(0,0,0,0.18)',
            background: 'transparent',
            color: bookData ? '#333' : '#bbb',
            fontSize: 11,
            padding: '5px 12px',
            borderRadius: 3,
            cursor: bookData ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          <FileDown size={11} />
          Export
        </button>

        {/* Generate / Fix My Book — neo-brutalism */}
        <button
          onClick={handleFixMyBook}
          disabled={isProcessing || !bookData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#FFE500',
            border: '2px solid #000',
            boxShadow: '3px 3px 0 #000',
            padding: '6px 18px',
            fontWeight: 900,
            fontSize: 12,
            color: '#000',
            cursor: (isProcessing || !bookData) ? 'not-allowed' : 'pointer',
            opacity: (isProcessing || !bookData) ? 0.5 : 1,
            flexShrink: 0,
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseEnter={(e) => {
            if (!isProcessing && bookData) {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translate(-1px,-1px)';
              el.style.boxShadow = '4px 4px 0 #000';
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = '';
            el.style.boxShadow = '3px 3px 0 #000';
          }}
        >
          <Star size={10} fill="#000" color="#000" />
          {isProcessing ? 'Fixing…' : 'Generate'}
        </button>
      </div>

      {/* ─── MAIN 3-PANEL AREA ─── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT: Navigator */}
        <Navigator
          bookData={bookData}
          selectedId={selectedItemId}
          onSelect={handleSelectNavItem}
          navMode={navMode}
          onNavModeChange={setNavMode}
          styleCategory={styleCategory}
          onStyleCategoryChange={setStyleCategory}
        />

        {/* CENTER: Chapter Editor */}
        <ChapterEditor
          bookData={bookData}
          selectedItem={selectedItem}
          navMode={navMode}
          styleCategory={styleCategory}
          selectedStyleId={selectedTemplateId}
          onSelectStyle={setSelectedTemplateId}
          onUpdateChapterContent={handleUpdateChapterContent}
        />

        {/* RIGHT: Preview Panel */}
        <div
          style={{
            width: 360,
            flexShrink: 0,
            borderLeft: '1px solid rgba(0,0,0,0.1)',
            background: '#E8E5DE',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Preview header */}
          <div
            style={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              background: '#E0DDD7',
              gap: 6,
              flexShrink: 0,
            }}
          >
            {/* Preview mode toggle pills */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(0,0,0,0.07)',
                borderRadius: 4,
                padding: 2,
                gap: 1,
              }}
            >
              {(['paperback', 'ebook'] as PreviewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setPreviewMode(mode); setCurrentSpread(0); }}
                  style={{
                    padding: '3px 10px',
                    fontSize: 10,
                    fontWeight: previewMode === mode ? 700 : 500,
                    color: previewMode === mode ? '#1a1a1a' : '#888',
                    background: previewMode === mode ? '#fff' : 'transparent',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                    boxShadow: previewMode === mode ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {mode === 'paperback' ? 'Paperback' : 'eBook'}
                </button>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Spread indicator */}
            {bookData && pages.length > 0 && (
              <span style={{ fontSize: 10, color: '#999' }}>
                Spread {currentSpread + 1} / {totalSpreads}
              </span>
            )}
          </div>

          {/* Preview body */}
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
            }}
          >
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <ProcessingState key="proc" />
              ) : bookData && pages.length > 0 ? (
                <motion.div
                  key="prev"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {previewMode === 'paperback' ? (
                    <PaperbackPreview
                      pages={pages}
                      currentSpread={currentSpread}
                      onSpreadChange={setCurrentSpread}
                      totalSpreads={totalSpreads}
                    />
                  ) : (
                    <EbookPreview
                      bookData={bookData}
                      templateId={selectedTemplateId}
                      fontSize={ebookFontSize}
                      onFontSizeChange={setEbookFontSize}
                    />
                  )}
                </motion.div>
              ) : (
                <EmptyPreviewState key="empty" onLoadDemo={() => handleFormat(DEMO_TEXT)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* EXPORT MODAL */}
      <AnimatePresence>
        {showExportModal && bookData && (
          <ExportModal
            bookData={bookData}
            templateId={selectedTemplateId}
            pages={pages}
            onClose={() => setShowExportModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
//  PROCESSING STATE
// ─────────────────────────────────────────

function ProcessingState() {
  const [step, setStep] = useState(0);
  const steps = ['Parsing manuscript…', 'Detecting chapters…', 'Applying template…', 'Rendering pages…'];

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 380);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
    >
      <div style={{ position: 'relative', width: 40, height: 56 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 2,
            background: '#F5F0E8',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
          }}
        />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              bottom: `${6 + i * 5}px`,
              right: `${-2 - i * 2}px`,
              width: '100%',
              height: 1.5,
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 1,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.9, delay: i * 0.25, repeat: Infinity }}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          style={{ fontSize: 11, color: '#888', margin: 0 }}
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────
//  EMPTY PREVIEW STATE
// ─────────────────────────────────────────

function EmptyPreviewState({ onLoadDemo }: { onLoadDemo: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}
    >
      <div
        style={{
          width: 36,
          height: 50,
          background: 'rgba(0,0,0,0.06)',
          border: '1.5px dashed rgba(0,0,0,0.2)',
          borderRadius: 2,
        }}
      />
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#666', margin: '0 0 4px' }}>
          No book loaded
        </p>
        <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>
          Your formatted book appears here
        </p>
      </div>
      <button
        onClick={onLoadDemo}
        style={{
          padding: '5px 14px',
          fontSize: 11,
          fontWeight: 600,
          background: 'transparent',
          border: '1px solid rgba(0,0,0,0.2)',
          borderRadius: 3,
          cursor: 'pointer',
          color: '#555',
        }}
      >
        Load demo book
      </button>
    </motion.div>
  );
}
