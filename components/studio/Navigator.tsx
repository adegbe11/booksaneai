'use client';

import { useState } from 'react';
import { BookMarked, FileText, GripVertical, Plus, ShieldCheck, Target, Upload } from 'lucide-react';
import { documentText, projectWords, words, type StudioProject, type StudioSection } from '@/lib/studio/model';

type Group = 'frontmatter' | 'body' | 'backmatter';
const groupOf = (s: StudioSection): Group => s.kind === 'frontmatter' ? 'frontmatter' : s.kind === 'backmatter' ? 'backmatter' : 'body';

export function todayKey() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

export default function Navigator({ project, selectedId, select, add, reorder, findings, openChecks, importReport }: {
  project: StudioProject; selectedId: string; select: (id: string) => void; add: (kind: StudioSection['kind']) => void;
  reorder: (sections: StudioSection[]) => void; findings: number; openChecks: () => void; importReport?: () => void;
}) {
  const [dragId, setDragId] = useState('');
  const [overId, setOverId] = useState('');
  const total = projectWords(project);
  const target = project.goals?.target || 0;
  const startToday = project.goals?.history?.[todayKey()];
  const today = startToday === undefined ? 0 : Math.max(0, total - startToday);

  function drop(targetId: string) {
    const from = project.sections.findIndex(s => s.id === dragId);
    const to = project.sections.findIndex(s => s.id === targetId);
    setDragId(''); setOverId('');
    if (from < 0 || to < 0 || from === to || groupOf(project.sections[from]) !== groupOf(project.sections[to])) return;
    const next = [...project.sections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    reorder(next);
  }

  const groups: [Group, string, [StudioSection['kind'], string][]][] = [
    ['frontmatter', 'Front matter', [['frontmatter', 'Add front matter']]],
    ['body', 'Chapters', [['part', 'Add part'], ['chapter', 'Add chapter']]],
    ['backmatter', 'Back matter', [['backmatter', 'Add back matter']]],
  ];
  return <aside className="book-navigator">
    <div className="navigator-heading"><span className="eyebrow">MANUSCRIPT</span><span>{project.sections.length}</span></div>
    {groups.map(([group, label, adds]) => <div className="section-group" key={group}>
      <div className="group-label">{label}<span className="group-adds">{adds.map(([kind, name]) => <button key={kind} aria-label={name} title={name} onClick={() => add(kind)}>{kind === 'part' ? <BookMarked size={13}/> : <Plus size={14}/>}</button>)}</span></div>
      {project.sections.filter(s => groupOf(s) === group).map(s => <button
        key={s.id}
        draggable
        onDragStart={e => { setDragId(s.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', s.id); }}
        onDragOver={e => { if (dragId && groupOf(project.sections.find(x => x.id === dragId)!) === group) { e.preventDefault(); setOverId(s.id); } }}
        onDragLeave={() => setOverId(o => o === s.id ? '' : o)}
        onDrop={e => { e.preventDefault(); drop(s.id); }}
        onDragEnd={() => { setDragId(''); setOverId(''); }}
        className={`section-item ${s.kind === 'part' ? 'is-part' : ''} ${selectedId === s.id ? 'selected' : ''} ${overId === s.id ? 'drop-over' : ''} ${dragId === s.id ? 'dragging' : ''}`}
        onClick={() => select(s.id)}>
        <GripVertical size={12} className="grip"/>{s.kind === 'part' ? <BookMarked size={14}/> : <FileText size={14}/>}<span>{s.title}</span>{s.kind !== 'part' && <small>{words(documentText(s.document))}</small>}
      </button>)}
    </div>)}
    <div className="navigator-bottom">
      <span>{total.toLocaleString()}<small>total words</small></span>
      {target > 0 && <div className="goal" aria-label={`Writing goal: ${total} of ${target} words`}>
        <div className="goal-row"><Target size={13}/>{Math.min(100, Math.round((total / target) * 100))}% of {target.toLocaleString()}</div>
        <div className="goal-bar"><i style={{ width: `${Math.min(100, (total / target) * 100)}%` }}/></div>
        {startToday !== undefined && <small>{today.toLocaleString()} words today{project.goals?.daily ? ` · goal ${project.goals.daily.toLocaleString()}` : ''}</small>}
      </div>}
      <button onClick={openChecks}><ShieldCheck size={16}/>Book review <span>{findings}</span></button>
      {importReport && <button onClick={importReport}><Upload size={15}/>Import report</button>}
    </div>
  </aside>;
}
