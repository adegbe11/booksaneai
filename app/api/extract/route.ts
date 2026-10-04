import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'Upload a file smaller than 20 MB.' }, { status: 413 });
    let text = '';

    if (name.endsWith('.txt')) {
      text = await file.text();
    } else if (name.endsWith('.docx')) {
      try {
        const mammoth = await import('mammoth');
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch {
        return NextResponse.json({ error: 'Could not read this DOCX file. Try exporting as TXT.' }, { status: 422 });
      }
    } else if (name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'PDF import is not supported yet. Upload TXT or DOCX.' }, { status: 415 });
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Upload TXT or DOCX.' }, { status: 415 });
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: 'No readable text found. Try uploading a .txt or .docx file.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error('Extract error:', err);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
