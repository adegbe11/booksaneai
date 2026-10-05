import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { readProject } from '@/lib/studio/model';
import { printHtml } from '@/lib/studio/publication';
import { findGhostscript, toPdfX1a } from '@/lib/server/pdfx';

export const runtime = 'nodejs';
export const maxDuration = 90;
let rendering = false;

/** Tells the studio whether this server can make PDF/X files. */
export async function GET() {
  return NextResponse.json({ pdfx: !!findGhostscript() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const pdfx = request.nextUrl.searchParams.get('format') === 'pdfx';
  if (pdfx && !findGhostscript()) return NextResponse.json({ error: 'PDF/X export is not available on this server.' }, { status: 501 });
  if (rendering) return NextResponse.json({ error: 'Another book is being composed. Try again in a moment.' }, { status: 429 });
  const text = await request.text();
  if (text.length > 25 * 1024 * 1024) return NextResponse.json({ error: 'This project is too large for this export service.' }, { status: 413 });
  let project;
  try { project = readProject(JSON.parse(text)); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid project.' }, { status: 400 }); }
  rendering = true;
  let browser;
  try {
    const script = await readFile(path.join(process.cwd(), 'public/layout/paged.polyfill.js'), 'utf8');
    let html = printHtml(project);
    // Embed every font the book uses, so the PDF never depends on the server's fonts.
    const fontUrls = [...new Set(html.match(/\/fonts\/(?:lib\/)?[a-z0-9-]+\.woff2/g) || [])];
    const fonts = await Promise.all(fontUrls.map(async url => [url, (await readFile(path.join(process.cwd(), 'public', url))).toString('base64')] as const));
    for (const [url, data] of fonts) html = html.split(`url('${url}')`).join(`url('data:font/woff2;base64,${data}')`);
    html = html.replace('<script src="/layout/paged.polyfill.js"></script>', () => `<script>${script.replace(/<\/script/gi, '<\\/script')}</script>`);
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => req.url().startsWith('data:') || req.url().startsWith('about:') ? void req.continue() : void req.abort());
    await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction('window.booksaneReady === true || !!window.booksaneError', { timeout: 60000 });
    const layoutError = await page.evaluate('window.booksaneError');
    if (layoutError) throw new Error(`Layout failed: ${layoutError}`);
    const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true, timeout: 60000 });
    const body = pdfx ? await toPdfX1a(new Uint8Array(pdf), project.title || 'Book') : new Uint8Array(pdf);
    return new Response(Buffer.from(body), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="booksane-interior${pdfx ? '-pdfx1a' : ''}.pdf"`, 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Booksane PDF export:', error);
    return NextResponse.json({ error: 'PDF composition failed. Save your project and try again. The server needs its bundled browser and font files.' }, { status: 500 });
  } finally { await browser?.close(); rendering = false; }
}
