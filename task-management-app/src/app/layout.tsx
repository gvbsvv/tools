import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrackEnds - Remind',
  description: 'Organize your tasks and reminders across multiple categories with ease. Simple task management for productivity.',
  keywords: 'task manager, todo, reminders, productivity, organization',
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
