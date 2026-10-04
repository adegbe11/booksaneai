// Copies the open-licence book fonts from @fontsource into public/fonts/lib so the preview,
// the PDF service and EPUB exports all read the same files. Run after installing packages.
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const FONTS = {
  'libre-baskerville': ['400-normal', '400-italic', '700-normal'],
  'crimson-pro': ['400-normal', '400-italic', '700-normal'],
  lora: ['400-normal', '400-italic', '700-normal'],
  'source-serif-4': ['400-normal', '400-italic', '700-normal'],
  merriweather: ['400-normal', '400-italic', '700-normal'],
  alegreya: ['400-normal', '400-italic', '700-normal'],
  spectral: ['400-normal', '400-italic', '700-normal'],
  'cormorant-garamond': ['400-normal', '400-italic', '700-normal'],
  'playfair-display': ['400-normal', '400-italic', '700-normal'],
  cinzel: ['400-normal', '700-normal'],
  'josefin-sans': ['400-normal', '700-normal'],
  montserrat: ['400-normal', '400-italic', '700-normal'],
  raleway: ['400-normal', '700-normal'],
  oswald: ['400-normal', '700-normal'],
  'great-vibes': ['400-normal'],
};
const SUBSETS = ['latin', 'latin-ext'];
const out = path.join(process.cwd(), 'public/fonts/lib');
await mkdir(out, { recursive: true });
let copied = 0;
for (const [id, variants] of Object.entries(FONTS)) {
  const dir = path.join(process.cwd(), 'node_modules/@fontsource', id);
  for (const subset of SUBSETS) for (const v of variants) {
    const name = `${id}-${subset}-${v}.woff2`;
    const from = path.join(dir, 'files', name);
    if (!existsSync(from)) { console.warn('missing', name); continue; }
    await copyFile(from, path.join(out, name)); copied++;
  }
  const licence = (await readdir(dir)).find(f => /^licen[cs]e/i.test(f));
  if (licence) await copyFile(path.join(dir, licence), path.join(out, `${id}-LICENSE.txt`));
}
console.log(`copied ${copied} font files`);
