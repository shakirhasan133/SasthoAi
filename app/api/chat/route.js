import { NextResponse } from 'next/server';
import { getAIResponse } from '../../../lib/ai';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body?.message?.toString().trim();

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      );
    }

    const reply = await getAIResponse(userMessage);
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}


