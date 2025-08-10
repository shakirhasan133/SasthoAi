import { NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || !q.trim()) {
      return NextResponse.json(
        { error: 'Missing query parameter: q' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'diseases.json');
    const diseases = await readFile(filePath, 'utf-8')
      .then((t) => JSON.parse(t))
      .catch(() => []);

    const query = q.toLowerCase();
    const results = Array.isArray(diseases)
      ? diseases.filter((item) => {
          const name = (item?.name || '').toString().toLowerCase();
          const symptoms = (item?.symptoms || '').toString().toLowerCase();
          return name.includes(query) || symptoms.includes(query);
        })
      : [];

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search data', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}


