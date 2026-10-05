import test from 'node:test';
import assert from 'node:assert/strict';
import { autofix, ALL_FIXES } from '../lib/studio/autofix';
import { documentText, newProject, newSection, readProject, textDocument, type StudioProject } from '../lib/studio/model';

function messy(): StudioProject {
  const p = newProject();
  p.title = 'Messy';
  p.sections = [{ id: 'm', kind: 'chapter', title: 'Manuscript', document: textDocument([
    'THE LONG ROAD', 'by Ada Obi',
    'CHAPTER ONE: THE DEPARTURE',
    '   She said "it\'s late"  and left -- quickly...',
    '', '',
    '* * *',
    "'Twas the night. Rock 'n' roll in the '90s.",
    'Chapter 2',
    'The second   chapter begins here.',
    '***',
    'Part Two: Home',
    'CHAPTER 3 - RETURN',
    'Back again.',
    'Acknowledgments',
    'Thanks to everyone.',
    'DEDICATION',
    'For my mother.',
  ].join('\n\n')) }];
  return p;
}

test('autofix finds chapters, parts, front and back matter, and keeps every word', () => {
  const before = messy();
  const { project, report } = autofix(before);
  readProject(project);
  const kinds = project.sections.map(s => `${s.kind}:${s.title}`);
  assert.deepEqual(kinds, ['frontmatter:Front pages', 'frontmatter:Dedication', 'chapter:The Departure', 'chapter:Chapter 2', 'part:Home', 'chapter:Return', 'backmatter:Acknowledgments']);
  assert.equal(report.counts.chapters, 4);
  assert.ok(report.counts.matter >= 2);
  // the original is untouched
  assert.equal(before.sections.length, 1);
  const allText = project.sections.map(s => documentText(s.document)).join(' ');
  for (const w of ['late', 'quickly', 'second', 'Back again', 'Thanks to everyone', 'For my mother']) assert.ok(allText.includes(w), w);
});

test('typography: curly quotes, apostrophes, dashes, ellipses and spaces', () => {
  const { project } = autofix(messy());
  const ch = project.sections.find(s => s.title === 'The Departure')!;
  const text = documentText(ch.document);
  assert.match(text, /She said “it’s late” and left—quickly…/);
  assert.match(text, /’Twas the night\. Rock ’n’ roll in the ’90s\./);
  assert.ok(ch.document.content!.some(b => b.type === 'horizontalRule'), 'scene break');
  assert.ok(!ch.document.content!.some(b => b.type === 'paragraph' && !documentText(b).trim()), 'no empty lines');
});

test('each fix can be switched off', () => {
  const none = autofix(messy(), []);
  assert.equal(none.report.total, 0);
  assert.equal(none.project.sections.length, 1);
  const noQuotes = autofix(messy(), ALL_FIXES.filter(k => k !== 'quotes'));
  assert.equal(noQuotes.report.counts.quotes, 0);
  assert.match(noQuotes.project.sections.map(s => documentText(s.document)).join(' '), /"it's late"/);
});

test('a clean book stays the same', () => {
  const p = newProject(true);
  const { project, report } = autofix(p, ALL_FIXES.filter(k => k !== 'theme'));
  assert.equal(project.sections.length, p.sections.length);
  assert.equal(report.counts.chapters, 0);
  assert.equal(report.counts.matter, 0);
});

test('theme guess picks a genre only with clear evidence', () => {
  const p = newProject();
  p.sections = [{ id: 'a', kind: 'chapter', title: 'One', document: textDocument(Array(40).fill('The dragon circled the kingdom while the wizard raised his sword and spoke the prophecy of the throne.').join('\n\n')) }];
  assert.equal(autofix(p).report.theme, 'fantasy');
  const q = newProject(true);
  assert.equal(autofix(q).report.theme, undefined);
});

test('a title line above chapter one becomes the book title', () => {
  const p = newProject();
  p.title = 'draft-final';
  const doc = (t: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: t }] }] });
  p.sections = [{ ...newSection('chapter', 'Manuscript'), document: doc('THE LONG ROAD') }, { ...newSection('chapter', 'Chapter One'), document: doc('Words.') }];
  const { project } = autofix(p);
  assert.equal(project.title, 'The Long Road');
  assert.deepEqual(project.sections.map(s => s.title), ['Chapter One']);
});
