export interface Child {
  id: string
  name: string
  age?: number
  grade?: string
  interests: string[] // activities they're learning
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Tutor {
  id: string
  name: string
  email?: string
  phone?: string
  specialization: string // e.g., "Piano", "Mathematics", "Karate", "Swimming"
  hourlyRate: number
  location: string // "Online", "At home", "At tutor's place", "Studio/Center"
  bio?: string
  qualifications?: string[]
  availability?: TimeSlot[]
  rating?: number // 1-5 star rating
  totalSessions?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  dayOfWeek: number // 0-6 (Sunday to Saturday)
  startTime: string // "HH:MM" format
  endTime: string // "HH:MM" format
}

export interface ActivityCategory {
  id: string
  name: string
  subcategories: string[]
}

// Common activity categories
export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: 'academic',
    name: 'Academic Subjects',
    subcategories: ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science', 'Languages']
  },
  {
    id: 'music',
    name: 'Music',
    subcategories: ['Piano', 'Guitar', 'Violin', 'Drums', 'Vocals', 'Flute', 'Keyboard', 'Tabla']
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    subcategories: ['Swimming', 'Tennis', 'Cricket', 'Football', 'Basketball', 'Badminton', 'Yoga', 'Gym Training']
  },
  {
    id: 'martial_arts',
    name: 'Martial Arts',
    subcategories: ['Karate', 'Taekwondo', 'Judo', 'Boxing', 'Kickboxing', 'Aikido', 'Kung Fu']
  },
  {
    id: 'dance',
    name: 'Dance',
    subcategories: ['Classical Dance', 'Hip Hop', 'Ballet', 'Contemporary', 'Bollywood', 'Salsa', 'Folk Dance']
  },
  {
    id: 'arts_crafts',
    name: 'Arts & Crafts',
    subcategories: ['Drawing', 'Painting', 'Sculpture', 'Pottery', 'Origami', 'Calligraphy', 'Photography']
  },
  {
    id: 'games',
    name: 'Mind Games',
    subcategories: ['Chess', 'Rubiks Cube', 'Scrabble', 'Bridge', 'Sudoku', 'Mental Math']
  },
  {
    id: 'life_skills',
    name: 'Life Skills',
    subcategories: ['Cooking', 'Public Speaking', 'Leadership', 'Time Management', 'Communication Skills']
  }
]

export interface Session {
  id: string
  tutorId: string
  childId: string
  activity: string // e.g., "Piano Lessons", "Math Tutoring", "Swimming", "Chess"
  type: 'one-time' | 'recurring'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  scheduledDateTime: string // ISO string
  duration: number // minutes
  rate: number
  location: string // "Online", "At home", "At tutor's place", etc.
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
  type: 'session' | 'payment'
  sessionId: string
  message: string
  reminderDateTime: string
  sent: boolean
  sentAt?: string
  recipientEmail?: string
  recipientPhone?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  sessionId: string
  tutorId: string
  childId: string
  amount: number
  dueDate: string
  paidDate?: string
  method?: string // 'cash', 'card', 'transfer', 'upi', 'cheque', etc.
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Dashboard {
  totalTutors: number
  totalChildren: number
  totalSessions: number
  upcomingSessions: Session[]
  overduePayments: Payment[]
  todaysReminders: Reminder[]
  monthlyExpenses: number
  weeklyStats: {
    scheduledSessions: number
    completedSessions: number
    cancelledSessions: number
  }
}

export interface NotificationSettings {
  sessionReminders: boolean
  paymentReminders: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  reminderMinutesBefore: number
  paymentReminderDaysBefore: number
}
