import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';

export const CALLOUT_TONES = ['note', 'tip', 'warning', 'quote'] as const;
export type CalloutTone = typeof CALLOUT_TONES[number];

/** A boxed panel for tips, notes and key points (nonfiction). */
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'paragraph+',
  defining: true,
  addAttributes() { return { tone: { default: 'note', parseHTML: el => el.getAttribute('data-callout') || 'note' } }; },
  parseHTML() { return [{ tag: 'div[data-callout]' }]; },
  renderHTML({ node, HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': node.attrs.tone, class: `callout callout-${node.attrs.tone}` }), 0]; },
});

/** A footnote: an inline marker that carries its own text. Print sets it at the foot of the page; ebooks link to it. */
export const Footnote = Node.create({
  name: 'footnote',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() { return { note: { default: '', parseHTML: el => el.getAttribute('data-footnote') || '' } }; },
  parseHTML() { return [{ tag: 'sup[data-footnote]' }]; },
  renderHTML({ node, HTMLAttributes }) { return ['sup', mergeAttributes(HTMLAttributes, { 'data-footnote': node.attrs.note, class: 'footnote-ref', title: node.attrs.note }), '✱']; },
});

export function studioExtensions() {
  return [StarterKit.configure({ heading: { levels: [2, 3] } }), Table.configure({ resizable: false }), TableRow, TableCell, TableHeader, Image.configure({ allowBase64: true }), TextAlign.configure({ types: ['heading', 'paragraph'] }), Callout, Footnote];
}
