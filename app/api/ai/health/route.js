import { NextResponse } from 'next/server';
import { getAIResponse } from '../../../../lib/ai';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const deep = url.searchParams.get('deep') === '1' || url.searchParams.get('test') === '1';

    const hasApiKey = Boolean(process.env.PUTER_API_KEY);
    const model = 'puter.ai.default';

    if (!deep) {
      // Basic health: only checks env presence
      return NextResponse.json({ ok: true, mode: 'basic', hasApiKey, model });
    }

    // Deep health: perform a lightweight roundtrip
    try {
      const reply = await getAIResponse('পিং');
      const ok = typeof reply === 'string' && reply.length >= 0; // dev fallback may return text
      return NextResponse.json({ ok, mode: 'deep', hasApiKey, model, reply });
    } catch (err) {
      return NextResponse.json(
        { ok: false, mode: 'deep', hasApiKey, model, error: err?.message || String(err) },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}


