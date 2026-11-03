import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Sora } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MLBB ID Checker — Cek Username, ID, Zone ID & Wilayah Akun',
  description:
    'Cari username, ID, Zone ID, dan wilayah akun Mobile Legends dalam satu pencarian dengan tampilan crimson dan gold.',
  applicationName: 'MLBB ID Checker',
}

export const viewport: Viewport = {
  themeColor: '#09070a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${sora.variable} ${instrument.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
