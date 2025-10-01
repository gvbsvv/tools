import { Preferences } from '@capacitor/preferences'
import { Task, Category } from '@/app/page'

export class CapacitorStorage {
  private static getStorageKey(email: string, dataType: string): string {
    return `user_${email}_${dataType}`
  }

  // Load user tasks
  static async loadUserTasks(email: string): Promise<Task[]> {
    try {
      const key = this.getStorageKey(email, 'tasks')
      const result = await Preferences.get({ key })
      
      if (result.value) {
        return JSON.parse(result.value)
      }
      
      return []
    } catch (error) {
      console.error('Error loading tasks:', error)
      return []
    }
  }

  // Save user tasks
  static async saveUserTasks(email: string, tasks: Task[]): Promise<void> {
    try {
      const key = this.getStorageKey(email, 'tasks')
      await Preferences.set({
        key,
        value: JSON.stringify(tasks)
      })
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }

  // Load user categories
  static async loadUserCategories(email: string): Promise<Category[]> {
    try {
      const key = this.getStorageKey(email, 'categories')
      const result = await Preferences.get({ key })
      
      if (result.value) {
        return JSON.parse(result.value)
      }
      
      return []
    } catch (error) {
      console.error('Error loading categories:', error)
      return []
    }
  }

  // Save user categories
  static async saveUserCategories(email: string, categories: Category[]): Promise<void> {
    try {
      const key = this.getStorageKey(email, 'categories')
      await Preferences.set({
        key,
        value: JSON.stringify(categories)
      })
    } catch (error) {
      console.error('Error saving categories:', error)
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
        theme: 'light',
        notifications: true,
        defaultCategory: 'personal'
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      return {
        theme: 'light',
        notifications: true,
        defaultCategory: 'personal'
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

  // Clear all user data
  static async clearUserData(email: string): Promise<void> {
    try {
      const tasksKey = this.getStorageKey(email, 'tasks')
      const categoriesKey = this.getStorageKey(email, 'categories')
      const settingsKey = this.getStorageKey(email, 'settings')
      
      await Preferences.remove({ key: tasksKey })
      await Preferences.remove({ key: categoriesKey })
      await Preferences.remove({ key: settingsKey })
      await Preferences.remove({ key: 'userSession' })
    } catch (error) {
      console.error('Error clearing user data:', error)
    }
  }

  // Get all storage keys
  static async getAllKeys(): Promise<{ keys: string[] }> {
    try {
      return await Preferences.keys()
    } catch (error) {
      console.error('Error getting keys:', error)
      return { keys: [] }
    }
  }

  // Export user data
  static async exportUserData(email: string) {
    const tasks = await this.loadUserTasks(email)
    const categories = await this.loadUserCategories(email)
    const settings = await this.loadUserSettings(email)
    
    return {
      email,
      tasks,
      categories,
      settings,
      exportDate: new Date().toISOString()
    }
  }

  // Import user data
  static async importUserData(email: string, data: any): Promise<void> {
    if (data.tasks) {
      await this.saveUserTasks(email, data.tasks)
    }
    
    if (data.categories) {
      await this.saveUserCategories(email, data.categories)
    }
    
    if (data.settings) {
      await this.saveUserSettings(email, data.settings)
    }
  }
}
