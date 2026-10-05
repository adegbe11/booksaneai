import test from 'node:test';
import assert from 'node:assert/strict';
import { blankRuns, proofCheck, RULES, type LayoutFacts } from '../lib/studio/proof';
import { defaultCover } from '../lib/studio/cover';
import { newProject, textDocument } from '../lib/studio/model';

const clean: LayoutFacts = { pages: 120, blank: [2, 8], overflow: [], images: [] };
const fails = (items: ReturnType<typeof proofCheck>) => items.filter(i => i.level === 'fail').map(i => i.title);

test('a clean book with a cover passes for KDP', () => {
  const p = newProject(true);
  p.cover = defaultCover();
  assert.deepEqual(fails(proofCheck(p, clean, 'kdp', { mode: 'design' })), []);
});

test('short books, narrow gutters and missing covers fail', () => {
  const p = newProject(true);
  assert.ok(fails(proofCheck(p, { ...clean, pages: 12 }, 'kdp', { mode: 'design' })).some(t => /too short/.test(t)));
  assert.ok(fails(proofCheck(p, { ...clean, pages: 760 }, 'kdp', { mode: 'design' })).includes('Inside margin is too narrow'));
  p.design.gutter = 0.875;
  assert.ok(!fails(proofCheck(p, { ...clean, pages: 760 }, 'kdp', { mode: 'design' })).includes('Inside margin is too narrow'));
  assert.ok(fails(proofCheck(p, clean, 'kdp', { mode: 'none' })).includes('No cover yet'));
});

test('KDP gutter table follows page count', () => {
  const g = RULES.kdp.gutter;
  assert.deepEqual([24, 150, 151, 300, 301, 500, 501, 700, 701, 828].map(g), [0.375, 0.375, 0.5, 0.5, 0.625, 0.625, 0.75, 0.75, 0.875, 0.875]);
});

test('layout problems are reported with page numbers', () => {
  const p = newProject(true);
  p.cover = defaultCover();
  const items = proofCheck(p, { pages: 100, blank: [40, 41, 42], overflow: [12, 30], images: [{ page: 5, width: 600, height: 400, shownWidth: 4.5, colour: true }] }, 'kdp', { mode: 'design' });
  assert.deepEqual(items.find(i => /margin$/.test(i.title))?.pages, [12, 30]);
  assert.deepEqual(items.find(i => /blank pages in a row/.test(i.title))?.pages, [40]);
  assert.equal(items.find(i => /DPI/.test(i.title))?.level, 'warn');
  assert.ok(items.some(i => /black and white/.test(i.title)));
  assert.deepEqual(blankRuns([9, 3, 4, 10, 11]), [[3, 2], [9, 3]]);
});

test('placeholder text, sizes the printer lacks and missing ISBNs fail', () => {
  const p = newProject(true);
  p.cover = defaultCover();
  p.sections[1].document = textDocument('She walked in. TK describe the room.');
  assert.ok(fails(proofCheck(p, clean, 'kdp', { mode: 'design' })).some(t => /Placeholder/.test(t)));
  p.design.trim = '4.25x6.87';
  assert.equal(proofCheck(p, clean, 'kdp', { mode: 'design' }).find(i => /custom size/.test(i.title))?.level, 'warn');
  p.design.trim = 'b5';
  p.publishing = { paper: 'cream' };
  assert.ok(fails(proofCheck(p, clean, 'ingram', { mode: 'design' })).some(t => /cream paper/.test(t)));
  p.design.trim = '6x9';
  assert.ok(fails(proofCheck(p, clean, 'ingram', { mode: 'design' })).includes('IngramSpark needs an ISBN barcode'));
  p.cover.isbn = '9780306406157';
  assert.ok(!fails(proofCheck(p, clean, 'ingram', { mode: 'design' })).some(t => /ISBN/.test(t)));
});

test('KDP page limits drop for the largest sizes', () => {
  const max = RULES.kdp.maxPages;
  assert.deepEqual([max('6x9', 'white'), max('6x9', 'cream'), max('8.5x11', 'white'), max('8.5x11', 'cream'), max('8.25x8.25', 'white'), max('a4', 'cream')], [828, 776, 590, 550, 800, 730]);
  const p = newProject(true);
  p.design.trim = '8.5x11';
  assert.ok(fails(proofCheck(p, { ...clean, pages: 600 }, 'kdp', { mode: 'design' })).some(t => /too long/.test(t)));
});
