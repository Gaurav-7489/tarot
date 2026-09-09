import Link from 'next/link'

export default function NotFound(){
 return <main className="auth-shell"><section className="auth-card"><p className="eyebrow">NOT FOUND</p><h1>Wrong door.</h1><p>This page does not exist. The room you were looking for may have moved.</p><Link className="button button-primary" href="/">Return to the room</Link></section></main>
}
