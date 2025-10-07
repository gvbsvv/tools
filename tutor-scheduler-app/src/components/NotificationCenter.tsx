'use client'

import { useState, useEffect, useMemo } from 'react'
import { Bell, Calendar, DollarSign, CheckCircle, XCircle, Settings, Filter } from 'lucide-react'
import { Reminder, Class, Payment, Tutor, Student, NotificationSettings } from '@/types'

interface NotificationCenterProps {
  reminders: Reminder[]
  classes: Class[]
  payments: Payment[]
  tutors: Tutor[]
  students: Student[]
  notificationSettings: NotificationSettings
  onUpdateReminder: (reminder: Reminder) => void
  onDeleteReminder: (id: string) => void
  onUpdateNotificationSettings: (settings: NotificationSettings) => void
}

export function NotificationCenter({
  reminders,
  classes,
  payments,
  tutors,
  students,
  notificationSettings,
  onUpdateReminder,
  onDeleteReminder,
  onUpdateNotificationSettings
}: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<'reminders' | 'settings'>('reminders')
  const [filterType, setFilterType] = useState<'all' | 'class' | 'payment'>('all')
  const [showSettings, setShowSettings] = useState(false)
  const [settingsForm, setSettingsForm] = useState(notificationSettings)

  useEffect(() => {
    setSettingsForm(notificationSettings)
  }, [notificationSettings])

  const upcomingReminders = useMemo(() => {
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    return reminders
      .filter(reminder => {
        const reminderTime = new Date(reminder.reminderDateTime)
        const matchesType = filterType === 'all' || reminder.type === filterType
        const isUpcoming = reminderTime >= now && reminderTime <= next24Hours
        const notSent = !reminder.sent
        
        return matchesType && isUpcoming && notSent
      })
      .sort((a, b) => new Date(a.reminderDateTime).getTime() - new Date(b.reminderDateTime).getTime())
  }, [reminders, filterType])

  const overduePayments = useMemo(() => {
    return payments.filter(payment => 
      payment.status === 'pending' && 
      new Date(payment.dueDate) < new Date()
    )
  }, [payments])

  const todaysClasses = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return classes.filter(classItem => {
      const classDate = new Date(classItem.scheduledDateTime)
      return classDate >= today && 
             classDate < tomorrow && 
             classItem.status === 'scheduled'
    })
  }, [classes])

  const getTutorName = (tutorId: string) => {
    return tutors.find(t => t.id === tutorId)?.name || 'Unknown Tutor'
  }

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student'
  }

  const getClassInfo = (classId: string) => {
    const classItem = classes.find(c => c.id === classId)
    if (!classItem) return null
    return {
      subject: classItem.subject,
      tutor: getTutorName(classItem.tutorId),
      student: getStudentName(classItem.studentId),
      dateTime: classItem.scheduledDateTime
    }
  }

  const markReminderAsSent = (reminder: Reminder) => {
    onUpdateReminder({
      ...reminder,
      sent: true,
      sentAt: new Date().toISOString()
    })
  }

  const dismissReminder = (reminderId: string) => {
    onDeleteReminder(reminderId)
  }

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateNotificationSettings(settingsForm)
    setShowSettings(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-gray-600">Manage reminders and notification settings</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Settings size={20} />
          Settings
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Reminders</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingReminders.length}</p>
            </div>
            <Bell className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Classes</p>
              <p className="text-2xl font-bold text-green-600">{todaysClasses.length}</p>
            </div>
            <Calendar className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Payments</p>
              <p className="text-2xl font-bold text-red-600">{overduePayments.length}</p>
            </div>
            <DollarSign className="text-red-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reminders</p>
              <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
            </div>
            <Bell className="text-gray-600" size={24} />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reminder Types */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Reminder Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.classReminders}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, classReminders: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Class reminders</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.paymentReminders}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, paymentReminders: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Payment reminders</span>
                  </label>
                </div>
              </div>

              {/* Delivery Methods */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Delivery Methods</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.emailNotifications}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Email notifications</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.smsNotifications}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">SMS notifications</span>
                  </label>
                </div>
              </div>

              {/* Timing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class reminder (minutes before)
                </label>
                <select
                  value={settingsForm.reminderMinutesBefore}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, reminderMinutesBefore: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={1440}>1 day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment reminder (days before due)
                </label>
                <select
                  value={settingsForm.paymentReminderDaysBefore}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, paymentReminderDaysBefore: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>1 week</option>
                  <option value={14}>2 weeks</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'class', 'payment'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type === 'all' ? 'All Reminders' : `${type.charAt(0).toUpperCase() + type.slice(1)} Reminders`}
          </button>
        ))}
      </div>

      {/* Today's Classes */}
      {todaysClasses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={20} />
              Today's Classes ({todaysClasses.length})
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {todaysClasses.map(classItem => (
              <div key={classItem.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
                  <p className="text-sm text-gray-600">
                    {getTutorName(classItem.tutorId)} & {getStudentName(classItem.studentId)}
                  </p>
                  <p className="text-sm text-green-600">
                    {new Date(classItem.scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overdue Payments */}
      {overduePayments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
              <DollarSign size={20} />
              Overdue Payments ({overduePayments.length})
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {overduePayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    ${payment.amount.toFixed(2)} - {getClassInfo(payment.classId)?.subject}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getTutorName(payment.tutorId)} & {getStudentName(payment.studentId)}
                  </p>
                  <p className="text-sm text-red-600">
                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <XCircle className="text-red-600" size={24} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Reminders */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            Upcoming Reminders ({upcomingReminders.length})
          </h3>
        </div>

        {upcomingReminders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No upcoming reminders</p>
            <p className="text-sm">All caught up! 🎉</p>
          </div>
        ) : (
          <div className="divide-y">
            {upcomingReminders.map(reminder => {
              const classInfo = getClassInfo(reminder.classId)
              const reminderTime = new Date(reminder.reminderDateTime)
              const isClass = reminder.type === 'class'
              
              return (
                <div key={reminder.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-full ${
                          isClass ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {isClass ? (
                            <Calendar size={16} className="text-blue-600" />
                          ) : (
                            <DollarSign size={16} className="text-green-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {isClass ? 'Class Reminder' : 'Payment Reminder'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {reminderTime.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {classInfo && (
                        <div className="ml-11">
                          <p className="text-sm text-gray-900 font-medium">
                            {classInfo.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            {classInfo.tutor} & {classInfo.student}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(classInfo.dateTime).toLocaleString()}
                          </p>
                        </div>
                      )}

                      <p className="mt-2 ml-11 text-sm text-gray-700">
                        {reminder.message}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => markReminderAsSent(reminder)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Mark Sent
                      </button>
                      <button
                        onClick={() => dismissReminder(reminder.id)}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
