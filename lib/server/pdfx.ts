// PDF/X-1a:2001 conversion with Ghostscript, for printers such as IngramSpark that require it.
// Server only. Text is forced to black ink; colour is converted to CMYK with
// Ghostscript's CMYK profile; links are removed (PDF/X forbids them); trim and bleed boxes are set.
import { execFile } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { PDFDocument } from 'pdf-lib';

const run = promisify(execFile);

/** Finds Ghostscript and its CMYK profile, or returns null when it isn't installed. */
export function findGhostscript(): { exe: string; icc: string } | null {
  const fromEnv = process.env.BOOKSANE_GHOSTSCRIPT;
  const candidates: string[] = fromEnv ? [fromEnv] : [];
  if (process.platform === 'win32') {
    const root = 'C:\\Program Files\\gs';
    if (existsSync(root)) for (const v of readdirSync(root).sort().reverse()) candidates.push(path.join(root, v, 'bin', 'gswin64c.exe'));
  } else {
    candidates.push('/usr/bin/gs', '/usr/local/bin/gs', '/opt/homebrew/bin/gs');
  }
  for (const exe of candidates) {
    if (!existsSync(exe)) continue;
    const near = path.join(path.dirname(exe), '..', 'iccprofiles', 'default_cmyk.icc');
    const icc = process.env.BOOKSANE_CMYK_ICC || (existsSync(near) ? near : findShared());
    if (icc && existsSync(icc)) return { exe, icc };
  }
  return null;
}
function findShared(): string | undefined {
  const base = '/usr/share/ghostscript';
  if (!existsSync(base)) return undefined;
  for (const v of readdirSync(base)) { const f = path.join(base, v, 'iccprofiles', 'default_cmyk.icc'); if (existsSync(f)) return f; }
  return path.join(base, 'iccprofiles', 'default_cmyk.icc');
}

const psString = (s: string) => `(${s.replace(/[\\()]/g, m => '\\' + m).replace(/[^\x20-\x7e]/g, '?').slice(0, 200)})`;

/** The PDF/X definitions file: version, title, output intent and its embedded CMYK profile. */
function definitions(title: string, icc: string): string {
  return `[ /GTS_PDFXVersion (PDF/X-1a:2001) /Title ${psString(title)} /Trapped /False /DOCINFO pdfmark
/ICCProfile ${psString(icc.replace(/\\/g, '/'))} def
[/_objdef {icc_PDFX} /type /stream /OBJ pdfmark
[{icc_PDFX} << /N 4 >> /PUT pdfmark
[{icc_PDFX} ICCProfile (r) file /PUT pdfmark
[/_objdef {OutputIntent_PDFX} /type /dict /OBJ pdfmark
[{OutputIntent_PDFX} << /Type /OutputIntent /S /GTS_PDFX /OutputCondition (Commercial and specialty printing) /Info (none) /OutputConditionIdentifier (CGATS TR001) /RegistryName (http://www.color.org) /DestOutputProfile {icc_PDFX} >> /PUT pdfmark
[{Catalog} << /OutputIntents [ {OutputIntent_PDFX} ] >> /PUT pdfmark
`;
}

export async function toPdfX1a(pdf: Uint8Array, title: string): Promise<Uint8Array> {
  const gs = findGhostscript();
  if (!gs) throw new Error('PDF/X needs Ghostscript on the server.');
  const dir = await mkdtemp(path.join(os.tmpdir(), 'booksane-pdfx-'));
  try {
    const input = path.join(dir, 'in.pdf');
    const output = path.join(dir, 'out.pdf');
    const defs = path.join(dir, 'booksane-pdfx-definitions.ps');
    await writeFile(input, pdf);
    await writeFile(defs, definitions(title, gs.icc));
    const { stderr } = await run(gs.exe, [
      '-q', '-dPDFX=1', '-dBATCH', '-dNOPAUSE', '-dNOOUTERSAVE', '-dPreserveAnnots=false',
      '-sDEVICE=pdfwrite', '-sColorConversionStrategy=CMYK', '-sProcessColorModel=DeviceCMYK',
      '-dBlackText', '-dCompatibilityLevel=1.3', '-dPDFSETTINGS=/prepress',
      `--permit-file-read=${path.dirname(gs.icc).replace(/\\/g, '/')}/`, `--permit-file-read=${dir.replace(/\\/g, '/')}/`,
      `-sOutputFile=${output}`, defs, input,
    ], { timeout: 120000, windowsHide: true, maxBuffer: 4 * 1024 * 1024 });
    if (/reverting to normal PDF output/i.test(stderr)) throw new Error(`Ghostscript could not make PDF/X: ${stderr.trim().slice(0, 300)}`);
    // Ghostscript leaves out a trim box equal to the page; PDF/X requires one, so add it here.
    const doc = await PDFDocument.load(await readFile(output), { updateMetadata: false });
    for (const page of doc.getPages()) { const { width, height } = page.getSize(); page.setTrimBox(0, 0, width, height); page.setBleedBox(0, 0, width, height); }
    const bytes = await doc.save({ useObjectStreams: false, updateFieldAppearances: false });
    // pdf-lib writes a 1.7 header; nothing beyond PDF 1.3 is used, and PDF/X-1a:2001 requires 1.3. Same length, so offsets hold.
    const header = Buffer.from('%PDF-1.3');
    if (Buffer.from(bytes.subarray(0, 5)).toString() !== '%PDF-') throw new Error('Unexpected PDF output.');
    header.copy(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength), 0);
    return bytes;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
