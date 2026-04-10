import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Stylist AI — персональный ИИ-стилист',
  description: 'Получи образ от ИИ и найди вещи в реальных магазинах',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans bg-stone-50 text-stone-900`}>
        {children}
      </body>
    </html>
  )
}
