import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrackEnds - Expense Tracker',
  description: 'Track and manage your expenses with ease. Simple, powerful expense tracking for individuals.',
  keywords: 'expense tracker, budget, finance, money management, personal finance',
  authors: [{ name: 'TrackEnds' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
