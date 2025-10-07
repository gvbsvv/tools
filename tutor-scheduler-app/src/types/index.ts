export interface Tutor {
  id: string
  name: string
  email: string
  phone: string
  subjects: string[]
  hourlyRate: number
  availability: TimeSlot[]
  bio?: string
  qualifications?: string[]
  profileImage?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: string
  name: string
  email?: string
  phone?: string
  parentName?: string
  parentEmail?: string
  parentPhone: string
  grade?: string
  subjects: string[]
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  dayOfWeek: number // 0-6 (Sunday to Saturday)
  startTime: string // "HH:MM" format
  endTime: string // "HH:MM" format
}

export interface Class {
  id: string
  tutorId: string
  studentId: string
  subject: string
  type: 'one-time' | 'recurring'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  scheduledDateTime: string // ISO string
  duration: number // minutes
  rate: number
  location: string
  notes?: string
  
  // For recurring classes
  recurrencePattern?: RecurrencePattern
  recurrenceEndDate?: string
  
  // Payment tracking
  paymentStatus: 'unpaid' | 'paid' | 'overdue'
  paymentDueDate?: string
  paidAmount?: number
  paidDate?: string
  
  // Completion tracking
  completedAt?: string
  completionNotes?: string
  
  createdAt: string
  updatedAt: string
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly'
  interval: number // every X days/weeks/months
  daysOfWeek?: number[] // for weekly recurrence
  dayOfMonth?: number // for monthly recurrence
}

export interface Reminder {
  id: string
  type: 'class' | 'payment'
  classId: string
  message: string
  reminderDateTime: string
  sent: boolean
  sentAt?: string
  recipientEmail?: string
  recipientPhone?: string
  createdAt: string
}

export interface Payment {
  id: string
  classId: string
  tutorId: string
  studentId: string
  amount: number
  dueDate: string
  paidDate?: string
  method?: string // 'cash', 'card', 'transfer', etc.
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Dashboard {
  totalTutors: number
  totalStudents: number
  totalClasses: number
  upcomingClasses: Class[]
  overduePayments: Payment[]
  todaysReminders: Reminder[]
  monthlyRevenue: number
  weeklyStats: {
    scheduledClasses: number
    completedClasses: number
    cancelledClasses: number
  }
}

export interface NotificationSettings {
  classReminders: boolean
  paymentReminders: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  reminderMinutesBefore: number
  paymentReminderDaysBefore: number
}
