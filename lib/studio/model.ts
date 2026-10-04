import { OVERRIDE_VALUES, THEME_IDS, TRIM_IDS, type DesignOverrides, type TrimId } from './themes';

export type SectionKind = 'chapter' | 'frontmatter' | 'backmatter';
export interface DocumentNode { type?: string; text?: string; attrs?: Record<string, unknown>; marks?: { type: string; attrs?: Record<string, unknown> }[]; content?: DocumentNode[] }
export interface StudioSection { id: string; kind: SectionKind; title: string; document: DocumentNode }
export interface StudioProject {
  schemaVersion: 2; id: string; title: string; subtitle: string; author: string; language: string;
  createdAt: number; updatedAt: number; revision: number;
  design: { theme: string; trim: TrimId; fontSize: number; lineHeight: number; recto: boolean } & DesignOverrides;
  sections: StudioSection[];
  importReport?: { filename: string; messages: string[]; sourceWords: number; importedWords: number };
}

export function emptyDocument(): DocumentNode { return { type: 'doc', content: [{ type: 'paragraph' }] }; }
export function textDocument(text: string): DocumentNode { return { type: 'doc', content: text.split(/\n\s*\n/).map(text => ({ type: 'paragraph', content: text ? [{ type: 'text', text }] : undefined })) }; }
export function newSection(kind: SectionKind = 'chapter', title = 'Untitled chapter'): StudioSection { return { id: crypto.randomUUID(), kind, title, document: emptyDocument() }; }
export function newProject(sample = false): StudioProject {
  const now = Date.now();
  return { schemaVersion: 2, id: crypto.randomUUID(), title: sample ? 'The Art of Paying Attention' : 'Untitled book', subtitle: sample ? 'Small discoveries in an ordinary world' : '', author: sample ? 'Alex Morgan' : '', language: 'en', createdAt: now, updatedAt: now, revision: 0,
    design: { theme: 'literary', trim: '6x9', fontSize: 11, lineHeight: 1.5, recto: true },
    sections: sample ? [
      { ...newSection('frontmatter', 'Dedication'), document: textDocument('For those who still stop to look.') },
      { ...newSection('chapter', 'A quieter kind of discovery'), document: textDocument('The first thing I noticed was the light. It arrived without ceremony, falling across the kitchen table in a narrow band of gold. Outside, the city was already beginning its familiar conversation.\n\nFor years I had mistaken attention for effort. I thought that to see more, I had to search harder: another journey, another book, another carefully arranged experience. But the world was not hiding. I was simply moving too quickly.\n\nThat morning, I let the kettle finish boiling before reaching for my phone. I watched the steam rise, watched it disappear. There was nothing remarkable about this, which was precisely what made it remarkable.\n\nWe tend to remember the great departures. The ticket purchased, the door closed, the road opening ahead. Yet a life is also made of smaller arrivals: the moment a familiar room becomes visible again, or an ordinary voice becomes a person worth listening to.\n\nThis book begins with a modest invitation. Before changing your life, spend a little time noticing the one you already have.') },
      { ...newSection('chapter', 'The shape of an ordinary day'), document: textDocument('Every day has a shape, though we seldom pause long enough to trace it. A beginning, a rhythm, a handful of interruptions. The familiar path from the bedroom to the kitchen. The sound of a gate closing down the street.\n\nWhen I began to write these things down, they seemed too small to matter. A neighbour carrying oranges. Rain collecting on a windowsill. The particular patience of a person waiting at a crossing.\n\nBut attention has a way of changing scale. What is small at a distance becomes generous up close. The ordinary day is not an empty container waiting for an extraordinary event. It is already full.') },
      { ...newSection('backmatter', 'About the author'), document: textDocument('Alex Morgan writes about everyday life, creative practice, and the things we notice when we slow down. This is a fictional sample manuscript for exploring Booksane.') }
    ] : [newSection('chapter', 'Chapter One')] };
}

export function documentText(node: DocumentNode): string {
  if (node.type === 'text') return node.text || '';
  if (node.type === 'hardBreak') return '\n';
  const children = (node.content || []).map(documentText);
  return children.join(['doc', 'bulletList', 'orderedList', 'table', 'tableRow', 'listItem'].includes(node.type || '') ? '\n' : '') + (['paragraph', 'heading', 'tableCell', 'tableHeader'].includes(node.type || '') ? '\n' : '');
}
export function words(text: string): number { return (text.match(/\S+/gu) || []).length; }
export function projectWords(project: StudioProject): number { return project.sections.reduce((n, section) => n + words(documentText(section.document)), 0); }
export function escape(value: string): string { return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

export function documentHtml(node: DocumentNode): string {
  if (node.type === 'text') {
    let text = escape(node.text || '');
    for (const mark of node.marks || []) {
      const tags: Record<string, string> = { bold: 'strong', italic: 'em', underline: 'u', strike: 's', code: 'code' };
      if (tags[mark.type]) text = `<${tags[mark.type]}>${text}</${tags[mark.type]}>`;
      if (mark.type === 'link' && typeof mark.attrs?.href === 'string' && /^(https?:|mailto:)/i.test(mark.attrs.href)) text = `<a href="${escape(mark.attrs.href)}">${text}</a>`;
    }
    return text;
  }
  const content = (node.content || []).map(documentHtml).join('');
  const tags: Record<string, string> = { paragraph: 'p', heading: `h${Math.max(2, Math.min(3, Number(node.attrs?.level) || 2))}`, blockquote: 'blockquote', bulletList: 'ul', orderedList: 'ol', listItem: 'li', table: 'table', tableRow: 'tr', tableCell: 'td', tableHeader: 'th', codeBlock: 'pre' };
  if (node.type === 'hardBreak') return '<br/>';
  if (node.type === 'horizontalRule') return '<p class="scene-break" role="separator"><span>* * *</span></p>';
  if (node.type === 'image' && typeof node.attrs?.src === 'string' && /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(node.attrs.src)) return `<img src="${node.attrs.src}" alt="${escape(String(node.attrs.alt || ''))}"/>`;
  const tag = tags[node.type || ''];
  const align = node.attrs?.textAlign;
  const style = ['left', 'center', 'right', 'justify'].includes(String(align)) ? ` style="text-align:${align}"` : '';
  const span = ['td', 'th'].includes(tag) ? ` colspan="${Math.max(1, Math.min(20, Number(node.attrs?.colspan) || 1))}" rowspan="${Math.max(1, Math.min(20, Number(node.attrs?.rowspan) || 1))}"` : '';
  return tag ? `<${tag}${style}${span}>${content}</${tag}>` : content;
}

export function readProject(value: unknown): StudioProject {
  if (!value || typeof value !== 'object') throw new Error('Invalid Booksane project.');
  const p = value as StudioProject;
  if (p.schemaVersion !== 2 || typeof p.id !== 'string' || typeof p.title !== 'string' || typeof p.author !== 'string' || typeof p.subtitle !== 'string' || !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(p.language) || !Number.isFinite(p.revision) || !Number.isFinite(p.createdAt) || !Number.isFinite(p.updatedAt) || !Array.isArray(p.sections) || p.sections.length > 1000) throw new Error('Unsupported or damaged Booksane project.');
  if (!p.design || !THEME_IDS.includes(p.design.theme) || !TRIM_IDS.includes(p.design.trim) || !(p.design.fontSize >= 8 && p.design.fontSize <= 24) || !(p.design.lineHeight >= 1.1 && p.design.lineHeight <= 2) || typeof p.design.recto !== 'boolean') throw new Error('Invalid book design settings.');
  for (const [key, allowed] of Object.entries(OVERRIDE_VALUES)) { const v = (p.design as unknown as Record<string, unknown>)[key]; if (v !== undefined && !allowed.includes(v as string | boolean)) throw new Error('Invalid book design settings.'); }
  const supported = new Set(['doc', 'text', 'paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'listItem', 'table', 'tableRow', 'tableCell', 'tableHeader', 'hardBreak', 'horizontalRule', 'image', 'codeBlock']);
  let nodes = 0;
  const validate = (node: DocumentNode, depth: number) => {
    if (!node || !supported.has(node.type || '') || depth > 30 || ++nodes > 500000 || (node.text !== undefined && typeof node.text !== 'string') || (node.content !== undefined && !Array.isArray(node.content)) || (node.marks !== undefined && !Array.isArray(node.marks))) throw new Error('Unsupported document content.');
    for (const mark of node.marks || []) if (!mark || !['bold', 'italic', 'underline', 'strike', 'code', 'link'].includes(mark.type)) throw new Error('Unsupported text formatting.');
    if (node.type === 'image' && (typeof node.attrs?.src !== 'string' || !/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(node.attrs.src))) throw new Error('Images must be embedded PNG or JPEG files.');
    (node.content || []).forEach(child => validate(child, depth + 1));
  };
  const ids = new Set<string>();
  for (const section of p.sections) {
    if (!section || typeof section.id !== 'string' || ids.has(section.id) || typeof section.title !== 'string' || !['chapter', 'frontmatter', 'backmatter'].includes(section.kind) || section.document?.type !== 'doc') throw new Error('Invalid book section.');
    ids.add(section.id); validate(section.document, 0);
  }
  return p;
}

export interface StudioFinding { level: 'error' | 'warning'; message: string; sectionId?: string }
export function studioChecks(project: StudioProject): StudioFinding[] {
  const findings: StudioFinding[] = [];
  if (!project.title.trim() || /^untitled book$/i.test(project.title)) findings.push({ level: 'warning', message: 'Give your book its final title.' });
  if (!project.author.trim()) findings.push({ level: 'warning', message: 'Add an author or pen name.' });
  if (!project.sections.some(s => s.kind === 'chapter')) findings.push({ level: 'error', message: 'Add a chapter to your manuscript.' });
  const inspect = (node: DocumentNode, sectionId: string) => {
    if (node.type === 'image' && !node.attrs?.alt) findings.push({ level: 'warning', message: 'An image needs an alternative description.', sectionId });
    (node.content || []).forEach(child => inspect(child, sectionId));
  };
  for (const s of project.sections) {
    if (!documentText(s.document).trim() && !documentHtml(s.document).includes('<img')) findings.push({ level: 'warning', message: `“${s.title}” is empty.`, sectionId: s.id });
    inspect(s.document, s.id);
  }
  return findings;
}
