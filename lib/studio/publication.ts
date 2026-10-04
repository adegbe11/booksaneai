import JSZip from 'jszip';
import { documentHtml, escape, readProject, type StudioProject } from './model';
import { TRIMS, chapterLabel, chapterOpening, fontFaceCss, fontStack, resolveDesign, themeCss } from './themes';

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
  ${themeCss(d)}`;
}

export function printHtml(project: StudioProject, paginate = true): string {
  readProject(project);
  const size = TRIMS[project.design.trim].size;
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
  let number = 0;
  const sections = project.sections.map((s, index) => {
    const label = s.kind === 'chapter' ? chapterLabel(d.label, ++number) : '';
    return `<section class="book-section ${s.kind}" id="section-${index}"><header class="section-head">${label ? `<div class="section-label">${label}</div>` : ''}<h1>${escape(s.title)}</h1></header>${s.kind === 'chapter' ? chapterOpening(documentHtml(s.document), d) : documentHtml(s.document)}</section>`;
  }).join('');
  const contents = project.sections.map((s, i) => `<li><a href="#section-${i}">${escape(s.title)}</a></li>`).join('');
  return `<!doctype html><html lang="${escape(project.language)}"><head><meta charset="utf-8"><title>${escape(project.title)}</title><style>${publicationCss(project)}
  @page{size:${size};margin:.75in .65in .8in .75in;${centre}}
  @page:left{margin-left:.65in;margin-right:.75in;${heads[0] ? `@top-left{${heads[0]}}` : ''}${outer ? `@bottom-left{${num}}` : ''}}
  @page:right{${heads[1] ? `@top-right{${heads[1]}}` : ''}${outer ? `@bottom-right{${num}}` : ''}}
  @page title{${none}}
  @page:blank{${none}}
  .title-page{page:title}.title-page h1{string-set:book-title content(text)}.chapter .section-head h1{string-set:chapter-title content(text)}.book-section,.contents{break-before:page}.chapter{break-before:${project.design.recto ? 'right' : 'page'}}
  .contents a{display:block}.contents a::after{float:right;content:target-counter(attr(href),page)}
  </style><style data-pagedjs-ignore>@media screen{body{background:#e8e8e5}.pagedjs_pages{display:flex;flex-direction:column;align-items:center;gap:24px;padding:30px 0}.pagedjs_page{background:white;box-shadow:0 3px 15px #0001}.pagedjs_page_content{overflow:hidden}}</style>${paginate ? `<script>window.PagedConfig={auto:false};window.booksaneReady=false;</script><script src="/layout/paged.polyfill.js"></script>` : ''}</head><body>
  <section class="title-page"><h1>${escape(project.title)}</h1>${project.subtitle ? `<p class="subtitle">${escape(project.subtitle)}</p>` : ''}<p>${escape(project.author)}</p></section>
  <section class="contents"><h1>Contents</h1><ol>${contents}</ol></section>${sections}
  ${paginate ? `<script>const sheet=document.querySelector('style');const css=sheet.textContent;sheet.remove();const base=document.baseURI.startsWith('http')?document.baseURI:'https://booksane.invalid/';window.PagedPolyfill.preview(undefined,[{[base]:css}]).then(flow=>{window.booksaneReady=true;window.booksanePages=flow.total;parent.postMessage({type:'booksane-layout',pages:flow.total},'*')}).catch(error=>{window.booksaneError=String(error);parent.postMessage({type:'booksane-layout-error'},'*')});</script>` : ''}</body></html>`;
}

const EPUB_BASE_CSS = 'body{font-family:serif;line-height:1.5}h1,h2,h3{line-height:1.2}p{text-indent:1.2em;margin:0}h1+p,h2+p,h3+p,header+p{ text-indent:0 }img{max-width:100%;height:auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid;padding:.5em}td p,th p{ text-indent:0 }.scene-break{text-align:center;text-indent:0;margin:1.5em 0}blockquote{margin:1.5em}.section-head{margin:2em 0 1.5em}.section-label{text-indent:0;font-size:.8em;letter-spacing:.14em;text-transform:uppercase;margin-bottom:.8em}';

export async function studioEpub(project: StudioProject): Promise<Blob> {
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
  zip.file('EPUB/title.xhtml', xhtml(project.title, `<section epub:type="titlepage"><h1>${escape(project.title)}</h1><p>${escape(project.subtitle)}</p><p>${escape(project.author)}</p></section>`));
  let chapterNo = 0;
  project.sections.forEach((s, i) => {
    const label = s.kind === 'chapter' ? chapterLabel(d.label, ++chapterNo) : '';
    zip.file(`EPUB/section-${i}.xhtml`, xhtml(s.title, `<section class="${s.kind}"><header class="section-head">${label ? `<p class="section-label">${label}</p>` : ''}<h1>${escape(s.title)}</h1></header>${packageImages(s.kind === 'chapter' ? chapterOpening(documentHtml(s.document), d) : documentHtml(s.document))}</section>`));
  });
  zip.file('EPUB/nav.xhtml', xhtml('Contents', `<nav epub:type="toc" id="toc"><h1>Contents</h1><ol><li><a href="title.xhtml">Title page</a></li>${project.sections.map((s, i) => `<li><a href="section-${i}.xhtml">${escape(s.title)}</a></li>`).join('')}</ol></nav>`));
  zip.file('EPUB/book.css', EPUB_BASE_CSS + themeCss(d, true));
  const uid = `urn:uuid:${crypto.randomUUID()}`;
  zip.file('EPUB/package.opf', `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">${uid}</dc:identifier><dc:title>${escape(project.title)}</dc:title><dc:creator>${escape(project.author)}</dc:creator><dc:language>${escape(project.language)}</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta></metadata><manifest><item id="title" href="title.xhtml" media-type="application/xhtml+xml"/><item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/><item id="css" href="book.css" media-type="text/css"/>${project.sections.map((_, i) => `<item id="s${i}" href="section-${i}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${assets.join('')}</manifest><spine><itemref idref="title"/><itemref idref="nav"/>${project.sections.map((_, i) => `<itemref idref="s${i}"/>`).join('')}</spine></package>`);
  return zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip', compression: 'DEFLATE' });
}

/** The reading edition exactly as the EPUB styles it, for the on-screen eBook preview. */
export function ebookHtml(project: StudioProject): string {
  const d = resolveDesign(project.design);
  let chapterNo = 0;
  const body = project.sections.map(s => {
    const label = s.kind === 'chapter' ? chapterLabel(d.label, ++chapterNo) : '';
    return `<section class="${s.kind}"><header class="section-head">${label ? `<p class="section-label">${label}</p>` : ''}<h1>${escape(s.title)}</h1></header>${s.kind === 'chapter' ? chapterOpening(documentHtml(s.document), d) : documentHtml(s.document)}</section>`;
  }).join('');
  return `<!doctype html><html lang="${escape(project.language)}"><head><meta charset="utf-8"><style>${EPUB_BASE_CSS}${themeCss(d, true)}body{margin:0;padding:28px 24px 40px;font-family:Georgia,serif;font-size:17px;color:#222;background:#fbfaf6}.titlepage{text-align:center;margin:30px 0 40px}.titlepage h1{font-size:1.8em;font-weight:400}section{margin-bottom:2.5em}</style></head><body><section class="titlepage"><h1>${escape(project.title)}</h1><p>${escape(project.author)}</p></section>${body}</body></html>`;
}
