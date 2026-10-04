// Book design system: fonts, trim sizes, themes and the CSS they produce.
// A theme is a set of defaults; every choice can be overridden per book.

export type FontId =
  | 'eb-garamond' | 'inter' | 'libre-baskerville' | 'crimson-pro' | 'lora' | 'source-serif-4' | 'merriweather'
  | 'alegreya' | 'spectral' | 'cormorant-garamond' | 'playfair-display' | 'cinzel' | 'josefin-sans'
  | 'montserrat' | 'raleway' | 'oswald' | 'great-vibes';

interface FontDef { label: string; kind: 'serif' | 'sans' | 'display' | 'script'; variants: string[]; fallback: string }
export const FONTS: Record<FontId, FontDef> = {
  'eb-garamond': { label: 'EB Garamond', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  inter: { label: 'Inter', kind: 'sans', variants: ['400-normal'], fallback: 'Arial, sans-serif' },
  'libre-baskerville': { label: 'Libre Baskerville', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  'crimson-pro': { label: 'Crimson Pro', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  lora: { label: 'Lora', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  'source-serif-4': { label: 'Source Serif', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  merriweather: { label: 'Merriweather', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  alegreya: { label: 'Alegreya', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  spectral: { label: 'Spectral', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  'cormorant-garamond': { label: 'Cormorant Garamond', kind: 'serif', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  'playfair-display': { label: 'Playfair Display', kind: 'display', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Georgia, serif' },
  cinzel: { label: 'Cinzel', kind: 'display', variants: ['400-normal', '700-normal'], fallback: 'Georgia, serif' },
  'josefin-sans': { label: 'Josefin Sans', kind: 'sans', variants: ['400-normal', '700-normal'], fallback: 'Arial, sans-serif' },
  montserrat: { label: 'Montserrat', kind: 'sans', variants: ['400-normal', '400-italic', '700-normal'], fallback: 'Arial, sans-serif' },
  raleway: { label: 'Raleway', kind: 'sans', variants: ['400-normal', '700-normal'], fallback: 'Arial, sans-serif' },
  oswald: { label: 'Oswald', kind: 'display', variants: ['400-normal', '700-normal'], fallback: 'Arial Narrow, sans-serif' },
  'great-vibes': { label: 'Great Vibes', kind: 'script', variants: ['400-normal'], fallback: 'cursive' },
};
export const FONT_IDS = Object.keys(FONTS) as FontId[];
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

/** The CSS family name used for a font inside book pages. */
export function family(id: FontId): string { return `bk-${id}`; }
export function fontStack(id: FontId): string { return `'${family(id)}', ${FONTS[id].fallback}`; }

/** @font-face rules for the given fonts. Every URL starts with /fonts/ so the PDF service can inline it. */
export function fontFaceCss(ids: Iterable<FontId>): string {
  let css = '';
  for (const id of new Set(ids)) {
    const fam = family(id);
    if (id === 'eb-garamond') {
      css += `@font-face{font-family:'${fam}';src:url('/fonts/serif.woff2')}@font-face{font-family:'${fam}';src:url('/fonts/serif-italic.woff2');font-style:italic}@font-face{font-family:'${fam}';src:url('/fonts/serif-bold.woff2');font-weight:700}`;
      continue;
    }
    if (id === 'inter') { css += `@font-face{font-family:'${fam}';src:url('/fonts/sans.woff2')}`; continue; }
    for (const v of FONTS[id].variants) {
      const [weight, style] = v.split('-');
      for (const [subset, range] of [['latin', LATIN], ['latin-ext', LATIN_EXT]]) {
        css += `@font-face{font-family:'${fam}';src:url('/fonts/lib/${id}-${subset}-${v}.woff2') format('woff2');font-weight:${weight};font-style:${style};unicode-range:${range}}`;
      }
    }
  }
  return css;
}

export type TrimId = '4.25x6.87' | '5x8' | '5.06x7.81' | '5.25x8' | '5.5x8.5' | '6x9' | '6.14x9.21' | '6.69x9.61' | '7x10' | '7.44x9.69' | '7.5x9.25' | '8x10' | '8.25x8.25' | '8.5x8.5' | '8.5x11' | 'a5' | 'b5' | 'a4';
export const TRIMS: Record<TrimId, { label: string; size: string; use: string }> = {
  '4.25x6.87': { label: '4.25 × 6.87 in', size: '4.25in 6.87in', use: 'Mass-market paperback' },
  '5x8': { label: '5 × 8 in', size: '5in 8in', use: 'Fiction' },
  '5.06x7.81': { label: '5.06 × 7.81 in', size: '5.06in 7.81in', use: 'UK B-format' },
  '5.25x8': { label: '5.25 × 8 in', size: '5.25in 8in', use: 'Fiction' },
  '5.5x8.5': { label: '5.5 × 8.5 in', size: '5.5in 8.5in', use: 'Digest · fiction and memoir' },
  '6x9': { label: '6 × 9 in', size: '6in 9in', use: 'Trade · most popular' },
  '6.14x9.21': { label: '6.14 × 9.21 in', size: '6.14in 9.21in', use: 'Royal · nonfiction' },
  '6.69x9.61': { label: '6.69 × 9.61 in', size: '6.69in 9.61in', use: 'Nonfiction' },
  '7x10': { label: '7 × 10 in', size: '7in 10in', use: 'Textbooks and workbooks' },
  '7.44x9.69': { label: '7.44 × 9.69 in', size: '7.44in 9.69in', use: 'Crown quarto' },
  '7.5x9.25': { label: '7.5 × 9.25 in', size: '7.5in 9.25in', use: 'Nonfiction' },
  '8x10': { label: '8 × 10 in', size: '8in 10in', use: 'Illustrated and workbooks' },
  '8.25x8.25': { label: '8.25 × 8.25 in', size: '8.25in 8.25in', use: 'Square · children’s' },
  '8.5x8.5': { label: '8.5 × 8.5 in', size: '8.5in 8.5in', use: 'Square · picture books' },
  '8.5x11': { label: '8.5 × 11 in', size: '8.5in 11in', use: 'Letter · workbooks and manuals' },
  a5: { label: 'A5 · 148 × 210 mm', size: '148mm 210mm', use: 'UK and Europe' },
  b5: { label: 'B5 · 176 × 250 mm', size: '176mm 250mm', use: 'Nonfiction' },
  a4: { label: 'A4 · 210 × 297 mm', size: '210mm 297mm', use: 'Manuals and workbooks' },
};
export const TRIM_IDS = Object.keys(TRIMS) as TrimId[];

export type ChapterLabel = 'chapter-number' | 'chapter-word' | 'word' | 'number' | 'roman' | 'none';
export type Align = 'center' | 'left';
export type HeadingCase = 'normal' | 'upper' | 'small-caps';
export type DropCap = 'none' | 'plain' | 'raised';
export type FirstLine = 'none' | 'small-caps' | 'upper';
export type SceneBreak = 'asterisks' | 'dots' | 'diamond' | 'flourish' | 'rule' | 'space';
export type Ornament = 'none' | 'rule' | 'short-rule' | 'double-rule' | 'flourish' | 'diamond';
export type ParagraphStyle = 'indent' | 'block';
export type RunningHead = 'author-title' | 'title-chapter' | 'none';
export type PageNumber = 'center' | 'outer' | 'none';

export const CHOICES = {
  chapterLabel: { 'chapter-number': 'Chapter 1', 'chapter-word': 'Chapter One', word: 'One', number: '1', roman: 'I', none: 'No label' },
  headingAlign: { center: 'Centred', left: 'Left' },
  headingCase: { normal: 'As typed', upper: 'UPPERCASE', 'small-caps': 'Small caps' },
  dropCap: { none: 'None', plain: 'Drop cap', raised: 'Raised initial' },
  firstLine: { none: 'Normal', 'small-caps': 'Small caps', upper: 'Uppercase' },
  sceneBreak: { asterisks: '* * *', dots: '· · ·', diamond: 'Diamond', flourish: 'Flourish', rule: 'Short line', space: 'Blank space' },
  ornament: { none: 'None', rule: 'Line', 'short-rule': 'Short line', 'double-rule': 'Double line', flourish: 'Flourish', diamond: 'Diamond' },
  paragraph: { indent: 'Indented', block: 'Spaced blocks' },
  runningHead: { 'author-title': 'Author · title', 'title-chapter': 'Title · chapter', none: 'None' },
  pageNumber: { center: 'Centred', outer: 'Outside corner', none: 'None' },
} as const;

export interface ThemeDef {
  id: string; name: string; genre: string; description: string;
  body: FontId; heading: FontId; label: ChapterLabel; align: Align; case: HeadingCase; dropCap: DropCap; firstLine: FirstLine;
  sceneBreak: SceneBreak; ornament: Ornament; paragraph: ParagraphStyle; headingSize: number; headingStyle?: 'italic';
}

export const THEMES: ThemeDef[] = [
  { id: 'literary', name: 'Literary', genre: 'Literary fiction', description: 'Classic Garamond with quiet, centred openings.', body: 'eb-garamond', heading: 'eb-garamond', label: 'chapter-number', align: 'center', case: 'normal', dropCap: 'none', firstLine: 'none', sceneBreak: 'asterisks', ornament: 'none', paragraph: 'indent', headingSize: 26 },
  { id: 'heritage', name: 'Heritage', genre: 'Classic fiction', description: 'Baskerville text, carved capitals and a flourish.', body: 'libre-baskerville', heading: 'cinzel', label: 'chapter-word', align: 'center', case: 'upper', dropCap: 'plain', firstLine: 'small-caps', sceneBreak: 'flourish', ornament: 'flourish', paragraph: 'indent', headingSize: 22 },
  { id: 'romance', name: 'Romance', genre: 'Romance', description: 'Script chapter titles over warm Lora text.', body: 'lora', heading: 'great-vibes', label: 'chapter-word', align: 'center', case: 'normal', dropCap: 'plain', firstLine: 'none', sceneBreak: 'diamond', ornament: 'diamond', paragraph: 'indent', headingSize: 36 },
  { id: 'thriller', name: 'Thriller', genre: 'Thriller and crime', description: 'Bold condensed headings, a hard left edge.', body: 'crimson-pro', heading: 'oswald', label: 'number', align: 'left', case: 'upper', dropCap: 'none', firstLine: 'upper', sceneBreak: 'rule', ornament: 'rule', paragraph: 'indent', headingSize: 28 },
  { id: 'fantasy', name: 'Fantasy', genre: 'Fantasy and epic', description: 'Roman numerals, carved titles, raised initials.', body: 'alegreya', heading: 'cinzel', label: 'roman', align: 'center', case: 'upper', dropCap: 'raised', firstLine: 'small-caps', sceneBreak: 'flourish', ornament: 'double-rule', paragraph: 'indent', headingSize: 24 },
  { id: 'mystery', name: 'Mystery', genre: 'Mystery and suspense', description: 'Elegant Playfair titles and small-cap openings.', body: 'spectral', heading: 'playfair-display', label: 'chapter-word', align: 'center', case: 'normal', dropCap: 'none', firstLine: 'small-caps', sceneBreak: 'asterisks', ornament: 'short-rule', paragraph: 'indent', headingSize: 28, headingStyle: 'italic' },
  { id: 'memoir', name: 'Memoir', genre: 'Memoir and biography', description: 'Graceful Cormorant with a soft drop cap.', body: 'cormorant-garamond', heading: 'cormorant-garamond', label: 'word', align: 'center', case: 'normal', dropCap: 'plain', firstLine: 'none', sceneBreak: 'dots', ornament: 'short-rule', paragraph: 'indent', headingSize: 30, headingStyle: 'italic' },
  { id: 'devotional', name: 'Devotional', genre: 'Faith and devotional', description: 'Calm Lora text, Playfair titles, a diamond mark.', body: 'lora', heading: 'playfair-display', label: 'chapter-word', align: 'center', case: 'normal', dropCap: 'raised', firstLine: 'none', sceneBreak: 'diamond', ornament: 'diamond', paragraph: 'indent', headingSize: 26 },
  { id: 'modern', name: 'Modern', genre: 'Contemporary', description: 'Clean sans serif, simple left-aligned openings.', body: 'inter', heading: 'inter', label: 'chapter-number', align: 'left', case: 'normal', dropCap: 'none', firstLine: 'none', sceneBreak: 'asterisks', ornament: 'none', paragraph: 'indent', headingSize: 24 },
  { id: 'editorial', name: 'Editorial', genre: 'Essays and journalism', description: 'Garamond text with uppercase openings.', body: 'eb-garamond', heading: 'eb-garamond', label: 'chapter-number', align: 'center', case: 'upper', dropCap: 'none', firstLine: 'none', sceneBreak: 'asterisks', ornament: 'none', paragraph: 'indent', headingSize: 21 },
  { id: 'business', name: 'Business', genre: 'Business and leadership', description: 'Source Serif text, Montserrat headings, spaced paragraphs.', body: 'source-serif-4', heading: 'montserrat', label: 'chapter-number', align: 'left', case: 'normal', dropCap: 'none', firstLine: 'none', sceneBreak: 'rule', ornament: 'short-rule', paragraph: 'block', headingSize: 24 },
  { id: 'self-help', name: 'Self-help', genre: 'Self-help and wellbeing', description: 'Friendly Merriweather with big chapter numbers.', body: 'merriweather', heading: 'raleway', label: 'number', align: 'left', case: 'normal', dropCap: 'none', firstLine: 'none', sceneBreak: 'dots', ornament: 'rule', paragraph: 'indent', headingSize: 24 },
  { id: 'young-adult', name: 'Young adult', genre: 'YA and middle grade', description: 'Open Josefin titles over easy-reading Lora.', body: 'lora', heading: 'josefin-sans', label: 'word', align: 'center', case: 'upper', dropCap: 'none', firstLine: 'none', sceneBreak: 'dots', ornament: 'short-rule', paragraph: 'indent', headingSize: 24 },
  { id: 'sci-fi', name: 'Sci-fi', genre: 'Science fiction', description: 'Wide-spaced capitals and a precise diamond.', body: 'spectral', heading: 'montserrat', label: 'number', align: 'left', case: 'upper', dropCap: 'none', firstLine: 'upper', sceneBreak: 'diamond', ornament: 'rule', paragraph: 'indent', headingSize: 22 },
  { id: 'gothic', name: 'Gothic', genre: 'Horror and gothic', description: 'Cinzel titles, Crimson text, a heavy initial.', body: 'crimson-pro', heading: 'cinzel', label: 'roman', align: 'center', case: 'upper', dropCap: 'plain', firstLine: 'small-caps', sceneBreak: 'flourish', ornament: 'flourish', paragraph: 'indent', headingSize: 24 },
  { id: 'poetry', name: 'Poetry', genre: 'Poetry and verse', description: 'Cormorant, no indents, room to breathe.', body: 'cormorant-garamond', heading: 'cormorant-garamond', label: 'none', align: 'center', case: 'normal', dropCap: 'none', firstLine: 'none', sceneBreak: 'space', ornament: 'short-rule', paragraph: 'block', headingSize: 24, headingStyle: 'italic' },
  { id: 'academic', name: 'Academic', genre: 'Academic and reference', description: 'Source Serif throughout, numbered and plain.', body: 'source-serif-4', heading: 'source-serif-4', label: 'chapter-number', align: 'left', case: 'normal', dropCap: 'none', firstLine: 'none', sceneBreak: 'asterisks', ornament: 'none', paragraph: 'indent', headingSize: 20 },
  { id: 'childrens', name: 'Children’s', genre: 'Early readers', description: 'Big friendly Josefin headings and spaced text.', body: 'lora', heading: 'josefin-sans', label: 'number', align: 'center', case: 'normal', dropCap: 'raised', firstLine: 'none', sceneBreak: 'dots', ornament: 'none', paragraph: 'block', headingSize: 32 },
];
export const THEME_IDS = THEMES.map(t => t.id);
export function themeById(id: string): ThemeDef { return THEMES.find(t => t.id === id) || THEMES[0]; }

/** Optional per-book overrides of the theme. Missing means "use the theme's choice". */
export interface DesignOverrides {
  bodyFont?: FontId; headingFont?: FontId; chapterLabel?: ChapterLabel; headingAlign?: Align; headingCase?: HeadingCase;
  dropCap?: DropCap; firstLine?: FirstLine; sceneBreak?: SceneBreak; ornament?: Ornament; paragraph?: ParagraphStyle;
  runningHead?: RunningHead; pageNumber?: PageNumber; largePrint?: boolean;
}
export const OVERRIDE_VALUES: Record<keyof DesignOverrides, readonly (string | boolean)[]> = {
  bodyFont: FONT_IDS, headingFont: FONT_IDS, chapterLabel: Object.keys(CHOICES.chapterLabel), headingAlign: Object.keys(CHOICES.headingAlign),
  headingCase: Object.keys(CHOICES.headingCase), dropCap: Object.keys(CHOICES.dropCap), firstLine: Object.keys(CHOICES.firstLine),
  sceneBreak: Object.keys(CHOICES.sceneBreak), ornament: Object.keys(CHOICES.ornament), paragraph: Object.keys(CHOICES.paragraph),
  runningHead: Object.keys(CHOICES.runningHead), pageNumber: Object.keys(CHOICES.pageNumber), largePrint: [true, false],
};

export interface ResolvedDesign {
  theme: ThemeDef; body: FontId; heading: FontId; label: ChapterLabel; align: Align; case: HeadingCase; dropCap: DropCap; firstLine: FirstLine;
  sceneBreak: SceneBreak; ornament: Ornament; paragraph: ParagraphStyle; runningHead: RunningHead; pageNumber: PageNumber; largePrint: boolean;
  fontSize: number; lineHeight: number;
}
export function resolveDesign(design: { theme: string; fontSize: number; lineHeight: number } & DesignOverrides): ResolvedDesign {
  const t = themeById(design.theme);
  const large = !!design.largePrint;
  return {
    theme: t, body: design.bodyFont || t.body, heading: design.headingFont || t.heading, label: design.chapterLabel || t.label,
    align: design.headingAlign || t.align, case: design.headingCase || t.case, dropCap: design.dropCap || t.dropCap,
    firstLine: design.firstLine || t.firstLine, sceneBreak: design.sceneBreak || t.sceneBreak, ornament: design.ornament || t.ornament,
    paragraph: design.paragraph || t.paragraph, runningHead: design.runningHead || 'author-title', pageNumber: design.pageNumber || 'center',
    largePrint: large, fontSize: large ? Math.max(16, design.fontSize) : design.fontSize, lineHeight: large ? Math.max(1.5, design.lineHeight) : design.lineHeight,
  };
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
export function numberWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numberWords(n % 100) : '');
  return String(n);
}
export function roman(n: number): string {
  const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}
export function chapterLabel(kind: ChapterLabel, n: number): string {
  switch (kind) {
    case 'chapter-number': return `Chapter ${n}`;
    case 'chapter-word': return `Chapter ${numberWords(n)}`;
    case 'word': return numberWords(n);
    case 'number': return String(n);
    case 'roman': return roman(n);
    default: return '';
  }
}

// Ornaments are drawn as SVG so they print the same with every font.
const svg = (body: string, w: number, h: number) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`)}")`;
const DIAMOND = svg(`<rect x='4' y='4' width='8' height='8' transform='rotate(45 8 8)' fill='#222'/>`, 16, 16);
const FLOURISH = svg(`<path d='M2 8 H38 M62 8 H98' stroke='#222' stroke-width='1'/><path d='M38 8 C44 1 48 1 50 8 C52 15 56 15 62 8 C56 1 52 1 50 8 C48 15 44 15 38 8 Z' fill='none' stroke='#222' stroke-width='1.2'/><circle cx='50' cy='8' r='1.8' fill='#222'/>`, 100, 16);

/** Theme CSS shared by print and ebook. `forEbook` keeps reader-friendly choices (no fixed fonts, text ornaments). */
export function themeCss(d: ResolvedDesign, forEbook = false): string {
  const head = forEbook ? 'serif' : fontStack(d.heading);
  const caseCss = d.case === 'upper' ? 'text-transform:uppercase;letter-spacing:.06em;' : d.case === 'small-caps' ? 'font-variant:small-caps;letter-spacing:.04em;' : '';
  const size = forEbook ? Math.min(2, d.theme.headingSize / 16) + 'em' : `${d.theme.headingSize}pt`;
  let css = `.section-head{text-align:${d.align}}.section-head h1{font-family:${head};font-size:${size};${caseCss}${d.theme.headingStyle ? 'font-style:italic;' : ''}font-weight:400;margin:0}
  ${d.label === 'number' || d.label === 'roman' ? `.section-label{font-family:${head};font-size:${forEbook ? '2.4em' : '40pt'};letter-spacing:0;text-transform:none;line-height:1;margin-bottom:.35em}` : ''}`;
  if (d.paragraph === 'block') css += 'p{text-indent:0!important;margin:0 0 .8em}';
  // Real elements, not ::first-letter / ::first-line: the page engine and many ebook readers drop those.
  // Script and display faces make poor initials, so script themes use the text font for the drop cap.
  const initial = FONTS[d.heading].kind === 'script' || forEbook ? 'inherit' : fontStack(d.heading);
  if (d.dropCap === 'plain') css += `.dropcap{float:left;font-family:${initial};font-size:${((d.lineHeight + 0.68) / 0.68).toFixed(2)}em;line-height:.74;margin:.06em .07em 0 0}`;
  if (d.dropCap === 'raised') css += `.dropcap{font-family:${initial};font-size:2.2em;line-height:1}`;
  if (d.firstLine === 'small-caps') css += '.lead{font-variant:small-caps;letter-spacing:.04em}';
  if (d.firstLine === 'upper') css += '.lead{text-transform:uppercase;font-size:.88em;letter-spacing:.05em}';
  const orn: Record<Ornament, string> = {
    none: '', rule: 'content:"";display:block;width:100%;border-top:.6pt solid #333;margin-top:.7em',
    'short-rule': 'content:"";display:block;width:3em;border-top:.6pt solid #333;margin:.8em auto 0',
    'double-rule': 'content:"";display:block;width:6em;height:3pt;border-top:.6pt solid #333;border-bottom:.6pt solid #333;margin:.8em auto 0',
    flourish: forEbook ? 'content:"~";display:block;margin-top:.4em' : `content:"";display:block;width:100px;height:16px;margin:.8em auto 0;background:${FLOURISH} center/contain no-repeat`,
    diamond: forEbook ? 'content:"\\25C6";display:block;margin-top:.4em;font-size:.6em' : `content:"";display:block;width:12px;height:12px;margin:.9em auto 0;background:${DIAMOND} center/contain no-repeat`,
  };
  if (orn[d.ornament]) css += `.chapter .section-head h1::after{${orn[d.ornament]}}${d.align === 'left' ? '.chapter .section-head h1::after{margin-left:0}' : ''}`;
  // Scene breaks: markup carries "* * *" text; themes may swap it for a drawn ornament.
  const scene: Record<SceneBreak, string> = {
    asterisks: '', dots: '.scene-break span{display:none}.scene-break::before{content:"\\00B7\\2003\\00B7\\2003\\00B7"}',
    rule: '.scene-break span{display:none}.scene-break::before{content:"";display:inline-block;width:3em;border-top:.6pt solid #333;vertical-align:middle}',
    space: '.scene-break span{visibility:hidden}',
    diamond: forEbook ? '' : `.scene-break span{display:none}.scene-break::before{content:"";display:inline-block;width:10px;height:10px;background:${DIAMOND} center/contain no-repeat}`,
    flourish: forEbook ? '' : `.scene-break span{display:none}.scene-break::before{content:"";display:inline-block;width:90px;height:14px;background:${FLOURISH} center/contain no-repeat}`,
  };
  css += scene[d.sceneBreak];
  return css;
}

/** Marks up a chapter's first paragraph with the drop cap and the opening words. Leaves anything it can't safely handle alone. */
export function chapterOpening(html: string, d: ResolvedDesign): string {
  if (d.dropCap === 'none' && d.firstLine === 'none') return html;
  return html.replace(/^<p((?: [^>]*)?)>([^<]+)/, (whole, attrs: string, text: string) => {
    let rest = text;
    let cap = '';
    if (d.dropCap !== 'none') {
      const m = rest.match(/^([“"‘'(\[]*\p{L})/u);
      if (!m) return whole;
      cap = `<span class="dropcap">${m[1]}</span>`;
      rest = rest.slice(m[1].length);
    }
    let lead = '';
    if (d.firstLine !== 'none') {
      const words = rest.split(/(\s+)/);
      let taken = '';
      for (const w of words) { if (taken.replace(/\s+/g, ' ').length >= 24 && /\s/.test(w)) break; taken += w; }
      lead = `<span class="lead">${taken}</span>`;
      rest = rest.slice(taken.length);
    }
    return `<p${attrs}>${cap}${lead}${rest}`;
  });
}

/** How many distinct looks the builder can make (theme × fonts × each option). Used for honest marketing copy. */
export function combinationCount(): number {
  const n = (o: object) => Object.keys(o).length;
  return THEMES.length * FONT_IDS.length * FONT_IDS.length * n(CHOICES.chapterLabel) * n(CHOICES.headingAlign) * n(CHOICES.headingCase) * n(CHOICES.dropCap) * n(CHOICES.firstLine) * n(CHOICES.sceneBreak) * n(CHOICES.ornament) * n(CHOICES.paragraph);
}

/** Amazon KDP paperback paper thickness, inches per page (KDP cover calculator values). */
export const PAPER_THICKNESS = { white: 0.002252, cream: 0.0025 } as const;
export function trimInches(trim: TrimId): [number, number] {
  const [w, h] = TRIMS[trim].size.split(' ').map(v => (v.endsWith('mm') ? parseFloat(v) / 25.4 : parseFloat(v)));
  return [w, h];
}
/** Full wraparound paperback cover with 0.125 in bleed on every edge. Page counts round up to an even number. */
export function coverSize(trim: TrimId, pages: number, paper: 'white' | 'cream' = 'white') {
  const [w, h] = trimInches(trim);
  const count = Math.max(24, pages + (pages % 2));
  const spine = count * PAPER_THICKNESS[paper];
  return { pages: count, spine, width: 0.125 + w + spine + w + 0.125, height: h + 0.25, spineText: count >= 79 };
}
