'use client'

import { useEffect, ReactNode } from 'react'
import { TutorStorage } from '@/utils/storage'

interface SessionManagerProps {
  children: ReactNode
  onSessionExpired: () => void
}

export function SessionManager({ children, onSessionExpired }: SessionManagerProps) {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await TutorStorage.loadUserSession()
        
        if (session && session.sessionExpiry) {
          const now = new Date().getTime()
          const expiry = new Date(session.sessionExpiry).getTime()
          
          if (now >= expiry) {
            // Session expired
            await TutorStorage.clearUserSession()
            onSessionExpired()
          }
        }
      } catch (error) {
        console.error('Session check error:', error)
        onSessionExpired()
      }
    }

    // Check session on mount
    checkSession()

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [onSessionExpired])

  return <>{children}</>
}
