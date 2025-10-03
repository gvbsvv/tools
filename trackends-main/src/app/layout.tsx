import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrackEnds - Your Personal Productivity Tools',
  description: 'A collection of powerful tools for managing your expenses, tasks, and more. Simple, effective, and always available.',
  keywords: 'productivity tools, expense tracker, task manager, personal finance, organization',
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
