'use client';
import type { BookData } from '@/types';
import type { Template } from '@/types';

// ─────────────────────────────────────────
//  WORD (.docx) GENERATOR
//  Uses the `docx` npm package to create a
//  properly-structured Word document
// ─────────────────────────────────────────

export async function generateDocx(bookData: BookData, template: Template): Promise<Blob> {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, PageBreak,
  } = await import('docx');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // ── helper: parse inline HTML to docx TextRun array (preserves bold/italic/underline/strike)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodeEntities = (s: string) => s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const innerHtmlToRuns = (html: string): any[] => {
    const runs: any[] = [];
    let bold = false, italic = false, under = false, strike = false, sup = false, sub = false;
    let text = '';
    const flush = () => {
      if (!text) return;
      runs.push(new TextRun({
        text: decodeEntities(text),
        bold:      bold      || undefined,
        italics:   italic    || undefined,
        underline: under     ? {} : undefined,
        strike:    strike    || undefined,
        superScript: sup     || undefined,
        subScript:   sub     || undefined,
      }));
      text = '';
    };
    let i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        flush();
        const end = html.indexOf('>', i);
        if (end === -1) { text += html[i++]; continue; }
        const raw  = html.slice(i + 1, end);
        const close = raw[0] === '/';
        const name  = (close ? raw.slice(1) : raw).split(/[\s/]/)[0].toLowerCase();
        if      (name === 'strong' || name === 'b')  bold   = !close;
        else if (name === 'em'     || name === 'i')  italic = !close;
        else if (name === 'u')                       under  = !close;
        else if (name === 's' || name === 'del')     strike = !close;
        else if (name === 'sup')                     sup    = !close;
        else if (name === 'sub')                     sub    = !close;
        else if (name === 'br')                      text  += '\n';
        i = end + 1;
      } else {
        text += html[i++];
      }
    }
    flush();
    return runs.length ? runs : [new TextRun({ text: decodeEntities(html.replace(/<[^>]*>/g, '')) })];
  };

  // ── helper: parse HTML paragraphs preserving inline formatting
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const htmlToParagraphs = (html: string, indent: boolean): any[] => {
    const paras: any[] = [];
    const re = /<(h[1-3]|p)([^>]*)>([\s\S]*?)<\/\1>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const tag   = m[1].toLowerCase();
      const inner = m[3];
      const plain = inner.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      if (!plain && !inner.trim()) continue;
      const runs  = innerHtmlToRuns(inner);
      if (tag === 'p') {
        // Check for section break
        if (/class="section-break"/.test(m[2]) || /^\* \* \*$/.test(plain)) {
          paras.push(new Paragraph({
            children: [new TextRun({ text: '* * *' })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 240 },
          }));
        } else {
          paras.push(new Paragraph({
            children: runs,
            style: 'BodyText',
            indent: indent ? { firstLine: 720 } : undefined,
            spacing: indent ? { before: 0, after: 0 } : { after: 160 },
          }));
        }
      } else {
        // In-chapter headings from Tiptap (H1/H2/H3)
        const level = tag === 'h1' ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
        paras.push(new Paragraph({ children: runs, heading: level, spacing: { before: 240, after: 120 } }));
      }
    }
    return paras.length ? paras : [new Paragraph({ children: [new TextRun({ text: '' })] })];
  };

  // ── TITLE PAGE
  children.push(
    new Paragraph({
      text: '',
      spacing: { before: 2880 },
    }),
    new Paragraph({
      text: bookData.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
    })
  );

  if (bookData.subtitle) {
    children.push(
      new Paragraph({
        text: bookData.subtitle,
        style: 'Subtitle',
        alignment: AlignmentType.CENTER,
        spacing: { after: 720 },
      })
    );
  }

  children.push(
    new Paragraph({
      text: bookData.author || '',
      alignment: AlignmentType.CENTER,
      spacing: { before: 720, after: 0 },
      run: { size: 28, bold: true },
    } as never)
  );

  // ── PAGE BREAK → COPYRIGHT PAGE
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      text: '',
      spacing: { before: 3600 },
    }),
    new Paragraph({
      text: `Copyright © ${new Date().getFullYear()} ${bookData.author || 'the Author'}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
    }),
    new Paragraph({
      text: 'All rights reserved.',
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
    }),
    new Paragraph({
      text: 'No part of this publication may be reproduced, distributed, or transmitted in any form or by any means without prior written permission.',
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      style: 'Caption',
    })
  );

  // ── DEDICATION (if present)
  if (bookData.dedication) {
    children.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({ text: '', spacing: { before: 2880 } }),
      new Paragraph({
        text: bookData.dedication,
        alignment: AlignmentType.CENTER,
        style: 'Quote',
        spacing: { after: 0 },
      })
    );
  }

  // ── EPIGRAPH (if present)
  if (bookData.epigraph) {
    children.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({ text: '', spacing: { before: 2880 } }),
      new Paragraph({
        text: `"${bookData.epigraph}"`,
        alignment: AlignmentType.CENTER,
        style: 'Quote',
        spacing: { after: 120 },
      })
    );
    if (bookData.epigraphAttribution) {
      children.push(
        new Paragraph({
          text: `— ${bookData.epigraphAttribution}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
        })
      );
    }
  }

  // ── Chapter number formatter (inline, no import needed)
  const fmtChNum = (n: number, style: string): string => {
    if (style === 'roman') {
      const v=[1000,900,500,400,100,90,50,40,10,9,5,4,1],s=['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
      let r=''; for(let i=0;i<v.length;i++) while(n>=v[i]){r+=s[i];n-=v[i];} return r;
    }
    const SP=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
      'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty'];
    if (style === 'spelled') return n < SP.length ? SP[n] : String(n);
    return String(n);
  };

  // ── CHAPTERS
  const useIndent = template.paragraphStyle === 'indent';
  for (const chapter of bookData.chapters) {
    // Chapter start on new page
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({ text: '', spacing: { before: 1440 } }));

    // Chapter number
    const numStyle = template.chapterNumberStyle || 'numeral';
    if (numStyle !== 'none') {
      const numLabel = numStyle === 'numeral'
        ? `Chapter ${chapter.number}`
        : fmtChNum(chapter.number, numStyle);
      children.push(
        new Paragraph({
          text: numLabel,
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        })
      );
    }

    // Chapter title
    children.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 720 },
      })
    );

    // Chapter body
    const bodyParas = htmlToParagraphs(chapter.content, useIndent);
    children.push(...bodyParas);
  }

  // ── BACK MATTER: Acknowledgments
  if (bookData.acknowledgments) {
    children.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        text: 'Acknowledgments',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
      }),
      ...htmlToParagraphs(bookData.acknowledgments, false)
    );
  }

  // ── BACK MATTER: About the Author
  if (bookData.aboutAuthor) {
    children.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        text: 'About the Author',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
      }),
      ...htmlToParagraphs(bookData.aboutAuthor, false)
    );
  }

  // ── EXTRAS
  if (bookData.extras) {
    for (const [key, value] of Object.entries(bookData.extras)) {
      if (!value) continue;
      const label = key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      children.push(
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({
          text: label,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
        }),
        ...htmlToParagraphs(value, false)
      );
    }
  }

  const doc = new Document({
    title: bookData.title,
    creator: bookData.author || 'Booksane',
    description: bookData.subtitle || '',
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 24, // 12pt
          },
          paragraph: {
            spacing: { line: 360, lineRule: 'auto' as never }, // double spaced by default for Word manuscripts
          },
        },
      },
      paragraphStyles: [
        {
          id: 'BodyText',
          name: 'Body Text',
          basedOn: 'Normal',
          run: { font: 'Times New Roman', size: 24 },
          paragraph: { spacing: { line: 360, lineRule: 'auto' as never } },
        },
        {
          id: 'Quote',
          name: 'Quote',
          basedOn: 'Normal',
          run: { italics: true, size: 24 },
          paragraph: { alignment: AlignmentType.CENTER },
        },
        {
          id: 'Caption',
          name: 'Caption',
          basedOn: 'Normal',
          run: { size: 18, color: '666666' },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
            size: {
              width: 12240, // 8.5 inches
              height: 15840, // 11 inches
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}
