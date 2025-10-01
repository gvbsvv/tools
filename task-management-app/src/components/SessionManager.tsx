'use client'

import { useEffect, useState } from 'react'
import { Preferences } from '@capacitor/preferences'
import { Clock, LogOut } from 'lucide-react'

interface SessionManagerProps {
  onSessionExpired: () => void
  children: React.ReactNode
}

export function SessionManager({ onSessionExpired, children }: SessionManagerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await Preferences.get({ key: 'userSession' })
        
        if (!sessionData.value) {
          onSessionExpired()
          return
        }

        const session = JSON.parse(sessionData.value)
        const now = new Date().getTime()
        const expiry = new Date(session.sessionExpiry).getTime()
        const remaining = Math.max(0, Math.floor((expiry - now) / 1000))

        if (remaining === 0) {
          await Preferences.remove({ key: 'userSession' })
          onSessionExpired()
          return
        }

        setTimeLeft(remaining)
        setShowWarning(remaining <= 120) // Show warning in last 2 minutes
      } catch (error) {
        console.error('Session check error:', error)
        onSessionExpired()
      }
    }

    checkSession()
    const interval = setInterval(checkSession, 30000)
    
    return () => clearInterval(interval)
  }, [onSessionExpired])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleLogout = async () => {
    await Preferences.remove({ key: 'userSession' })
    onSessionExpired()
  }

  const extendSession = async () => {
    alert('To extend your session, you would receive a new OTP via email.')
    const newExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const sessionData = await Preferences.get({ key: 'userSession' })
    
    if (sessionData.value) {
      const session = JSON.parse(sessionData.value)
      session.sessionExpiry = newExpiry
      
      await Preferences.set({
        key: 'userSession',
        value: JSON.stringify(session)
      })
      
      setTimeLeft(15 * 60)
      setShowWarning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Warning Bar */}
      {showWarning && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <Clock className="text-amber-600 mr-2" size={20} />
              <span className="text-amber-800 font-medium">
                Session expires in {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={extendSession}
                className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700 transition-colors"
              >
                Extend Session
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Timer in Header */}
      <div className="bg-white shadow-sm border-b px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-1" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <div>{children}</div>
    </div>
  )
}
