// DISABLED - Seed functionality handled via Supabase
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'Seed functionality is disabled - use Supabase for data management' }, 
    { status: 410 }
  )
}

export async function POST() {
  return NextResponse.json(
    { error: 'Seed functionality is disabled - use Supabase for data management' }, 
    { status: 410 }
  )
}