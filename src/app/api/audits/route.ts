import { NextRequest, NextResponse } from 'next/server'

// API routes are minimal in v1 since persistence is localStorage-based.
// These exist as API contract stubs for future Supabase migration.

export async function GET() {
  return NextResponse.json({ message: 'Use client-side localStorage for v1' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ message: 'Use client-side localStorage for v1', body })
}
