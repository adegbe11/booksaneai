'use client';

import { useState } from 'react';
import type { BookData } from '@/types';

// ─────────────────────────────────────────
//  EXPORTED TYPES
// ─────────────────────────────────────────

export type NavMode = 'contents' | 'styles';
export type StyleCategory = 'Popular' | 'Serif' | 'Sans Serif' | 'Script' | 'All Styles';

export interface NavItem {
  id: string;
  type: 'title-page' | 'copyright' | 'dedication' | 'epigraph' | 'toc' | 'chapter' | 'acknowledgments' | 'about-author';
  label: string;
  chapterIdx?: number;
}

export function buildNavItems(bookData: BookData | null): NavItem[] {
  const items: NavItem[] = [];

  items.push({ id: 'title-page', type: 'title-page', label: 'Title Page' });
  items.push({ id: 'copyright', type: 'copyright', label: 'Copyright' });

  if (bookData?.dedication) {
    items.push({ id: 'dedication', type: 'dedication', label: 'Dedication' });
  }
  if (bookData?.epigraph) {
    items.push({ id: 'epigraph', type: 'epigraph', label: 'Epigraph' });
  }
  if (bookData && bookData.chapters.length > 0) {
    items.push({ id: 'toc', type: 'toc', label: 'Table of Contents' });
  }

  if (bookData) {
    bookData.chapters.forEach((ch, idx) => {
      items.push({
        id: `chapter-${ch.id}`,
        type: 'chapter',
        label: ch.title || `Chapter ${ch.number}`,
        chapterIdx: idx,
      });
    });
  }

  if (bookData?.acknowledgments) {
    items.push({ id: 'acknowledgments', type: 'acknowledgments', label: 'Acknowledgments' });
  }
  if (bookData?.aboutAuthor) {
    items.push({ id: 'about-author', type: 'about-author', label: 'About the Author' });
  }

  return items;
}

// ─────────────────────────────────────────
//  NAVIGATOR PROPS
// ─────────────────────────────────────────

interface NavigatorProps {
  bookData: BookData | null;
  selectedId: string;
  onSelect: (item: NavItem) => void;
  navMode: NavMode;
  onNavModeChange: (mode: NavMode) => void;
  styleCategory: StyleCategory;
  onStyleCategoryChange: (cat: StyleCategory) => void;
}

const STYLE_CATEGORIES: StyleCategory[] = ['Popular', 'Serif', 'Sans Serif', 'Script', 'All Styles'];

// ─────────────────────────────────────────
//  NAVIGATOR COMPONENT
// ─────────────────────────────────────────

export default function Navigator({
  bookData,
  selectedId,
  onSelect,
  navMode,
  onNavModeChange,
  styleCategory,
  onStyleCategoryChange,
}: NavigatorProps) {
  const navItems = buildNavItems(bookData);

  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        background: '#EDEBE5',
        borderRight: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Mode tabs ── */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      >
        {(['contents', 'styles'] as NavMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onNavModeChange(mode)}
            style={{
              flex: 1,
              height: 36,
              background: navMode === mode ? '#EDEBE5' : '#E5E2DC',
              border: 'none',
              borderBottom: navMode === mode ? '2.5px solid #1a1a1a' : '2.5px solid transparent',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: navMode === mode ? 700 : 500,
              color: navMode === mode ? '#1a1a1a' : '#777',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              transition: 'background 0.15s',
            }}
          >
            {mode === 'contents' ? 'Contents' : 'Styles'}
          </button>
        ))}
      </div>

      {/* ── Contents Mode ── */}
      {navMode === 'contents' && (
        <>
          {/* Book header */}
          <div
            style={{
              padding: '14px 16px 12px',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {bookData?.title || 'Untitled Book'}
            </div>
            {bookData?.author && (
              <div
                style={{
                  fontSize: 10,
                  color: '#888',
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {bookData.author}
              </div>
            )}
          </div>

          {/* Chapter list */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '6px 0',
            }}
          >
            {navItems.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  style={{
                    width: '100%',
                    display: 'block',
                    textAlign: 'left',
                    padding: '7px 16px',
                    fontSize: 13,
                    border: 'none',
                    borderLeft: isSelected ? '3px solid #FFE500' : '3px solid transparent',
                    background: isSelected ? '#1a1a1a' : 'transparent',
                    color: isSelected ? '#fff' : '#333',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  {item.type === 'chapter' && (
                    <span style={{ fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.5)' : '#aaa', marginRight: 6 }}>
                      {item.chapterIdx !== undefined ? item.chapterIdx + 1 : ''}
                    </span>
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Add Element button */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }}>
            <button
              style={{
                width: '100%',
                padding: '7px 0',
                background: 'transparent',
                border: '1.5px dashed rgba(0,0,0,0.2)',
                borderRadius: 4,
                fontSize: 12,
                color: '#888',
                cursor: 'pointer',
                fontWeight: 600,
                letterSpacing: '0.02em',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(0,0,0,0.4)';
                el.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(0,0,0,0.2)';
                el.style.color = '#888';
              }}
            >
              + Add Element
            </button>
          </div>
        </>
      )}

      {/* ── Styles Mode ── */}
      {navMode === 'styles' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {STYLE_CATEGORIES.map((cat) => {
            const isSelected = cat === styleCategory;
            return (
              <button
                key={cat}
                onClick={() => onStyleCategoryChange(cat)}
                style={{
                  width: '100%',
                  display: 'block',
                  textAlign: 'left',
                  padding: '8px 16px',
                  fontSize: 13,
                  border: 'none',
                  borderLeft: isSelected ? '3px solid #FFE500' : '3px solid transparent',
                  background: isSelected ? '#1a1a1a' : 'transparent',
                  color: isSelected ? '#fff' : '#333',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
