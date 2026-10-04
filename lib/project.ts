import type { BookData } from '@/types';

export function readBackup(text: string): { bookData: BookData; templateId: string } {
  const value = JSON.parse(text);
  const book = value?.bookData;
  if (value?.version !== 1 || !book || typeof book.title !== 'string' || typeof book.author !== 'string' || !Array.isArray(book.chapters) || !book.metadata || typeof value.templateId !== 'string') throw new Error('This is not a supported Booksane backup.');
  for (const field of ['subtitle', 'dedication', 'epigraph', 'epigraphAttribution', 'acknowledgments', 'aboutAuthor']) {
    if (book[field] !== undefined && typeof book[field] !== 'string') throw new Error('Invalid book metadata.');
  }
  const ids = new Set<string>();
  for (const ch of book.chapters) {
    if (!ch || typeof ch.id !== 'string' || typeof ch.title !== 'string' || typeof ch.content !== 'string' || !Number.isFinite(ch.number) || !Number.isFinite(ch.wordCount) || ids.has(ch.id)) throw new Error('Invalid chapter in backup.');
    ids.add(ch.id);
    // Until restoration has a full sanitizer, accept only formatter-generated text markup.
    const stripped = ch.content.replace(/<\/?(?:p|strong|em|b|i|u|h2|h3|ul|ol|li|blockquote)>|<p class="section-break">|<br\s*\/?>/g, '');
    if (/[<>]/.test(stripped)) throw new Error('This backup contains unsupported HTML. Restore plain text instead.');
  }
  if (!Number.isFinite(book.metadata.wordCount) || !Number.isFinite(book.metadata.estimatedPages)) throw new Error('Invalid word count metadata.');
  return { bookData: book, templateId: value.templateId };
}
