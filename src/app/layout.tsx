import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'REV — Private Tarot Readings',
  description: 'Private tarot readings with Rev. Love, career, future, deep readings, and questions that do not fit a box.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
