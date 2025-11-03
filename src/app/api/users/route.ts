// DISABLED - User management is handled by Supabase Auth
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'User management is handled by Supabase Auth' }, 
    { status: 410 }
  )
}

export async function POST() {
  return NextResponse.json(
    { error: 'User management is handled by Supabase Auth' }, 
    { status: 410 }
  )
}