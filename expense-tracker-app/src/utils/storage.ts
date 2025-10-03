import { Preferences } from '@capacitor/preferences'
import { Expense } from '@/app/page'

export interface UserData {
  email: string
  expenses: Expense[]
  settings?: {
    currency: string
    theme: string
  }
}

export class CapacitorStorage {
  private static getStorageKey(email: string, dataType: string): string {
    return `user_${email}_${dataType}`
  }

  // Load user expenses
  static async loadUserExpenses(email: string): Promise<Expense[]> {
    try {
      const key = this.getStorageKey(email, 'expenses')
      const result = await Preferences.get({ key })
      
      if (result.value) {
        return JSON.parse(result.value)
      }
      
      return []
    } catch (error) {
      console.error('Error loading expenses:', error)
      return []
    }
  }

  // Save user expenses
  static async saveUserExpenses(email: string, expenses: Expense[]): Promise<void> {
    try {
      const key = this.getStorageKey(email, 'expenses')
      await Preferences.set({
        key,
        value: JSON.stringify(expenses)
      })
    } catch (error) {
      console.error('Error saving expenses:', error)
    }
  }

  // Load user settings
  static async loadUserSettings(email: string): Promise<any> {
    try {
      const key = this.getStorageKey(email, 'settings')
      const result = await Preferences.get({ key })
      
      if (result.value) {
        return JSON.parse(result.value)
      }
      
      return {
        currency: 'USD',
        theme: 'light'
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      return {
        currency: 'USD',
        theme: 'light'
      }
    }
  }

  // Save user settings
  static async saveUserSettings(email: string, settings: any): Promise<void> {
    try {
      const key = this.getStorageKey(email, 'settings')
      await Preferences.set({
        key,
        value: JSON.stringify(settings)
      })
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  // Clear all user data (for logout)
  static async clearUserData(email: string): Promise<void> {
    try {
      const expensesKey = this.getStorageKey(email, 'expenses')
      const settingsKey = this.getStorageKey(email, 'settings')
      
      await Preferences.remove({ key: expensesKey })
      await Preferences.remove({ key: settingsKey })
      await Preferences.remove({ key: 'userSession' })
    } catch (error) {
      console.error('Error clearing user data:', error)
    }
  }

  // Get all storage keys (for debugging)
  static async getAllKeys(): Promise<{ keys: string[] }> {
    try {
      return await Preferences.keys()
    } catch (error) {
      console.error('Error getting keys:', error)
      return { keys: [] }
    }
  }

  // Export user data as JSON
  static async exportUserData(email: string): Promise<UserData> {
    const expenses = await this.loadUserExpenses(email)
    const settings = await this.loadUserSettings(email)
    
    return {
      email,
      expenses,
      settings
    }
  }

  // Import user data from JSON
  static async importUserData(email: string, data: UserData): Promise<void> {
    if (data.expenses) {
      await this.saveUserExpenses(email, data.expenses)
    }
    
    if (data.settings) {
      await this.saveUserSettings(email, data.settings)
    }
  }
}
