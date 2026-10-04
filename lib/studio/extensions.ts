import StarterKit from '@tiptap/starter-kit';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';

export function studioExtensions() {
  return [StarterKit.configure({ heading: { levels: [2, 3] } }), Table.configure({ resizable: false }), TableRow, TableCell, TableHeader, Image.configure({ allowBase64: true }), TextAlign.configure({ types: ['heading', 'paragraph'] })];
}
