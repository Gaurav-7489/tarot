import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ACTIVE = ['requested','pending','confirmed']
const TZ = 'Asia/Kolkata'

function localParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value])) as Record<string,string>
}

function minutesOf(time: string) {
  const [h,m] = time.slice(0,5).split(':').map(Number)
  return h * 60 + m
}

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

  const local = localParts(start)
  const weekdayMap: Record<string,number> = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 }
  const weekday = weekdayMap[local.weekday]
  const startMinute = Number(local.hour) * 60 + Number(local.minute)
  const endLocal = localParts(end)
  const endMinute = Number(endLocal.hour) * 60 + Number(endLocal.minute)
  const crossesDay = local.year !== endLocal.year || local.month !== endLocal.month || local.day !== endLocal.day

  const { data: exception } = await supabase.from('availability_exceptions').select('is_available,start_time,end_time').eq('exception_date', `${local.year}-${local.month}-${local.day}`).maybeSingle()
  if (exception && !exception.is_available) return NextResponse.json({ error: 'That day is unavailable.' }, { status: 400 })

  const { data: rules } = await supabase.from('availability_rules').select('start_time,end_time').eq('weekday',weekday).eq('is_active',true)
  const ranges = exception?.is_available && exception.start_time && exception.end_time
    ? [{ start_time: exception.start_time, end_time: exception.end_time }]
    : (rules ?? [])
  const fitsAvailability = !crossesDay && ranges.some(range => startMinute >= minutesOf(range.start_time) && endMinute <= minutesOf(range.end_time))
  if (!fitsAvailability) return NextResponse.json({ error: 'That time is outside the reader’s availability.' }, { status: 400 })

  const { data: conflict } = await supabase.from('bookings').select('id').in('status',ACTIVE).lt('requested_start',end.toISOString()).gt('requested_end',start.toISOString()).limit(1)
  if (conflict?.length) return NextResponse.json({ error: 'That time was just taken. Please choose another slot.' }, { status: 409 })

  const { data: booking, error } = await supabase.from('bookings').insert({
    customer_id: user.id,
    service_id,
    session_type,
    requested_start: start.toISOString(),
    requested_end: end.toISOString(),
    timezone: TZ,
    status: 'requested',
    customer_name: customer_name.trim().slice(0,120),
    customer_phone: user.phone ?? null,
    customer_question: customer_question.trim().slice(0,4000),
    customer_notes: String(customer_notes).trim().slice(0,4000),
    reader_notes: '',
    reschedule_count: 0,
  }).select('id').single()

  if (error) {
    if (error.code === '23P01') return NextResponse.json({ error: 'That time was just taken. Please choose another slot.' }, { status: 409 })
    return NextResponse.json({ error: 'Could not create the booking.' }, { status: 400 })
  }
  return NextResponse.json({ id: booking.id })
}
