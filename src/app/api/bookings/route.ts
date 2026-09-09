import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ACTIVE = ['requested','pending','confirmed']

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  const { service_id, session_type, requested_start, customer_name, customer_question, customer_notes = '' } = body
  if (!service_id || !['zoom','in_person'].includes(session_type) || !requested_start || !customer_name?.trim() || !customer_question?.trim()) {
    return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 })
  }

  const { data: service } = await supabase.from('services').select('id,duration_minutes').eq('id',service_id).eq('is_active',true).maybeSingle()
  if (!service) return NextResponse.json({ error: 'That reading is not available.' }, { status: 400 })
  const start = new Date(requested_start)
  if (Number.isNaN(start.getTime())) return NextResponse.json({ error: 'Invalid time.' }, { status: 400 })
  const end = new Date(start.getTime() + service.duration_minutes * 60000)
  const { data: settings } = await supabase.from('site_settings').select('booking_notice_hours,booking_window_days').eq('id',true).single()
  const now = Date.now()
  if (start.getTime() < now + Number(settings?.booking_notice_hours ?? 24)*3600000 || start.getTime() > now + Number(settings?.booking_window_days ?? 60)*86400000) {
    return NextResponse.json({ error: 'That time is outside the booking window.' }, { status: 400 })
  }

  const { data: conflict } = await supabase.from('bookings').select('id').in('status',ACTIVE).lt('requested_start',end.toISOString()).gt('requested_end',start.toISOString()).limit(1)
  if (conflict?.length) return NextResponse.json({ error: 'That time was just taken. Please choose another slot.' }, { status: 409 })

  const timezone = 'Asia/Kolkata'
  const { data: booking, error } = await supabase.from('bookings').insert({
    customer_id: user.id,
    service_id,
    session_type,
    requested_start: start.toISOString(),
    requested_end: end.toISOString(),
    timezone,
    status: 'requested',
    customer_name: customer_name.trim().slice(0,120),
    customer_phone: user.phone ?? null,
    customer_question: customer_question.trim().slice(0,4000),
    customer_notes: String(customer_notes).trim().slice(0,4000),
    reader_notes: '',
    reschedule_count: 0,
  }).select('id').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ id: booking.id })
}
