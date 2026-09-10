'use client'

import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, ChevronDown, Moon, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { cardsImage, goatImage, ritualImage, tableImage } from './images'

const readings = [
  { title: 'Love', number: '01', glyph: '♡', text: 'The person. The distance. The choice. The thing you keep pretending you are over.', cta: 'Open the love room' },
  { title: 'Career', number: '02', glyph: '†', text: 'Work, money, ambition, direction — when the road ahead has stopped making sense.', cta: 'Open the career room' },
  { title: 'Future', number: '03', glyph: '☽', text: 'What may be approaching. Where the path bends. What deserves your attention now.', cta: 'Open the future room' },
  { title: 'Deep', number: '04', glyph: '✦', text: 'The complicated one. Multiple questions, tangled stories, nowhere neat to put them.', cta: 'Open the deep room' },
]

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const smoothX = useSpring(cursorX, { stiffness: 500, damping: 40, mass: 0.15 })
  const smoothY = useSpring(cursorY, { stiffness: 500, damping: 40, mass: 0.15 })
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14])
  const moveCursor = (e: React.MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY) }
  const cinematicEase = [0.16, 1, 0.3, 1] as [number, number, number, number]

  return (
    <main ref={pageRef} className="site-shell" onMouseMove={moveCursor}>
      <motion.div className="cursor-orb" style={{ x: smoothX, y: smoothY }} aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <header className="nav">
        <Link href="/" className="wordmark" aria-label="Rev home">REV<span>†</span></Link>
        <div className="nav-center"><span className="nav-dot" /> <span>PRIVATE RITUALS / HUMAN READINGS</span></div>
        <nav><a href="#readings">Readings</a><a href="#the-room">The room</a><Link href="/login">Enter</Link></nav>
      </header>
      <section className="hero">
        <motion.div className="hero-image" style={{ y: heroY, scale: heroScale }}><img src={ritualImage} alt="A candlelit ritual room" fetchPriority="high" /><div className="image-veil" /></motion.div>
        <div className="hero-ring hero-ring-one" aria-hidden="true" /><div className="hero-ring hero-ring-two" aria-hidden="true" />
        <motion.div className="hero-sigil" initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} aria-hidden="true"><Moon size={18} /></motion.div>
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}><span /> PRIVATE TAROT READINGS <span /></motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1, ease: cinematicEase }}>COME WITH<br /><em>YOUR QUESTION.</em></motion.h1>
          <motion.p className="hero-lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.9 }}>You already know the question. You just need somewhere quiet enough to ask it. Enter a private, one-to-one reading with Rev.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}><Link className="button button-primary magnetic" href="/book"><span>Enter the reading</span><ArrowUpRight size={16} /></Link><a className="button button-quiet" href="#readings"><span>Find your doorway</span><ArrowDown size={15} /></a></motion.div>
        </div>
        <div className="hero-foot"><span>REV / MMXXVI</span><span><span className="red-mark">●</span> PRIVATE · HUMAN · ONE-TO-ONE</span><span className="scroll-cue">SCROLL <ChevronDown size={12} /></span></div>
      </section>
      <section className="marquee" aria-label="Rev reading philosophy"><div className="marquee-track"><span>THE CARDS ARE NOT THE ANSWER</span><b>✦</b><span>THE QUESTION IS THE DOOR</span><b>✦</b><span>THE READING BEGINS WHERE GOOGLE ENDS</span><b>✦</b><span>THE CARDS ARE NOT THE ANSWER</span><b>✦</b><span>THE QUESTION IS THE DOOR</span><b>✦</b></div></section>
      <motion.section className="manifesto" id="the-room" initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: cinematicEase }}>
        <div className="manifesto-image image-frame"><img src={goatImage} alt="Occult mask in the reading room" loading="lazy" /><div className="frame-corner frame-corner-a" /><div className="frame-corner frame-corner-b" /><span className="image-caption">THE ROOM / AFTER DARK / 01</span></div>
        <div className="manifesto-copy"><p className="eyebrow left"><span /> THE ROOM</p><h2>Leave the<br /><em>daylight</em> at the door.</h2><p>There is no crystal ball here. No cold prediction machine. No algorithm pretending it knows you.</p><p>There are cards, instinct, symbolism, and a private conversation about the thing that has been sitting in the back of your mind.</p><div className="ritual-line"><Star size={13} /> HUMAN READING / NO AUTOMATED ANSWERS</div></div>
      </motion.section>
      <section className="interlude"><div className="interlude-symbol"><Sparkles size={17} /></div><p>Some questions arrive quietly.<br /><em>Others knock.</em></p></section>
      <section className="cards-showcase">
        <motion.div className="cards-photo image-frame" initial={{ clipPath: 'inset(8% 8% 8% 8%)' }} whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: cinematicEase }}><img src={cardsImage} alt="Tarot cards laid out for a reading" loading="lazy" /><div className="cards-glow" /><span className="image-caption">THE DECK / LISTEN CLOSELY</span></motion.div>
        <div className="cards-copy"><p className="eyebrow left"><span /> THE CARDS</p><h2>Ask the thing<br /><em>you cannot google.</em></h2><p>Love. Career. Future. A decision. A person. A pattern you keep repeating. Bring the real question — not the polite version.</p><div className="question-list"><span>WHAT IS THIS?</span><span>WHY IS THIS HAPPENING?</span><span>WHERE DOES THIS GO?</span><span>WHAT AM I NOT SEEING?</span></div><Link className="text-link" href="/book">Bring your question <ArrowUpRight size={15} /></Link></div>
      </section>
      <section className="readings" id="readings">
        <div className="section-heading"><div><p className="eyebrow left"><span /> 01 / THE DOORWAYS</p><h2>Choose what<br /><em>called you here.</em></h2></div><p className="section-intro">Four ways in. One rule: <em>bring the honest question.</em></p></div>
        <div className="reading-grid">{readings.map((item, i) => <motion.article key={item.title} className="reading-card" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -7 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: i * 0.09, duration: 0.7, ease: cinematicEase }}><div className="card-aura" /><div className="card-glyph">{item.glyph}</div><div className="card-top"><span>{item.number}</span><small>PRIVATE READING</small></div><h3>{item.title}</h3><p>{item.text}</p><Link href={`/book?reading=${item.title.toLowerCase()}`}><span>{item.cta}</span><ArrowUpRight size={14} /></Link></motion.article>)}</div>
      </section>
      <section className="atmosphere"><motion.div className="atmosphere-photo" initial={{ scale: 1.12 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: cinematicEase }}><img src={tableImage} alt="Candlelit tarot spread" loading="lazy" /></motion.div><div className="atmosphere-overlay" /><div className="atmosphere-copy"><p className="eyebrow left"><span /> 02 / HOW IT WORKS</p><h2>Three steps.<br /><em>Then we see.</em></h2><div className="steps"><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}><b>01</b><span>Leave a note</span><p>Tell Rev what is on your mind and choose the reading that feels right.</p></motion.div><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .12, duration: .6 }}><b>02</b><span>Wait for the signal</span><p>Your request is reviewed personally. You will receive the details and confirmation.</p></motion.div><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .24, duration: .6 }}><b>03</b><span>Enter the room</span><p>The reading happens privately, one-to-one, with the cards on the table.</p></motion.div></div></div></section>
      <section className="credo"><div className="credo-mark">†</div><p className="eyebrow">THE REV CODE</p><div className="credo-lines"><p>NO AUTOMATED PROPHECIES.</p><p>NO JUDGEMENT.</p><p>NO QUESTION TOO STRANGE.</p><p>NO NEED TO PRETEND.</p></div></section>
      <section className="final-cta"><motion.div className="sigil" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}><Moon size={20} /></motion.div><p>THE DOOR IS OPEN</p><h2>Start with<br /><em>the question.</em></h2><Link className="button button-primary" href="/book">Request a private session <ArrowUpRight size={16} /></Link><div className="final-note"><ChevronDown size={14} /> Enter quietly. Leave with something to think about.</div></section>
      <footer><span>REV† / PRIVATE TAROT</span><span>HUMAN READING · NO AI</span><span>© {new Date().getFullYear()}</span></footer>
    </main>
  )
}
