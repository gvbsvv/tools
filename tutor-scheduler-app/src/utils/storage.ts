import { Preferences } from '@capacitor/preferences'

export class TutorStorage {
  private static readonly STORAGE_KEYS = {
    TUTORS: 'tutors',
    STUDENTS: 'students', 
    CLASSES: 'classes',
    PAYMENTS: 'payments',
    REMINDERS: 'reminders',
    USER_SESSION: 'userSession',
    NOTIFICATION_SETTINGS: 'notificationSettings'
  } as const

  // Generic storage methods
  static async save<T>(key: string, data: T): Promise<void> {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(data)
      })
    } catch (error) {
      console.error(`Error saving ${key}:`, error)
      throw error
    }
  }

  static async load<T>(key: string): Promise<T | null> {
    try {
      const result = await Preferences.get({ key })
      return result.value ? JSON.parse(result.value) : null
    } catch (error) {
      console.error(`Error loading ${key}:`, error)
      return null
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key })
    } catch (error) {
      console.error(`Error removing ${key}:`, error)
      throw error
    }
  }

  static async clear(): Promise<void> {
    try {
      await Preferences.clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
      throw error
    }
  }

  // Specific data methods with user scoping
  static async saveTutors(userId: string, tutors: any[]): Promise<void> {
    return this.save(`${userId}_${this.STORAGE_KEYS.TUTORS}`, tutors)
  }

  static async loadTutors(userId: string): Promise<any[]> {
    const tutors = await this.load<any[]>(`${userId}_${this.STORAGE_KEYS.TUTORS}`)
    return tutors || []
  }

  static async saveStudents(userId: string, students: any[]): Promise<void> {
    return this.save(`${userId}_${this.STORAGE_KEYS.STUDENTS}`, students)
  }

  static async loadStudents(userId: string): Promise<any[]> {
    const students = await this.load<any[]>(`${userId}_${this.STORAGE_KEYS.STUDENTS}`)
    return students || []
  }

  static async saveClasses(userId: string, classes: any[]): Promise<void> {
    return this.save(`${userId}_${this.STORAGE_KEYS.CLASSES}`, classes)
  }

  static async loadClasses(userId: string): Promise<any[]> {
    const classes = await this.load<any[]>(`${userId}_${this.STORAGE_KEYS.CLASSES}`)
    return classes || []
  }

  static async savePayments(userId: string, payments: any[]): Promise<void> {
    return this.save(`${userId}_${this.STORAGE_KEYS.PAYMENTS}`, payments)
  }

  static async loadPayments(userId: string): Promise<any[]> {
    const payments = await this.load<any[]>(`${userId}_${this.STORAGE_KEYS.PAYMENTS}`)
    return payments || []
  }

  static async saveReminders(userId: string, reminders: any[]): Promise<void> {
    return this.save(`${userId}_${this.STORAGE_KEYS.REMINDERS}`, reminders)
  }

  static async loadReminders(userId: string): Promise<any[]> {
    const reminders = await this.load<any[]>(`${userId}_${this.STORAGE_KEYS.REMINDERS}`)
    return reminders || []
  }

  static async saveNotificationSettings(userId: string, settings: any): Promise<void> {
    return this.save(`${userId}_${this.STORAGE_KEYS.NOTIFICATION_SETTINGS}`, settings)
  }

  static async loadNotificationSettings(userId: string): Promise<any | null> {
    return this.load(`${userId}_${this.STORAGE_KEYS.NOTIFICATION_SETTINGS}`)
  }

  // Session management
  static async saveUserSession(session: any): Promise<void> {
    return this.save(this.STORAGE_KEYS.USER_SESSION, session)
  }

  static async loadUserSession(): Promise<any | null> {
    return this.load(this.STORAGE_KEYS.USER_SESSION)
  }

  static async clearUserSession(): Promise<void> {
    return this.remove(this.STORAGE_KEYS.USER_SESSION)
  }
}
