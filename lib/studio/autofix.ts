// Automatic manuscript clean-up. Runs in the browser, no internet, no AI.
// Every fix belongs to a category; the author can switch any category off and Booksane
// re-runs the clean-up from the untouched original, so nothing is ever lost.
import { documentText, newSection, words, type DocumentNode, type SectionKind, type StudioProject, type StudioSection } from './model';
import { THEMES } from './themes';

export type FixKind = 'quotes' | 'dashes' | 'spaces' | 'blank' | 'scenes' | 'chapters' | 'titles' | 'matter' | 'theme';
export const FIX_LABELS: Record<FixKind, [string, string]> = {
  chapters: ['chapters found', 'chapter found'],
  matter: ['pages put in place', 'page put in place'],
  scenes: ['scene breaks', 'scene break'],
  quotes: ['quotes curled', 'quote curled'],
  dashes: ['dashes and ellipses fixed', 'dash or ellipsis fixed'],
  spaces: ['extra spaces removed', 'extra space removed'],
  blank: ['empty lines removed', 'empty line removed'],
  titles: ['chapter titles tidied', 'chapter title tidied'],
  theme: ['theme picked', 'theme picked'],
};
export const ALL_FIXES = Object.keys(FIX_LABELS) as FixKind[];

export interface FixReport { counts: Record<FixKind, number>; theme?: string; total: number }

const NUM_WORDS = 'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred';
const NUM = `(?:\\d{1,3}|[ivxlc]{1,7}|(?:${NUM_WORDS})(?:[\\s-](?:${NUM_WORDS}))*)`;
/** "Chapter 1", "CHAPTER ONE: The Road", "Ch. 12 - Home", "Prologue", "Part Two", "Epilogue". */
const CHAPTER_LINE = new RegExp(`^\\s*(?:(chapter|ch\\.?)\\s+${NUM}\\b\\s*(?:[:.\\-–—]\\s*)?(.*)|(prologue|epilogue|interlude)\\b\\s*(?:[:.\\-–—]\\s*)?(.*)|part\\s+${NUM}\\b\\s*(?:[:.\\-–—]\\s*)?(.*))$`, 'i');
const SCENE_LINE = /^\s*(?:(?:\*\s*){1,5}|(?:#\s*){1,5}|(?:~\s*){1,5}|(?:-\s*){3,}|(?:—\s*){1,3}|(?:•\s*){1,5}|(?:\+\s*){3,}|(?:o\s*){3}|§)\s*$/i;
const FRONT = /^(dedication|epigraph|foreword|preface|copyright|a note (?:to|for) (?:the )?readers?|author'?s note|note to (?:the )?reader|contents|table of contents)$/i;
const BACK = /^(acknowledge?ments?|about the authors?|also by .+|afterword|glossary|bibliography|references|endnotes|notes|appendix(?: [a-z0-9]+)?|resources|reading group guide|discussion questions|index)$/i;
const SKIP = /^(contents|table of contents|index)$/i; // Booksane builds these itself

const ELISION = /^(tis|twas|twere|twill|em|n|cause|cos|til|till|round|bout|cept|neath|ere)\b/i;
const emptyCounts = (): Record<FixKind, number> => Object.fromEntries(ALL_FIXES.map(k => [k, 0])) as Record<FixKind, number>;
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const plain = (node: DocumentNode) => documentText(node).replace(/\s+/g, ' ').trim();

function titleCase(s: string): string {
  const small = /^(a|an|and|as|at|but|by|for|in|nor|of|on|or|so|the|to|up|yet)$/i;
  return s.toLowerCase().split(/(\s+)/).map((w, i, all) => {
    if (/^\s+$/.test(w)) return w;
    const first = i === 0, last = i === all.length - 1;
    return !first && !last && small.test(w) ? w : w.replace(/^([^\p{L}]*)(\p{L})/u, (_, p, c) => p + c.toUpperCase());
  }).join('');
}
const isShouting = (s: string) => /\p{L}{2}/u.test(s) && s === s.toUpperCase() && s !== s.toLowerCase();

/** Typography on the text of one block, remembering the previous character across formatting runs. */
function fixText(node: DocumentNode, on: Set<FixKind>, counts: Record<FixKind, number>) {
  let prev = ' ';
  const visit = (n: DocumentNode) => {
    if (n.type === 'codeBlock') return;
    if (n.type === 'text' && typeof n.text === 'string' && !(n.marks || []).some(m => m.type === 'code')) {
      let t = n.text;
      if (on.has('dashes')) {
        t = t.replace(/(\S) ?-{2,3} ?(?=\S)/g, (_, a) => { counts.dashes++; return `${a}—`; })
          .replace(/\.{3}|\. \. \./g, () => { counts.dashes++; return '…'; });
      }
      if (on.has('spaces')) {
        t = t.replace(/\t+/g, () => { counts.spaces++; return ' '; })
          .replace(/ {2,}/g, () => { counts.spaces++; return ' '; })
          .replace(/ +([,.;:!?…])(?=\s|$)/g, (_, p) => { counts.spaces++; return p; });
      }
      if (on.has('quotes')) {
        let out = '';
        for (let i = 0; i < t.length; i++) {
          const c = t[i], before = i ? t[i - 1] : prev, after = t[i + 1] ?? '';
          if (c === '"') { counts.quotes++; out += /[\s([{—–-]/.test(before) || before === '' ? '“' : '”'; }
          else if (c === "'") {
            counts.quotes++;
            if (/\p{L}|\d/u.test(before) && /\p{L}/u.test(after)) out += '’'; // don't, it's
            else if (/[\s([{—–-]/.test(before)) out += /\d/.test(after) || ELISION.test(t.slice(i + 1)) ? '’' : '‘'; // '90s, 'twas, 'n'
            else out += '’';
          } else out += c;
        }
        t = out;
      }
      n.text = t;
      if (t) prev = t[t.length - 1];
      return;
    }
    (n.content || []).forEach(visit);
  };
  visit(node);
  // leading and trailing spaces in a paragraph
  if (on.has('spaces') && node.content?.length) {
    const first = node.content[0], last = node.content[node.content.length - 1];
    if (first.type === 'text' && /^\s+/.test(first.text || '')) { first.text = first.text!.replace(/^\s+/, ''); counts.spaces++; }
    if (last.type === 'text' && /\s+$/.test(last.text || '')) { last.text = last.text!.replace(/\s+$/, ''); counts.spaces++; }
    node.content = node.content.filter(c => c.type !== 'text' || c.text);
  }
}

function blockFixes(doc: DocumentNode, on: Set<FixKind>, counts: Record<FixKind, number>): DocumentNode {
  const out: DocumentNode[] = [];
  for (const block of doc.content || []) {
    const text = plain(block);
    if (block.type === 'paragraph' && on.has('scenes') && SCENE_LINE.test(text) && text) { counts.scenes++; out.push({ type: 'horizontalRule' }); continue; }
    if (block.type === 'paragraph' && on.has('blank') && !text && !(block.content || []).some(c => c.type === 'image' || c.type === 'footnote')) { counts.blank++; continue; }
    if (['paragraph', 'heading', 'listItem', 'blockquote', 'callout', 'table', 'bulletList', 'orderedList'].includes(block.type || '')) {
      if (block.type === 'paragraph' || block.type === 'heading') fixText(block, on, counts);
      else (block.content || []).forEach(function walk(c: DocumentNode) { if (c.type === 'paragraph' || c.type === 'heading') fixText(c, on, counts); else (c.content || []).forEach(walk); });
    }
    out.push(block);
  }
  // no doubled scene breaks, none at the very start or end
  const clean = out.filter((b, i, all) => !(b.type === 'horizontalRule' && (i === 0 || i === all.length - 1 || all[i - 1].type === 'horizontalRule')));
  return { ...doc, content: clean.length ? clean : [{ type: 'paragraph' }] };
}

/** Splits sections wherever a paragraph or heading reads like a chapter line. */
function splitChapters(sections: StudioSection[], counts: Record<FixKind, number>): StudioSection[] {
  const result: StudioSection[] = [];
  for (const s of sections) {
    if (s.kind !== 'chapter') { result.push(s); continue; }
    const blocks = s.document.content || [];
    let current: StudioSection = { ...s, document: { type: 'doc', content: [] } };
    let found = 0;
    let found_before = false;
    for (const block of blocks) {
      const text = plain(block);
      const short = text.length > 0 && text.length <= 90 && (block.type === 'heading' || block.type === 'paragraph');
      const matterName = text.replace(/[.:]$/, '');
      const matter = short && !SKIP.test(matterName) && (FRONT.test(matterName) || BACK.test(matterName));
      const m = short ? text.match(CHAPTER_LINE) : null;
      if (m || matter) {
        found++;
        if (current.kind === 'part' || (current.document.content || []).some(b => plain(b) || b.type === 'image')) {
          // Words before the first chapter of an untitled import are front pages (title, copyright, and so on).
          if (!found_before && /^manuscript$/i.test(current.title)) current = { ...current, kind: 'frontmatter', title: 'Front pages' };
          result.push(current);
        }
        found_before = true;
        const kind: SectionKind = matter ? (FRONT.test(matterName) ? 'frontmatter' : 'backmatter') : /^part\b/i.test(text) ? 'part' : 'chapter';
        current = { ...newSection(kind, matter ? titleCase(matterName) : text), document: { type: 'doc', content: [] } };
        if (matter) { counts.matter++; found--; continue; }
        continue;
      }
      current.document.content!.push(block);
    }
    if ((current.document.content || []).length === 0) current.document.content = [{ type: 'paragraph' }];
    result.push(current);
    counts.chapters += found;
  }
  return result;
}

/**
 * An untitled "Manuscript" section before the first chapter holds whatever came above Chapter 1.
 * A lone short line there is the book's title; anything longer becomes the front pages.
 */
function leadingPages(p: StudioProject, sections: StudioSection[], counts: Record<FixKind, number>): StudioSection[] {
  const [first, ...rest] = sections;
  if (!first || first.kind !== 'chapter' || !/^manuscript$/i.test(first.title) || !rest.some(s => s.kind === 'chapter')) return sections;
  const lines = (first.document.content || []).map(plain).filter(Boolean);
  counts.matter++;
  if (lines.length === 1 && lines[0].split(/\s+/).length <= 10) { const t = lines[0].replace(/[.:]$/, ''); p.title = isShouting(t) ? titleCase(t) : t; return rest; }
  return [{ ...first, kind: 'frontmatter', title: 'Front pages' }, ...rest];
}

/** Turns "Chapter 3: The Road" into "The Road" (the theme prints the label) and quiets ALL CAPS. */
function tidyTitle(s: StudioSection, counts: Record<FixKind, number>): StudioSection {
  let t = s.title.trim().replace(/\s+/g, ' ');
  const m = t.match(CHAPTER_LINE);
  const rest = m ? (m[2] ?? m[4] ?? m[5] ?? '').trim() : '';
  if (m && rest && s.kind === 'chapter' && !m[3]) t = rest;
  if (m && rest && s.kind === 'part') t = rest;
  if (isShouting(t)) t = titleCase(t);
  if (t !== s.title) counts.titles++;
  return { ...s, title: t || s.title };
}

/** Puts front matter first and back matter last, removing hand-made contents pages. */
function placeMatter(sections: StudioSection[], counts: Record<FixKind, number>): StudioSection[] {
  const placed = sections.flatMap(s => {
    const name = s.title.trim().replace(/[.:]$/, '');
    if (SKIP.test(name) && s.kind !== 'part') { counts.matter++; return []; }
    if (FRONT.test(name) && s.kind !== 'frontmatter') { counts.matter++; return [{ ...s, kind: 'frontmatter' as const }]; }
    if (BACK.test(name) && s.kind !== 'backmatter') { counts.matter++; return [{ ...s, kind: 'backmatter' as const }]; }
    return [s];
  });
  const rank = (k: SectionKind) => (k === 'frontmatter' ? 0 : k === 'backmatter' ? 2 : 1);
  return placed.map((s, i) => [s, i] as const).sort((a, b) => rank(a[0].kind) - rank(b[0].kind) || a[1] - b[1]).map(([s]) => s);
}

const GENRES: [string, RegExp][] = [
  ['romance', /\b(kiss(?:ed|es)?|heart (?:raced|pounded)|his lips|her lips|love you|wedding|desire)\b/gi],
  ['thriller', /\b(gun|bullet|detective|murder(?:ed)?|killer|police|agent|bomb|chase|blood)\b/gi],
  ['fantasy', /\b(dragon|sword|magic|kingdom|spell|wizard|elves?|realm|prophecy|throne)\b/gi],
  ['sci-fi', /\b(spaceship|planet|galaxy|android|robot|starship|orbit|alien|laser|quantum)\b/gi],
  ['mystery', /\b(clue|suspect|alibi|inspector|mystery|crime scene|whodunit)\b/gi],
  ['gothic', /\b(ghost|haunted|grave|shadows?|candlelight|crypt|vampire|curse)\b/gi],
  ['devotional', /\b(god|lord|jesus|prayer|pray|scripture|faith|holy spirit|amen|psalm)\b/gi],
  ['business', /\b(customers?|revenue|strategy|leadership|market(?:ing)?|startup|profit|team|growth)\b/gi],
  ['self-help', /\b(habits?|mindset|goals?|you can|your life|confidence|anxiety|motivation)\b/gi],
  ['memoir', /\b(my mother|my father|i remember|when i was|my childhood|grandmother)\b/gi],
];
/** A best guess from word counts. Only used when the book is still on the default theme. */
export function guessTheme(project: StudioProject): string | undefined {
  const sample = project.sections.map(s => documentText(s.document)).join(' ').slice(0, 200000);
  const total = Math.max(1, words(sample));
  const scores = GENRES.map(([id, re]) => [id, (sample.match(re) || []).length / total * 1000] as const).sort((a, b) => b[1] - a[1]);
  const [best, second] = scores;
  // Needs real evidence and a clear winner; otherwise the author keeps the default.
  return best[1] >= 6 && best[1] >= second[1] * 2 && THEMES.some(t => t.id === best[0]) ? best[0] : undefined;
}

/** Cleans a manuscript. Pure: returns a new project and leaves the original untouched. */
export function autofix(original: StudioProject, enabled: Iterable<FixKind> = ALL_FIXES): { project: StudioProject; report: FixReport } {
  const on = new Set(enabled);
  const counts = emptyCounts();
  const p = clone(original);
  let sections = p.sections;
  if (on.has('chapters')) sections = splitChapters(sections, counts);
  if (on.has('matter')) sections = leadingPages(p, sections, counts);
  sections = sections.map(s => ({ ...s, document: blockFixes(s.document, on, counts) }));
  if (on.has('titles')) sections = sections.map(s => tidyTitle(s, counts));
  if (on.has('matter')) sections = placeMatter(sections, counts);
  // drop sections that ended up completely empty (but keep at least one chapter)
  const kept = sections.filter(s => s.kind === 'part' || plain(s.document) || (s.document.content || []).some(b => b.type === 'image'));
  p.sections = kept.some(s => s.kind === 'chapter') ? kept : sections;
  let theme: string | undefined;
  if (on.has('theme') && original.design.theme === 'literary') {
    theme = guessTheme(p);
    if (theme) { p.design = { ...p.design, theme }; counts.theme = 1; }
  }
  return { project: p, report: { counts, theme, total: ALL_FIXES.reduce((n, k) => n + counts[k], 0) } };
}

/** The book's likely genre for store keywords, with a looser bar than the theme guess. */
export function bookGenre(project: StudioProject): string | undefined {
  const sample = project.sections.map(s => documentText(s.document)).join(' ').slice(0, 200000);
  const total = Math.max(1, words(sample));
  const [best, second] = GENRES.map(([id, re]) => [id, (sample.match(re) || []).length / total * 1000] as const).sort((a, b) => b[1] - a[1]);
  return best[1] >= 2 && best[1] >= second[1] * 1.5 ? best[0] : undefined;
}
