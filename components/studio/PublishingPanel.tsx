'use client';

import { STORES, type Publishing, type Store, type StudioProject } from '@/lib/studio/model';
import { STORE_NAMES } from '@/lib/studio/publication';

const isUrl = (v: string) => v === '' || /^https?:\/\/\S+$/i.test(v);

/** Series, "Also by", store links, newsletter and writing goal: the details that become pages in the finished book. */
export default function PublishingPanel({ project, change }: { project: StudioProject; change: (fn: (p: StudioProject) => StudioProject) => void }) {
  const pub = project.publishing || {};
  const set = (patch: Partial<Publishing>) => change(p => {
    const next: Publishing = { ...(p.publishing || {}), ...patch };
    for (const k of Object.keys(next) as (keyof Publishing)[]) if (next[k] === '' || next[k] === undefined) delete next[k];
    return { ...p, publishing: next };
  });
  const link = (k: Store | 'website', v: string) => {
    const links = { ...(pub.storeLinks || {}) };
    if (v) links[k] = v; else delete links[k];
    set({ storeLinks: links });
  };
  const goal = (k: 'target' | 'daily', v: string) => change(p => {
    const n = Math.max(0, Math.min(k === 'target' ? 10000000 : 1000000, parseInt(v, 10) || 0));
    const goals = { ...(p.goals || {}), [k]: n || undefined };
    if (!goals.target) delete goals.target;
    if (!goals.daily) delete goals.daily;
    return { ...p, goals };
  });
  return <div className="publishing-panel">
    <details className="pub-group"><summary>Writing goal</summary>
      <div className="design-numbers">
        <label>Book target<input inputMode="numeric" aria-label="Book word target" placeholder="e.g. 60000" value={project.goals?.target || ''} onChange={e => goal('target', e.target.value)}/></label>
        <label>Daily goal<input inputMode="numeric" aria-label="Daily word goal" placeholder="e.g. 1000" value={project.goals?.daily || ''} onChange={e => goal('daily', e.target.value)}/></label>
      </div>
    </details>
    <details className="pub-group"><summary>Series and other books</summary>
      <div className="design-numbers">
        <label>Series<input aria-label="Series name" placeholder="Optional" value={pub.series || ''} onChange={e => set({ series: e.target.value })}/></label>
        <label>Book number<input inputMode="numeric" aria-label="Number in series" placeholder="1" value={pub.seriesNumber || ''} onChange={e => set({ seriesNumber: parseInt(e.target.value, 10) > 0 ? Math.min(999, parseInt(e.target.value, 10)) : undefined })}/></label>
      </div>
      <label>Also by you<textarea aria-label="Also by" rows={4} placeholder={'One title per line'} value={(pub.alsoBy || []).join('\n')} onChange={e => set({ alsoBy: e.target.value.split('\n').slice(0, 100) })}/></label>
      <p className="design-field-help">Adds an “Also by” page at the end of the book.</p>
    </details>
    <details className="pub-group"><summary>Store links and newsletter</summary>
      {[...STORES, 'website' as const].map(k => { const v = pub.storeLinks?.[k] || ''; return <label key={k}>{k === 'website' ? 'Your website' : STORE_NAMES[k]}<input aria-label={`${k === 'website' ? 'Website' : STORE_NAMES[k]} link`} className={isUrl(v) ? '' : 'invalid'} placeholder="https://" value={v} onChange={e => link(k, e.target.value.trim())}/></label>; })}
      <label>Newsletter invitation<textarea rows={2} aria-label="Newsletter invitation" placeholder="Get the next book first." value={pub.newsletterText || ''} onChange={e => set({ newsletterText: e.target.value.slice(0, 1000) })}/></label>
      <label>Newsletter link<input aria-label="Newsletter link" className={isUrl(pub.newsletterUrl || '') ? '' : 'invalid'} placeholder="https://" value={pub.newsletterUrl || ''} onChange={e => set({ newsletterUrl: e.target.value.trim() })}/></label>
      <p className="design-field-help">Adds a “Stay in touch” page. Each store’s ebook links only to that store.</p>
    </details>
  </div>;
}
