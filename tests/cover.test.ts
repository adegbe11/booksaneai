import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { checkUpload, defaultCover, ean13, fit, isbnDigits, validCover, wrap, wrapGeometry } from '../lib/studio/cover';
import { newProject, readProject } from '../lib/studio/model';
import { studioEpub } from '../lib/studio/publication';

test('ISBNs are checked and ISBN-10 becomes ISBN-13', () => {
  assert.equal(isbnDigits('978-0-306-40615-7'), '9780306406157');
  assert.equal(isbnDigits('0-306-40615-2'), '9780306406157');
  assert.equal(isbnDigits('978-0-306-40615-8'), null);
  assert.equal(isbnDigits('12345'), null);
});

test('EAN-13 barcode has 95 modules with guard bars', () => {
  const bits = ean13('9780306406157');
  assert.equal(bits.length, 95);
  assert.equal(bits.slice(0, 3), '101');
  assert.equal(bits.slice(45, 50), '01010');
  assert.equal(bits.slice(92), '101');
  // first digit 9 sets the left-hand parity LGGLGL; the digit 7 in L parity is 0111011
  assert.equal(bits.slice(3, 10), '0111011');
});

test('paperback wrap matches KDP: bleed, spine from page count, spine text rules', () => {
  const g = wrapGeometry('6x9', 300, 'white');
  assert.equal(g.pages, 300);
  assert.ok(Math.abs(g.spine - 0.6756) < 0.001);
  assert.ok(Math.abs(g.width - (0.25 + 12 + g.spine)) < 1e-9);
  assert.equal(g.height, 9.25);
  assert.equal(g.spineText, true);
  assert.equal(g.front.x, 0.125 + 6 + g.spine);
  assert.ok(g.barcode.x + g.barcode.w <= g.back.x + g.back.w - 0.25 + 1e-9);
  assert.equal(wrapGeometry('6x9', 60, 'white', 'kdp').spineText, false);
  assert.equal(wrapGeometry('6x9', 60, 'white', 'ingram').spineText, true);
  assert.equal(wrapGeometry('5x8', 101, 'cream').pages, 102);
});

test('uploaded covers are checked against each store and print', () => {
  const good = checkUpload(1600, 2560, '5x8');
  assert.ok(good.slice(0, 3).every(c => c.ok));
  const small = checkUpload(400, 640, '6x9');
  assert.ok(small.some(c => !c.ok && /Kindle/.test(c.message)));
  assert.ok(checkUpload(2560, 1600, '6x9').some(c => /wide/.test(c.message)));
  assert.ok(checkUpload(1838, 2850, '6x9').some(c => c.ok && /print/.test(c.message)));
});

test('titles wrap and shrink to fit the box', () => {
  const ctx = { font: '10px x', measureText(s: string) { return { width: s.length * parseFloat(this.font) * 0.5 } as TextMetrics; } };
  assert.deepEqual(wrap(s => s.length, 'one two three four', 9), ['one two', 'three', 'four']);
  const t = fit(ctx, 'The Very Long Title Of A Very Long Book', n => `${n}px x`, { w: 300, h: 200 }, 120, 10, 4);
  assert.ok(t.lines.length <= 4 && t.height <= 200);
  assert.ok(t.lines.every(l => l.length * t.size * 0.5 <= 300));
});

test('cover settings are validated with the project', () => {
  const p = newProject(true);
  p.cover = { ...defaultCover(), blurb: 'A story.', isbn: '9780306406157' };
  assert.doesNotThrow(() => readProject(p));
  assert.equal(validCover({ ...defaultCover(), style: 'nope' }), false);
  assert.equal(validCover({ ...defaultCover(), photo: 'javascript:alert(1)' }), false);
  assert.throws(() => readProject({ ...p, cover: { ...defaultCover(), palette: 99 } }));
});

test('EPUB carries the cover as cover-image and first page', async () => {
  const p = newProject(true);
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]).toString('base64');
  const zip = await JSZip.loadAsync(await (await studioEpub(p, 'universal', jpeg)).arrayBuffer());
  const opf = await zip.file('EPUB/package.opf')!.async('string');
  assert.match(opf, /properties="cover-image"/);
  assert.match(opf, /<meta name="cover" content="cover-image"\/>/);
  assert.match(opf, /<spine><itemref idref="cover"\/>/);
  assert.ok(zip.file('EPUB/images/cover.jpg'));
  const without = await JSZip.loadAsync(await (await studioEpub(p)).arrayBuffer());
  assert.doesNotMatch(await without.file('EPUB/package.opf')!.async('string'), /cover-image/);
});
