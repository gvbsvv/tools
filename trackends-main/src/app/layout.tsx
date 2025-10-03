import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrackEnds - Expense Tracker, Task Reminders, Budget Planner & Productivity Tools',
  description: 'Free productivity tools suite including expense tracker, task reminders, budget planner, time tracker, note taking, password manager. Cross-platform apps for web, Android & iOS. Manage finances, organize tasks, track spending, plan budgets.',
  keywords: 'expense tracker, task reminders, budget planner, time tracker, note taking, password manager, productivity tools, personal finance, money management, expense management, task manager, todo list, reminder app, budget tracker, spending tracker, financial planner, expense app, task organizer, productivity suite, personal organizer, finance tools, budgeting app, expense monitoring, task planning, reminder notifications, expense categories, budget analysis, financial tracking, personal productivity, organization tools, life management, digital planner, expense record, task scheduling, budget control, money tracker, expense diary, task reminder, productivity apps, financial organization, expense calculator, budget manager, task list, reminder system, expense report, financial dashboard, budget planning tools, expense analysis, task management system',
  authors: [{ name: 'TrackEnds' }],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'TrackEnds - Free Expense Tracker, Task Reminders & Productivity Tools',
    description: 'Complete productivity suite with expense tracker, task reminders, budget planner, time tracker. Free web and mobile apps for better financial and task management.',
    url: 'https://www.trackends.com',
    siteName: 'TrackEnds',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrackEnds - Expense Tracker & Task Management Tools',
    description: 'Free productivity tools: expense tracker, task reminders, budget planner. Available on web, Android & iOS.',
    creator: '@trackends',
  },
  alternates: {
    canonical: 'https://www.trackends.com',
  },
  category: 'Productivity',
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
