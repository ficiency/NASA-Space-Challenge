import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BloomingHealth - Health & Bloom Tracker',
  description: 'Track blooming seasons and their health impacts across Mexico',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}