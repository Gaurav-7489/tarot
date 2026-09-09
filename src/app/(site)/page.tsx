'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, LockKeyhole, Moon, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

const readings = [
  { title: 'Love', kicker: 'THE HEART', text: 'Connection, distance, choices, patterns, and the questions you keep circling back to.' },
  { title: 'Career', kicker: 'THE CROSSROADS', text: 'Work, direction, ambition, decisions, and the road that feels hardest to read.' },
  { title: 'Future', kicker: 'WHAT COMES NEXT', text: 'Possible paths, turning points, timing, and the themes surrounding your next chapter.' },
  { title: 'Deep', kicker: 'NO SMALL QUESTIONS', text: 'More time for layered situations, multiple questions, difficult decisions, and the things that need room.' },
]

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <main ref={ref} className="site-shell">
      <div className="noise" /><div className="ambient ambient-a" /><div className="ambient ambient-b" />
      <header className="nav"><Link href="/" className="wordmark">REV<span>.</span></Link><nav><a href="#readings">Readings</a><a href="#private">Privacy</a><Link href="/login">Enter</Link></nav></header>
      <section className="hero">
        <motion.div style={{ y, scale }} className="hero-orbit" aria-hidden="true"><div className="orbit-ring" /><div className="orbit-core"><Moon size={18} /></div></motion.div>
        <div className="hero-copy"><p className="eyebrow"><span /> PRIVATE TAROT READINGS <span /></p><h1>Some questions<br /><em>need a reader.</em></h1><p className="hero-lede">A private space to ask what you actually want to know. Readings by Rev — no algorithms, no automated answers, just one reader and one conversation.</p><div className="hero-actions"><Link className="button button-primary" href="/login">Request a reading <ArrowUpRight size={16} /></Link><a className="button button-quiet" href="#readings">Explore the readings <ArrowDown size={15} /></a></div></div>
        <div className="hero-foot"><span>01 / 04</span><span>Scroll to enter</span><span>PRIVATE · HUMAN · ONE-TO-ONE</span></div>
      </section>
      <section className="statement" id="private"><div className="section-mark">01</div><div><p className="eyebrow">THE ROOM</p><h2>Nothing here is automated.</h2><p>Rev has spent years reading cards, questions, patterns, and people. Every session is handled privately and personally. What you share in a reading stays between you and your reader.</p></div><div className="seal"><LockKeyhole size={18} /><span>PRIVATE<br />BY DEFAULT</span></div></section>
      <section className="readings" id="readings"><div className="section-heading"><div><p className="eyebrow">02 / READINGS</p><h2>Bring the question.</h2></div><p>Choose a direction, or ask something that does not fit one.</p></div><div className="reading-grid">{readings.map((item, i) => <motion.article key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: i * 0.08 }} className="reading-card"><span>{item.kicker}</span><h3>{item.title}</h3><p>{item.text}</p><Link href="/login">Request <ArrowUpRight size={15} /></Link><div className="card-index">0{i + 1}</div></motion.article>)}</div></section>
      <section className="booking-band"><div><p className="eyebrow">03 / THE PROCESS</p><h2>Pick a time.<br />Ask the thing.</h2></div><div className="process-list"><div><span>01</span><b>Request</b><p>Choose your reading, format, and preferred time.</p></div><div><span>02</span><b>Confirmation</b><p>Rev reviews the request and confirms the session personally.</p></div><div><span>03</span><b>Read</b><p>Meet privately over your chosen platform or in person.</p></div></div></section>
      <section className="final-cta"><Sparkles size={18} /><p>Not sure which reading?</p><h2>Start with the question.</h2><Link className="button button-primary" href="/login">Request a private session <ArrowUpRight size={16} /></Link></section>
      <footer><span>REV. / PRIVATE TAROT</span><span>Human reading. No AI.</span><span>© {new Date().getFullYear()}</span></footer>
    </main>
  )
}
