import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { newProject, documentHtml, documentText, readProject, projectWords, studioChecks } from '../lib/studio/model';
import { printHtml, studioEpub } from '../lib/studio/publication';
import { saveProject, listProjects, projectSnapshots } from '../lib/studio/store';

test('schema round-trip preserves sections, meaning, and design', () => {
  const p = newProject(true);
  assert.deepEqual(readProject(JSON.parse(JSON.stringify(p))), p);
  assert.ok(projectWords(p) > 200);
  assert.deepEqual(studioChecks(p), []);
  const content = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '<script> & text', marks: [{ type: 'bold' }] }] }] };
  assert.equal(documentHtml(content), '<p><strong>&lt;script&gt; &amp; text</strong></p>');
  assert.equal(documentText(content).trim(), '<script> & text');
});

test('invalid project formats and external image sources are rejected', () => {
  const p = newProject();
  assert.throws(() => readProject({ ...p, schemaVersion: 100 }));
  p.sections[0].document = { type: 'doc', content: [{ type: 'image', attrs: { src: 'https://external.example/private' } }] };
  assert.throws(() => readProject(p), /embedded PNG or JPEG/);
  const html = documentHtml({ type: 'text', text: 'click', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] });
  assert.equal(html, 'click');
});

test('print includes all sections, local fonts, measured contents, and trim settings', () => {
  const p = newProject(true); p.design.trim = 'a5';
  const html = printHtml(p);
  assert.ok(html.includes('148mm 210mm'));
  assert.ok(html.includes('target-counter'));
  assert.ok(html.includes('counter(page)'));
  assert.ok(html.includes('break-before:right'));
  assert.ok(html.includes('/fonts/serif.woff2'));
  p.sections.forEach(s => assert.ok(html.includes(s.title)));
  assert.ok(!html.includes('978-0-000000'));
});

test('EPUB packages every section and embedded images, without print pagination', async () => {
  const p = newProject(true);
  p.sections[1].document.content!.push({ type: 'image', attrs: { src: 'data:image/png;base64,iVBORw0KGgo=', alt: 'A descriptive image' } });
  const bytes = await (await studioEpub(p)).arrayBuffer();
  const zip = await JSZip.loadAsync(bytes);
  assert.equal(new DataView(bytes).getUint16(8, true), 0);
  assert.equal(await zip.file('mimetype')!.async('string'), 'application/epub+zip');
  const opf = await zip.file('EPUB/package.opf')!.async('string');
  assert.ok(opf.includes('images/image-1.png'));
  assert.ok(zip.file('EPUB/images/image-1.png'));
  for (let i = 0; i < p.sections.length; i++) {
    const html = await zip.file(`EPUB/section-${i}.xhtml`)!.async('string');
    assert.ok(html.includes(p.sections[i].title));
    assert.ok(!html.includes('data:image/'));
  }
  assert.ok((await zip.file('EPUB/section-1.xhtml')!.async('string')).includes('alt="A descriptive image"'));
});

test('IndexedDB commits documents and checkpoints atomically and rejects older revisions', async () => {
  const p = newProject(true); p.revision = 5;
  await saveProject(p, true);
  assert.ok((await listProjects()).some(book => book.id === p.id && book.revision === 5));
  assert.equal((await projectSnapshots(p.id)).length, 1);
  await assert.rejects(() => saveProject({ ...p, revision: 4, title: 'Stale' }), /newer revision/);
  assert.equal((await listProjects()).find(book => book.id === p.id)!.title, p.title);
  for (let i = 6; i < 18; i++) await saveProject({ ...p, revision: i }, true);
  assert.equal((await projectSnapshots(p.id)).length, 10);
});
