'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, GraduationCap, DollarSign, Bell, Settings, Plus } from 'lucide-react'
import { AuthScreen } from '@/components/AuthScreen'
import { SessionManager } from '@/components/SessionManager' 
import { Dashboard } from '@/components/Dashboard'
import { TutorManager } from '@/components/TutorManager'
import { StudentManager } from '@/components/StudentManager'
import { ClassScheduler } from '@/components/ClassScheduler'
import { PaymentTracker } from '@/components/PaymentTracker'
import { NotificationCenter } from '@/components/NotificationCenter'
import { TutorStorage } from '@/utils/storage'
import { Tutor, Student, Class, Payment, Reminder, NotificationSettings } from '@/types'

type ViewType = 'dashboard' | 'tutors' | 'students' | 'classes' | 'payments' | 'notifications' | 'settings'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  // Data states
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    classReminders: true,
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
      TutorStorage.saveStudents(userEmail, students)
    }
  }, [students, isAuthenticated, userEmail])

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      TutorStorage.saveClasses(userEmail, classes)
    }
  }, [classes, isAuthenticated, userEmail])

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
        loadedStudents, 
        loadedClasses,
        loadedPayments,
        loadedReminders,
        loadedSettings
      ] = await Promise.all([
        TutorStorage.loadTutors(userEmail),
        TutorStorage.loadStudents(userEmail),
        TutorStorage.loadClasses(userEmail),
        TutorStorage.loadPayments(userEmail),
        TutorStorage.loadReminders(userEmail),
        TutorStorage.loadNotificationSettings(userEmail)
      ])

      setTutors(loadedTutors)
      setStudents(loadedStudents)
      setClasses(loadedClasses)
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
    setStudents([])
    setClasses([])
    setPayments([])
    setReminders([])
    await TutorStorage.clearUserSession()
  }

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'tutors', label: 'Tutors', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'classes', label: 'Classes', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
          <Dashboard
            tutors={tutors}
            students={students}
            classes={classes}
            payments={payments}
            reminders={reminders}
          />
        )
      case 'tutors':
        return (
          <TutorManager
            tutors={tutors}
            onTutorsChange={setTutors}
          />
        )
      case 'students':
        return (
          <StudentManager
            students={students}
            onStudentsChange={setStudents}
          />
        )
      case 'classes':
        return (
          <ClassScheduler
            tutors={tutors}
            students={students}
            classes={classes}
            onClassesChange={setClasses}
            onPaymentsChange={setPayments}
          />
        )
      case 'payments':
        return (
          <PaymentTracker
            payments={payments}
            classes={classes}
            tutors={tutors}
            students={students}
            onPaymentsChange={setPayments}
          />
        )
      case 'notifications':
        return (
          <NotificationCenter
            reminders={reminders}
            settings={notificationSettings}
            onRemindersChange={setReminders}
            onSettingsChange={setNotificationSettings}
          />
        )
      default:
        return <Dashboard tutors={tutors} students={students} classes={classes} payments={payments} reminders={reminders} />
    }
  }

  return (
    <SessionManager onSessionExpired={handleSessionExpired}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">Tutor Scheduler</h1>
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
                    currentView === item.id ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : 'text-gray-700'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </SessionManager>
  )
}
