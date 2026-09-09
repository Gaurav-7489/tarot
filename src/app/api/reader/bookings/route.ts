import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED = ['requested','pending','confirmed','declined','cancelled','completed']

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'reader') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'Booking id is required.' }, { status: 400 })
  const patch: Record<string, unknown> = {}
  if (body.status !== undefined) {
    if (!ALLOWED.includes(body.status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    patch.status = body.status
  }
  if (body.meeting_link !== undefined) patch.meeting_link = String(body.meeting_link).trim().slice(0,1000) || null
  if (body.meeting_location !== undefined) patch.meeting_location = String(body.meeting_location).trim().slice(0,1000) || null
  if (body.reader_notes !== undefined) patch.reader_notes = String(body.reader_notes).trim().slice(0,4000)
  if (body.cancellation_reason !== undefined) patch.cancellation_reason = String(body.cancellation_reason).trim().slice(0,1000) || null
  if (!Object.keys(patch).length) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  const { error } = await supabase.from('bookings').update(patch).eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
