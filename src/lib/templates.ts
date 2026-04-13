import type { Template } from '@/types';

// ─────────────────────────────────────────
//  8 AWARD-WINNING BOOK TEMPLATES
//  Each named after a legendary publisher.
//  Every font pair, margin, drop cap, and
//  ornament chosen to beat Vellum and every
//  other formatting tool on the market.
// ─────────────────────────────────────────

export const templates: Template[] = [

  // ── 1. KNOPF ─────────────────────────────────────────────────────
  // Alfred A. Knopf: Toni Morrison, Cormac McCarthy, John Updike.
  // The gold standard of literary publishing. Cream paper, Garamond
  // body, Cormorant Garamond display — timeless, unhurried prestige.
  {
    id: 'knopf',
    name: 'Knopf',
    category: 'fiction',
    description: 'Literary gold standard. Cormorant Garamond meets EB Garamond on warm cream.',
    previewColor: '#FAF7F2',
    previewAccent: '#8B6914',

    bodyFont: "'EB Garamond', Georgia, serif",
    headingFont: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    bodySize: '11.5pt',
    headingSize: '22pt',
    lineHeight: '1.65',

    paragraphStyle: 'indent',
    textIndent: '1.5em',
    paragraphSpacing: '0',

    headingAlign: 'center',
    headingWeight: '400',
    headingTransform: 'none',
    chapterNumberStyle: 'spelled',
    chapterNumberSize: '12pt',

    paperColor: '#FAF7F2',
    inkColor: '#1A1208',
    headingColor: '#1A1208',
    accentColor: '#8B6914',

    pageMarginH: '0.875in',
    pageMarginV: '0.875in',
    chapterStartMargin: '33%',

    pageSize: 'trade',
    showPageNumbers: true,
    pageNumberAlign: 'outer',

    dropCap: true,
    ornament: `<div style="text-align:center;padding:1em 0;color:[ACCENT];font-size:1.1em;line-height:1;">❧</div>`,
  },

  // ── 2. SCRIBNER ──────────────────────────────────────────────────
  // Scribner: Hemingway, Fitzgerald, Stephen King, Don DeLillo.
  // Warm authority. Lora body pairs with Playfair Display headers —
  // commercial but refined, every sentence feels important.
  {
    id: 'scribner',
    name: 'Scribner',
    category: 'fiction',
    description: 'Warm authority. Playfair Display headings over a Lora body on ivory paper.',
    previewColor: '#FDFBF7',
    previewAccent: '#2C4A2E',

    bodyFont: "'Lora', Georgia, serif",
    headingFont: "'Playfair Display', Georgia, serif",
    bodySize: '11pt',
    headingSize: '20pt',
    lineHeight: '1.7',

    paragraphStyle: 'indent',
    textIndent: '1.4em',
    paragraphSpacing: '0',

    headingAlign: 'center',
    headingWeight: '700',
    headingTransform: 'none',
    chapterNumberStyle: 'roman',
    chapterNumberSize: '11pt',

    paperColor: '#FDFBF7',
    inkColor: '#1C150E',
    headingColor: '#1C150E',
    accentColor: '#2C4A2E',

    pageMarginH: '0.875in',
    pageMarginV: '0.875in',
    chapterStartMargin: '33%',

    pageSize: 'trade',
    showPageNumbers: true,
    pageNumberAlign: 'outer',

    dropCap: true,
    ornament: `<div style="text-align:center;padding:1em 0;color:[ACCENT];font-size:0.7em;letter-spacing:0.5em;">✦ &nbsp; ✦ &nbsp; ✦</div>`,
  },

  // ── 3. TOR ───────────────────────────────────────────────────────
  // Tor Books: Wheel of Time, Name of the Wind, Mistborn, LOTR.
  // Epic and ancient-feeling. Cinzel's all-cap majesty over
  // EB Garamond body — every page feels carved in stone.
  {
    id: 'tor',
    name: 'Tor',
    category: 'fiction',
    description: 'Epic fantasy & sci-fi. Cinzel headings with EB Garamond on parchment.',
    previewColor: '#F5F2EC',
    previewAccent: '#7A4F1E',

    bodyFont: "'EB Garamond', Georgia, serif",
    headingFont: "'Cinzel', 'Palatino Linotype', Georgia, serif",
    bodySize: '11.5pt',
    headingSize: '14pt',
    lineHeight: '1.65',

    paragraphStyle: 'indent',
    textIndent: '1.5em',
    paragraphSpacing: '0',

    headingAlign: 'center',
    headingWeight: '600',
    headingTransform: 'uppercase',
    chapterNumberStyle: 'numeral',
    chapterNumberSize: '32pt',

    paperColor: '#F5F2EC',
    inkColor: '#0E0C0A',
    headingColor: '#0E0C0A',
    accentColor: '#7A4F1E',

    pageMarginH: '0.875in',
    pageMarginV: '0.875in',
    chapterStartMargin: '33%',

    pageSize: 'trade',
    showPageNumbers: true,
    pageNumberAlign: 'outer',

    dropCap: true,
    ornament: `<div style="display:flex;align-items:center;justify-content:center;gap:6px;padding:1em 0;"><div style="width:24px;height:1px;background:[ACCENT];opacity:0.7;"></div><span style="color:[ACCENT];font-size:0.55em;font-family:'Cinzel',serif;">◆</span><div style="width:24px;height:1px;background:[ACCENT];opacity:0.7;"></div></div>`,
  },

  // ── 4. BALLANTINE ─────────────────────────────────────────────────
  // Ballantine Books: Diana Gabaldon (Outlander), Nora Roberts.
  // Romantic, lush, passionate. Playfair Display in deep rose —
  // italic chapter numbers, florid drop caps, everything feels felt.
  {
    id: 'ballantine',
    name: 'Ballantine',
    category: 'fiction',
    description: 'Romance perfected. Playfair italic headers over Lora on blush-cream paper.',
    previewColor: '#FFF7F5',
    previewAccent: '#9B2335',

    bodyFont: "'Lora', Georgia, serif",
    headingFont: "'Playfair Display', Georgia, serif",
    bodySize: '12pt',
    headingSize: '22pt',
    lineHeight: '1.72',

    paragraphStyle: 'indent',
    textIndent: '1.5em',
    paragraphSpacing: '0',

    headingAlign: 'center',
    headingWeight: '400',
    headingTransform: 'none',
    chapterNumberStyle: 'roman',
    chapterNumberSize: '11pt',

    paperColor: '#FFF7F5',
    inkColor: '#1A080A',
    headingColor: '#9B2335',
    accentColor: '#9B2335',

    pageMarginH: '0.875in',
    pageMarginV: '0.875in',
    chapterStartMargin: '33%',

    pageSize: 'mass',
    showPageNumbers: true,
    pageNumberAlign: 'center',

    dropCap: true,
    ornament: `<div style="text-align:center;padding:1em 0;color:[ACCENT];font-size:1.3em;line-height:1;">❧</div>`,
  },

  // ── 5. VINTAGE ───────────────────────────────────────────────────
  // Vintage Books / Anchor: Nabokov, Didion, Cormac McCarthy.
  // Literary indie austerity. Josefin Sans Light uppercase headers
  // over Libre Baskerville body — spare, rigorous, unmistakably cool.
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'fiction',
    description: 'Literary cool. Josefin Sans Light headings over Libre Baskerville on white.',
    previewColor: '#FFFFFF',
    previewAccent: '#444444',

    bodyFont: "'Libre Baskerville', Georgia, serif",
    headingFont: "'Josefin Sans', 'Raleway', sans-serif",
    bodySize: '10.5pt',
    headingSize: '11pt',
    lineHeight: '1.75',

    paragraphStyle: 'indent',
    textIndent: '1.3em',
    paragraphSpacing: '0',

    headingAlign: 'left',
    headingWeight: '300',
    headingTransform: 'uppercase',
    chapterNumberStyle: 'spelled',
    chapterNumberSize: '11pt',

    paperColor: '#FFFFFF',
    inkColor: '#111111',
    headingColor: '#111111',
    accentColor: '#444444',

    pageMarginH: '1in',
    pageMarginV: '1in',
    chapterStartMargin: '33%',

    pageSize: 'trade',
    showPageNumbers: true,
    pageNumberAlign: 'outer',

    dropCap: false,
    ornament: `<div style="padding:1em 0;display:flex;align-items:center;justify-content:${`center`};"><div style="width:36px;height:1px;background:[ACCENT];opacity:0.4;"></div></div>`,
  },

  // ── 6. PENGUIN MODERN ────────────────────────────────────────────
  // Penguin Modern Classics: Orwell, Kafka, Woolf, Borges.
  // Contemporary literary authority. Raleway Light display headers,
  // Libre Baskerville body — and a flash of Penguin orange.
  {
    id: 'penguin',
    name: 'Penguin Modern',
    category: 'fiction',
    description: 'Contemporary literary. Raleway Light display over Libre Baskerville, orange accent.',
    previewColor: '#FFFFFF',
    previewAccent: '#E05000',

    bodyFont: "'Libre Baskerville', Georgia, serif",
    headingFont: "'Raleway', 'Inter', sans-serif",
    bodySize: '11pt',
    headingSize: '28pt',
    lineHeight: '1.7',

    paragraphStyle: 'indent',
    textIndent: '1.4em',
    paragraphSpacing: '0',

    headingAlign: 'left',
    headingWeight: '200',
    headingTransform: 'none',
    chapterNumberStyle: 'numeral',
    chapterNumberSize: '52pt',

    paperColor: '#FFFFFF',
    inkColor: '#0A0A0A',
    headingColor: '#0A0A0A',
    accentColor: '#E05000',

    pageMarginH: '1in',
    pageMarginV: '1in',
    chapterStartMargin: '30%',

    pageSize: 'trade',
    showPageNumbers: true,
    pageNumberAlign: 'outer',

    dropCap: true,
    ornament: `<div style="text-align:center;padding:1em 0;"><span style="color:[ACCENT];font-size:0.55em;font-family:'Raleway',sans-serif;font-weight:300;letter-spacing:0.3em;">▲</span></div>`,
  },

  // ── 7. HBR ───────────────────────────────────────────────────────
  // Harvard Business Review: precise, authoritative, no-nonsense.
  // Clean Inter throughout — the type of book that sits on a CEO's desk.
  {
    id: 'hbr',
    name: 'HBR',
    category: 'business',
    description: 'Business authority. Clean Inter throughout with HBR navy-blue precision.',
    previewColor: '#F8F9FB',
    previewAccent: '#1A5F9E',

    bodyFont: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
    bodySize: '11pt',
    headingSize: '16pt',
    lineHeight: '1.68',

    paragraphStyle: 'spaced',
    textIndent: '0',
    paragraphSpacing: '0.8em',

    headingAlign: 'left',
    headingWeight: '700',
    headingTransform: 'none',
    chapterNumberStyle: 'numeral',
    chapterNumberSize: '52pt',

    paperColor: '#F8F9FB',
    inkColor: '#1A1A2E',
    headingColor: '#0D2137',
    accentColor: '#1A5F9E',

    pageMarginH: '1in',
    pageMarginV: '1in',
    chapterStartMargin: '22%',

    pageSize: 'trade',
    showPageNumbers: true,
    pageNumberAlign: 'outer',

    dropCap: false,
    ornament: `<div style="padding:1em 0;"><div style="width:36px;height:2px;background:[ACCENT];opacity:0.6;"></div></div>`,
  },

  // ── 8. ANCHOR ────────────────────────────────────────────────────
  // Anchor Books: Malcolm Gladwell, Michael Lewis, Elizabeth Gilbert.
  // Narrative nonfiction — smart but accessible. Inter headings over
  // Libre Baskerville body, warm orange accent that says "read me."
  {
    id: 'anchor',
    name: 'Anchor',
    category: 'nonfiction',
    description: 'Narrative nonfiction. Inter headings over Libre Baskerville with warm orange.',
    previewColor: '#FAFAFA',
    previewAccent: '#C44200',

    bodyFont: "'Libre Baskerville', Georgia, serif",
    headingFont: "'Inter', system-ui, sans-serif",
    bodySize: '11pt',
    headingSize: '15pt',
    lineHeight: '1.7',

    paragraphStyle: 'spaced',
    textIndent: '0',
    paragraphSpacing: '0.75em',

    headingAlign: 'left',
    headingWeight: '600',
    headingTransform: 'none',
    chapterNumberStyle: 'numeral',
    chapterNumberSize: '44pt',

    paperColor: '#FAFAFA',
    inkColor: '#151515',
    headingColor: '#0A0A0A',
    accentColor: '#C44200',

    pageMarginH: '1in',
    pageMarginV: '1in',
    chapterStartMargin: '25%',

    pageSize: 'trade',
    showPageNumbers: true,
    pageNumberAlign: 'outer',

    dropCap: true,
    ornament: `<div style="display:flex;align-items:center;justify-content:center;gap:8px;padding:1em 0;"><div style="width:20px;height:1px;background:[ACCENT];opacity:0.5;"></div><div style="width:5px;height:5px;border-radius:50%;background:[ACCENT];opacity:0.6;"></div><div style="width:20px;height:1px;background:[ACCENT];opacity:0.5;"></div></div>`,
  },

];

export const defaultTemplate = templates[0]; // Knopf

export function getTemplate(id: string): Template {
  return templates.find((t) => t.id === id) ?? defaultTemplate;
}

// ─────────────────────────────────────────
//  SECTION BREAK BUILDER
//  Replaces [ACCENT] placeholder with the
//  template's real accent color.
// ─────────────────────────────────────────

export function buildSectionBreak(template: Template): string {
  return template.ornament.replace(/\[ACCENT\]/g, template.accentColor);
}

// ─────────────────────────────────────────
//  TEMPLATE CSS
//  Used for ChapterEditor live preview
// ─────────────────────────────────────────

export function getTemplateCSS(template: Template): string {
  return `
    .book-page {
      background: ${template.paperColor};
      color: ${template.inkColor};
      font-family: ${template.bodyFont};
      font-size: ${template.bodySize};
      line-height: ${template.lineHeight};
      padding: ${template.pageMarginV} ${template.pageMarginH};
    }
    .book-page p {
      margin: 0;
      text-indent: ${template.paragraphStyle === 'indent' ? template.textIndent : '0'};
      margin-bottom: ${template.paragraphStyle === 'spaced' ? template.paragraphSpacing : '0'};
    }
    .book-page p + p {
      margin-top: ${template.paragraphStyle === 'indent' ? '0' : template.paragraphSpacing};
    }
    .chapter-heading {
      font-family: ${template.headingFont};
      font-size: ${template.headingSize};
      font-weight: ${template.headingWeight};
      text-align: ${template.headingAlign};
      text-transform: ${template.headingTransform};
      color: ${template.headingColor};
      margin-bottom: 1.5em;
    }
    .chapter-number {
      font-family: ${template.headingFont};
      font-size: ${template.chapterNumberSize};
      font-weight: ${template.headingWeight};
      text-align: ${template.headingAlign};
      color: ${template.accentColor};
      margin-bottom: 0.5em;
      display: block;
    }
    .chapter-start {
      padding-top: ${template.chapterStartMargin};
    }
    .section-break {
      text-align: center;
      margin: 1.5em 0;
    }
    .drop-cap::first-letter {
      float: left;
      font-family: ${template.headingFont};
      font-size: 3.8em;
      line-height: 0.82;
      font-weight: 700;
      color: ${template.accentColor};
      padding-right: 4px;
      margin-top: 4px;
    }
    .page-number {
      font-family: ${template.bodyFont};
      font-size: 9pt;
      text-align: ${template.pageNumberAlign === 'center' ? 'center' : 'right'};
      color: ${template.inkColor};
      opacity: 0.5;
    }
  `;
}
