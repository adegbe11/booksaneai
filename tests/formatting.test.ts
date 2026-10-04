import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatBook } from '../lib/formatter';
import { buildPrintHTML } from '../lib/print';
import { checkBook } from '../lib/preflight';
import { getTemplate } from '../lib/templates';
import { readBackup } from '../lib/project';
import { generateEpub } from '../lib/epub';
import JSZip from 'jszip';

test('two-line chapter headings do not leak into the preceding chapter', () => {
  const book = formatBook('Test Book\nBy A Writer\n\nChapter 1\nThe Arrival\n\nFirst chapter body.\n\nChapter 2\nThe Return\n\nSecond chapter body.');
  assert.equal(book.chapters.length, 2);
  assert.equal(book.chapters[0].title, 'Chapter 1\nThe Arrival');
  assert.equal(book.chapters[0].content, '<p>First chapter body.</p>');
  assert.equal(book.chapters[1].content, '<p>Second chapter body.</p>');
});

test('plain manuscript markup is escaped before inline formatting', () => {
  const book = formatBook('Title\nBy Author\n\nChapter 1\n\nA <script>alert(1)</script> & **bold** paragraph.');
  assert.ok(book.chapters[0].content.includes('&lt;script&gt;'));
  assert.ok(book.chapters[0].content.includes('&amp; <strong>bold</strong>'));
});

test('print uses manuscript content, template trim size, and full typography', () => {
  const book = formatBook('A & B\nBy Writer\n\nChapter 1\n\nA real paragraph.');
  const html = buildPrintHTML(book, { ...getTemplate('classic-novel'), pageSize: 'a5' });
  assert.ok(html.includes('148mm 210mm'));
  assert.ok(html.includes('A real paragraph.'));
  assert.ok(html.includes('<title>A &amp; B</title>'));
  assert.ok(!html.includes('7.5pt'));
  assert.ok(!html.includes('watermark'));
});

test('preflight does not invent a minimum word count', () => {
  const book = formatBook('Short Book\nBy Writer\n\nChapter 1\n\nShort but valid.');
  assert.deepEqual(checkBook(book), []);
  book.chapters[0].content = '<p><img src="missing.png"></p>';
  assert.ok(checkBook(book).some(issue => issue.severity === 'error'));
});

test('portable backup round-trips edited document and style', () => {
  const bookData = formatBook('Restored Title\nBy Writer\n\nChapter 1\n\nEdited <text> & **emphasis**.');
  const restored = readBackup(JSON.stringify({ version: 1, bookData, templateId: 'classic-novel' }));
  assert.deepEqual(restored.bookData, JSON.parse(JSON.stringify(bookData)));
  assert.equal(restored.templateId, 'classic-novel');
  bookData.chapters[0].content = '<p onclick="alert(1)">Unsafe</p>';
  assert.throws(() => readBackup(JSON.stringify({ version: 1, bookData, templateId: 'classic-novel' })), /unsupported HTML/);
});

test('EPUB includes current title, author, chapter text, navigation, and uncompressed mimetype', async () => {
  const book = formatBook('Current Title\nBy Current Author\n\nChapter 1\n\nCurrent manuscript.');
  const blob = await generateEpub(book, getTemplate('classic-novel'));
  const bytes = await blob.arrayBuffer();
  const zip = await JSZip.loadAsync(bytes);
  assert.equal(await zip.file('mimetype')!.async('string'), 'application/epub+zip');
  assert.equal(new DataView(bytes).getUint16(8, true), 0);
  const opf = await zip.file('OEBPS/content.opf')!.async('string');
  assert.ok(opf.includes('Current Title'));
  assert.ok(opf.includes('Current Author'));
  assert.ok(zip.file('OEBPS/nav.xhtml'));
  assert.ok((await zip.file('OEBPS/content/chapter-1.xhtml')!.async('string')).includes('Current manuscript.'));
});
