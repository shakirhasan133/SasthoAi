import { NextResponse } from 'next/server'
import { getSuggestionsFromAI } from '../../../lib/ai'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    if (!q) {
      return NextResponse.json({ error: 'Missing query parameter: q' }, { status: 400 })
    }
    const suggestions = await getSuggestionsFromAI(q)
    return NextResponse.json(suggestions)
  } catch (error) {
    // Return empty suggestions instead of 500 to keep UX smooth
    return NextResponse.json([])
  }
}


