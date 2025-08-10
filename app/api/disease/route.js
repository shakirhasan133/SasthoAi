import { NextResponse } from 'next/server'
import { getDiseaseDetailsFromAI } from '../../../lib/ai'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = (searchParams.get('name') || '').trim()
    if (!name) {
      return NextResponse.json({ error: 'Missing query parameter: name' }, { status: 400 })
    }
    const details = await getDiseaseDetailsFromAI(name)
    if (!details || typeof details !== 'object') {
      return NextResponse.json({
        symptoms: [],
        causes: [],
        prevention: [],
        treatment: [],
        healthGuidelines: [],
        diet: [],
        otherInfo: [],
        _note: 'AI returned no details; using empty defaults.'
      })
    }
    return NextResponse.json(details)
  } catch (error) {
    // Return safe fallback instead of 500 to avoid breaking UI
    return NextResponse.json({
      symptoms: [],
      causes: [],
      prevention: [],
      treatment: [],
      healthGuidelines: [],
      diet: [],
      otherInfo: [],
      _error: error?.message || String(error)
    })
  }
}


