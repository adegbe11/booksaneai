import type { BookData, Template } from '@/types';
import { getChapterNumberDisplay } from './formatter';

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function buildPrintHTML(book: BookData, template: Template): string {
  const sizes = { trade: '6in 9in', digest: '5.5in 8.5in', mass: '5in 8in', a5: '148mm 210mm' };
  const text = (value: string) => value.split(/\n\s*\n/).map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
  const section = (title: string, value?: string) => value ? `<section class="matter"><h1>${title}</h1>${text(value)}</section>` : '';
  const chapters = book.chapters.map(ch => `<section class="chapter"><header>${template.chapterNumberStyle === 'none' ? '' : `<div class="chapter-number">Chapter ${getChapterNumberDisplay(ch.number, template.chapterNumberStyle)}</div>`}<h1>${escapeHtml(ch.title)}</h1></header>${ch.content}</section>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(book.title)}</title>
  <style>
  @page { size: ${sizes[template.pageSize]}; margin: ${template.pageMarginV} ${template.pageMarginH}; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ${template.bodyFont}; font-size: ${template.bodySize}; line-height: ${template.lineHeight}; color: #111; background: white; }
  section { break-before: page; } section:first-of-type { break-before: auto; }
  .title { text-align: center; padding-top: 2in; } .title p { text-indent: 0; }
  h1 { font-family: ${template.headingFont}; font-size: ${template.headingSize}; font-weight: ${template.headingWeight}; text-align: ${template.headingAlign}; text-transform: ${template.headingTransform}; break-after: avoid; }
  .chapter header { padding-top: 1in; margin-bottom: 1.5em; break-inside: avoid; }
  .chapter-number { text-align: ${template.headingAlign}; font-size: ${template.chapterNumberSize}; }
  p { margin: 0 0 ${template.paragraphSpacing}; text-indent: ${template.paragraphStyle === 'indent' ? template.textIndent : '0'}; orphans: 2; widows: 2; }
  header + p, .section-break + p, .matter p { text-indent: 0; }
  .section-break { text-align: center; text-indent: 0; margin: 1.5em 0; }
  img { max-width: 100%; } table { width: 100%; border-collapse: collapse; } td, th { padding: .4em; border: 1px solid #aaa; }
  .instructions { padding: 16px; background: #fff4bc; font: 14px system-ui; margin-bottom: 24px; }
  @media print { .instructions { display: none; } }
  </style></head><body><aside class="instructions">Print proof: select Save as PDF, match the paper size, use 100% scale, and disable browser headers and footers. Review every page before uploading. This is not a certified press-ready PDF.</aside>
  <section class="title"><h1>${escapeHtml(book.title)}</h1>${book.subtitle ? `<p>${escapeHtml(book.subtitle)}</p>` : ''}<p>${escapeHtml(book.author)}</p></section>
  ${section('Dedication', book.dedication)}${section('Epigraph', book.epigraph ? `${book.epigraph}\n\n${book.epigraphAttribution || ''}` : undefined)}
  ${chapters}${section('Acknowledgments', book.acknowledgments)}${section('About the Author', book.aboutAuthor)}
  </body></html>`;
}
