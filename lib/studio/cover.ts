// Book covers, drawn in the browser on a canvas: the front (designed or uploaded),
// the full paperback wrap (back, spine, front with bleed), the ISBN barcode and marketing images.
import { FONTS, family, fontFaceCss, trimInches, PAPER_THICKNESS, type FontId, type TrimId } from './themes';
import type { StudioProject } from './model';

export const COVER_STYLES = ['classic', 'bold', 'minimal', 'frame', 'split', 'arch', 'noir', 'stripes', 'swiss', 'script', 'photo'] as const;
export type CoverStyle = typeof COVER_STYLES[number];
export const STYLE_NAMES: Record<CoverStyle, string> = { classic: 'Classic', bold: 'Bold', minimal: 'Sun', frame: 'Frame', split: 'Split', arch: 'Arch', noir: 'Noir', stripes: 'Stripes', swiss: 'Swiss', script: 'Script', photo: 'Photo' };

/** [background, text, accent] */
export const PALETTES: [string, string, string][] = [
  ['#1f3d2f', '#f4ecd8', '#d9a441'], ['#14161c', '#f2efe8', '#e4572e'], ['#f3ede0', '#1f2a24', '#b5462f'], ['#123a5a', '#f1f5f8', '#7fc3d9'],
  ['#3e1f3a', '#f6e9ef', '#e8a0b4'], ['#f2c14e', '#1d1d1b', '#c0392b'], ['#f6d7d3', '#4a1f2a', '#b23a48'], ['#3b4248', '#f0f0ea', '#c9b37e'],
  ['#dfeee3', '#1d3b2c', '#2f8a62'], ['#5a1a12', '#fbe9d5', '#f08a4b'],
];
export const COVER_FONTS: FontId[] = ['playfair-display', 'cormorant-garamond', 'libre-baskerville', 'eb-garamond', 'cinzel', 'oswald', 'montserrat', 'josefin-sans', 'raleway', 'lora', 'great-vibes'];
export type Printer = 'kdp' | 'ingram';
export const PRINTERS: Record<Printer, { name: string; spineText: number }> = { kdp: { name: 'Amazon KDP', spineText: 80 }, ingram: { name: 'IngramSpark', spineText: 48 } };

export interface CoverSettings {
  mode: 'design' | 'upload';
  style: CoverStyle; palette: number; font: FontId;
  photo?: string; image?: string; border?: boolean;
  blurb?: string; bio?: string; authorPhoto?: string; isbn?: string; printer?: Printer;
  thumb?: string;
}
export function defaultCover(): CoverSettings { return { mode: 'design', style: 'classic', palette: 0, font: 'playfair-display' }; }

export interface CoverWords { title: string; subtitle: string; author: string; series?: string }
export interface Rect { x: number; y: number; w: number; h: number }
type Ctx = CanvasRenderingContext2D;
type Img = CanvasImageSource & { width: number; height: number };

const IMAGE = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/;
export function validCover(c: unknown): boolean {
  if (!c || typeof c !== 'object') return false;
  const v = c as CoverSettings;
  const img = (s: unknown) => s === undefined || (typeof s === 'string' && s.length < 25_000_000 && IMAGE.test(s));
  const str = (s: unknown, max: number) => s === undefined || (typeof s === 'string' && s.length <= max);
  return ['design', 'upload'].includes(v.mode) && COVER_STYLES.includes(v.style) && Number.isInteger(v.palette) && v.palette >= 0 && v.palette < PALETTES.length
    && v.font in FONTS && img(v.photo) && img(v.image) && img(v.authorPhoto) && img(v.thumb) && (v.border === undefined || typeof v.border === 'boolean')
    && str(v.blurb, 3000) && str(v.bio, 1200) && str(v.isbn, 20) && (v.printer === undefined || v.printer in PRINTERS);
}

// ── Text ──

function fontString(font: FontId, size: number, weight = 400, italic = false) { return `${italic ? 'italic ' : ''}${weight} ${size}px '${family(font)}', ${FONTS[font].fallback}`; }
function weightFor(font: FontId, bold: boolean) { return bold && FONTS[font].variants.includes('700-normal') ? 700 : 400; }

/** Greedy word wrap at one size. */
export function wrap(measure: (s: string) => number, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next) > maxW) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** The largest size (down to `min`) at which the text fits the box, wrapped into at most `maxLines` lines. */
export function fit(ctx: Pick<Ctx, 'font' | 'measureText'>, text: string, f: (size: number) => string, box: { w: number; h: number }, max: number, min: number, maxLines = 6, leading = 1.08) {
  let size = max;
  for (;;) {
    ctx.font = f(size);
    const lines = wrap(s => ctx.measureText(s).width, text, box.w);
    const widest = Math.max(0, ...lines.map(l => ctx.measureText(l).width));
    if ((lines.length <= maxLines && lines.length * size * leading <= box.h && widest <= box.w) || size <= min) return { size, lines, height: lines.length * size * leading, leading };
    size = Math.max(min, size * 0.94);
  }
}

function spaced(ctx: Ctx, em: number) { if ('letterSpacing' in ctx) (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${em}px`; }

/** Draws wrapped lines; `y` is the top of the block. Returns the bottom. */
function lines(ctx: Ctx, t: { size: number; lines: string[]; leading: number }, x: number, y: number, align: CanvasTextAlign) {
  ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  t.lines.forEach((l, i) => ctx.fillText(l, x, y + t.size * 0.86 + i * t.size * t.leading));
  return y + t.lines.length * t.size * t.leading;
}

function text(ctx: Ctx, s: string, font: string, x: number, y: number, align: CanvasTextAlign, colour: string, track = 0) {
  ctx.save(); ctx.font = font; ctx.fillStyle = colour; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; spaced(ctx, track); ctx.fillText(s, x, y); ctx.restore();
}

// ── Colour helpers ──

export function luminance(hex: string) { const n = parseInt(hex.slice(1), 16); const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map(v => v / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
export function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(Math.max(0, Math.min(255, amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => f(v).toString(16).padStart(2, '0')).join('');
}

function cover(ctx: Ctx, img: Img, r: Rect) {
  const k = Math.max(r.w / img.width, r.h / img.height);
  const w = img.width * k, h = img.height * k;
  ctx.drawImage(img, r.x + (r.w - w) / 2, r.y + (r.h - h) / 2, w, h);
}

// ── Front cover ──

export interface FrontInput { words: CoverWords; settings: CoverSettings; photo?: Img; upload?: Img }

/**
 * Draws the front cover. `trim` is the finished page (text stays inside it), `bleed` the area to paint (trim plus bleed).
 * Every size is relative to the trim width, so the same design works for a 1600 px ebook and a 300 DPI print cover.
 */
export function drawFront(ctx: Ctx, trim: Rect, bleed: Rect, input: FrontInput) {
  const { words, settings, photo } = input;
  ctx.save();
  ctx.beginPath(); ctx.rect(bleed.x, bleed.y, bleed.w, bleed.h); ctx.clip();
  if (settings.mode === 'upload' && input.upload) { cover(ctx, input.upload, bleed); ctx.restore(); return; }
  const [bg, ink, accent] = PALETTES[settings.palette] || PALETTES[0];
  const W = trim.w, H = trim.h, X = trim.x, Y = trim.y;
  const pad = W * 0.09;
  const font = settings.font;
  const script = FONTS[font].kind === 'script';
  const small = script ? 'cormorant-garamond' : font;
  const title = (s: number) => fontString(font, s, weightFor(font, !script && settings.style !== 'classic' && settings.style !== 'minimal'));
  const label = (s: number) => fontString(small, s, weightFor(small, true));
  const fill = (c: string) => { ctx.fillStyle = c; ctx.fillRect(bleed.x, bleed.y, bleed.w, bleed.h); };
  const withPhoto = (r: Rect, dim: string, alpha: number) => { if (!photo) return false; cover(ctx, photo, r); ctx.globalAlpha = alpha; ctx.fillStyle = dim; ctx.fillRect(r.x, r.y, r.w, r.h); ctx.globalAlpha = 1; return true; };
  const upper = (s: string) => s.toUpperCase();
  const author = words.author || 'Your Name';
  const sub = words.subtitle;
  const series = words.series;
  const centreX = X + W / 2;

  switch (settings.style) {
    case 'classic': {
      fill(bg); withPhoto(bleed, bg, 0.62);
      ctx.fillStyle = accent; ctx.fillRect(centreX - W * 0.08, Y + H * 0.3, W * 0.16, W * 0.006);
      const t = fit(ctx, words.title, title, { w: W - pad * 2, h: H * 0.3 }, W * 0.15, W * 0.05, 5);
      ctx.fillStyle = ink; ctx.font = title(t.size);
      const bottom = lines(ctx, t, centreX, Y + H * 0.34, 'center');
      ctx.fillStyle = accent; ctx.fillRect(centreX - W * 0.08, bottom + W * 0.04, W * 0.16, W * 0.006);
      if (sub) { const s = fit(ctx, sub, n => fontString(small, n, 400, FONTS[small].variants.includes('400-italic')), { w: W - pad * 2.4, h: H * 0.1 }, W * 0.045, W * 0.026, 3); ctx.fillStyle = ink; ctx.font = fontString(small, s.size, 400, FONTS[small].variants.includes('400-italic')); lines(ctx, s, centreX, bottom + W * 0.09, 'center'); }
      if (series) text(ctx, upper(series), label(W * 0.028), centreX, Y + pad * 1.1, 'center', accent, W * 0.006);
      text(ctx, upper(author), label(W * 0.05), centreX, Y + H - pad * 1.1, 'center', ink, W * 0.012);
      break;
    }
    case 'bold': {
      fill(bg); withPhoto(bleed, bg, 0.55);
      const t = fit(ctx, upper(words.title), title, { w: W - pad * 2, h: H * 0.56 }, W * 0.3, W * 0.07, 6, 0.95);
      ctx.fillStyle = ink; ctx.font = title(t.size);
      const bottom = lines(ctx, t, X + pad, Y + H * 0.12, 'left');
      ctx.fillStyle = accent; ctx.fillRect(X + pad, bottom + W * 0.04, W * 0.22, W * 0.022);
      if (sub) { const s = fit(ctx, sub, n => fontString(small, n, 400), { w: W - pad * 2, h: H * 0.1 }, W * 0.045, W * 0.026, 3); ctx.fillStyle = ink; ctx.font = fontString(small, s.size, 400); lines(ctx, s, X + pad, bottom + W * 0.1, 'left'); }
      text(ctx, upper(author), label(W * 0.055), X + pad, Y + H - pad, 'left', accent, W * 0.01);
      if (series) text(ctx, upper(series), label(W * 0.028), X + W - pad, Y + pad * 0.9, 'right', ink, W * 0.006);
      break;
    }
    case 'minimal': {
      fill(bg); withPhoto(bleed, bg, 0.7);
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(X + W * 0.7, Y + H * 0.28, W * 0.24, 0, Math.PI * 2); ctx.fill();
      const t = fit(ctx, words.title, title, { w: W - pad * 2, h: H * 0.26 }, W * 0.12, W * 0.05, 4);
      ctx.fillStyle = ink; ctx.font = title(t.size);
      const top = Y + H * 0.62 - t.height / 2;
      const bottom = lines(ctx, t, X + pad, top, 'left');
      if (sub) { const s = fit(ctx, sub, n => fontString(small, n, 400), { w: W - pad * 2, h: H * 0.08 }, W * 0.04, W * 0.024, 2); ctx.font = fontString(small, s.size, 400); lines(ctx, s, X + pad, bottom + W * 0.03, 'left'); }
      text(ctx, author, label(W * 0.042), X + pad, Y + H - pad, 'left', ink, W * 0.004);
      if (series) text(ctx, upper(series), label(W * 0.026), X + pad, Y + pad, 'left', ink, W * 0.006);
      break;
    }
    case 'frame': {
      fill(bg); withPhoto(bleed, bg, 0.6);
      ctx.strokeStyle = accent; ctx.lineWidth = W * 0.008; ctx.strokeRect(X + W * 0.06, Y + W * 0.06, W * 0.88, H - W * 0.12);
      ctx.lineWidth = W * 0.003; ctx.strokeRect(X + W * 0.085, Y + W * 0.085, W * 0.83, H - W * 0.17);
      const t = fit(ctx, words.title, title, { w: W * 0.7, h: H * 0.32 }, W * 0.13, W * 0.05, 5);
      ctx.fillStyle = ink; ctx.font = title(t.size);
      const top = Y + H * 0.42 - t.height / 2;
      const bottom = lines(ctx, t, centreX, top, 'center');
      const d = W * 0.025, cy = bottom + W * 0.06;
      ctx.fillStyle = accent; ctx.beginPath(); ctx.moveTo(centreX, cy - d); ctx.lineTo(centreX + d, cy); ctx.lineTo(centreX, cy + d); ctx.lineTo(centreX - d, cy); ctx.fill();
      ctx.fillRect(centreX - W * 0.18, cy - W * 0.0015, W * 0.13, W * 0.003); ctx.fillRect(centreX + W * 0.05, cy - W * 0.0015, W * 0.13, W * 0.003);
      if (sub) { const s = fit(ctx, sub, n => fontString(small, n, 400), { w: W * 0.66, h: H * 0.1 }, W * 0.04, W * 0.024, 3); ctx.fillStyle = ink; ctx.font = fontString(small, s.size, 400); lines(ctx, s, centreX, cy + W * 0.05, 'center'); }
      if (series) text(ctx, upper(series), label(W * 0.026), centreX, Y + W * 0.17, 'center', accent, W * 0.008);
      text(ctx, upper(author), label(W * 0.045), centreX, Y + H - W * 0.15, 'center', ink, W * 0.012);
      break;
    }
    case 'split': {
      fill(bg);
      const top: Rect = { x: bleed.x, y: bleed.y, w: bleed.w, h: (Y - bleed.y) + H * 0.52 };
      ctx.fillStyle = accent; ctx.fillRect(top.x, top.y, top.w, top.h);
      if (photo) { ctx.save(); ctx.beginPath(); ctx.rect(top.x, top.y, top.w, top.h); ctx.clip(); cover(ctx, photo, top); ctx.restore(); }
      const t = fit(ctx, words.title, title, { w: W - pad * 2, h: H * 0.26 }, W * 0.13, W * 0.05, 4);
      ctx.fillStyle = ink; ctx.font = title(t.size);
      const bottom = lines(ctx, t, X + pad, Y + H * 0.58, 'left');
      if (sub) { const s = fit(ctx, sub, n => fontString(small, n, 400), { w: W - pad * 2, h: H * 0.08 }, W * 0.04, W * 0.024, 2); ctx.font = fontString(small, s.size, 400); lines(ctx, s, X + pad, bottom + W * 0.025, 'left'); }
      text(ctx, upper(author), label(W * 0.045), X + pad, Y + H - pad, 'left', ink, W * 0.01);
      if (series) text(ctx, upper(series), label(W * 0.026), X + pad, Y + pad, 'left', luminance(accent) > 0.5 ? '#1d1d1b' : '#ffffff', W * 0.006);
      break;
    }
    case 'arch': {
      fill(bg);
      const aw = W * 0.62, ah = H * 0.5, ax = centreX - aw / 2, ay = Y + H * 0.1;
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax, ay + ah); ctx.lineTo(ax, ay + aw / 2); ctx.arc(centreX, ay + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw, ay + ah); ctx.closePath(); ctx.clip();
      const g = ctx.createLinearGradient(0, ay, 0, ay + ah); g.addColorStop(0, shade(accent, 0.35)); g.addColorStop(1, accent);
      ctx.fillStyle = g; ctx.fillRect(ax, ay, aw, ah);
      if (photo) cover(ctx, photo, { x: ax, y: ay, w: aw, h: ah });
      ctx.restore();
      const t = fit(ctx, words.title, title, { w: W - pad * 2, h: H * 0.2 }, W * 0.11, W * 0.045, 3);
      ctx.fillStyle = ink; ctx.font = title(t.size);
      const bottom = lines(ctx, t, centreX, ay + ah + H * 0.05, 'center');
      if (sub) { const s = fit(ctx, sub, n => fontString(small, n, 400), { w: W - pad * 2, h: H * 0.06 }, W * 0.036, W * 0.022, 2); ctx.font = fontString(small, s.size, 400); lines(ctx, s, centreX, bottom + W * 0.02, 'center'); }
      text(ctx, upper(author), label(W * 0.04), centreX, Y + H - pad * 0.9, 'center', ink, W * 0.012);
      if (series) text(ctx, upper(series), label(W * 0.024), centreX, Y + H * 0.07, 'center', ink, W * 0.008);
      break;
    }
    case 'noir': {
      const dark = luminance(bg) < 0.3 ? bg : '#121214';
      const light = luminance(bg) < 0.3 ? ink : '#f2efe8';
      fill(dark); withPhoto(bleed, dark, 0.5);
      ctx.fillStyle = accent; ctx.fillRect(X + pad, Y + H * 0.48, W * 0.018, H * 0.4);
      const t = fit(ctx, upper(words.title), title, { w: W - pad * 2.6, h: H * 0.34 }, W * 0.2, W * 0.06, 5, 0.98);
      ctx.fillStyle = light; ctx.font = title(t.size);
      const top = Y + H * 0.88 - t.height;
      lines(ctx, t, X + pad * 1.6, top, 'left');
      if (sub) text(ctx, sub, fontString(small, W * 0.034, 400), X + pad * 1.6, top - W * 0.04, 'left', accent);
      text(ctx, upper(author), label(W * 0.05), centreX, Y + pad * 1.4, 'center', light, W * 0.02);
      if (series) text(ctx, upper(series), label(W * 0.024), centreX, Y + pad * 1.4 + W * 0.05, 'center', accent, W * 0.008);
      break;
    }
    case 'stripes': {
      fill(bg); withPhoto(bleed, bg, 0.6);
      ctx.save(); ctx.beginPath(); ctx.rect(bleed.x, Y + H * 0.08, bleed.w, H * 0.34); ctx.clip();
      ctx.fillStyle = accent;
      for (let i = -12; i < 24; i++) { const x = X + i * W * 0.09; ctx.beginPath(); ctx.moveTo(x, Y + H * 0.08); ctx.lineTo(x + W * 0.045, Y + H * 0.08); ctx.lineTo(x + W * 0.045 + H * 0.34, Y + H * 0.42); ctx.lineTo(x + H * 0.34, Y + H * 0.42); ctx.fill(); }
      ctx.restore();
      const t = fit(ctx, words.title, title, { w: W - pad * 2, h: H * 0.28 }, W * 0.13, W * 0.05, 4);
      ctx.fillStyle = ink; ctx.font = title(t.size);
      const bottom = lines(ctx, t, X + pad, Y + H * 0.48, 'left');
      if (sub) { const s = fit(ctx, sub, n => fontString(small, n, 400), { w: W - pad * 2, h: H * 0.08 }, W * 0.04, W * 0.024, 2); ctx.font = fontString(small, s.size, 400); lines(ctx, s, X + pad, bottom + W * 0.025, 'left'); }
      text(ctx, upper(author), label(W * 0.045), X + pad, Y + H - pad, 'left', ink, W * 0.01);
      if (series) text(ctx, upper(series), label(W * 0.026), X + W - pad, Y + H - pad, 'right', accent, W * 0.006);
      break;
    }
    case 'swiss': {
      fill(bg); withPhoto(bleed, bg, 0.65);
      ctx.fillStyle = ink;
      for (const f of [0.18, 0.7]) ctx.fillRect(X + pad, Y + H * f, W - pad * 2, W * 0.004);
      ctx.fillStyle = accent; ctx.beginPath(); ctx.rect(X + W - pad - W * 0.16, Y + H * 0.7 + W * 0.04, W * 0.16, W * 0.16); ctx.fill();
      const t = fit(ctx, words.title, title, { w: W - pad * 2, h: H * 0.42 }, W * 0.17, W * 0.05, 5, 1);
      ctx.fillStyle = ink; ctx.font = title(t.size);
      lines(ctx, t, X + pad, Y + H * 0.21, 'left');
      if (sub) { const s = fit(ctx, sub, n => fontString(small, n, 400), { w: W * 0.55, h: H * 0.12 }, W * 0.036, W * 0.022, 3); ctx.font = fontString(small, s.size, 400); lines(ctx, s, X + pad, Y + H * 0.7 + W * 0.04, 'left'); }
      text(ctx, author, label(W * 0.05), X + pad, Y + H * 0.18 - W * 0.03, 'left', ink);
      if (series) text(ctx, upper(series), label(W * 0.024), X + W - pad, Y + H * 0.18 - W * 0.03, 'right', ink, W * 0.006);
      break;
    }
    case 'script': {
      const g = ctx.createLinearGradient(0, bleed.y, 0, bleed.y + bleed.h); g.addColorStop(0, shade(bg, 0.18)); g.addColorStop(1, shade(bg, -0.18));
      ctx.fillStyle = g; ctx.fillRect(bleed.x, bleed.y, bleed.w, bleed.h); withPhoto(bleed, bg, 0.55);
      const t = fit(ctx, words.title, (s: number) => fontString(font, s, weightFor(font, false), !script && FONTS[font].variants.includes('400-italic')), { w: W - pad * 2, h: H * 0.34 }, W * 0.19, W * 0.06, 4, 1.05);
      ctx.fillStyle = ink; ctx.font = fontString(font, t.size, weightFor(font, false), !script && FONTS[font].variants.includes('400-italic'));
      const top = Y + H * 0.45 - t.height / 2;
      const bottom = lines(ctx, t, centreX, top, 'center');
      ctx.strokeStyle = accent; ctx.lineWidth = W * 0.004; ctx.beginPath(); ctx.moveTo(centreX - W * 0.2, bottom + W * 0.04); ctx.quadraticCurveTo(centreX, bottom + W * 0.09, centreX + W * 0.2, bottom + W * 0.04); ctx.stroke();
      if (sub) text(ctx, sub, fontString(small, W * 0.036, 400), centreX, bottom + W * 0.15, 'center', ink);
      text(ctx, upper(author), label(W * 0.042), centreX, Y + H - pad, 'center', ink, W * 0.014);
      if (series) text(ctx, upper(series), label(W * 0.024), centreX, Y + pad, 'center', accent, W * 0.008);
      break;
    }
    case 'photo': {
      const g = ctx.createLinearGradient(0, bleed.y, 0, bleed.y + bleed.h); g.addColorStop(0, accent); g.addColorStop(1, bg);
      ctx.fillStyle = g; ctx.fillRect(bleed.x, bleed.y, bleed.w, bleed.h);
      if (photo) cover(ctx, photo, bleed);
      const shadow = ctx.createLinearGradient(0, Y + H * 0.45, 0, bleed.y + bleed.h); shadow.addColorStop(0, 'rgba(0,0,0,0)'); shadow.addColorStop(1, 'rgba(0,0,0,.78)');
      ctx.fillStyle = shadow; ctx.fillRect(bleed.x, Y + H * 0.45, bleed.w, bleed.y + bleed.h - (Y + H * 0.45));
      const t = fit(ctx, words.title, title, { w: W - pad * 2, h: H * 0.24 }, W * 0.14, W * 0.05, 4);
      ctx.fillStyle = '#ffffff'; ctx.font = title(t.size);
      const top = Y + H * 0.84 - t.height - (sub ? W * 0.06 : 0);
      const bottom = lines(ctx, t, centreX, top, 'center');
      if (sub) text(ctx, sub, fontString(small, W * 0.036, 400), centreX, bottom + W * 0.05, 'center', '#ffffff');
      text(ctx, upper(author), label(W * 0.045), centreX, Y + H - pad * 0.8, 'center', '#ffffff', W * 0.014);
      if (series) text(ctx, upper(series), label(W * 0.024), centreX, Y + pad, 'center', '#ffffff', W * 0.008);
      break;
    }
  }
  ctx.restore();
}

/** Background and text colour for the back and spine: the palette, or the uploaded cover's average colour. */
export function wrapColours(settings: CoverSettings, upload?: Img): { bg: string; ink: string; accent: string } {
  const [bg, ink, accent] = PALETTES[settings.palette] || PALETTES[0];
  if (settings.mode === 'design') return settings.style === 'noir' && luminance(bg) >= 0.3 ? { bg: '#121214', ink: '#f2efe8', accent } : { bg, ink, accent };
  const avg = upload ? averageColour(upload) : '#222222';
  const light = luminance(avg) > 0.55;
  return { bg: avg, ink: light ? '#1d1d1b' : '#f5f2ea', accent: light ? '#1d1d1b' : '#f5f2ea' };
}

function averageColour(img: Img): string {
  if (typeof document === 'undefined') return '#222222';
  const c = document.createElement('canvas'); c.width = 24; c.height = 36;
  const x = c.getContext('2d', { willReadFrequently: true }); if (!x) return '#222222';
  x.drawImage(img, 0, 0, 24, 36);
  const d = x.getImageData(0, 0, 24, 36).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
  const n = d.length / 4;
  return '#' + [r, g, b].map(v => Math.round(v / n * 0.82).toString(16).padStart(2, '0')).join('');
}

// ── Paperback wrap ──

export const BLEED = 0.125;
export const SAFE = 0.25;
export const BARCODE = { w: 2, h: 1.2 };

export interface WrapGeometry { trimW: number; trimH: number; spine: number; width: number; height: number; pages: number; spineText: boolean; back: Rect; front: Rect; spineRect: Rect; barcode: Rect }
/** Inches. Back on the left, spine, front on the right, with 0.125 in bleed on every outside edge. */
export function wrapGeometry(trim: TrimId, pages: number, paper: 'white' | 'cream' = 'white', printer: Printer = 'kdp'): WrapGeometry {
  const [w, h] = trimInches(trim);
  const count = Math.max(24, pages + (pages % 2));
  const spine = count * PAPER_THICKNESS[paper];
  const width = BLEED * 2 + w * 2 + spine, height = h + BLEED * 2;
  const back = { x: BLEED, y: BLEED, w, h };
  const spineRect = { x: BLEED + w, y: BLEED, w: spine, h };
  const front = { x: BLEED + w + spine, y: BLEED, w, h };
  const barcode = { x: back.x + w - SAFE - BARCODE.w, y: back.y + h - SAFE - BARCODE.h, w: BARCODE.w, h: BARCODE.h };
  return { trimW: w, trimH: h, spine, width, height, pages: count, spineText: count >= PRINTERS[printer].spineText, back, front, spineRect, barcode };
}

export interface WrapInput extends FrontInput { authorPhoto?: Img; guides?: boolean }

/** Draws the full wrap at `dpi` pixels per inch. The canvas must be geometry.width × geometry.height inches. */
export function drawWrap(ctx: Ctx, g: WrapGeometry, dpi: number, input: WrapInput) {
  const px = (r: Rect): Rect => ({ x: r.x * dpi, y: r.y * dpi, w: r.w * dpi, h: r.h * dpi });
  const { words, settings } = input;
  const colours = wrapColours(settings, input.upload);
  ctx.fillStyle = colours.bg; ctx.fillRect(0, 0, g.width * dpi, g.height * dpi);
  // front, painted into its bleed
  const front = px(g.front);
  drawFront(ctx, front, { x: front.x, y: 0, w: front.w + BLEED * dpi, h: g.height * dpi }, input);
  // spine
  const spine = px(g.spineRect);
  if (g.spineText) {
    const room = spine.w - 0.0625 * 2 * dpi;
    const size = Math.min(room * 0.62, 0.3 * dpi);
    ctx.save(); ctx.translate(spine.x + spine.w / 2, spine.y + spine.h / 2); ctx.rotate(Math.PI / 2);
    const font = settings.mode === 'design' ? settings.font : 'eb-garamond';
    const sfont = FONTS[font].kind === 'script' ? 'cormorant-garamond' : font;
    ctx.fillStyle = colours.ink; ctx.textBaseline = 'middle';
    const len = spine.h - SAFE * 2 * dpi;
    ctx.font = fontString(sfont, size, weightFor(sfont, true));
    const t = fit(ctx, words.title, s => fontString(sfont, s, weightFor(sfont, true)), { w: len * 0.6, h: size * 1.2 }, size, size * 0.4, 1);
    ctx.font = fontString(sfont, t.size, weightFor(sfont, true)); ctx.textAlign = 'left'; ctx.fillText(t.lines.join(' '), -len / 2, 0);
    const a = fit(ctx, words.author || '', s => fontString(sfont, s, 400), { w: len * 0.34, h: size }, size * 0.8, size * 0.35, 1);
    ctx.font = fontString(sfont, a.size, 400); ctx.textAlign = 'right'; ctx.fillText(a.lines.join(' '), len / 2, 0);
    ctx.restore();
  }
  // back
  const back = px(g.back);
  const pad = SAFE * dpi + 0.15 * dpi;
  const inner = { x: back.x + pad, y: back.y + pad, w: back.w - pad * 2 };
  const bodyFont: FontId = settings.mode === 'design' && FONTS[settings.font].kind === 'serif' ? settings.font : 'libre-baskerville';
  let y = inner.y;
  if (settings.blurb?.trim()) {
    const maxH = (g.barcode.y * dpi - 0.3 * dpi) - y - (settings.bio?.trim() ? 1.5 * dpi : 0);
    const paras = settings.blurb.trim().split(/\n\s*\n|\n/);
    let size = 0.17 * dpi;
    let laid: { size: number; lines: string[]; leading: number }[] = [];
    for (;;) {
      ctx.font = fontString(bodyFont, size);
      laid = paras.map(p => ({ size, lines: wrap(s => ctx.measureText(s).width, p, inner.w), leading: 1.45 }));
      const h = laid.reduce((n, l) => n + l.lines.length * size * 1.45 + size * 0.7, 0);
      if (h <= maxH || size < 0.09 * dpi) break;
      size *= 0.95;
    }
    ctx.fillStyle = colours.ink; ctx.font = fontString(bodyFont, size);
    laid.forEach((l, i) => {
      if (i === 0 && paras.length > 1) ctx.font = fontString(bodyFont, size, weightFor(bodyFont, true));
      y = lines(ctx, l, inner.x, y, 'left') + size * 0.7;
      ctx.font = fontString(bodyFont, size);
    });
  }
  if (settings.bio?.trim()) {
    const top = Math.max(y + 0.2 * dpi, g.barcode.y * dpi - 1.55 * dpi);
    const photoSize = input.authorPhoto ? 1.0 * dpi : 0;
    if (input.authorPhoto) { ctx.save(); ctx.beginPath(); ctx.arc(inner.x + photoSize / 2, top + photoSize / 2, photoSize / 2, 0, Math.PI * 2); ctx.clip(); cover(ctx, input.authorPhoto, { x: inner.x, y: top, w: photoSize, h: photoSize }); ctx.restore(); }
    const bx = inner.x + (photoSize ? photoSize + 0.2 * dpi : 0);
    const t = fit(ctx, settings.bio.trim(), s => fontString(bodyFont, s, 400, FONTS[bodyFont].variants.includes('400-italic')), { w: inner.x + inner.w - bx, h: 1.2 * dpi }, 0.13 * dpi, 0.085 * dpi, 8, 1.4);
    ctx.fillStyle = colours.ink; ctx.font = fontString(bodyFont, t.size, 400, FONTS[bodyFont].variants.includes('400-italic'));
    lines(ctx, t, bx, top, 'left');
  }
  // barcode
  const bc = px(g.barcode);
  const digits = isbnDigits(settings.isbn);
  if (digits) drawBarcode(ctx, bc, digits);
  if (input.guides) drawGuides(ctx, g, dpi, !digits);
}

function drawGuides(ctx: Ctx, g: WrapGeometry, dpi: number, emptyBarcode: boolean) {
  ctx.save();
  const lw = Math.max(1, dpi / 100);
  ctx.lineWidth = lw;
  const box = (r: Rect, colour: string, dash: number[]) => { ctx.strokeStyle = colour; ctx.setLineDash(dash.map(d => d * lw)); ctx.strokeRect(r.x * dpi, r.y * dpi, r.w * dpi, r.h * dpi); };
  box({ x: BLEED, y: BLEED, w: g.width - BLEED * 2, h: g.height - BLEED * 2 }, '#e4572e', [6, 4]);
  for (const r of [g.back, g.front]) box({ x: r.x + SAFE, y: r.y + SAFE, w: r.w - SAFE * 2, h: r.h - SAFE * 2 }, '#2f8a62', [3, 3]);
  ctx.setLineDash([]); ctx.strokeStyle = '#2f6bd8';
  for (const x of [g.spineRect.x, g.spineRect.x + g.spineRect.w]) { ctx.beginPath(); ctx.moveTo(x * dpi, 0); ctx.lineTo(x * dpi, g.height * dpi); ctx.stroke(); }
  if (emptyBarcode) { ctx.fillStyle = '#ffffff'; ctx.fillRect(g.barcode.x * dpi, g.barcode.y * dpi, g.barcode.w * dpi, g.barcode.h * dpi); ctx.fillStyle = '#9a9a9a'; ctx.font = `${0.14 * dpi}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Barcode', (g.barcode.x + g.barcode.w / 2) * dpi, (g.barcode.y + g.barcode.h / 2) * dpi); }
  ctx.restore();
}

// ── ISBN and EAN-13 barcode ──

/** The 13 digits of a valid ISBN (ISBN-10 is converted), or null. */
export function isbnDigits(raw?: string): string | null {
  const s = (raw || '').replace(/[\s-]/g, '').toUpperCase();
  if (/^\d{13}$/.test(s)) {
    const sum = [...s.slice(0, 12)].reduce((n, d, i) => n + Number(d) * (i % 2 ? 3 : 1), 0);
    return (10 - (sum % 10)) % 10 === Number(s[12]) && /^97[89]/.test(s) ? s : null;
  }
  if (/^\d{9}[\dX]$/.test(s)) {
    const sum = [...s].reduce((n, d, i) => n + (d === 'X' ? 10 : Number(d)) * (10 - i), 0);
    if (sum % 11) return null;
    const twelve = '978' + s.slice(0, 9);
    const check = (10 - ([...twelve].reduce((n, d, i) => n + Number(d) * (i % 2 ? 3 : 1), 0) % 10)) % 10;
    return twelve + check;
  }
  return null;
}

const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const G = L.map(p => [...p].map(b => (b === '1' ? '0' : '1')).reverse().join(''));
const R = L.map(p => [...p].map(b => (b === '1' ? '0' : '1')).join(''));
const PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];
/** The 95 modules of an EAN-13 barcode as a string of 0s and 1s. */
export function ean13(digits: string): string {
  const p = PARITY[Number(digits[0])];
  let bits = '101';
  for (let i = 1; i <= 6; i++) bits += (p[i - 1] === 'L' ? L : G)[Number(digits[i])];
  bits += '01010';
  for (let i = 7; i <= 12; i++) bits += R[Number(digits[i])];
  return bits + '101';
}

function drawBarcode(ctx: Ctx, r: Rect, digits: string) {
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.fillRect(r.x, r.y, r.w, r.h);
  const bits = ean13(digits);
  const quiet = 11, module = (r.w * 0.9) / (95 + quiet * 2);
  const x0 = r.x + r.w * 0.05 + quiet * module;
  const top = r.y + r.h * 0.2, full = r.h * 0.62, short = full - module * 6;
  ctx.fillStyle = '#000000';
  [...bits].forEach((b, i) => { if (b === '1') { const guard = i < 3 || (i >= 45 && i < 50) || i >= 92; ctx.fillRect(x0 + i * module, top, module + 0.3, guard ? full : short); } });
  const hyphenated = `ISBN ${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}-${digits[12]}`;
  ctx.font = `${r.h * 0.11}px Arial, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(hyphenated, r.x + r.w / 2, r.y + r.h * 0.16);
  ctx.font = `${module * 9}px Arial, sans-serif`;
  ctx.fillText(digits[0], x0 - module * 6, top + full + module * 4);
  ctx.fillText(digits.slice(1, 7), x0 + module * 24, top + full + module * 4);
  ctx.fillText(digits.slice(7), x0 + module * 71, top + full + module * 4);
  ctx.restore();
}

// ── Uploaded cover checks ──

export interface CoverCheck { ok: boolean; message: string }
/** Checks an uploaded front cover against Kindle, Apple Books, Kobo and print at 300 DPI. */
export function checkUpload(width: number, height: number, trim: TrimId, lightEdges = false): CoverCheck[] {
  const out: CoverCheck[] = [];
  const short = Math.min(width, height);
  const ratio = height / width;
  if (width >= height) out.push({ ok: false, message: 'This image is wide. Book covers are tall.' });
  out.push(short >= 500 ? { ok: true, message: `Big enough for Kindle (${width} × ${height} px).` } : { ok: false, message: `Too small for Kindle. It needs at least 500 px across; yours is ${width}.` });
  out.push(short >= 1400 ? { ok: true, message: 'Big enough for Apple Books and Kobo.' } : { ok: false, message: 'Apple Books and Kobo need at least 1400 px across.' });
  out.push(Math.abs(ratio - 1.6) <= 0.04 ? { ok: true, message: 'Kindle shape (1 : 1.6).' } : { ok: false, message: `Kindle’s ideal shape is 1600 × 2560. Yours is 1 : ${ratio.toFixed(2)}, so stores may add bars.` });
  const [tw, th] = trimInches(trim);
  const needW = Math.ceil((tw + BLEED) * 300), needH = Math.ceil((th + BLEED * 2) * 300);
  out.push(width >= needW && height >= needH ? { ok: true, message: 'Sharp in print at 300 DPI.' } : { ok: false, message: `For a sharp print cover, use at least ${needW} × ${needH} px.` });
  const printRatio = (th + BLEED * 2) / (tw + BLEED);
  if (Math.abs(ratio - printRatio) > 0.05) out.push({ ok: false, message: 'The print cover will crop the edges to fit your trim size.' });
  if (lightEdges) out.push({ ok: false, message: 'The edges are very light and will fade into white store pages.' });
  return out;
}

/** True when the outer edge of the image is nearly white (stores ask for a thin grey border). */
export function hasLightEdges(img: Img): boolean {
  if (typeof document === 'undefined') return false;
  const c = document.createElement('canvas'); c.width = 40; c.height = 64;
  const x = c.getContext('2d', { willReadFrequently: true }); if (!x) return false;
  x.drawImage(img, 0, 0, 40, 64);
  const d = x.getImageData(0, 0, 40, 64).data;
  let sum = 0, n = 0;
  for (let y = 0; y < 64; y++) for (let i = 0; i < 40; i++) if (y < 2 || y > 61 || i < 2 || i > 37) { const k = (y * 40 + i) * 4; sum += (d[k] + d[k + 1] + d[k + 2]) / 3; n++; }
  return sum / n > 235;
}

// ── Browser helpers ──

const images = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string): Promise<HTMLImageElement> {
  let p = images.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => { const i = new Image(); i.onload = () => resolve(i); i.onerror = () => reject(new Error('Could not read that image.')); i.src = src; });
    images.set(src, p);
    if (images.size > 24) images.delete(images.keys().next().value as string);
  }
  return p;
}

/** Makes sure the cover fonts are loaded before the canvas draws with them. */
export async function loadCoverFonts(ids: FontId[] = [...COVER_FONTS, 'eb-garamond']) {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('bk-cover-fonts')) { const s = document.createElement('style'); s.id = 'bk-cover-fonts'; s.textContent = fontFaceCss([...COVER_FONTS, 'eb-garamond']); document.head.appendChild(s); }
  await Promise.all(ids.flatMap(id => [document.fonts.load(fontString(id, 40, 400)), document.fonts.load(fontString(id, 40, weightFor(id, true)))]).map(p => p.catch(() => undefined)));
}

export interface CoverImages { photo?: HTMLImageElement; upload?: HTMLImageElement; authorPhoto?: HTMLImageElement }
export async function coverImages(s: CoverSettings): Promise<CoverImages> {
  const [photo, upload, authorPhoto] = await Promise.all([s.photo, s.mode === 'upload' ? s.image : undefined, s.authorPhoto].map(src => (src ? loadImage(src).catch(() => undefined) : undefined)));
  return { photo, upload, authorPhoto };
}

/** The ebook front cover: 1600 × 2560 for a designed cover, the upload's own shape (long side 2560 at most) otherwise. */
export function ebookCanvas(words: CoverWords, s: CoverSettings, imgs: CoverImages): HTMLCanvasElement {
  let w = 1600, h = 2560;
  if (s.mode === 'upload' && imgs.upload) { const k = Math.min(1, 2560 / Math.max(imgs.upload.width, imgs.upload.height)); w = Math.round(imgs.upload.width * k); h = Math.round(imgs.upload.height * k); }
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  const r = { x: 0, y: 0, w, h };
  drawFront(ctx, r, r, { words, settings: s, ...imgs });
  if (s.border) { ctx.strokeStyle = '#c8c8c8'; ctx.lineWidth = Math.max(3, w / 400); ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth); }
  return c;
}

/** A 3D paperback on a soft background, for social posts and store pages. */
export function mockupCanvas(front: HTMLCanvasElement, spineColour: string, w = 1600, h = 1600, backdrop = '#f4eedf'): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(w / 2, h * 0.4, w * 0.1, w / 2, h / 2, w * 0.8); g.addColorStop(0, shade(backdrop, 0.4)); g.addColorStop(1, shade(backdrop, -0.08));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const bookH = Math.min(h * 0.72, w * 0.95 * (front.height / front.width) * 0.62);
  const bookW = bookH * (front.width / front.height);
  const depth = bookW * 0.09;
  const x0 = (w - bookW) / 2 + depth / 2, y0 = (h - bookH) / 2;
  // shadow
  ctx.save(); ctx.filter = `blur(${w * 0.02}px)`; ctx.fillStyle = 'rgba(30,30,25,.35)';
  ctx.beginPath(); ctx.ellipse(x0 + bookW / 2, y0 + bookH * 1.02, bookW * 0.62, bookH * 0.04, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  // spine (left side, receding)
  const taper = bookH * 0.05;
  ctx.fillStyle = shade(spineColour, -0.25);
  ctx.beginPath(); ctx.moveTo(x0 - depth, y0 + taper * 0.6); ctx.lineTo(x0, y0); ctx.lineTo(x0, y0 + bookH); ctx.lineTo(x0 - depth, y0 + bookH - taper * 0.6); ctx.closePath(); ctx.fill();
  // front in vertical slices, shrinking slightly to the right for perspective
  const slices = Math.ceil(bookW / 2);
  for (let i = 0; i < slices; i++) {
    const t = i / slices;
    const sh = bookH * (1 - t * 0.04);
    ctx.drawImage(front, (front.width * i) / slices, 0, front.width / slices + 1, front.height, x0 + (bookW * i) / slices, y0 + (bookH - sh) / 2, bookW / slices + 1, sh);
  }
  // light across the cover and a hinge crease
  const shine = ctx.createLinearGradient(x0, 0, x0 + bookW, 0);
  shine.addColorStop(0, 'rgba(0,0,0,.28)'); shine.addColorStop(0.03, 'rgba(255,255,255,.18)'); shine.addColorStop(0.06, 'rgba(0,0,0,.06)'); shine.addColorStop(0.5, 'rgba(255,255,255,.06)'); shine.addColorStop(1, 'rgba(0,0,0,.08)');
  ctx.fillStyle = shine;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + bookW, y0 + bookH * 0.02); ctx.lineTo(x0 + bookW, y0 + bookH * 0.98); ctx.lineTo(x0, y0 + bookH); ctx.closePath(); ctx.fill();
  return c;
}

export function canvasBlob(c: HTMLCanvasElement, type = 'image/jpeg', quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => c.toBlob(b => (b ? resolve(b) : reject(new Error('Could not make the image.'))), type, quality));
}

/** The print-ready wrap as a one-page PDF at 300 DPI, sized exactly to the printer's cover. */
export async function wrapPdf(g: WrapGeometry, input: WrapInput, title: string): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const dpi = 300;
  const c = document.createElement('canvas'); c.width = Math.round(g.width * dpi); c.height = Math.round(g.height * dpi);
  drawWrap(c.getContext('2d')!, g, dpi, { ...input, guides: false });
  const jpeg = new Uint8Array(await (await canvasBlob(c, 'image/jpeg', 0.95)).arrayBuffer());
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${title} cover`); pdf.setProducer('Booksane'); pdf.setCreator('Booksane');
  const img = await pdf.embedJpg(jpeg);
  const page = pdf.addPage([g.width * 72, g.height * 72]);
  page.drawImage(img, { x: 0, y: 0, width: g.width * 72, height: g.height * 72 });
  page.setTrimBox(BLEED * 72, BLEED * 72, (g.width - BLEED * 2) * 72, (g.height - BLEED * 2) * 72);
  page.setBleedBox(0, 0, g.width * 72, g.height * 72);
  const bytes = await pdf.save();
  return new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer], { type: 'application/pdf' });
}

/** The words printed on the cover, taken from the book's details. */
export function coverWords(p: StudioProject): CoverWords {
  const pub = p.publishing;
  const series = pub?.series?.trim() ? (pub.seriesNumber ? `Book ${pub.seriesNumber} of ${pub.series.trim()}` : pub.series.trim()) : undefined;
  return { title: p.title.trim() || 'Untitled', subtitle: p.subtitle.trim(), author: p.author.trim(), series };
}

/** The ebook cover as base64 JPEG, ready for the EPUB. */
export async function ebookCoverBase64(p: StudioProject): Promise<string | undefined> {
  if (!p.cover) return undefined;
  await loadCoverFonts();
  const c = ebookCanvas(coverWords(p), p.cover, await coverImages(p.cover));
  return c.toDataURL('image/jpeg', 0.92).split(',')[1];
}
