'use client';

import { useMemo, useState } from 'react';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AlertCircle, Bold, Check, Copy, Download, Heading, Italic, List, ListOrdered, Loader2, Plus, Sparkles } from 'lucide-react';
import type { DocumentNode, StudioProject } from '@/lib/studio/model';
import { studioEpub } from '@/lib/studio/publication';
import { ebookCoverBase64 } from '@/lib/studio/cover';
import {
  DESCRIPTION_LIMIT, KEYWORD_LIMIT, KEYWORD_SLOTS, checkDescription, checkKeyword, descriptionHtml, descriptionText, draftDescription,
  keywordDuplicates, keywordIdeas, listingKit, sampleEdition, type Listing,
} from '@/lib/studio/listing';

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
const slug = (p: StudioProject) => (p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'book').slice(0, 60);

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return <button className="secondary" disabled={!text} onClick={() => { void navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1600); }); }}>{done ? <Check size={14}/> : <Copy size={14}/>}{done ? 'Copied' : label}</button>;
}

function DescriptionEditor({ doc, onChange, epoch }: { doc?: DocumentNode; onChange: (d: DocumentNode) => void; epoch: number }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [4] }, blockquote: false, code: false, codeBlock: false, horizontalRule: false, strike: false, underline: false, link: false })],
    content: (doc || { type: 'doc', content: [{ type: 'paragraph' }] }) as JSONContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON() as DocumentNode),
    editorProps: { attributes: { class: 'desc-prose', 'aria-label': 'Book description' } },
  }, [epoch]);
  const tool = (label: string, icon: React.ReactNode, run: () => void, active?: boolean) => <button type="button" aria-label={label} title={label} className={active ? 'active' : ''} disabled={!editor} onClick={run}>{icon}</button>;
  return <div className="desc-editor">
    <div className="desc-toolbar">
      {tool('Bold', <Bold size={15}/>, () => editor?.chain().focus().toggleBold().run(), editor?.isActive('bold'))}
      {tool('Italic', <Italic size={15}/>, () => editor?.chain().focus().toggleItalic().run(), editor?.isActive('italic'))}
      {tool('Heading', <Heading size={15}/>, () => editor?.chain().focus().toggleHeading({ level: 4 }).run(), editor?.isActive('heading'))}
      {tool('Bullet list', <List size={15}/>, () => editor?.chain().focus().toggleBulletList().run(), editor?.isActive('bulletList'))}
      {tool('Numbered list', <ListOrdered size={15}/>, () => editor?.chain().focus().toggleOrderedList().run(), editor?.isActive('orderedList'))}
    </div>
    <EditorContent editor={editor}/>
  </div>;
}

export default function StoreStudio({ project, change }: { project: StudioProject; change: (fn: (p: StudioProject) => StudioProject) => void }) {
  const l = project.listing || {};
  const set = (patch: Partial<Listing>) => change(p => ({ ...p, listing: { ...(p.listing || {}), ...patch } }));
  const [epoch, setEpoch] = useState(0);
  const [open, setOpen] = useState(false);
  const [chapters, setChapters] = useState(3);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const html = descriptionHtml(l.description);
  const text = descriptionText(l.description);
  const checks = checkDescription(l.description);
  const keys = Array.from({ length: KEYWORD_SLOTS }, (_, i) => l.keywords?.[i] || '');
  const dups = keywordDuplicates(keys);
  const ideas = useMemo(() => keywordIdeas(project), [project.sections, project.title, project.subtitle]); // eslint-disable-line react-hooks/exhaustive-deps
  const used = new Set(keys.map(k => k.trim().toLowerCase()));
  const chapterCount = project.sections.filter(s => s.kind === 'chapter').length;
  const take = Math.min(chapters, Math.max(1, Math.min(5, chapterCount)));

  function setKey(i: number, v: string) { const next = [...keys]; next[i] = v.slice(0, 80); set({ keywords: next }); }
  function addIdea(idea: string) { const i = keys.findIndex(k => !k.trim()); if (i >= 0) setKey(i, idea); }

  async function sample(kind: 'epub' | 'pdf') {
    setBusy(kind); setError('');
    try {
      const s = sampleEdition(project, take);
      if (kind === 'epub') save(await studioEpub(s, 'universal', await ebookCoverBase64(project)), `${slug(project)}-sample.epub`);
      else {
        const r = await fetch('/api/publish/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...s, cover: undefined, listing: undefined }) });
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'PDF export failed.');
        save(await r.blob(), `${slug(project)}-sample.pdf`);
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not make the sample.'); }
    finally { setBusy(''); }
  }

  return <div className="store-studio">
    <section className="store-main">
      <div className="ds-head"><span className="eyebrow">STORE PAGE</span><h2>Sell your book.</h2></div>
      <div className="store-card">
        <div className="store-card-head"><h3>Description</h3><span className={`desc-count ${html.length > DESCRIPTION_LIMIT ? 'over' : ''}`}>{html.length.toLocaleString()} / {DESCRIPTION_LIMIT.toLocaleString()}</span></div>
        <DescriptionEditor doc={l.description} epoch={epoch} onChange={description => set({ description })}/>
        {!text && <button className="secondary" onClick={() => { set({ description: draftDescription(project) }); setEpoch(e => e + 1); }}><Sparkles size={14}/>{project.cover?.blurb?.trim() ? 'Start from my back cover' : 'Start a draft'}</button>}
        <ul className="store-checks">{checks.map(c => <li key={c.message} className={c.ok ? 'ok' : 'warn'}>{c.ok ? <Check size={14}/> : <AlertCircle size={14}/>}{c.message}</li>)}</ul>
        <div className="store-actions"><CopyButton text={html} label="Copy for KDP"/><CopyButton text={text} label="Copy plain text"/></div>
      </div>
      <div className="store-card store-preview" aria-label="Store page preview">
        <div className="store-preview-head">
          {project.cover?.thumb ? <img src={project.cover.thumb} alt=""/> : <span className="store-preview-blank"/>}
          <div><strong>{project.title}{project.subtitle ? `: ${project.subtitle}` : ''}</strong><span>{project.author || 'Your name'}</span></div>
        </div>
        {html ? <><div className={`store-preview-body ${open ? 'open' : ''}`} dangerouslySetInnerHTML={{ __html: html }}/><button className="read-more" onClick={() => setOpen(o => !o)}>{open ? 'Read less' : 'Read more'}</button></> : <p className="store-preview-empty">Your description shows here.</p>}
      </div>
    </section>

    <aside className="store-side">
      <div className="store-card">
        <div className="store-card-head"><h3>Keywords</h3><span className="desc-count">{keys.filter(k => k.trim()).length} / {KEYWORD_SLOTS}</span></div>
        <ol className="keyword-list">
          {keys.map((k, i) => {
            const problem = dups.includes(i) ? 'Same as another box.' : checkKeyword(k, project);
            return <li key={i}>
              <span className="keyword-box"><input aria-label={`Keyword ${i + 1}`} value={k} placeholder={i === 0 ? 'What would a reader type?' : ''} onChange={e => setKey(i, e.target.value)}/><small className={k.trim().length > KEYWORD_LIMIT ? 'over' : ''}>{k.trim().length}/{KEYWORD_LIMIT}</small></span>
              {problem && <p className="keyword-problem"><AlertCircle size={12}/>{problem}</p>}
            </li>;
          })}
        </ol>
        {(ideas.seeds.length > 0 || ideas.phrases.length > 0) && <div className="keyword-ideas">
          <span className="builder-title">Ideas</span>
          <div>{[...ideas.seeds, ...ideas.phrases].filter(k => !used.has(k)).slice(0, 16).map(k => <button key={k} className="idea-chip" onClick={() => addIdea(k)} disabled={keys.every(x => x.trim())}><Plus size={12}/>{k}</button>)}</div>
        </div>}
      </div>

      <div className="store-card">
        <div className="store-card-head"><h3>Free sample</h3></div>
        <label className="sample-row">Chapters<select aria-label="Sample chapters" value={take} onChange={e => setChapters(Number(e.target.value))}>{Array.from({ length: Math.max(1, Math.min(5, chapterCount)) }, (_, i) => i + 1).map(n => <option key={n} value={n}>First {n}</option>)}</select></label>
        <div className="store-actions">
          <button className="primary" disabled={!!busy} onClick={() => void sample('epub')}>{busy === 'epub' ? <Loader2 size={15} className="spin"/> : <Download size={15}/>}Sample · EPUB</button>
          <button className="secondary" disabled={!!busy} onClick={() => void sample('pdf')}>{busy === 'pdf' ? <Loader2 size={15} className="spin"/> : <Download size={15}/>}Sample · PDF</button>
        </div>
        {error && <p className="cover-error" role="alert">{error}</p>}
      </div>

      <div className="store-card">
        <div className="store-card-head"><h3>Store details</h3></div>
        <dl className="kit-list">
          <div><dt>Title</dt><dd>{project.title}</dd></div>
          {project.subtitle && <div><dt>Subtitle</dt><dd>{project.subtitle}</dd></div>}
          <div><dt>Author</dt><dd>{project.author || '—'}</dd></div>
          {project.publishing?.series && <div><dt>Series</dt><dd>{project.publishing.series}{project.publishing.seriesNumber ? ` · ${project.publishing.seriesNumber}` : ''}</dd></div>}
        </dl>
        <div className="store-actions"><CopyButton text={listingKit(project)} label="Copy all"/><button className="secondary" onClick={() => save(new Blob([listingKit(project)], { type: 'text/plain' }), `${slug(project)}-store-details.txt`)}><Download size={14}/>Download</button></div>
      </div>
    </aside>
  </div>;
}
