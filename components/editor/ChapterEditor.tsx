'use client';

import { useEffect, useRef, useCallback } from 'react';
import { templates } from '@/lib/templates';
import { cleanEditorHtml } from '@/lib/editor-html';
import type { BookData } from '@/types';
import type { NavItem, StyleCategory } from './Navigator';

// ─────────────────────────────────────────
//  POPULAR TEMPLATE IDS
// ─────────────────────────────────────────

const POPULAR_IDS = ['classic-novel', 'modern-fiction', 'business', 'romance'];

function filterTemplates(category: StyleCategory) {
  switch (category) {
    case 'Popular':
      return templates.filter((t) => POPULAR_IDS.includes(t.id));
    case 'Serif':
      return templates.filter(
        (t) =>
          t.bodyFont.includes('Garamond') ||
          t.bodyFont.includes('Baskerville') ||
          t.bodyFont.includes('Georgia') ||
          t.bodyFont.includes('Palatino')
      );
    case 'Sans Serif':
      return templates.filter(
        (t) =>
          t.bodyFont.includes('Inter') ||
          t.bodyFont.includes('system-ui') ||
          t.bodyFont.includes('sans')
      );
    case 'Script':
      return templates.filter((t) => t.category === 'poetry');
    case 'All Styles':
    default:
      return templates;
  }
}

// ─────────────────────────────────────────
//  PROPS
// ─────────────────────────────────────────

interface ChapterEditorProps {
  bookData: BookData | null;
  selectedItem: NavItem | null;
  navMode: 'contents' | 'styles';
  styleCategory: StyleCategory;
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
  onUpdateChapterContent: (chapterIdx: number, newContent: string) => void;
}

// ─────────────────────────────────────────
//  HELPER: strip HTML tags
// ─────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─────────────────────────────────────────
//  TOOLBAR BUTTON
// ─────────────────────────────────────────

function ToolbarButton({
  label,
  title,
  onClick,
}: {
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28,
        height: 28,
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 3,
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 700,
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────
//  STYLES GRID
// ─────────────────────────────────────────

function StylesGrid({
  styleCategory,
  selectedStyleId,
  onSelectStyle,
}: {
  styleCategory: StyleCategory;
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
}) {
  const filtered = filterTemplates(styleCategory);

  return (
    <div
      style={{
        flex: 1,
        background: '#F5F2EC',
        overflow: 'auto',
        padding: 28,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        {filtered.map((tmpl) => {
          const isSelected = tmpl.id === selectedStyleId;
          return (
            <button
              key={tmpl.id}
              onClick={() => onSelectStyle(tmpl.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                border: isSelected
                  ? '2.5px solid #1a1a1a'
                  : '1.5px solid rgba(0,0,0,0.12)',
                boxShadow: isSelected
                  ? '4px 4px 0 #1a1a1a'
                  : '2px 2px 0 rgba(0,0,0,0.06)',
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
                textAlign: 'left',
                transition: 'box-shadow 0.15s, border-color 0.15s',
              }}
            >
              {/* Preview area */}
              <div
                style={{
                  height: 120,
                  background: tmpl.paperColor,
                  padding: '18px 16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {/* Heading preview */}
                <div
                  style={{
                    fontFamily: tmpl.headingFont,
                    color: tmpl.headingColor,
                    fontWeight: tmpl.headingWeight,
                    textTransform: tmpl.headingTransform,
                    fontSize: 13,
                    textAlign: tmpl.headingAlign,
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Chapter One
                </div>
                {/* Body lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                  {[100, 85, 92].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: 2,
                        width: `${w}%`,
                        background: tmpl.inkColor,
                        opacity: 0.18,
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom strip */}
              <div
                style={{
                  padding: '8px 12px',
                  background: isSelected ? '#1a1a1a' : '#f7f6f3',
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: isSelected ? '#fff' : '#1a1a1a',
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tmpl.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: isSelected ? 'rgba(255,255,255,0.6)' : '#888',
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tmpl.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  CONTENTS PANEL (individual item views)
// ─────────────────────────────────────────

function TitlePageView({ bookData }: { bookData: BookData | null }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        minHeight: 400,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
          color: '#1a1a1a',
          lineHeight: 1.25,
          marginBottom: 12,
        }}
      >
        {bookData?.title || 'Untitled Book'}
      </div>
      {bookData?.subtitle && (
        <div
          style={{
            fontSize: 14,
            color: '#666',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            marginBottom: 12,
          }}
        >
          {bookData.subtitle}
        </div>
      )}
      <div
        style={{
          fontSize: 15,
          color: '#555',
          fontFamily: 'Georgia, serif',
          marginTop: 8,
        }}
      >
        {bookData?.author || ''}
      </div>
    </div>
  );
}

function CopyrightView({ bookData }: { bookData: BookData | null }) {
  const year = new Date().getFullYear();
  return (
    <div style={{ padding: '40px 40px', fontFamily: 'Georgia, serif', color: '#555', fontSize: 12, lineHeight: 1.8 }}>
      <p>Copyright © {year} {bookData?.author || 'the author'}. All rights reserved.</p>
      <p style={{ marginTop: 12 }}>No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the publisher.</p>
      <p style={{ marginTop: 12 }}>First Edition</p>
    </div>
  );
}

function DedicationView({ bookData }: { bookData: BookData | null }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        minHeight: 300,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 16,
          fontStyle: 'italic',
          color: '#444',
          lineHeight: 1.8,
          maxWidth: 380,
        }}
      >
        {bookData?.dedication || ''}
      </div>
    </div>
  );
}

function EpigraphView({ bookData }: { bookData: BookData | null }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        minHeight: 300,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 15,
          fontStyle: 'italic',
          color: '#333',
          lineHeight: 1.8,
          maxWidth: 400,
        }}
      >
        {bookData?.epigraph || ''}
      </div>
      {bookData?.epigraphAttribution && (
        <div
          style={{
            marginTop: 16,
            fontSize: 12,
            color: '#888',
            fontFamily: 'Georgia, serif',
          }}
        >
          — {bookData.epigraphAttribution}
        </div>
      )}
    </div>
  );
}

function TocView({ bookData }: { bookData: BookData | null }) {
  return (
    <div style={{ padding: '40px' }}>
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 20,
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: 24,
        }}
      >
        Contents
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {bookData?.chapters.map((ch, idx) => (
          <div
            key={ch.id}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 0,
              paddingBottom: 10,
              paddingTop: 10,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 13,
                color: '#1a1a1a',
                flexShrink: 0,
              }}
            >
              {ch.title || `Chapter ${ch.number}`}
            </span>
            <span
              style={{
                flex: 1,
                borderBottom: '1px dotted rgba(0,0,0,0.2)',
                margin: '0 8px',
                height: 1,
                alignSelf: 'flex-end',
                marginBottom: 4,
              }}
            />
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 13,
                color: '#888',
                flexShrink: 0,
              }}
            >
              {idx * 18 + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleTextView({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Georgia, serif',
        fontSize: 15,
        lineHeight: 1.8,
        color: '#1a1a1a',
      }}
      dangerouslySetInnerHTML={{ __html: text || '' }}
    />
  );
}

// ─────────────────────────────────────────
//  CHAPTER CONTENT EDITOR
// ─────────────────────────────────────────

function ChapterContentEditor({
  bookData,
  selectedItem,
  onUpdateChapterContent,
}: {
  bookData: BookData | null;
  selectedItem: NavItem;
  onUpdateChapterContent: (chapterIdx: number, newContent: string) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const chapterIdx = selectedItem.chapterIdx;
  const chapter = chapterIdx !== undefined ? bookData?.chapters[chapterIdx] : undefined;

  // Update editor content when chapter changes
  useEffect(() => {
    if (!contentRef.current || !chapter) return;
    contentRef.current.innerHTML = cleanEditorHtml(chapter.content);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.id]);

  const handleBlur = useCallback(() => {
    if (!contentRef.current || chapterIdx === undefined) return;
    const html = cleanEditorHtml(contentRef.current.innerHTML);
    onUpdateChapterContent(chapterIdx, html);
  }, [chapterIdx, onUpdateChapterContent]);

  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    contentRef.current?.focus();
    handleBlur();
  };

  if (!chapter) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa',
          fontSize: 13,
        }}
      >
        Chapter not found.
      </div>
    );
  }

  return (
    <>
      {/* Chapter header + toolbar */}
      <div
        style={{
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          padding: '16px 40px 0',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: 12,
          }}
        >
          {chapter.title || `Chapter ${chapter.number}`}
        </div>

        {/* Formatting toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            paddingBottom: 10,
          }}
        >
          <ToolbarButton label="B" title="Bold" onClick={() => execCmd('bold')} />
          <ToolbarButton label="I" title="Italic" onClick={() => execCmd('italic')} />
          <ToolbarButton label="U" title="Underline" onClick={() => execCmd('underline')} />

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />

          <button
            onClick={() => execCmd('insertHTML', '<hr style="border:none;text-align:center;margin:1.5em auto;width:40%;border-top:1px solid #999;" />')}
            style={{
              height: 28,
              padding: '0 10px',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 3,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 600,
              color: '#555',
              flexShrink: 0,
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            Scene Break
          </button>

          <div style={{ flex: 1 }} />

          <button
            style={{
              width: 28,
              height: 28,
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 3,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 12,
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Search"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Editable content area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 40px',
        }}
      >
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onInput={handleBlur}
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 15,
            lineHeight: 1.85,
            color: '#1a1a1a',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            minHeight: 400,
            wordBreak: 'break-word',
          }}
        />
      </div>
    </>
  );
}

// ─────────────────────────────────────────
//  CHAPTER EDITOR MAIN
// ─────────────────────────────────────────

export default function ChapterEditor({
  bookData,
  selectedItem,
  navMode,
  styleCategory,
  selectedStyleId,
  onSelectStyle,
  onUpdateChapterContent,
}: ChapterEditorProps) {
  // ── Styles mode ──
  if (navMode === 'styles') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <StylesGrid
          styleCategory={styleCategory}
          selectedStyleId={selectedStyleId}
          onSelectStyle={onSelectStyle}
        />
      </div>
    );
  }

  // ── Contents mode ──
  if (!selectedItem) {
    return (
      <div
        style={{
          flex: 1,
          background: '#FAFAF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa',
          fontSize: 13,
        }}
      >
        Select a chapter from the navigator
      </div>
    );
  }

  const renderItem = () => {
    switch (selectedItem.type) {
      case 'title-page':
        return <TitlePageView bookData={bookData} />;
      case 'copyright':
        return <CopyrightView bookData={bookData} />;
      case 'dedication':
        return <DedicationView bookData={bookData} />;
      case 'epigraph':
        return <EpigraphView bookData={bookData} />;
      case 'toc':
        return <TocView bookData={bookData} />;
      case 'chapter':
        return (
          <ChapterContentEditor
            bookData={bookData}
            selectedItem={selectedItem}
            onUpdateChapterContent={onUpdateChapterContent}
          />
        );
      case 'acknowledgments':
        return <SimpleTextView text={bookData?.acknowledgments || ''} />;
      case 'about-author':
        return <SimpleTextView text={bookData?.aboutAuthor || ''} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        flex: 1,
        background: '#FAFAF8',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {renderItem()}
    </div>
  );
}
