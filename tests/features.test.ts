import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { boxSet, findInProject, newProject, newSection, readProject, replaceInProject, type StudioProject } from '../lib/studio/model';
import { ebookHtml, printHtml, studioEpub } from '../lib/studio/publication';
import { coverSize } from '../lib/studio/themes';

function withExtras(): StudioProject {
  const p = newProject(true);
  const ch = p.sections[1];
  ch.document = { type: 'doc', content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'Light arrived' }, { type: 'footnote', attrs: { note: 'Morning, in July.' } }, { type: 'text', text: ' without ceremony.' }] },
    { type: 'callout', attrs: { tone: 'tip' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Notice one thing today.' }] }] },
  ] };
  p.sections.splice(1, 0, { ...newSection('part', 'Beginnings') });
  p.publishing = { alsoBy: ['The Quiet Year', 'Small Rooms'], series: 'Everyday', seriesNumber: 2, storeLinks: { amazon: 'https://amazon.example/b', apple: 'https://apple.example/b', kobo: 'not a link' }, newsletterText: 'Get the next book first.', newsletterUrl: 'https://news.example' };
  return readProject(JSON.parse(JSON.stringify(p)));
}

async function epubText(blob: Blob): Promise<string> {
  const zip = await JSZip.loadAsync(Buffer.from(await blob.arrayBuffer()));
  const parts = await Promise.all(Object.values(zip.files).filter(f => f.name.endsWith('.xhtml') || f.name.endsWith('.opf')).map(f => f.async('string')));
  return parts.join('\n');
}

test('footnotes print at the foot of the page and link in ebooks', async () => {
  const p = withExtras();
  assert.match(printHtml(p, false), /<span class="footnote">Morning, in July\.<\/span>/);
  assert.match(printHtml(p, false), /float:footnote/);
  const text = await epubText(await studioEpub(p));
  assert.match(text, /epub:type="noteref"[^>]*href="#fn-1"/);
  assert.match(text, /<aside id="fn-1" epub:type="footnote"/);
});

test('callouts and parts render in print, ebook and preview', async () => {
  const p = withExtras();
  const print = printHtml(p, false);
  assert.match(print, /<aside class="callout callout-tip">/);
  assert.match(print, /class="book-section part".*Part One/s);
  assert.match(ebookHtml(p), /callout-tip/);
  assert.match(await epubText(await studioEpub(p)), /class="part"/);
});

test('Also by and Stay in touch pages are added, with store-specific links', async () => {
  const p = withExtras();
  const print = printHtml(p, false);
  assert.match(print, /Also by Alex Morgan/);
  assert.match(print, /The Quiet Year/);
  assert.doesNotMatch(print, /Review on/, 'print has no clickable store links');
  const all = await epubText(await studioEpub(p));
  assert.match(all, /Review on Amazon Kindle/);
  assert.match(all, /Review on Apple Books/);
  assert.doesNotMatch(all, /not a link/, 'incomplete links never reach the book');
  const kindle = await epubText(await studioEpub(p, 'amazon'));
  assert.match(kindle, /Review on Amazon Kindle/);
  assert.doesNotMatch(kindle, /Apple Books/);
  assert.match(all, /belongs-to-collection/);
});

test('find and replace works across the whole book', () => {
  const p = newProject(true);
  assert.equal(findInProject(p, 'attention'), 2);
  assert.equal(findInProject(p, 'ATTENTION', true), 0);
  const next = replaceInProject(p, 'kettle', 'teapot');
  assert.equal(findInProject(next, 'kettle'), 0);
  assert.equal(findInProject(next, 'teapot'), 1);
  assert.equal(findInProject(p, 'kettle'), 1, 'original is untouched');
});

test('box sets turn each book into a part', () => {
  const a = newProject(true); a.title = 'Book One';
  const b = newProject(true); b.title = 'Book Two';
  const set = readProject(boxSet([a, b], 'The Set'));
  assert.equal(set.title, 'The Set');
  assert.deepEqual(set.sections.filter(s => s.kind === 'part').map(s => s.title), ['Book One', 'Book Two']);
  assert.ok(set.sections.every(s => !a.sections.some(o => o.id === s.id)), 'sections get new ids');
});

test('cover size follows KDP paperback maths', () => {
  const c = coverSize('6x9', 200, 'white');
  assert.equal(c.pages, 200);
  assert.ok(Math.abs(c.spine - 0.4504) < 0.0001);
  assert.ok(Math.abs(c.width - (0.25 + 12 + 0.4504)) < 0.0001);
  assert.equal(c.height, 9.25);
  assert.equal(coverSize('6x9', 41).pages, 42, 'odd page counts round up');
  assert.equal(coverSize('6x9', 10).pages, 24, 'minimum 24 pages');
  assert.equal(coverSize('6x9', 60).spineText, false);
});

test('bad publishing and goal data is rejected', () => {
  const p = newProject(true);
  assert.throws(() => readProject({ ...p, publishing: { storeLinks: { myspace: 'https://x' } } }));
  assert.throws(() => readProject({ ...p, goals: { target: -5 } }));
  assert.throws(() => readProject({ ...p, sections: [{ ...p.sections[1], document: { type: 'doc', content: [{ type: 'callout', attrs: { tone: 'shout' }, content: [] }] } }] }));
});

test('PDF/X-1a conversion produces a compliant structure when Ghostscript is installed', async t => {
  const { findGhostscript, toPdfX1a } = await import('../lib/server/pdfx');
  if (!findGhostscript()) { t.skip('Ghostscript not installed'); return; }
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  const src = await PDFDocument.create();
  const font = await src.embedFont(StandardFonts.TimesRoman);
  const page = src.addPage([432, 648]);
  page.drawText('Chapter One', { x: 72, y: 560, size: 18, font, color: rgb(0.2, 0.2, 0.2) });
  page.drawRectangle({ x: 72, y: 100, width: 100, height: 40, color: rgb(0.8, 0.2, 0.2) });
  const out = Buffer.from(await toPdfX1a(await src.save(), 'Test (Book)'));
  const text = out.toString('latin1');
  assert.equal(text.slice(0, 8), '%PDF-1.3');
  assert.match(text, /GTS_PDFXVersion\s*\(PDF\/X-1a:2001\)/);
  assert.match(text, /\/GTS_PDFX/);
  assert.match(text, /\/TrimBox/);
  const back = await PDFDocument.load(out);
  assert.equal(back.getPageCount(), 1);
});
