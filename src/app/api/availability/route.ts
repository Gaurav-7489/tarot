import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const TZ = 'Asia/Kolkata'

function parts(date: Date) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  return Object.fromEntries(p.filter(x => x.type !== 'literal').map(x => [x.type, x.value])) as Record<string,string>
}

function toUtc(date: string, time: string) {
  const [y,m,d] = date.split('-').map(Number)
  const [hh,mm] = time.slice(0,5).split(':').map(Number)
  return new Date(Date.UTC(y,m-1,d,hh-5,mm-30))
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const date = req.nextUrl.searchParams.get('date')
  const serviceId = req.nextUrl.searchParams.get('service_id')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: 'Invalid date' }, { status: 400 })

  const selected = new Date(`${date}T12:00:00Z`)
  const now = new Date()
  const { booking_notice_hours = 24, booking_window_days = 60 } = (await supabase.from('site_settings').select('booking_notice_hours,booking_window_days').eq('id', true).single()).data ?? {}
  const min = new Date(now.getTime() + Number(booking_notice_hours) * 3600000)
  const max = new Date(now.getTime() + Number(booking_window_days) * 86400000)
  if (selected < new Date(`${parts(min).year}-${parts(min).month}-${parts(min).day}T00:00:00Z`) || selected > max) return NextResponse.json({ slots: [] })

  const weekdayMap: Record<string,number> = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 }
  const weekday = weekdayMap[new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short'}).format(selected)]
  const { data: rules } = await supabase.from('availability_rules').select('start_time,end_time').eq('weekday',weekday).eq('is_active',true)
  const { data: exception } = await supabase.from('availability_exceptions').select('is_available,start_time,end_time').eq('exception_date',date).maybeSingle()
  if (exception && !exception.is_available) return NextResponse.json({ slots: [] })

  const ranges = exception?.is_available && exception.start_time && exception.end_time
    ? [{ start_time: exception.start_time, end_time: exception.end_time }]
    : (rules ?? [])
  if (!ranges.length) return NextResponse.json({ slots: [] })

  let duration = 60
  if (serviceId) {
    const { data: service } = await supabase.from('services').select('duration_minutes').eq('id',serviceId).eq('is_active',true).maybeSingle()
    if (!service) return NextResponse.json({ slots: [] })
    duration = service.duration_minutes
  }

  const dayStart = toUtc(date, '00:00')
  const dayEnd = toUtc(date, '23:59')
  const { data: bookings } = await supabase.from('bookings').select('requested_start,requested_end').in('status',['requested','pending','confirmed']).lt('requested_start',dayEnd.toISOString()).gt('requested_end',dayStart.toISOString())
  const slots: string[] = []
  for (const range of ranges) {
    let cursor = toUtc(date, range.start_time)
    const end = toUtc(date, range.end_time)
    while (cursor.getTime() + duration*60000 <= end.getTime()) {
      const slotEnd = new Date(cursor.getTime()+duration*60000)
      if (cursor >= min && cursor <= max && !(bookings ?? []).some(b => new Date(b.requested_start) < slotEnd && new Date(b.requested_end) > cursor)) {
        slots.push(cursor.toISOString())
      }
      cursor = slotEnd
    }
  }
  return NextResponse.json({ slots })
}
