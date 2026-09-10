'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, ChevronDown, Moon, Star } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { cardsImage, goatImage, ritualImage, tableImage } from './images'

const readings = [
  { title: 'Love', number: '01', text: 'For the person, the distance, the choice, or the question you keep coming back to.' },
  { title: 'Career', number: '02', text: 'For work, money, direction, ambition, and the road that refuses to look obvious.' },
  { title: 'Future', number: '03', text: 'For what may be approaching, where the path bends, and what deserves your attention.' },
  { title: 'Deep', number: '04', text: 'For complicated situations, multiple questions, and readings that need more room.' },
]

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.16])

  return (
    <main ref={ref} className="site-shell">
      <div className="noise" />
      <header className="nav">
        <Link href="/" className="wordmark">REV<span>†</span></Link>
        <nav>
          <a href="#readings">Readings</a>
          <a href="#the-room">The room</a>
          <Link href="/login">Enter</Link>
        </nav>
      </header>

      <section className="hero">
        <motion.div className="hero-image" style={{ y: heroY, scale: heroScale }}>
          <img src={ritualImage} alt="Dark tarot reading table" />
          <div className="image-veil" />
        </motion.div>
        <div className="hero-sigil" aria-hidden="true"><Moon size={18} /></div>
        <div className="hero-copy">
          <p className="eyebrow"><span /> PRIVATE TAROT READINGS <span /></p>
          <h1>COME WITH<br /><em>YOUR QUESTION.</em></h1>
          <p className="hero-lede">Some things are easier to say in the dark. Private tarot readings by Rev — one reader, one conversation, no automated answers.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/book">Enter the reading <ArrowUpRight size={16} /></Link>
            <a className="button button-quiet" href="#readings">See the readings <ArrowDown size={15} /></a>
          </div>
        </div>
        <div className="hero-foot"><span>REV / 2026</span><span>PRIVATE · HUMAN · ONE-TO-ONE</span><span>SCROLL TO ENTER</span></div>
      </section>

      <section className="manifesto" id="the-room">
        <div className="manifesto-image">
          <img src={goatImage} alt="Dark occult tarot atmosphere" />
          <span className="image-caption">THE ROOM · AFTER DARK</span>
        </div>
        <div className="manifesto-copy">
          <p className="eyebrow"><span /> THE ROOM</p>
          <h2>Leave the daylight at the door.</h2>
          <p>Rev reads the cards, the question, the pattern, and the parts you do not know how to explain. The session is private. The conversation is human. Come with whatever you are actually trying to understand.</p>
          <div className="ritual-line"><Star size={13} /> NO ALGORITHMS · NO AUTOMATED READINGS</div>
        </div>
      </section>

      <section className="cards-showcase">
        <div className="cards-photo"><img src={cardsImage} alt="Gothic tarot cards" /></div>
        <div className="cards-copy">
          <p className="eyebrow">THE CARDS</p>
          <h2>Ask the thing<br /><em>you cannot google.</em></h2>
          <p>Love. Career. Future. The messy question that does not fit a category. The reading starts there.</p>
          <Link className="text-link" href="/book">Request a private reading <ArrowUpRight size={15} /></Link>
        </div>
      </section>

      <section className="readings" id="readings">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> 01 / READINGS</p>
            <h2>Pick your doorway.</h2>
          </div>
          <p>Choose a direction or bring a question of your own.</p>
        </div>
        <div className="reading-grid">
          {readings.map((item, i) => (
            <motion.article key={item.title} className="reading-card"
              initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }} transition={{ delay: i * 0.07 }}>
              <div className="card-top"><span>{item.number}</span><small>READING</small></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link href={`/book?reading=${item.title.toLowerCase()}`}>Open doorway <ArrowUpRight size={14} /></Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="atmosphere">
        <div className="atmosphere-photo"><img src={tableImage} alt="Candlelit tarot reading" /></div>
        <div className="atmosphere-overlay" />
        <div className="atmosphere-copy">
          <p className="eyebrow">02 / THE READING</p>
          <h2>Light a candle.<br /><em>Ask honestly.</em></h2>
          <div className="steps">
            <div><b>01</b><span>Request</span><p>Choose a reading and a time that works.</p></div>
            <div><b>02</b><span>Confirmation</span><p>Rev reviews your request personally.</p></div>
            <div><b>03</b><span>Read</span><p>Meet privately over your chosen platform.</p></div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="sigil"><Moon size={20} /></div>
        <p>Not sure which reading?</p>
        <h2>Start with the question.</h2>
        <Link className="button button-primary" href="/book">Request a private session <ArrowUpRight size={16} /></Link>
        <div className="final-note"><ChevronDown size={14} /> Enter quietly. Leave with something to think about.</div>
      </section>

      <footer>
        <span>REV† / PRIVATE TAROT</span>
        <span>HUMAN READING · NO AI</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  )
}
