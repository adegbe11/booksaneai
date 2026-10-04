import type { BookData } from '@/types';

export interface PreflightIssue { id: string; severity: 'error' | 'warning'; message: string }

export function checkBook(book: BookData): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  if (!book.title.trim() || /^untitled( book)?$/i.test(book.title.trim())) issues.push({ id: 'title', severity: 'warning', message: 'Add the final book title.' });
  if (!book.author.trim()) issues.push({ id: 'author', severity: 'warning', message: 'Add an author or pen name.' });
  if (!book.chapters.length) issues.push({ id: 'chapters', severity: 'error', message: 'Add at least one chapter before exporting.' });
  const titles = new Set<string>();
  for (const chapter of book.chapters) {
    if (!chapter.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()) issues.push({ id: `empty-${chapter.id}`, severity: 'warning', message: `“${chapter.title}” has no text.` });
    const title = chapter.title.trim().toLowerCase();
    if (titles.has(title)) issues.push({ id: `duplicate-${chapter.id}`, severity: 'warning', message: `Repeated chapter title: “${chapter.title}”.` });
    titles.add(title);
    if (/<img\b/i.test(chapter.content)) issues.push({ id: `images-${chapter.id}`, severity: 'error', message: `“${chapter.title}” contains images. EPUB image packaging is not supported yet.` });
  }
  return issues;
}
