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

  // ── helper: strip HTML tags
  const stripHtml = (html: string) =>
    html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();

  // ── helper: parse HTML paragraphs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const htmlToParagraphs = (html: string, indent: boolean): any[] => {
    const rawParas = html.split(/<\/p>|<br\s*\/?>/i).filter(Boolean);
    return rawParas.map((raw) => {
      const text = stripHtml(raw);
      if (!text) return new Paragraph({ text: '' });
      return new Paragraph({
        text,
        style: 'BodyText',
        indent: indent ? { firstLine: 720 } : undefined, // 720 twips = 0.5 inch
        spacing: indent ? { before: 0, after: 0 } : { after: 160 },
      });
    }).filter((p) => p !== null);
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

  // ── CHAPTERS
  const useIndent = template.paragraphStyle === 'indent';
  for (const chapter of bookData.chapters) {
    // Chapter start on new page
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({ text: '', spacing: { before: 1440 } }));

    // Chapter number
    if (template.chapterNumberStyle !== 'none') {
      children.push(
        new Paragraph({
          text: `Chapter ${chapter.number}`,
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
