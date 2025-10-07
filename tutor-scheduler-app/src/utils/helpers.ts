import { format, parseISO, addMinutes, startOfWeek, endOfWeek, addDays, isSameDay, isAfter, isBefore } from 'date-fns'
import { Class, RecurrencePattern, TimeSlot } from '@/types'

export class DateTimeUtils {
  static formatDate(date: string | Date, formatString: string = 'MMM dd, yyyy'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatString)
  }

  static formatTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'h:mm a')
  }

  static formatDateTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MMM dd, yyyy h:mm a')
  }

  static isToday(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isSameDay(dateObj, new Date())
  }

  static isTomorrow(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const tomorrow = addDays(new Date(), 1)
    return isSameDay(dateObj, tomorrow)
  }

  static getWeekRange(date?: Date): { start: Date; end: Date } {
    const baseDate = date || new Date()
    return {
      start: startOfWeek(baseDate, { weekStartsOn: 1 }), // Monday
      end: endOfWeek(baseDate, { weekStartsOn: 1 })
    }
  }

  static addMinutesToDate(date: string | Date, minutes: number): Date {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return addMinutes(dateObj, minutes)
  }

  static createTimeSlots(startTime: string, endTime: string, duration: number = 60): string[] {
    const slots: string[] = []
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    let currentHour = startHour
    let currentMin = startMin
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`
      slots.push(timeString)
      
      currentMin += duration
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60)
        currentMin = currentMin % 60
      }
    }
    
    return slots
  }

  static getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayOfWeek] || ''
  }

  static parseTimeSlot(timeSlot: TimeSlot): { day: string; time: string } {
    return {
      day: this.getDayName(timeSlot.dayOfWeek),
      time: `${timeSlot.startTime} - ${timeSlot.endTime}`
    }
  }
}

export class ClassUtils {
  static generateRecurringClasses(
    baseClass: Partial<Class>,
    pattern: RecurrencePattern,
    endDate: string,
    startDate?: string
  ): Partial<Class>[] {
    const classes: Partial<Class>[] = []
    const baseDateTime = parseISO(startDate || baseClass.scheduledDateTime!)
    let currentDate = new Date(baseDateTime)
    const end = parseISO(endDate)

    while (isBefore(currentDate, end) || isSameDay(currentDate, end)) {
      // Create a new class instance
      const newClass: Partial<Class> = {
        ...baseClass,
        id: `${baseClass.id}_${format(currentDate, 'yyyy-MM-dd')}`,
        scheduledDateTime: currentDate.toISOString(),
        type: 'recurring'
      }

      classes.push(newClass)

      // Calculate next occurrence
      currentDate = this.getNextOccurrence(currentDate, pattern)
      
      // Prevent infinite loops
      if (classes.length > 365) break
    }

    return classes
  }

  static getNextOccurrence(currentDate: Date, pattern: RecurrencePattern): Date {
    const nextDate = new Date(currentDate)

    switch (pattern.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + pattern.interval)
        break
      
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (7 * pattern.interval))
        break
      
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + pattern.interval)
        break
    }

    return nextDate
  }

  static isClassUpcoming(scheduledDateTime: string): boolean {
    return isAfter(parseISO(scheduledDateTime), new Date())
  }

  static getClassDuration(scheduledDateTime: string, duration: number): string {
    const start = parseISO(scheduledDateTime)
    const end = addMinutes(start, duration)
    return `${DateTimeUtils.formatTime(start)} - ${DateTimeUtils.formatTime(end)}`
  }

  static sortClassesByDate(classes: Class[]): Class[] {
    return [...classes].sort((a, b) => 
      new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime()
    )
  }

  static filterUpcomingClasses(classes: Class[]): Class[] {
    return classes.filter(cls => this.isClassUpcoming(cls.scheduledDateTime))
  }

  static filterClassesByDateRange(classes: Class[], startDate: Date, endDate: Date): Class[] {
    return classes.filter(cls => {
      const classDate = parseISO(cls.scheduledDateTime)
      return (isAfter(classDate, startDate) || isSameDay(classDate, startDate)) &&
             (isBefore(classDate, endDate) || isSameDay(classDate, endDate))
    })
  }
}

export class PaymentUtils {
  static calculateTotalRevenue(payments: any[]): number {
    return payments
      .filter(payment => payment.status === 'paid')
      .reduce((total, payment) => total + payment.amount, 0)
  }

  static getOverduePayments(payments: any[]): any[] {
    const today = new Date()
    return payments.filter(payment => 
      payment.status === 'pending' && 
      isAfter(today, parseISO(payment.dueDate))
    )
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  static getDaysOverdue(dueDate: string): number {
    const due = parseISO(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}

export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone.trim())
  }

  static validateTimeSlot(timeSlot: TimeSlot): string[] {
    const errors: string[] = []
    
    if (timeSlot.dayOfWeek < 0 || timeSlot.dayOfWeek > 6) {
      errors.push('Invalid day of week')
    }
    
    const startParts = timeSlot.startTime.split(':')
    const endParts = timeSlot.endTime.split(':')
    
    if (startParts.length !== 2 || endParts.length !== 2) {
      errors.push('Invalid time format')
      return errors
    }
    
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1])
    
    if (startMinutes >= endMinutes) {
      errors.push('End time must be after start time')
    }
    
    return errors
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
  }
}
