// The store page: book description, the seven keyword boxes, a free sample, and a copy-ready summary.
// Limits and rules from KDP Help: description (4,000 characters, limited HTML, content rules) and keywords (7 × 50 characters).
import { documentText, escape, newSection, safeUrl, textDocument, STORES, type DocumentNode, type StudioProject } from './model';
import { bookGenre } from './autofix';
import { STORE_NAMES } from './publication';

export interface Listing { description?: DocumentNode; keywords?: string[] }
export const DESCRIPTION_LIMIT = 4000;
export const KEYWORD_SLOTS = 7;
export const KEYWORD_LIMIT = 50;

const DESC_NODES = new Set(['doc', 'paragraph', 'heading', 'text', 'bulletList', 'orderedList', 'listItem', 'hardBreak']);
export function validListing(l: unknown): boolean {
  if (!l || typeof l !== 'object') return false;
  const v = l as Listing;
  if (v.keywords !== undefined && !(Array.isArray(v.keywords) && v.keywords.length <= KEYWORD_SLOTS && v.keywords.every(k => typeof k === 'string' && k.length <= 120))) return false;
  if (v.description === undefined) return true;
  let n = 0;
  const ok = (node: DocumentNode, depth: number): boolean => !!node && DESC_NODES.has(node.type || '') && depth < 12 && ++n < 20000
    && (node.text === undefined || (typeof node.text === 'string' && node.text.length < 10000))
    && (node.marks === undefined || (Array.isArray(node.marks) && node.marks.every(m => m && ['bold', 'italic'].includes(m.type))))
    && (node.content === undefined || (Array.isArray(node.content) && node.content.every(c => ok(c, depth + 1))));
  return v.description.type === 'doc' && ok(v.description, 0);
}

/** The description as the HTML KDP accepts: p, b, i, h4, ul, ol, li, br. */
export function descriptionHtml(node?: DocumentNode): string {
  if (!node) return '';
  if (node.type === 'text') {
    let t = escape(node.text || '').replace(/&#39;/g, '’');
    for (const m of node.marks || []) t = m.type === 'bold' ? `<b>${t}</b>` : m.type === 'italic' ? `<i>${t}</i>` : t;
    return t;
  }
  if (node.type === 'hardBreak') return '<br>';
  const inner = (node.content || []).map(descriptionHtml).join('');
  const tag = ({ paragraph: 'p', heading: 'h4', bulletList: 'ul', orderedList: 'ol', listItem: 'li' } as Record<string, string>)[node.type || ''];
  if (node.type === 'listItem') return `<li>${inner.replace(/^<p>|<\/p>$/g, '').replace(/<\/p><p>/g, '<br>')}</li>`;
  if (tag === 'p' && !inner) return '';
  return tag ? `<${tag}>${inner}</${tag}>` : inner;
}

export function descriptionText(node?: DocumentNode): string { return node ? documentText(node).replace(/\n{3,}/g, '\n\n').trim() : ''; }

/** A first draft of the description from the back-cover blurb. */
export function draftDescription(p: StudioProject): DocumentNode {
  const blurb = p.cover?.blurb?.trim() || p.subtitle.trim();
  const paras = blurb ? blurb.split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean) : ['Start with one line that makes a reader need to know more.'];
  const [hook, ...rest] = paras;
  const content: DocumentNode[] = [{ type: 'paragraph', content: [{ type: 'text', text: hook, marks: [{ type: 'bold' }] }] }];
  rest.forEach(t => content.push({ type: 'paragraph', content: [{ type: 'text', text: t }] }));
  const pub = p.publishing;
  if (pub?.series?.trim()) content.push({ type: 'paragraph', content: [{ type: 'text', text: `${pub.seriesNumber ? `Book ${pub.seriesNumber} of` : 'Part of'} the ${pub.series.trim()} series.`, marks: [{ type: 'italic' }] }] });
  return { type: 'doc', content };
}

export interface ListingCheck { ok: boolean; message: string }

const CONTACT = /(https?:\/\/|www\.|\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b|\+?\d[\d\s().-]{8,}\d)/i;
const PRICE = /([$£€]\s?\d|\b\d+(\.\d\d)?\s?(dollars|usd|cents)\b|\bfree\b|\bon sale\b|\b99\s?c\b|\bdiscount)/i;
const TIMED = /\b(limited time|today only|this week only|for a short time|price goes up|act now|pre-?order now|launch price)\b/i;
const REVIEWS = /(\bplease (leave|write) a review\b|\breviews? (are|is) appreciated\b|\b★|\b5[- ]stars?\b|“[^”]{3,}”\s*[—–-]\s*[A-Z][\w .]+(review|times|post|magazine|journal)\b)/i;

export function checkDescription(node?: DocumentNode): ListingCheck[] {
  const html = descriptionHtml(node);
  const text = descriptionText(node);
  if (!text) return [{ ok: false, message: 'Write your description.' }];
  const out: ListingCheck[] = [];
  out.push(html.length <= DESCRIPTION_LIMIT ? { ok: true, message: `${html.length.toLocaleString()} of ${DESCRIPTION_LIMIT.toLocaleString()} characters` } : { ok: false, message: `${html.length.toLocaleString()} characters. KDP allows ${DESCRIPTION_LIMIT.toLocaleString()}, formatting included.` });
  const first = text.split(/\n/)[0] || '';
  out.push(first.length <= 220 ? { ok: true, message: 'Short opening line' } : { ok: false, message: 'Shorten the first line. Readers see only the top before “Read more”.' });
  if (CONTACT.test(text)) out.push({ ok: false, message: 'Remove links, email addresses and phone numbers. KDP doesn’t allow them.' });
  if (PRICE.test(text)) out.push({ ok: false, message: 'Remove prices, “free” and sale wording. KDP doesn’t allow them.' });
  if (TIMED.test(text)) out.push({ ok: false, message: 'Remove time-limited wording like “today only”.' });
  if (REVIEWS.test(text)) out.push({ ok: false, message: 'Remove review quotes and requests. Use Editorial Reviews for quotes.' });
  if (out.length === 2) out.push({ ok: true, message: 'Follows KDP’s description rules' });
  return out;
}

const WASTED = /\b(books?|e-?books?|kindle|amazon|novels?)\b/i;
const BANNED = /(\bbest ?sell(er|ing)\b|#\s?1\b|\bnumber one\b|\bfree\b|\bon sale\b|\bnew\b|\bkindle unlimited\b|\bkdp select\b|\bprime reading\b|\bbest\b.*\bever\b)/i;

export function checkKeyword(k: string, p: StudioProject): string | null {
  const v = k.trim();
  if (!v) return null;
  if (v.length > KEYWORD_LIMIT) return `${v.length} characters. The limit is ${KEYWORD_LIMIT}.`;
  if (BANNED.test(v)) return 'KDP doesn’t allow claims, prices, “new” or program names.';
  if (/["'“”‘’,;]/.test(v)) return 'No quote marks or commas needed.';
  const words = v.toLowerCase().split(/\s+/);
  const taken = new Set(`${p.title} ${p.subtitle} ${p.author} ${p.publishing?.series || ''}`.toLowerCase().match(/[\p{L}\d]+/gu) || []);
  if (words.every(w => taken.has(w))) return 'Already in your title or author name. Use new words.';
  if (WASTED.test(v)) return '“Book”, “Kindle” and “novel” are wasted words here.';
  return null;
}

export function keywordDuplicates(keys: string[]): number[] {
  const seen = new Map<string, number>();
  const dups: number[] = [];
  keys.forEach((k, i) => { const v = k.trim().toLowerCase(); if (!v) return; if (seen.has(v)) dups.push(i); else seen.set(v, i); });
  return dups;
}

const STOP = new Set(('a about above after again against all am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours out over own same she should so some such than that the their theirs them then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself ' +
  'said says say like one two get got go went going come came back know knew thought think see saw look looked made make way time day days thing things even still just really much many also well yet ever never every something nothing anything someone everyone around away again always maybe perhaps must might shall upon toward towards each little long first last next another without within could would should may let')
  .split(/\s+/));

const SEEDS: Record<string, string[]> = {
  romance: ['contemporary romance', 'slow burn romance', 'small town romance', 'second chance romance', 'enemies to lovers', 'romantic comedy'],
  thriller: ['psychological thriller', 'crime thriller', 'suspense thriller', 'detective thriller', 'mystery thriller suspense', 'serial killer thriller'],
  fantasy: ['epic fantasy', 'fantasy adventure', 'sword and sorcery', 'magic school fantasy', 'dragon fantasy', 'coming of age fantasy'],
  'sci-fi': ['space opera', 'science fiction adventure', 'first contact', 'dystopian fiction', 'hard science fiction', 'alien invasion'],
  mystery: ['cozy mystery', 'amateur sleuth', 'murder mystery', 'whodunit mystery', 'police procedural', 'detective mystery'],
  gothic: ['gothic horror', 'haunted house', 'ghost story', 'gothic fiction', 'supernatural suspense', 'dark academia'],
  devotional: ['daily devotional', 'christian living', 'prayer journal', 'bible study', 'spiritual growth', 'faith and hope'],
  business: ['small business', 'leadership skills', 'marketing strategy', 'entrepreneurship', 'personal finance', 'management'],
  'self-help': ['personal growth', 'self improvement', 'mental health', 'building habits', 'confidence', 'mindfulness'],
  memoir: ['memoir', 'family memoir', 'personal stories', 'coming of age memoir', 'true story', 'life lessons'],
};

/** Keyword ideas: phrases the manuscript uses again and again (character names left out), plus common searches for its genre. */
export function keywordIdeas(p: StudioProject, limit = 12): { phrases: string[]; genre?: string; seeds: string[] } {
  const text = p.sections.filter(s => s.kind !== 'frontmatter').map(s => documentText(s.document)).join('\n').slice(0, 400000);
  const caps = new Map<string, [number, number]>();
  for (const m of text.matchAll(/(^|[^.!?]\s+)([\p{L}’']+)/gu)) {
    const w = m[2]; const k = w.toLowerCase(); const c = caps.get(k) || [0, 0];
    c[0]++; if (/^\p{Lu}/u.test(w)) c[1]++; caps.set(k, c);
  }
  const name = (w: string) => { const c = caps.get(w); return !!c && c[0] >= 2 && c[1] / c[0] > 0.7; };
  const counts = new Map<string, number>();
  for (const sentence of text.toLowerCase().split(/[.!?;:\n—–()"“”]+/)) {
    const ws = sentence.match(/[\p{L}’']+/gu) || [];
    for (let n = 2; n <= 3; n++) for (let i = 0; i + n <= ws.length; i++) {
      const g = ws.slice(i, i + n);
      if (STOP.has(g[0]) || STOP.has(g[n - 1]) || g.some(w => w.length < 3 || name(w) || /’|'/.test(w)) || g.filter(w => STOP.has(w)).length > 1) continue;
      const k = g.join(' ');
      counts.set(k, (counts.get(k) || 0) + 1);
    }
  }
  const taken = new Set(`${p.title} ${p.subtitle}`.toLowerCase().match(/[\p{L}\d]+/gu) || []);
  const phrases = [...counts].filter(([k, c]) => c >= 3 && !k.split(' ').every(w => taken.has(w))).sort((a, b) => b[1] * b[0].split(' ').length - a[1] * a[0].split(' ').length).map(([k]) => k);
  const unique = phrases.filter((k, i) => !phrases.slice(0, i).some(o => o.includes(k) || k.includes(o))).slice(0, limit);
  const genre = bookGenre(p);
  return { phrases: unique, genre, seeds: genre ? SEEDS[genre] || [] : [] };
}

/** A free sample: front pages, the first chapters, then a page sending the reader to the full book. */
export function sampleEdition(p: StudioProject, chapters: number): StudioProject {
  const out: StudioProject['sections'] = [];
  let seen = 0;
  for (const s of p.sections) {
    if (s.kind === 'backmatter') continue;
    if (s.kind === 'chapter') { if (seen >= chapters) break; seen++; }
    out.push(s);
  }
  while (out.length && out[out.length - 1].kind === 'part') out.pop();
  const links = p.publishing?.storeLinks || {};
  const stores = STORES.map(s => [STORE_NAMES[s], safeUrl(links[s])] as const).filter(([, u]) => u);
  const site = safeUrl(links.website);
  const end = { ...newSection('backmatter', 'Keep reading'), document: textDocument(`Thank you for reading the opening of ${p.title}.\n\n${stores.length || site ? 'The full book is waiting for you:' : 'The full book is available now wherever books are sold.'}`) };
  const list: DocumentNode[] = [...stores.map(([n, u]) => ({ type: 'paragraph', content: [{ type: 'text', text: n, marks: [{ type: 'link', attrs: { href: u } }] }] })), ...(site ? [{ type: 'paragraph', content: [{ type: 'text', text: site.replace(/^https?:\/\//, ''), marks: [{ type: 'link', attrs: { href: site } }] }] }] : [])];
  end.document.content = [...(end.document.content || []), ...list];
  return { ...p, id: `${p.id}-sample`, title: p.title, sections: [...out, end], publishing: { ...p.publishing, alsoBy: [], newsletterText: undefined, newsletterUrl: undefined, storeLinks: {} } };
}

/** Everything the store forms ask for, as plain text. */
export function listingKit(p: StudioProject): string {
  const l = p.listing || {};
  const pub = p.publishing || {};
  const lines = [
    `Title: ${p.title}`, p.subtitle ? `Subtitle: ${p.subtitle}` : null, pub.series ? `Series: ${pub.series}${pub.seriesNumber ? ` (Book ${pub.seriesNumber})` : ''}` : null,
    `Author: ${p.author}`, `Language: ${p.language}`, '',
    'Description (HTML for KDP):', descriptionHtml(l.description), '',
    'Description (plain text):', descriptionText(l.description), '',
    'Keywords:', ...(l.keywords || []).filter(k => k.trim()).map((k, i) => `${i + 1}. ${k.trim()}`),
  ];
  return lines.filter((x): x is string => typeof x === 'string').join('\n') + '\n';
}
