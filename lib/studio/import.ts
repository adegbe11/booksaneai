import { generateJSON } from '@tiptap/core';
import sanitizeHtml from 'sanitize-html';
import { studioExtensions } from './extensions';
import { newProject, newSection, readProject, textDocument, documentText, words, type StudioProject } from './model';
import type { RecentBook } from '@/types';

export function htmlDocument(html: string) {
  return generateJSON(sanitizeHtml(html, {
    allowedTags: ['p', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'blockquote', 'ul', 'ol', 'li', 'br', 'hr', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'img'],
    allowedAttributes: { a: ['href'], img: ['src', 'alt'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan'] },
    allowedSchemes: ['https', 'http', 'mailto'], allowedSchemesByTag: { img: ['data'] },
  }), studioExtensions());
}

export function importPlainText(text: string, filename: string): StudioProject {
  const project = newProject();
  project.title = filename.replace(/\.[^.]+$/, '');
  project.sections = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  let title = 'Manuscript'; let body: string[] = [];
  const flush = () => { if (body.join('\n').trim() || title !== 'Manuscript') project.sections.push({ ...newSection('chapter', title), document: textDocument(body.join('\n')) }); body = []; };
  for (const line of lines) {
    if (/^\s*(chapter\s+(?:\d+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten)\b.*|prologue|epilogue)\s*$/i.test(line)) { flush(); title = line.trim(); }
    else body.push(line);
  }
  flush();
  if (!project.sections.length) project.sections.push(newSection());
  project.importReport = { filename, messages: ['Plain text preserves words and line breaks. Review chapter boundaries; title and author are not inferred from body text.'], sourceWords: words(text), importedWords: project.sections.reduce((sum, s) => sum + words(documentText(s.document)), 0) };
  return project;
}

export async function importFile(file: File): Promise<StudioProject> {
  if (file.size > 20 * 1024 * 1024) throw new Error('Choose a file smaller than 20 MB.');
  if (file.name.endsWith('.booksane') || file.name.endsWith('.json')) {
    const p = readProject(JSON.parse(await file.text()));
    return { ...p, id: crypto.randomUUID(), revision: 0, updatedAt: Date.now() };
  }
  if (/\.txt$/i.test(file.name)) return importPlainText(await file.text(), file.name);
  if (!/\.docx$/i.test(file.name)) throw new Error('Choose a DOCX, TXT, or Booksane project file.');
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const [converted, raw] = await Promise.all([mammoth.convertToHtml({ arrayBuffer }), mammoth.extractRawText({ arrayBuffer })]);
  const project = newProject();
  project.title = file.name.replace(/\.docx$/i, '');
  project.sections = [];
  const source = new DOMParser().parseFromString(converted.value, 'text/html');
  let title = 'Manuscript'; let html = '';
  const flush = () => { if (html.trim()) project.sections.push({ ...newSection('chapter', title), document: htmlDocument(html) }); html = ''; };
  for (const node of Array.from(source.body.children)) {
    if (node.tagName === 'H1') { flush(); title = node.textContent?.trim() || 'Untitled chapter'; }
    else html += node.outerHTML;
  }
  flush();
  if (!project.sections.length) project.sections.push(newSection());
  const messages = converted.messages.map(m => m.message);
  const unsupportedImages = Array.from(source.querySelectorAll('img')).filter(img => !/^data:image\/(png|jpeg);base64,/.test(img.src));
  if (unsupportedImages.length) messages.push(`${unsupportedImages.length} images use an unsupported format. Convert them to PNG or JPEG before importing.`);
  if (!source.querySelector('h1')) messages.push('No Heading 1 chapter boundaries found. Imported as one section; split it into chapters in your source document or add sections here.');
  messages.push('DOCX headings, emphasis, lists, tables, and embedded PNG/JPEG images are mapped to book content. Review notes, numbering, text boxes, and tracked changes against your original.');
  project.importReport = { filename: file.name, messages, sourceWords: words(raw.value), importedWords: project.sections.reduce((sum, s) => sum + words(documentText(s.document)), 0) };
  readProject(project);
  return project;
}

export function migrateRecent(book: RecentBook): StudioProject {
  const p = book.bookData;
  if (!p) return importPlainText(book.rawText, book.title);
  const project = newProject();
  project.id = `legacy-${book.id}`; project.title = p.title; project.author = p.author; project.subtitle = p.subtitle || '';
  project.sections = p.chapters.map(ch => ({ ...newSection('chapter', ch.title), document: htmlDocument(ch.content) }));
  if (p.dedication) project.sections.unshift({ ...newSection('frontmatter', 'Dedication'), document: textDocument(p.dedication) });
  if (p.epigraph) project.sections.unshift({ ...newSection('frontmatter', 'Epigraph'), document: textDocument(`${p.epigraph}\n\n${p.epigraphAttribution || ''}`) });
  if (p.acknowledgments) project.sections.push({ ...newSection('backmatter', 'Acknowledgments'), document: textDocument(p.acknowledgments) });
  if (p.aboutAuthor) project.sections.push({ ...newSection('backmatter', 'About the author'), document: textDocument(p.aboutAuthor) });
  project.importReport = { filename: 'Previous Booksane project', messages: ['Recovered from the previous editor. The original local save remains available.'], sourceWords: p.metadata.wordCount, importedWords: project.sections.reduce((sum, s) => sum + words(documentText(s.document)), 0) };
  return project;
}
