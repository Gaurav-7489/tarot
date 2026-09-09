import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingForm from './BookingForm'

export default async function BookPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/book')
  const { data: services } = await supabase.from('services').select('id,slug,name,short_description,description,duration_minutes,price,currency').eq('is_active',true).order('sort_order')
  const { data: settings } = await supabase.from('site_settings').select('display_name,zoom_platform,location_label,location_details').eq('id',true).single()
  return <main className="booking-shell"><header className="booking-nav"><a href="/" className="wordmark">REV<span>.</span></a><a href="/dashboard">Dashboard</a></header><section className="booking-intro"><p className="eyebrow">PRIVATE SESSION</p><h1>Choose the room.</h1><p>Pick a reading, choose how you want to meet, then give Rev the question behind the question.</p></section><BookingForm services={services ?? []} settings={settings} /></main>
}
