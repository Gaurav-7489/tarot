import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ReaderConsole from './ReaderConsole'

export default async function Dashboard(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login')
 const isReader=user.app_metadata?.role==='reader'
 if(isReader){
  const [{data:bookings},{data:services},{data:settings}]=await Promise.all([
   supabase.from('bookings').select('id,status,requested_start,session_type,customer_name,customer_question,customer_notes,reader_notes,meeting_link,meeting_location,services(name)').order('requested_start',{ascending:true}).limit(50),
   supabase.from('services').select('id,name,duration_minutes,price,currency,is_active').order('sort_order'),
   supabase.from('site_settings').select('display_name,location_label,zoom_platform').single(),
  ])
  return <main className="dash"><header className="dash-nav"><Link href="/" className="wordmark">REV<span>.</span></Link><span>READER CONSOLE</span></header><section className="dash-wrap"><div className="dash-hero"><div><p className="eyebrow">PRIVATE READER DASHBOARD</p><h1>The room, behind the room.</h1></div><form action="/auth/signout" method="post"><button className="button button-quiet">Sign out</button></form></div><ReaderConsole bookings={(bookings||[]) as any} services={(services||[]) as any}/><div className="dash-panel setup-panel"><p className="panel-label">SETUP</p><p className="setting-line">Display <b>{settings?.display_name??'Rev'}</b></p><p className="setting-line">Zoom <b>{settings?.zoom_platform??'Not set'}</b></p><p className="setting-line">In person <b>{settings?.location_label||'Not set'}</b></p></div></section></main>
 }
 const {data:bookings}=await supabase.from('bookings').select('id,status,requested_start,session_type,services(name)').eq('customer_id',user.id).order('requested_start',{ascending:true}).limit(20)
 return <main className="dash"><header className="dash-nav"><Link href="/" className="wordmark">REV<span>.</span></Link><span>YOUR ROOM</span></header><section className="dash-wrap"><div className="dash-hero"><div><p className="eyebrow">PRIVATE DASHBOARD</p><h1>Your readings.</h1></div><form action="/auth/signout" method="post"><button className="button button-quiet">Sign out</button></form></div><div className="dash-grid"><div className="dash-panel wide"><p className="panel-label">YOUR REQUESTS</p>{bookings?.length?<div className="rows">{bookings.map((b:any)=><div className="row" key={b.id}><span>{new Date(b.requested_start).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</span><b>{(b.services as any)?.name||'Reading'}</b><em>{b.status}</em></div>)}</div>:<div className="empty"><p>You haven't requested a reading yet.</p><Link className="button button-primary" href="/book">Start a reading</Link></div>}</div></div></section></main>
}
