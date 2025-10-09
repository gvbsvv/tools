'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, Baby, GraduationCap, DollarSign, Bell, Settings, Plus } from 'lucide-react'
import { AuthScreen } from '@/components/AuthScreen'
// import { SessionManager } from '@/components/SessionManager' 
// import { Dashboard } from '@/components/Dashboard'
import { TutorManager } from '@/components/TutorManager'
import { ChildManager } from '@/components/ChildManager'
// import { SessionScheduler } from '@/components/SessionScheduler'
// import { PaymentTracker } from '@/components/PaymentTracker'
import { NotificationCenter } from '@/components/NotificationCenter'
import { TutorStorage } from '@/utils/storage'
import { Tutor, Child, Session, Payment, Reminder, NotificationSettings } from '@/types'

type ViewType = 'dashboard' | 'children' | 'tutors' | 'sessions' | 'payments' | 'notifications' | 'settings'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  // Data states
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    sessionReminders: true,
    paymentReminders: true,
    emailNotifications: true,
    smsNotifications: false,
    reminderMinutesBefore: 60,
    paymentReminderDaysBefore: 3
  })

  // Authentication and data loading
  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      loadAllData()
    }
  }, [isAuthenticated, userEmail])

  // Auto-save data when changed
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      TutorStorage.saveTutors(userEmail, tutors)
    }
  }, [tutors, isAuthenticated, userEmail])

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      // TutorStorage.saveChildren?.(userEmail, children) // Will implement later
    }
  }, [children, isAuthenticated, userEmail])

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      // TutorStorage.saveSessions?.(userEmail, sessions) // Will implement later
    }
  }, [sessions, isAuthenticated, userEmail])

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      TutorStorage.savePayments(userEmail, payments)
    }
  }, [payments, isAuthenticated, userEmail])

  const checkAuthStatus = async () => {
    try {
      const session = await TutorStorage.loadUserSession()
      if (session && session.sessionExpiry) {
        const now = new Date().getTime()
        const expiry = new Date(session.sessionExpiry).getTime()
        
        if (now < expiry) {
          setUserEmail(session.email)
          setIsAuthenticated(true)
        } else {
          await TutorStorage.clearUserSession()
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllData = async () => {
    try {
      const [
        loadedTutors,
        loadedChildren, 
        loadedSessions,
        loadedPayments,
        loadedReminders,
        loadedSettings
      ] = await Promise.all([
        TutorStorage.loadTutors(userEmail),
        Promise.resolve([]), // TutorStorage.loadChildren - will implement later
        Promise.resolve([]), // TutorStorage.loadSessions - will implement later
        TutorStorage.loadPayments(userEmail),
        TutorStorage.loadReminders(userEmail),
        TutorStorage.loadNotificationSettings(userEmail)
      ])

      setTutors(loadedTutors)
      setChildren(loadedChildren || [])
      setSessions(loadedSessions || [])
      setPayments(loadedPayments)
      setReminders(loadedReminders)
      if (loadedSettings) setNotificationSettings(loadedSettings)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleAuthenticated = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  const handleSessionExpired = async () => {
    setIsAuthenticated(false)
    setUserEmail('')
    setTutors([])
    setChildren([])
    setSessions([])
    setPayments([])
    setReminders([])
    await TutorStorage.clearUserSession()
  }

  const navigation = [
    { id: 'dashboard', label: 'Overview', icon: Calendar },
    { id: 'children', label: 'My Children', icon: Baby },
    { id: 'tutors', label: 'My Tutors', icon: GraduationCap },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'notifications', label: 'Reminders', icon: Bell },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Activity Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <Baby className="text-pink-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">My Children</p>
                    <p className="text-2xl font-bold">{children.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Active Tutors</p>
                    <p className="text-2xl font-bold">{tutors.filter(t => t.isActive).length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-green-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">This Month's Sessions</p>
                    <p className="text-2xl font-bold">{sessions.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="text-yellow-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Pending Payments</p>
                    <p className="text-2xl font-bold">{payments.filter(p => p.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Start Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setCurrentView('children')}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Baby className="text-pink-600 mb-2" size={24} />
                  <h4 className="font-semibold">Add Your Children</h4>
                  <p className="text-sm text-gray-600">Start by adding your children and their interests</p>
                </button>
                <button 
                  onClick={() => setCurrentView('tutors')}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <GraduationCap className="text-blue-600 mb-2" size={24} />
                  <h4 className="font-semibold">Find & Add Tutors</h4>
                  <p className="text-sm text-gray-600">Add tutors for different activities and subjects</p>
                </button>
              </div>
            </div>
          </div>
        )
      case 'children':
        return (
          <ChildManager
            children={children}
            onAddChild={(newChild) => {
              const child = {
                ...newChild,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
              setChildren([...children, child])
            }}
            onUpdateChild={(updatedChild) => {
              setChildren(children.map(c => c.id === updatedChild.id ? { ...updatedChild, updatedAt: new Date().toISOString() } : c))
            }}
            onDeleteChild={(id) => {
              setChildren(children.filter(c => c.id !== id))
            }}
          />
        )
      case 'tutors':
        return (
          <TutorManager
            tutors={tutors}
            onAddTutor={(newTutor) => {
              const tutor = {
                ...newTutor,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
              setTutors([...tutors, tutor])
            }}
            onUpdateTutor={(updatedTutor) => {
              setTutors(tutors.map(t => t.id === updatedTutor.id ? { ...updatedTutor, updatedAt: new Date().toISOString() } : t))
            }}
            onDeleteTutor={(id) => {
              setTutors(tutors.filter(t => t.id !== id))
            }}
          />
        )
      case 'sessions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Sessions</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Session Scheduler Coming Soon</h3>
              <p className="text-gray-600 mb-4">Schedule and manage learning sessions for your children with their tutors.</p>
              <p className="text-sm text-gray-500">Add your children and tutors first to start scheduling sessions.</p>
            </div>
          </div>
        )
      case 'payments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <DollarSign size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Payment Tracker Coming Soon</h3>
              <p className="text-gray-600 mb-4">Track payments to tutors and manage your learning expenses.</p>
              <p className="text-sm text-gray-500">This feature will help you manage payments for all your children's activities.</p>
            </div>
          </div>
        )
      case 'notifications':
        return (
          <NotificationCenter
            sessions={sessions}
            payments={payments}
            reminders={reminders}
            tutors={tutors}
            children={children}
            notificationSettings={notificationSettings}
            onAddReminder={(newReminder) => {
              const reminder = {
                ...newReminder,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
              setReminders([...reminders, reminder])
            }}
            onUpdateReminder={(updatedReminder) => {
              setReminders(reminders.map(r => r.id === updatedReminder.id ? { ...updatedReminder, updatedAt: new Date().toISOString() } : r))
            }}
            onDeleteReminder={(id) => {
              setReminders(reminders.filter(r => r.id !== id))
            }}
            onUpdateNotificationSettings={(settings) => {
              setNotificationSettings(settings)
            }}
          />
        )
      default:
        return renderCurrentView()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Learning Manager</h1>
          <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
        </div>
        
        <nav className="mt-6">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewType)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  currentView === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleSessionExpired}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  )
}
