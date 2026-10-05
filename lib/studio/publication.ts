import JSZip from 'jszip';
import { STORES, documentHtml, escape, readProject, safeUrl, type Store, type StudioProject } from './model';
import { TRIMS, chapterLabel, chapterOpening, fontFaceCss, fontStack, numberWords, resolveDesign, themeCss, type ResolvedDesign } from './themes';

export const STORE_NAMES: Record<Store, string> = { amazon: 'Amazon Kindle', apple: 'Apple Books', kobo: 'Kobo', google: 'Google Play Books', bn: 'Barnes & Noble' };
export type EpubTarget = 'universal' | Store;

const SHARED_CSS = `.callout{margin:1.3em 0;padding:.85em 1.05em;border:.6pt solid #9a9a9a;border-radius:4pt;break-inside:avoid}.callout p{text-indent:0}.callout p+p{margin-top:.5em}
  .callout-tip{border-left:3pt solid #333}.callout-warning{border:1pt solid #333;background:#f3f3f1}.callout-quote{border:0;border-left:2pt solid #333;border-radius:0;font-style:italic}
  .part-head{text-align:center}.part-head .section-label{margin-bottom:1em}
  .also-by{list-style:none;padding:0;margin:0;text-align:center}.also-by li{margin:.55em 0;font-style:italic}.auto p{text-indent:0;text-align:center}.auto .series{font-variant:small-caps;letter-spacing:.05em;margin-bottom:1.2em}
  .store-links{list-style:none;padding:0;text-align:center}.store-links li{margin:.5em 0}`;

interface BuiltSection { kind: string; title: string; body: string; notes: string[]; auto?: boolean }

/** Every section of the book in reading order, including the pages Booksane writes for you ("Also by", "Stay in touch"). */
function buildSections(project: StudioProject, d: ResolvedDesign, forEbook: boolean, target: EpubTarget = 'universal'): BuiltSection[] {
  let chapterNo = 0;
  let partNo = 0;
  const out: BuiltSection[] = project.sections.map(s => {
    const notes: string[] = [];
    const html = documentHtml(s.document, forEbook ? notes : undefined);
    if (s.kind === 'part') {
      return { kind: 'part', title: s.title, notes, body: `<header class="section-head part-head"><div class="section-label">Part ${numberWords(++partNo)}</div><h1>${escape(s.title)}</h1></header>${html}` };
    }
    const label = s.kind === 'chapter' ? chapterLabel(d.label, ++chapterNo) : '';
    return { kind: s.kind, title: s.title, notes, body: `<header class="section-head">${label ? `<div class="section-label">${label}</div>` : ''}<h1>${escape(s.title)}</h1></header>${s.kind === 'chapter' ? chapterOpening(html, d) : html}` };
  });
  const pub = project.publishing || {};
  const also = (pub.alsoBy || []).map(t => t.trim()).filter(Boolean);
  if (also.length) {
    out.push({ kind: 'backmatter', title: `Also by ${project.author || 'the author'}`, notes: [], auto: true,
      body: `<header class="section-head"><h1>Also by ${escape(project.author || 'the author')}</h1></header>${pub.series ? `<p class="series">The ${escape(pub.series)} series</p>` : ''}<ul class="also-by">${also.map(t => `<li>${escape(t)}</li>`).join('')}</ul>` });
  }
  const raw = pub.storeLinks || {};
  const links: Partial<Record<Store | 'website', string>> = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, safeUrl(v)]).filter(([, v]) => v));
  const newsletterUrl = safeUrl(pub.newsletterUrl);
  const review = forEbook ? (target === 'universal' ? STORES.filter(s => links[s]) : STORES.filter(s => s === target && links[s])) : [];
  const site = links.website;
  if (pub.newsletterText || newsletterUrl || review.length || site) {
    const link = (url: string, text: string) => forEbook ? `<a href="${escape(url)}">${escape(text)}</a>` : escape(url.replace(/^https?:\/\//, ''));
    out.push({ kind: 'backmatter', title: 'Stay in touch', notes: [], auto: true,
      body: `<header class="section-head"><h1>Stay in touch</h1></header>${pub.newsletterText ? `<p>${escape(pub.newsletterText)}</p>` : ''}${newsletterUrl ? `<p>${link(newsletterUrl, 'Join the newsletter')}</p>` : ''}${site ? `<p>${link(site, site.replace(/^https?:\/\//, ''))}</p>` : ''}${review.length ? `<p>If you enjoyed this book, a short review helps other readers find it.</p><ul class="store-links">${review.map(s => `<li><a href="${escape(links[s] || '')}">Review on ${STORE_NAMES[s]}</a></li>`).join('')}</ul>` : ''}` });
  }
  return out;
}

const noteList = (notes: string[]) => notes.length ? `<section class="footnotes" epub:type="footnotes" role="doc-endnotes">${notes.map((n, i) => `<aside id="fn-${i + 1}" epub:type="footnote" role="doc-footnote"><p><a href="#fnref-${i + 1}">${i + 1}</a>. ${n}</p></aside>`).join('')}</section>` : '';

export function publicationCss(project: StudioProject): string {
  const d = resolveDesign(project.design);
  return `${fontFaceCss([d.body, d.heading])}
  *{box-sizing:border-box}body{font-family:${fontStack(d.body)};font-size:${d.fontSize}pt;line-height:${d.lineHeight};color:#171717;margin:0}
  h1,h2,h3{line-height:1.2;font-weight:normal;break-after:avoid}h1{font-size:26pt}h2{font-size:17pt}h3{font-size:14pt}h2,h3{font-family:${fontStack(d.heading)}}
  p{margin:0;text-indent:1.2em;orphans:2;widows:2}header+p,h2+p,h3+p,.scene-break+p{ text-indent:0 }
  ul,ol{padding-left:1.6em}li p,blockquote p{ text-indent:0 }blockquote{font-style:italic;margin:1.5em}
  .scene-break{text-align:center;text-indent:0;margin:1.5em 0;break-after:avoid}img{max-width:100%;height:auto;break-inside:avoid}
  table{width:100%;border-collapse:collapse;margin:1.5em 0;font-size:.9em}td,th{border:1px solid #bbb;padding:.5em;vertical-align:top}td p,th p{ text-indent:0 }tr{break-inside:avoid}a{color:inherit}
  .title-page{text-align:center;padding-top:1.8in}.title-page p{text-indent:0}.title-page h1{font-family:${fontStack(d.heading)};font-size:32pt;font-weight:400}.subtitle{margin:1em 0 3em}
  .section-head{padding-top:.8in;margin-bottom:2em}.section-label{font-size:9pt;letter-spacing:.16em;text-transform:uppercase;margin-bottom:1.5em}
  .contents h1{font-family:${fontStack(d.heading)}}.contents a{text-decoration:none}.contents li{margin:.7em 0}.contents ol{list-style:none;padding:0}
  .footnote{float:footnote;font-size:${Math.max(7, d.fontSize * 0.78).toFixed(2)}pt;line-height:1.35;text-indent:0;text-align:left;font-style:normal}
  ::footnote-call{font-size:.62em;vertical-align:super;line-height:0}
  ${SHARED_CSS}
  ${themeCss(d)}`;
}

export function printHtml(project: StudioProject, paginate = true): string {
  readProject(project);
  const size = TRIMS[project.design.trim].size;
  const gutter = project.design.gutter ?? 0.75;
  const d = resolveDesign(project.design);
  const q = (v: string) => escape(v).replace(/'/g, "\\'");
  const small = `font:8pt ${fontStack(d.body)};color:#777`;
  const num = `content:counter(page);font:9pt ${fontStack(d.body)};color:#666`;
  const heads = d.runningHead === 'none' ? ['', ''] : d.runningHead === 'title-chapter'
    ? [`content:'${q(project.title)}';${small}`, `content:string(chapter-title);${small}`]
    : [`content:'${q(project.author)}';${small}`, `content:string(book-title);${small}`];
  const centre = d.pageNumber === 'center' ? `@bottom-center{${num}}` : '';
  const outer = d.pageNumber === 'outer';
  const none = '@top-left{content:none}@top-right{content:none}@bottom-center{content:none}@bottom-left{content:none}@bottom-right{content:none}';
  const built = buildSections(project, d, false);
  const sections = built.map((s, index) => `<section class="book-section ${s.kind}${s.auto ? ' auto' : ''}" id="section-${index}">${s.body}</section>`).join('');
  const contents = built.map((s, i) => `<li${s.kind === 'part' ? ' class="part-entry"' : ''}><a href="#section-${i}">${escape(s.title)}</a></li>`).join('');
  return `<!doctype html><html lang="${escape(project.language)}"><head><meta charset="utf-8"><title>${escape(project.title)}</title><style>${publicationCss(project)}
  @page{size:${size};margin:.75in .65in .8in ${gutter}in;${centre}@footnote{border-top:.5pt solid #999;padding-top:5pt;margin-top:10pt}}
  @page:left{margin-left:.65in;margin-right:${gutter}in;${heads[0] ? `@top-left{${heads[0]}}` : ''}${outer ? `@bottom-left{${num}}` : ''}}
  @page:right{${heads[1] ? `@top-right{${heads[1]}}` : ''}${outer ? `@bottom-right{${num}}` : ''}}
  @page title{${none}}
  @page part{${none}}
  @page chapter:first{@top-left{content:none}@top-right{content:none}}
  @page:blank{${none}}
  @page end{${none}}
  .end-page{page:end;break-before:page;color:transparent}
  .title-page{page:title}.title-page h1{string-set:book-title content(text)}.chapter .section-head h1{string-set:chapter-title content(text)}.book-section,.contents{break-before:page}.chapter{page:chapter;break-before:${project.design.recto ? 'right' : 'page'}}
  .part{page:part;break-before:right;break-after:page}.part .part-head{padding-top:2.6in;margin:0}
  .contents a{display:block}.contents a::after{float:right;content:target-counter(attr(href),page)}.contents .part-entry{margin-top:1.3em;font-variant:small-caps;letter-spacing:.04em}
  </style><style data-pagedjs-ignore>@media screen{body{background:#e8e8e5}.pagedjs_pages{display:flex;flex-direction:column;align-items:center;gap:24px;padding:30px 0}.pagedjs_page{background:white;box-shadow:0 3px 15px #0001}.pagedjs_page_content{overflow:hidden}}</style>${paginate ? `<script>window.PagedConfig={auto:false};window.booksaneReady=false;</script><script src="/layout/paged.polyfill.js"></script>` : ''}</head><body>
  <section class="title-page"><h1>${escape(project.title)}</h1>${project.subtitle ? `<p class="subtitle">${escape(project.subtitle)}</p>` : ''}<p>${escape(project.author)}</p></section>
  <section class="contents"><h1>Contents</h1><ol>${contents}</ol></section>${sections}${project.design.endBlank ? '<section class="end-page" aria-hidden="true">&#160;</section>' : ''}
  ${paginate ? `<script>const sheet=document.querySelector('style');const css=sheet.textContent;sheet.remove();const base=document.baseURI.startsWith('http')?document.baseURI:'https://booksane.invalid/';window.PagedPolyfill.preview(undefined,[{[base]:css}]).then(flow=>{window.booksaneReady=true;window.booksanePages=flow.total;parent.postMessage({type:'booksane-layout',pages:flow.total},'*')}).catch(error=>{window.booksaneError=String(error);parent.postMessage({type:'booksane-layout-error'},'*')});</script>` : ''}</body></html>`;
}

export const EPUB_BASE_CSS = 'body{font-family:serif;line-height:1.5}h1,h2,h3{line-height:1.2}p{text-indent:1.2em;margin:0}h1+p,h2+p,h3+p,header+p{ text-indent:0 }img{max-width:100%;height:auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid;padding:.5em}td p,th p{ text-indent:0 }.scene-break{text-align:center;text-indent:0;margin:1.5em 0}blockquote{margin:1.5em}.section-head{margin:2em 0 1.5em}.section-label{text-indent:0;font-size:.8em;letter-spacing:.14em;text-transform:uppercase;margin-bottom:.8em}.part .part-head{margin-top:30%}.noteref{font-size:.7em;vertical-align:super;line-height:0;text-decoration:none}.footnotes{margin-top:2em;padding-top:.6em;border-top:1px solid #999;font-size:.85em}.footnotes p{text-indent:0}' + SHARED_CSS.replace(/\s+/g, ' ');

/** `coverJpeg` is the front cover as base64 JPEG; it becomes the store thumbnail and the first page. */
export async function studioEpub(project: StudioProject, target: EpubTarget = 'universal', coverJpeg?: string): Promise<Blob> {
  readProject(project);
  const d = resolveDesign(project.design);
  const zip = new JSZip();
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.file('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const assets: string[] = [];
  const packageImages = (html: string) => html.replace(/src="data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)"/g, (_, mime: string, bytes: string) => {
    const filename = `images/image-${assets.length + 1}.${mime === 'jpeg' ? 'jpg' : 'png'}`;
    zip.file(`EPUB/${filename}`, bytes, { base64: true });
    assets.push(`<item id="image-${assets.length + 1}" href="${filename}" media-type="image/${mime}"/>`);
    return `src="${filename}"`;
  });
  const xhtml = (title: string, body: string) => `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${escape(project.language)}" xml:lang="${escape(project.language)}"><head><title>${escape(title)}</title><link rel="stylesheet" href="book.css" type="text/css"/></head><body>${body}</body></html>`;
  if (coverJpeg) {
    zip.file('EPUB/images/cover.jpg', coverJpeg, { base64: true });
    zip.file('EPUB/cover.xhtml', xhtml('Cover', `<section epub:type="cover" class="cover-page"><img src="images/cover.jpg" alt="${escape(project.title)} cover"/></section>`));
  }
  zip.file('EPUB/title.xhtml', xhtml(project.title, `<section epub:type="titlepage"><h1>${escape(project.title)}</h1><p>${escape(project.subtitle)}</p><p>${escape(project.author)}</p></section>`));
  const built = buildSections(project, d, true, target);
  built.forEach((s, i) => zip.file(`EPUB/section-${i}.xhtml`, xhtml(s.title, `<section class="${s.kind}${s.auto ? ' auto' : ''}">${packageImages(s.body)}${noteList(s.notes)}</section>`)));
  zip.file('EPUB/nav.xhtml', xhtml('Contents', `<nav epub:type="toc" id="toc"><h1>Contents</h1><ol><li><a href="title.xhtml">Title page</a></li>${built.map((s, i) => `<li><a href="section-${i}.xhtml">${escape(s.title)}</a></li>`).join('')}</ol></nav>`));
  zip.file('EPUB/book.css', EPUB_BASE_CSS + '.cover-page{margin:0;padding:0;text-align:center;page-break-after:always}.cover-page img{max-width:100%;max-height:100vh;height:auto}' + themeCss(d, true));
  const uid = `urn:uuid:${crypto.randomUUID()}`;
  const series = project.publishing?.series ? `<meta property="belongs-to-collection" id="series">${escape(project.publishing.series)}</meta><meta refines="#series" property="collection-type">series</meta>${project.publishing.seriesNumber ? `<meta refines="#series" property="group-position">${project.publishing.seriesNumber}</meta>` : ''}` : '';
  zip.file('EPUB/package.opf', `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">${uid}</dc:identifier><dc:title>${escape(project.title)}</dc:title><dc:creator>${escape(project.author)}</dc:creator><dc:language>${escape(project.language)}</dc:language>${series}${coverJpeg ? '<meta name="cover" content="cover-image"/>' : ''}<meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta></metadata><manifest>${coverJpeg ? '<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/><item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>' : ''}<item id="title" href="title.xhtml" media-type="application/xhtml+xml"/><item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/><item id="css" href="book.css" media-type="text/css"/>${built.map((_, i) => `<item id="s${i}" href="section-${i}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${assets.join('')}</manifest><spine>${coverJpeg ? '<itemref idref="cover"/>' : ''}<itemref idref="title"/><itemref idref="nav"/>${built.map((_, i) => `<itemref idref="s${i}"/>`).join('')}</spine></package>`);
  return zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip', compression: 'DEFLATE' });
}

export type ReaderTheme = 'white' | 'sepia' | 'dark';
/** The reading edition exactly as the EPUB styles it, for the on-screen eBook preview. */
export function ebookHtml(project: StudioProject, reader: ReaderTheme = 'white', size = 17): string {
  const d = resolveDesign(project.design);
  const colours = { white: ['#fbfaf6', '#222'], sepia: ['#f4ecd8', '#3b2f1f'], dark: ['#121212', '#d9d6cf'] }[reader];
  const body = buildSections(project, d, true).map(s => `<section class="${s.kind}${s.auto ? ' auto' : ''}">${s.body}${noteList(s.notes)}</section>`).join('');
  return `<!doctype html><html lang="${escape(project.language)}"><head><meta charset="utf-8"><style>${EPUB_BASE_CSS}${themeCss(d, true)}body{margin:0;padding:28px 24px 40px;font-family:Georgia,serif;font-size:${size}px;color:${colours[1]};background:${colours[0]}}a{color:inherit}.titlepage{text-align:center;margin:30px 0 40px}.titlepage h1{font-size:1.8em;font-weight:400}section{margin-bottom:2.5em}${reader === 'dark' ? '.callout,.footnotes{border-color:#555}.callout-warning{background:#1e1e1e}' : ''}.cover-shot{display:block;width:100%;max-width:420px;margin:0 auto 34px;box-shadow:0 6px 20px #0003}</style></head><body>${project.cover?.thumb ? `<img class="cover-shot" src="${project.cover.thumb}" alt="Cover"/>` : ''}<section class="titlepage"><h1>${escape(project.title)}</h1><p>${escape(project.author)}</p></section>${body}</body></html>`;
}
