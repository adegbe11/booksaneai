// Print proof check: the checks Amazon KDP and IngramSpark run when you upload a paperback,
// run here first on the real laid-out pages and the cover, so the files are not rejected.
import { documentText, type StudioProject } from './model';
import { BLEED, isbnDigits, PRINTERS, wrapGeometry, type Printer } from './cover';
import { TRIMS, trimInches, type TrimId } from './themes';

export type Level = 'pass' | 'warn' | 'fail';
export type Fix = 'endpage' | 'gutter' | 'cover' | 'author' | 'isbn' | 'trim';
export interface ProofItem { area: 'interior' | 'cover'; level: Level; title: string; detail?: string; pages?: number[]; sectionId?: string; fix?: Fix }

/** What the page engine actually produced. Pages are numbered from 1 as in the PDF. */
export interface LayoutFacts {
  pages: number;
  blank: number[];
  overflow: number[];
  images: { page: number; width: number; height: number; shownWidth: number; colour: boolean }[];
}

/**
 * Printer rules, from KDP Help (paperback trim and margins, submission guidelines, cover, barcode)
 * and the IngramSpark File Creation Guide. Neither printer publishes a numeric blank-page limit.
 */
export const RULES: Record<Printer, {
  trims: TrimId[]; custom: TrimId[]; noCream?: TrimId[]; minPages: number; maxPages: (trim: TrimId, paper: 'white' | 'cream') => number;
  gutter: (pages: number) => number; outside: number; dpi: number; minFont: number; needsIsbn: boolean; pdfx: boolean; lastPageBlank: boolean;
}> = {
  kdp: {
    trims: ['5x8', '5.06x7.81', '5.25x8', '5.5x8.5', '6x9', '6.14x9.21', '6.69x9.61', '7x10', '7.44x9.69', '7.5x9.25', '8x10', '8.25x8.25', '8.5x8.5', '8.5x11', 'a4'],
    custom: ['4.25x6.87', 'a5', 'b5'],
    minPages: 24,
    maxPages: (trim, paper) => {
      const cream = paper === 'cream';
      if (trim === '8.25x8.25') return cream ? 750 : 800;
      if (trim === '8.5x8.5' || trim === '8.5x11') return cream ? 550 : 590;
      if (trim === 'a4') return cream ? 730 : 780;
      return cream ? 776 : 828;
    },
    gutter: p => (p <= 150 ? 0.375 : p <= 300 ? 0.5 : p <= 500 ? 0.625 : p <= 700 ? 0.75 : 0.875),
    outside: 0.25, dpi: 300, minFont: 7, needsIsbn: false, pdfx: false, lastPageBlank: false,
  },
  ingram: {
    trims: ['5x8', '5.06x7.81', '5.25x8', '5.5x8.5', '6x9', '6.14x9.21', '6.69x9.61', '7x10', '7.44x9.69', '7.5x9.25', '8x10', '8.5x8.5', '8.5x11', 'a5', 'a4'],
    custom: ['4.25x6.87', '8.25x8.25', 'b5'],
    noCream: ['8.25x8.25', 'b5'],
    minPages: 18,
    maxPages: (_trim, paper) => (paper === 'cream' ? 1050 : 1200),
    gutter: () => 0.5,
    outside: 0.5, dpi: 300, minFont: 7, needsIsbn: true, pdfx: true, lastPageBlank: true,
  },
};

const PLACEHOLDER = /\b(lorem ipsum|dolor sit amet)\b|\b(TK|TKTK|XXX+|TODO|FIXME|TBD)\b|\[(insert|add|placeholder|citation needed|chapter title|author name)[^\]]*\]/;

function placeholders(project: StudioProject): { sectionId: string; title: string; match: string }[] {
  const out: { sectionId: string; title: string; match: string }[] = [];
  for (const s of project.sections) {
    const m = (documentText(s.document) + '\n' + s.title).match(PLACEHOLDER);
    if (m) out.push({ sectionId: s.id, title: s.title, match: m[0] });
  }
  return out;
}

/** Runs of consecutive blank pages: [first page, length]. */
export function blankRuns(blank: number[]): [number, number][] {
  const runs: [number, number][] = [];
  for (const p of [...blank].sort((a, b) => a - b)) {
    const last = runs[runs.length - 1];
    if (last && last[0] + last[1] === p) last[1]++; else runs.push([p, 1]);
  }
  return runs;
}

export interface CoverFacts { mode: 'design' | 'upload' | 'none'; width?: number; height?: number }

export function proofCheck(project: StudioProject, facts: LayoutFacts, printer: Printer, cover: CoverFacts, opts: { pdfx?: boolean } = {}): ProofItem[] {
  const r = RULES[printer];
  const items: ProofItem[] = [];
  const name = PRINTERS[printer].name;
  const paper = project.publishing?.paper || 'white';
  const trim = project.design.trim;
  const pages = facts.pages + (facts.pages % 2);
  const add = (i: ProofItem) => items.push(i);

  // ── Interior ──
  const label = TRIMS[trim].label;
  if (paper === 'cream' && r.noCream?.includes(trim)) add({ area: 'interior', level: 'fail', title: `${name} doesn’t print ${label} on cream paper`, detail: 'Choose white paper or another size.', fix: 'trim' });
  else if (r.trims.includes(trim)) add({ area: 'interior', level: 'pass', title: `${name} prints ${label}` });
  else if (r.custom.includes(trim)) add({ area: 'interior', level: 'warn', title: `${label} is a custom size at ${name}`, detail: 'Choose “custom trim size” when you set up the book.' });
  else add({ area: 'interior', level: 'fail', title: `${name} doesn’t print ${label}`, detail: 'Pick another trim size in Design.', fix: 'trim' });

  const max = r.maxPages(trim, paper);
  if (pages < r.minPages) add({ area: 'interior', level: 'fail', title: `${pages} pages is too short`, detail: `${name} needs at least ${r.minPages} pages.` });
  else if (pages > max) add({ area: 'interior', level: 'fail', title: `${pages} pages is too long`, detail: `${name} prints up to ${max} pages on ${paper} paper at this size.` });
  else add({ area: 'interior', level: 'pass', title: `${pages} pages` });

  const gutter = project.design.gutter ?? 0.75;
  const need = r.gutter(pages);
  add(gutter + 1e-9 >= need
    ? { area: 'interior', level: 'pass', title: 'Inside margin is wide enough', detail: `${gutter} in · ${name} needs ${need} in at ${pages} pages.` }
    : { area: 'interior', level: 'fail', title: 'Inside margin is too narrow', detail: `${name} needs ${need} in at ${pages} pages; yours is ${gutter} in.`, fix: 'gutter' });
  add(0.65 >= r.outside ? { area: 'interior', level: 'pass', title: 'Outside margins are clear' } : { area: 'interior', level: 'warn', title: 'Outside margins are tight', detail: `${name} asks for ${r.outside} in.` });

  add(facts.overflow.length
    ? { area: 'interior', level: 'fail', title: 'Something runs into the margin', detail: 'Usually a long link, a wide table or an image.', pages: facts.overflow }
    : { area: 'interior', level: 'pass', title: 'Nothing runs into the margins' });

  const runs = blankRuns(facts.blank).filter(([start, len]) => start + len - 1 < facts.pages);
  const long = runs.filter(([, len]) => len >= 3);
  add(long.length
    ? { area: 'interior', level: 'warn', title: 'Several blank pages in a row', detail: `${name} can reject “excessive blank pages”.`, pages: long.map(([start]) => start) }
    : { area: 'interior', level: 'pass', title: 'No long runs of blank pages' });
  if (r.lastPageBlank && !facts.blank.includes(facts.pages)) add({ area: 'interior', level: 'warn', title: 'Last page has words on it', detail: `${name} prints its details on the last page. Leave it blank.`, pages: [facts.pages], fix: 'endpage' });
  if (r.pdfx) add(opts.pdfx ? { area: 'interior', level: 'pass', title: 'PDF/X-1a file available', detail: 'Download it from Export.' } : { area: 'interior', level: 'warn', title: `${name} asks for a PDF/X-1a file`, detail: 'Convert the PDF with Acrobat or a free PDF/X tool before upload.' });

  const soft = facts.images.filter(i => i.width / i.shownWidth < r.dpi);
  add(!facts.images.length ? { area: 'interior', level: 'pass', title: 'No images to check' }
    : soft.length ? { area: 'interior', level: 'warn', title: `${soft.length} ${soft.length === 1 ? 'image prints' : 'images print'} below ${r.dpi} DPI`, detail: 'They may look soft. Use bigger images.', pages: [...new Set(soft.map(i => i.page))] }
    : { area: 'interior', level: 'pass', title: `Images are ${r.dpi} DPI or sharper` });
  const colour = facts.images.filter(i => i.colour);
  if (colour.length) add({ area: 'interior', level: 'warn', title: `${colour.length} colour ${colour.length === 1 ? 'image prints' : 'images print'} in black and white`, detail: 'Unless you choose colour ink.', pages: [...new Set(colour.map(i => i.page))] });

  const smallest = Math.min(8, Math.max(7, project.design.fontSize * 0.78));
  add(smallest >= r.minFont ? { area: 'interior', level: 'pass', title: `Smallest text is ${smallest.toFixed(1)} pt` } : { area: 'interior', level: 'fail', title: 'Some text is smaller than 7 pt' });

  const holes = placeholders(project);
  if (holes.length) holes.slice(0, 4).forEach(h => add({ area: 'interior', level: 'fail', title: `Placeholder text in “${h.title}”`, detail: `“${h.match}”`, sectionId: h.sectionId }));
  else add({ area: 'interior', level: 'pass', title: 'No placeholder text' });

  if (!project.author.trim()) add({ area: 'interior', level: 'fail', title: 'Add an author name', fix: 'author' });
  const titleLen = (project.title + project.subtitle).length;
  if (titleLen > 200) add({ area: 'interior', level: 'fail', title: 'Title and subtitle are too long', detail: `Stores allow 200 characters; yours is ${titleLen}.` });
  add({ area: 'interior', level: 'pass', title: 'Fonts are built into the PDF' });

  // ── Cover ──
  const g = wrapGeometry(trim, facts.pages, paper, printer);
  if (cover.mode === 'none') add({ area: 'cover', level: 'fail', title: 'No cover yet', detail: 'Make one or upload yours in Cover.', fix: 'cover' });
  else {
    add({ area: 'cover', level: 'pass', title: `Cover is ${g.width.toFixed(3)} × ${g.height.toFixed(3)} in`, detail: `Spine ${g.spine.toFixed(3)} in for ${g.pages} pages on ${paper} paper, ${BLEED} in bleed.` });
    add(g.spineText ? { area: 'cover', level: 'pass', title: 'Spine text fits' } : { area: 'cover', level: 'pass', title: 'Spine left blank', detail: `${name} allows spine text from ${PRINTERS[printer].spineText} pages.` });
    if (cover.mode === 'upload' && cover.width && cover.height) {
      const [w, h] = trimInches(trim);
      const needW = Math.ceil((w + BLEED) * r.dpi), needH = Math.ceil((h + BLEED * 2) * r.dpi);
      add(cover.width >= needW && cover.height >= needH
        ? { area: 'cover', level: 'pass', title: `Front image is sharp at ${r.dpi} DPI` }
        : { area: 'cover', level: 'warn', title: `Front image is below ${r.dpi} DPI`, detail: `Use at least ${needW} × ${needH} px.` });
      add({ area: 'cover', level: 'warn', title: 'Check your cover shows the same title and author', detail: `${project.title} · ${project.author || 'no author'}` });
    } else add({ area: 'cover', level: 'pass', title: 'Title and author match the book' });
    add({ area: 'cover', level: 'pass', title: 'Text stays inside the safe area' });
  }
  const isbn = isbnDigits(project.cover?.isbn);
  if (project.cover?.isbn && !isbn) add({ area: 'cover', level: 'fail', title: 'That ISBN is not valid', fix: 'isbn' });
  else if (isbn) add({ area: 'cover', level: 'pass', title: 'ISBN barcode is on the back' });
  else if (r.needsIsbn) add({ area: 'cover', level: 'fail', title: `${name} needs an ISBN barcode`, detail: 'Add your ISBN in Cover.', fix: 'isbn' });
  else add({ area: 'cover', level: 'pass', title: 'Barcode space left clear', detail: `${name} adds a barcode there for you.` });
  return items;
}

// ── Reading the laid-out pages (browser only) ──

function isColour(img: HTMLImageElement): boolean {
  try {
    const c = img.ownerDocument.createElement('canvas'); c.width = 32; c.height = 32;
    const x = c.getContext('2d', { willReadFrequently: true }); if (!x) return false;
    x.drawImage(img, 0, 0, 32, 32);
    const d = x.getImageData(0, 0, 32, 32).data;
    let sat = 0;
    for (let i = 0; i < d.length; i += 4) { const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]); sat += mx ? (mx - mn) / mx : 0; }
    return sat / (d.length / 4) > 0.12;
  } catch { return false; }
}

/** Inspects the Paged.js output: blank pages, content past the page edges, and every image's printed size. */
export function inspectLayout(doc: Document): LayoutFacts {
  const pages = [...doc.querySelectorAll<HTMLElement>('.pagedjs_page')];
  const blank: number[] = [];
  const overflow: number[] = [];
  const images: LayoutFacts['images'] = [];
  const win = doc.defaultView;
  pages.forEach((page, i) => {
    const n = i + 1;
    const content = page.querySelector<HTMLElement>('.pagedjs_page_content');
    if (!content) return;
    if (page.classList.contains('pagedjs_blank_page') || (!content.textContent?.trim() && !content.querySelector('img'))) blank.push(n);
    const box = content.getBoundingClientRect();
    const scale = box.width / (content.offsetWidth || box.width);
    let over = false;
    content.querySelectorAll<HTMLElement>('p, li, h1, h2, h3, table, pre, img, blockquote, aside, a').forEach(el => {
      if (over) return;
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > box.right + 2 || r.left < box.left - 2)) over = true;
      else if (el.scrollWidth > el.clientWidth + 2 && win?.getComputedStyle(el).overflowX !== 'visible') over = true;
      else if (el.tagName === 'P' && el.scrollWidth > el.clientWidth + 2) over = true;
    });
    if (over) overflow.push(n);
    content.querySelectorAll('img').forEach(img => {
      const shown = img.getBoundingClientRect().width / scale / 96;
      if (shown > 0 && img.naturalWidth) images.push({ page: n, width: img.naturalWidth, height: img.naturalHeight, shownWidth: shown, colour: isColour(img) });
    });
  });
  return { pages: pages.length, blank, overflow, images };
}

