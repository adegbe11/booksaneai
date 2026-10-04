'use client';

import { Check, RotateCcw } from 'lucide-react';
import type { StudioProject } from '@/lib/studio/model';
import { CHOICES, FONTS, FONT_IDS, THEMES, TRIMS, TRIM_IDS, chapterLabel, fontFaceCss, fontStack, resolveDesign, themeById, type DesignOverrides, type ThemeDef } from '@/lib/studio/themes';

type Design = StudioProject['design'];
const FACES = fontFaceCss(FONT_IDS);

function MiniPage({ theme }: { theme: ThemeDef }) {
  const head: React.CSSProperties = {
    fontFamily: fontStack(theme.heading),
    textTransform: theme.case === 'upper' ? 'uppercase' : undefined,
    fontVariant: theme.case === 'small-caps' ? 'small-caps' : undefined,
    fontStyle: theme.headingStyle,
    fontSize: Math.min(19, theme.headingSize * 0.62),
  };
  const label = chapterLabel(theme.label, 1);
  const bigLabel = theme.label === 'number' || theme.label === 'roman';
  return <div className={`theme-page align-${theme.align} orn-${theme.ornament} dc-${theme.dropCap} fl-${theme.firstLine} ${theme.paragraph === 'block' ? 'block' : ''}`} style={{ fontFamily: fontStack(theme.body) }} aria-hidden="true">
    {label && <small className={bigLabel ? 'big' : ''} style={bigLabel ? { fontFamily: fontStack(theme.heading) } : undefined}>{label}</small>}
    <strong style={head}>A New Beginning</strong>
    <i className="theme-orn"/>
    <p>The morning light found its way through the open window, and with it came the first quiet hint of a story waiting to be told.</p>
    <span>1</span>
  </div>;
}

export function ThemeGallery({ design, select }: { design: Design; select: (theme: string) => void }) {
  return <>
    <style>{FACES}</style>
    <div className="theme-gallery" aria-label="Book themes">
      {THEMES.map(t => <button key={t.id} aria-pressed={design.theme === t.id} aria-label={`${t.name} theme`} className={`theme-card ${design.theme === t.id ? 'selected' : ''}`} onClick={() => select(t.id)}>
        <MiniPage theme={t}/>
        <span className="theme-name">{t.name}{design.theme === t.id && <Check size={13}/>}</span>
        <small className="theme-genre">{t.genre}</small>
      </button>)}
    </div>
  </>;
}

function Pick<K extends keyof DesignOverrides>({ label, k, design, options, themeValue, set }: { label: string; k: K; design: Design; options: Record<string, string>; themeValue: string; set: (k: K, v: DesignOverrides[K] | undefined) => void }) {
  const value = design[k] as string | undefined;
  return <label>{label}<select aria-label={label} value={value ?? ''} onChange={e => set(k, (e.target.value || undefined) as DesignOverrides[K] | undefined)}>
    <option value="">Theme · {options[themeValue]}</option>
    {Object.entries(options).map(([v, name]) => <option key={v} value={v}>{name}</option>)}
  </select></label>;
}

export function DesignControls({ design, change }: { design: Design; change: (next: Design) => void }) {
  const t = themeById(design.theme);
  const r = resolveDesign(design);
  const set = <K extends keyof DesignOverrides>(k: K, v: DesignOverrides[K] | undefined) => { const next = { ...design, [k]: v }; if (v === undefined) delete next[k]; change(next); };
  const fonts = Object.fromEntries(FONT_IDS.map(id => [id, FONTS[id].label]));
  const custom = Object.keys(design).some(k => !['theme', 'trim', 'fontSize', 'lineHeight', 'recto'].includes(k));
  return <div className="design-builder">
    <div className="builder-group"><span className="builder-title">Fonts</span>
      <Pick label="Text font" k="bodyFont" design={design} options={fonts} themeValue={t.body} set={set}/>
      <Pick label="Heading font" k="headingFont" design={design} options={fonts} themeValue={t.heading} set={set}/>
      <div className="design-numbers"><label>Type size<select aria-label="Type size" value={design.fontSize} onChange={e => change({ ...design, fontSize: Number(e.target.value) })}>{[9, 10, 10.5, 11, 11.5, 12, 13, 14, 16, 18, 20].map(size => <option value={size} key={size}>{size} pt</option>)}</select></label>
        <label>Line spacing<select aria-label="Line spacing" value={design.lineHeight} onChange={e => change({ ...design, lineHeight: Number(e.target.value) })}>{[1.2, 1.3, 1.35, 1.4, 1.5, 1.65, 1.8, 2].map(size => <option value={size} key={size}>{size}</option>)}</select></label></div>
    </div>
    <div className="builder-group"><span className="builder-title">Chapter openings</span>
      <Pick label="Chapter label" k="chapterLabel" design={design} options={CHOICES.chapterLabel} themeValue={t.label} set={set}/>
      <Pick label="Alignment" k="headingAlign" design={design} options={CHOICES.headingAlign} themeValue={t.align} set={set}/>
      <Pick label="Title style" k="headingCase" design={design} options={CHOICES.headingCase} themeValue={t.case} set={set}/>
      <Pick label="Ornament" k="ornament" design={design} options={CHOICES.ornament} themeValue={t.ornament} set={set}/>
      <Pick label="First letter" k="dropCap" design={design} options={CHOICES.dropCap} themeValue={t.dropCap} set={set}/>
      <Pick label="First line" k="firstLine" design={design} options={CHOICES.firstLine} themeValue={t.firstLine} set={set}/>
      <label className="check-label"><input type="checkbox" checked={design.recto} onChange={e => change({ ...design, recto: e.target.checked })}/>Start chapters on right-hand pages</label>
    </div>
    <div className="builder-group"><span className="builder-title">Text</span>
      <Pick label="Paragraphs" k="paragraph" design={design} options={CHOICES.paragraph} themeValue={t.paragraph} set={set}/>
      <Pick label="Scene break" k="sceneBreak" design={design} options={CHOICES.sceneBreak} themeValue={t.sceneBreak} set={set}/>
    </div>
    <div className="builder-group"><span className="builder-title">Page</span>
      <Pick label="Running heads" k="runningHead" design={design} options={CHOICES.runningHead} themeValue="author-title" set={set}/>
      <Pick label="Page numbers" k="pageNumber" design={design} options={CHOICES.pageNumber} themeValue="center" set={set}/>
      <label className="check-label"><input type="checkbox" checked={!!design.largePrint} onChange={e => set('largePrint', e.target.checked || undefined)}/>Large print edition {r.largePrint && <small>· {r.fontSize} pt</small>}</label>
    </div>
    {custom && <button className="reset-theme" onClick={() => change({ theme: design.theme, trim: design.trim, fontSize: design.fontSize, lineHeight: design.lineHeight, recto: design.recto })}><RotateCcw size={13}/>Back to {t.name} defaults</button>}
  </div>;
}

export function TrimSelect({ design, change }: { design: Design; change: (next: Design) => void }) {
  return <label>Trim size<select aria-label="Trim size" value={design.trim} onChange={e => change({ ...design, trim: e.target.value as Design['trim'] })}>
    {TRIM_IDS.map(id => <option key={id} value={id}>{TRIMS[id].label} · {TRIMS[id].use}</option>)}
  </select></label>;
}
