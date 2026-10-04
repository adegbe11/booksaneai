import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { newProject, readProject } from '../lib/studio/model';
import { printHtml } from '../lib/studio/publication';
import { FONT_IDS, THEMES, TRIM_IDS, chapterLabel, fontFaceCss, numberWords, resolveDesign, roman } from '../lib/studio/themes';

test('every theme and trim size composes a print document', () => {
  for (const theme of THEMES) {
    const p = newProject(true); p.design.theme = theme.id;
    const html = printHtml(p, false);
    assert.match(html, /<section class="book-section chapter"/);
    assert.ok(html.includes(`bk-${theme.body}`), `${theme.id} uses its text font`);
  }
  for (const trim of TRIM_IDS) { const p = newProject(true); p.design.trim = trim; assert.match(printHtml(p, false), /@page\{size:/); }
});

test('every font file the design system references exists on disk', () => {
  const urls = fontFaceCss(FONT_IDS).match(/\/fonts\/(?:lib\/)?[a-z0-9-]+\.woff2/g) || [];
  assert.ok(urls.length > 60);
  for (const url of urls) assert.ok(existsSync(path.join(process.cwd(), 'public', url)), url);
});

test('chapter labels read correctly', () => {
  assert.equal(numberWords(21), 'Twenty-One');
  assert.equal(numberWords(105), 'One Hundred Five');
  assert.equal(roman(14), 'XIV');
  assert.equal(chapterLabel('chapter-word', 3), 'Chapter Three');
  assert.equal(chapterLabel('none', 3), '');
});

test('overrides win over the theme and survive a project round trip', () => {
  const p = newProject(true);
  p.design = { ...p.design, theme: 'heritage', dropCap: 'none', headingFont: 'lora', largePrint: true, fontSize: 11 };
  const back = readProject(JSON.parse(JSON.stringify(p)));
  const d = resolveDesign(back.design);
  assert.equal(d.dropCap, 'none');
  assert.equal(d.heading, 'lora');
  assert.equal(d.sceneBreak, 'flourish');
  assert.equal(d.fontSize, 16, 'large print raises the type size');
});

test('unknown themes and override values are rejected', () => {
  const p = newProject(true);
  assert.throws(() => readProject({ ...p, design: { ...p.design, theme: 'nope' } }));
  assert.throws(() => readProject({ ...p, design: { ...p.design, dropCap: 'huge' } }));
  assert.throws(() => readProject({ ...p, design: { ...p.design, bodyFont: 'comic-sans' } }));
});

test('older projects with the original three themes still open', () => {
  for (const theme of ['literary', 'modern', 'editorial']) { const p = newProject(true); p.design.theme = theme; assert.doesNotThrow(() => readProject(p)); }
});
