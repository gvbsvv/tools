import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'

export class PlatformUtils {
  
  // Check if running on native mobile platform
  static isNative(): boolean {
    return Capacitor.isNativePlatform()
  }

  // Check if running on web
  static isWeb(): boolean {
    return Capacitor.getPlatform() === 'web'
  }

  // Check if running on Android
  static isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android'
  }

  // Check if running on iOS
  static isIOS(): boolean {
    return Capacitor.getPlatform() === 'ios'
  }

  // Get platform name
  static getPlatform(): string {
    return Capacitor.getPlatform()
  }

  // Get device info
  static async getDeviceInfo() {
    try {
      const info = await Device.getInfo()
      return {
        platform: info.platform,
        operatingSystem: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        model: info.model,
        isVirtual: info.isVirtual,
        webViewVersion: info.webViewVersion
      }
    } catch (error) {
      console.error('Error getting device info:', error)
      return null
    }
  }

  // Check if device has network connectivity
  static async hasNetworkConnection(): Promise<boolean> {
    try {
      // Simple network check
      if (this.isWeb()) {
        return navigator.onLine
      }
      
      // For native platforms, you might want to use Network plugin
      // For now, we'll assume connection is available
      return true
    } catch (error) {
      console.error('Error checking network:', error)
      return false
    }
  }

  // Get storage information for debugging
  static async getStorageInfo() {
    if (this.isWeb()) {
      try {
        const estimate = await navigator.storage?.estimate?.()
        return {
          quota: estimate?.quota,
          usage: estimate?.usage,
          available: estimate?.quota ? estimate.quota - (estimate.usage || 0) : null
        }
      } catch (error) {
        return null
      }
    }
    
    // Native platforms don't have storage quota limits like web
    return {
      quota: null,
      usage: null,
      available: 'unlimited'
    }
  }
}
