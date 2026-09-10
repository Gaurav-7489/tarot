'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

export default function LoginPage(){
 const next=new URLSearchParams(typeof window!=='undefined'?location.search:'').get('next')||'/dashboard'
 const [phone,setPhone]=useState(''); const [sent,setSent]=useState(false); const [otp,setOtp]=useState(''); const [error,setError]=useState('')
 async function google(){setError(''); const supabase=createClient(); const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${location.origin}/auth/callback?next=${encodeURIComponent(next)}`}}); if(error)setError('Google sign-in is not configured yet. Add the Google credentials in Supabase Auth settings.')}
 async function sendOtp(e:React.FormEvent){e.preventDefault();setError(''); const supabase=createClient(); const {error}=await supabase.auth.signInWithOtp({phone});if(error)setError('We could not send the code. Check the number and try again.');else setSent(true)}
 async function verify(e:React.FormEvent){e.preventDefault();setError('');const supabase=createClient();const {error}=await supabase.auth.verifyOtp({phone,token:otp,type:'sms'});if(error)setError('That code is not valid anymore. Request a new one.');else location.href=next}
 return <main className="auth-shell"><Link href="/" className="back"><ArrowLeft size={15}/> Back</Link><section className="auth-card"><p className="eyebrow">PRIVATE ACCESS</p><h1>Enter the room.</h1><p>Sign in only when you are ready to request a reading. Your account keeps your bookings and private session details in one place.</p><button className="button auth-google" onClick={google}>Continue with Google <ArrowUpRight size={15}/></button><div className="divider"><span>or phone</span></div>{!sent?<form onSubmit={sendOtp}><label>Phone number</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98••••••••" required/><button className="button button-primary" type="submit">Send secure code <ArrowUpRight size={15}/></button></form>:<form onSubmit={verify}><label>6-digit code</label><input inputMode="numeric" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} placeholder="••••••" required/><button className="button button-primary" type="submit">Verify & enter <ArrowUpRight size={15}/></button><button type="button" className="resend" onClick={()=>setSent(false)}>Use another number</button></form>}{error&&<p className="auth-error">{error}</p>}<small>By continuing, you agree that readings are private conversations between you and Rev.</small></section></main>
}
