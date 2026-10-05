import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDescription, checkKeyword, descriptionHtml, draftDescription, keywordDuplicates, keywordIdeas, listingKit, sampleEdition, validListing } from '../lib/studio/listing';
import { newProject, newSection, readProject, textDocument, type DocumentNode } from '../lib/studio/model';

const doc = (...paras: string[]): DocumentNode => ({ type: 'doc', content: paras.map(t => ({ type: 'paragraph', content: [{ type: 'text', text: t }] })) });

test('description becomes the HTML KDP accepts', () => {
  const d: DocumentNode = { type: 'doc', content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'A hook.', marks: [{ type: 'bold' }] }] },
    { type: 'heading', attrs: { level: 4 }, content: [{ type: 'text', text: 'Inside' }] },
    { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'One & <two>' }] }] }] },
  ] };
  assert.equal(descriptionHtml(d), '<p><b>A hook.</b></p><h4>Inside</h4><ul><li>One &amp; &lt;two&gt;</li></ul>');
});

test('description rules: length, links, prices, review requests', () => {
  assert.ok(checkDescription(doc('A short hook.', 'More.')).every(c => c.ok));
  assert.ok(checkDescription(doc('x'.repeat(4100))).some(c => !c.ok && /KDP allows 4,000/.test(c.message)));
  assert.ok(checkDescription(doc('Hook.', 'Visit www.mysite.com')).some(c => /links/.test(c.message)));
  assert.ok(checkDescription(doc('Hook.', 'Only $0.99 this week!')).some(c => /prices/.test(c.message)));
  assert.ok(checkDescription(doc('Hook.', 'Please leave a review.')).some(c => /review/.test(c.message)));
  assert.ok(checkDescription(doc('Hook.', 'Today only.')).some(c => /time-limited/.test(c.message)));
});

test('keyword boxes: limit, banned words, wasted words, title repeats, duplicates', () => {
  const p = newProject(true);
  assert.equal(checkKeyword('small town second chance romance', p), null);
  assert.match(checkKeyword('x'.repeat(51), p)!, /limit is 50/);
  assert.match(checkKeyword('bestseller thriller', p)!, /doesn’t allow/);
  assert.match(checkKeyword('kindle unlimited romance', p)!, /doesn’t allow/);
  assert.match(checkKeyword('mystery books', p)!, /wasted/);
  assert.match(checkKeyword('paying attention', p)!, /title/);
  assert.deepEqual(keywordDuplicates(['a b', '', 'A B ', 'c']), [2]);
});

test('keyword ideas come from repeated phrases, leaving out character names', () => {
  const p = newProject();
  p.sections = [{ ...newSection('chapter', 'One'), document: textDocument(Array(4).fill('Mara walked to the lighthouse keeper. Mara saw the lighthouse keeper again by the stormy harbour. The stormy harbour was cold.').join('\n\n')) }];
  const { phrases } = keywordIdeas(p);
  assert.ok(phrases.includes('lighthouse keeper'));
  assert.ok(phrases.includes('stormy harbour'));
  assert.ok(!phrases.some(k => k.includes('mara')));
});

test('free sample keeps the first chapters and ends with a keep-reading page', () => {
  const p = newProject(true);
  p.publishing = { storeLinks: { amazon: 'https://example.com/book' } };
  const s = sampleEdition(p, 1);
  assert.deepEqual(s.sections.map(x => x.title), ['Dedication', 'A quieter kind of discovery', 'Keep reading']);
  assert.match(JSON.stringify(s.sections[2].document), /example\.com\/book/);
  assert.doesNotThrow(() => readProject(s));
});

test('listing is validated and drafted from the back cover', () => {
  const p = newProject(true);
  p.cover = { mode: 'design', style: 'classic', palette: 0, font: 'playfair-display', blurb: 'The hook line.\n\nThe rest of it.' };
  p.listing = { description: draftDescription(p), keywords: ['quiet essays'] };
  assert.doesNotThrow(() => readProject(p));
  assert.equal(descriptionHtml(p.listing.description), '<p><b>The hook line.</b></p><p>The rest of it.</p>');
  assert.match(listingKit(p), /Keywords:\n1\. quiet essays/);
  assert.equal(validListing({ description: { type: 'doc', content: [{ type: 'image' }] } }), false);
  assert.equal(validListing({ keywords: Array(8).fill('x') }), false);
});
