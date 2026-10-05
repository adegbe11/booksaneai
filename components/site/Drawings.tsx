// Hand-drawn pieces for the marketing site: Booksy the book, editor's red-pen doodles, a shelf of books.
// Plain SVG so they stay crisp, light and easy to change.

const INK = '#1f2a24';
const RED = '#e4572e';

type Pose = 'wave' | 'point' | 'cheer' | 'read';

/** Booksy: a friendly hardcover with a bookmark ribbon. */
export function Booksy({ pose = 'wave', size = 160, className = '' }: { pose?: Pose; size?: number; className?: string }) {
  const arms: Record<Pose, [string, string]> = {
    wave: ['M44 118 C 28 128, 22 142, 20 156', 'M162 112 C 178 96, 186 78, 184 58'],
    point: ['M44 118 C 30 130, 26 144, 24 158', 'M162 116 C 178 114, 192 110, 204 106'],
    cheer: ['M44 112 C 28 96, 20 78, 18 60', 'M162 112 C 178 96, 186 78, 188 60'],
    read: ['M44 120 C 34 136, 40 150, 58 156', 'M162 120 C 172 136, 166 150, 148 156'],
  };
  const hands: Record<Pose, [number, number][]> = { wave: [[20, 158], [184, 54]], point: [[23, 160], [207, 105]], cheer: [[17, 56], [189, 56]], read: [[60, 157], [146, 157]] };
  return <svg className={`booksy booksy-${pose} ${className}`} width={size} height={size * 1.1} viewBox="0 0 212 232" fill="none" aria-hidden="true">
    <ellipse cx="104" cy="222" rx="58" ry="7" fill={INK} opacity=".08"/>
    {/* legs */}
    <path d="M82 184 C 81 194, 80 202, 78 210" stroke={INK} strokeWidth="4" strokeLinecap="round"/>
    <path d="M126 184 C 127 194, 128 202, 130 210" stroke={INK} strokeWidth="4" strokeLinecap="round"/>
    <path d="M66 212 C 70 206, 84 206, 88 212" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="#2f6b4f"/>
    <path d="M120 212 C 124 206, 138 206, 142 212" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="#2f6b4f"/>
    {/* page block */}
    <path d="M150 40 C 158 41, 164 44, 166 48 L 166 178 C 164 182, 158 185, 150 186 Z" fill="#fff8e7" stroke={INK} strokeWidth="3.5" strokeLinejoin="round"/>
    {[62, 82, 102, 122, 142, 162].map(y => <path key={y} d={`M153 ${y} L 163 ${y + 1}`} stroke={INK} strokeWidth="1.4" opacity=".35" strokeLinecap="round"/>)}
    {/* cover */}
    <path d="M46 34 C 46 30, 49 28, 53 28 L 150 30 C 154 30, 156 33, 156 37 L 155 184 C 155 188, 152 190, 148 190 L 52 188 C 48 188, 45 185, 45 181 Z" fill="#2f8a62" stroke={INK} strokeWidth="3.5" strokeLinejoin="round"/>
    <path d="M47 34 C 47 31, 50 29, 53 29 L 62 29 L 61 189 L 52 188 C 48 188, 46 185, 46 181 Z" fill="#256f4f"/>
    <path d="M62 30 L 61 189" stroke={INK} strokeWidth="2" opacity=".5"/>
    {/* ribbon */}
    <path d="M124 22 L 136 22 L 136 58 L 130 52 L 124 58 Z" fill={RED} stroke={INK} strokeWidth="2.6" strokeLinejoin="round"/>
    {/* title line */}
    <path d="M84 56 C 100 54, 118 54, 134 56" stroke="#f3d48f" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M92 66 C 104 65, 114 65, 126 66" stroke="#f3d48f" strokeWidth="2.5" strokeLinecap="round" opacity=".8"/>
    {/* face */}
    <ellipse cx="90" cy="104" rx="11" ry="13" fill="#fff"/><ellipse cx="124" cy="104" rx="11" ry="13" fill="#fff"/>
    <circle className="booksy-eye" cx={pose === 'point' ? 94 : 92} cy="106" r="5.5" fill={INK}/><circle className="booksy-eye" cx={pose === 'point' ? 128 : 126} cy="106" r="5.5" fill={INK}/>
    <circle cx={pose === 'point' ? 96 : 94} cy="103" r="1.8" fill="#fff"/><circle cx={pose === 'point' ? 130 : 128} cy="103" r="1.8" fill="#fff"/>
    <ellipse cx="76" cy="126" rx="7" ry="4.5" fill="#f28b74" opacity=".55"/><ellipse cx="138" cy="126" rx="7" ry="4.5" fill="#f28b74" opacity=".55"/>
    <path d={pose === 'cheer' ? 'M94 126 C 100 140, 114 140, 120 126 Z' : 'M95 128 C 101 136, 113 136, 119 128'} stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill={pose === 'cheer' ? '#7a2e1d' : 'none'}/>
    {/* arms */}
    <g className="booksy-arm-l"><path d={arms[pose][0]} stroke={INK} strokeWidth="4" strokeLinecap="round"/><circle cx={hands[pose][0][0]} cy={hands[pose][0][1]} r="6" fill="#fff8e7" stroke={INK} strokeWidth="3"/></g>
    <g className="booksy-arm-r"><path d={arms[pose][1]} stroke={INK} strokeWidth="4" strokeLinecap="round"/><circle cx={hands[pose][1][0]} cy={hands[pose][1][1]} r="6" fill="#fff8e7" stroke={INK} strokeWidth="3"/></g>
    {pose === 'read' && <g><path d="M70 150 L 104 156 L 138 150 L 138 170 L 104 176 L 70 170 Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round"/><path d="M104 156 L 104 176" stroke={INK} strokeWidth="2.4"/></g>}
  </svg>;
}

/** A red-pen squiggle under a word. */
export function Squiggle({ className = '', width = 220 }: { className?: string; width?: number }) {
  return <svg className={`doodle squiggle ${className}`} width={width} height={width * 0.09} viewBox="0 0 220 20" fill="none" aria-hidden="true" preserveAspectRatio="none"><path d="M3 13 C 30 4, 52 18, 78 10 S 128 4, 152 12 S 196 16, 217 7" stroke={RED} strokeWidth="4" strokeLinecap="round"/></svg>;
}

/** A loose hand-drawn circle around something. */
export function Ring({ className = '' }: { className?: string }) {
  return <svg className={`doodle doodle-ring ${className}`} viewBox="0 0 200 90" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d="M30 18 C 70 4, 160 6, 186 30 C 204 50, 170 80, 104 84 C 40 88, 4 70, 10 46 C 14 30, 40 16, 96 12" stroke={RED} strokeWidth="3.4" strokeLinecap="round"/></svg>;
}

/** A curvy arrow. `flip` points it the other way. */
export function Arrow({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return <svg className={`doodle arrow ${className}`} viewBox="0 0 120 80" fill="none" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}><path d="M6 10 C 40 6, 76 22, 98 62" stroke={RED} strokeWidth="3.4" strokeLinecap="round"/><path d="M84 58 L 99 66 L 104 49" stroke={RED} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function Sparkle({ className = '', color = '#e7a93a' }: { className?: string; color?: string }) {
  return <svg className={`doodle sparkle ${className}`} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 3 C 21 14, 26 19, 37 20 C 26 21, 21 26, 20 37 C 19 26, 14 21, 3 20 C 14 19, 19 14, 20 3 Z" fill={color} stroke={INK} strokeWidth="2" strokeLinejoin="round"/></svg>;
}

/** A hand-drawn row of books, used along the bottom of the hero. */
export function Shelf({ className = '' }: { className?: string }) {
  const books: [number, number, number, string][] = [
    [0, 64, 26, '#cfe6d6'], [28, 82, 22, '#2f8a62'], [52, 70, 30, '#f3d48f'], [84, 94, 20, '#e9a48f'], [106, 76, 26, '#fff8e7'],
    [134, 88, 24, '#a7cdb6'], [160, 60, 34, '#2f6b4f'], [196, 84, 22, '#f7c9a8'], [220, 72, 28, '#d8ead9'], [250, 96, 20, '#e4572e'],
  ];
  return <svg className={`shelf ${className}`} viewBox="0 0 1680 110" fill="none" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    {[0, 280, 560, 840, 1120, 1400].map(off => books.map(([x, h, w, c], i) => <g key={`${off}-${i}`}>
      <rect x={x + off} y={104 - h} width={w} height={h} rx="3" fill={c} stroke={INK} strokeWidth="2.2"/>
      <path d={`M${x + off + 5} ${104 - h + 12} L ${x + off + w - 5} ${104 - h + 12}`} stroke={INK} strokeWidth="1.6" opacity=".4" strokeLinecap="round"/>
    </g>))}
    <path d="M0 105 L 1680 105" stroke={INK} strokeWidth="2.6" strokeLinecap="round"/>
  </svg>;
}
