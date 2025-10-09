'use client'

import { useState, useEffect, useMemo } from 'react'
import { Bell, Calendar, DollarSign, CheckCircle, XCircle, Settings, Plus, Clock, AlertTriangle } from 'lucide-react'
import { Reminder, Session, Payment, Tutor, Child, NotificationSettings } from '@/types'

interface NotificationCenterProps {
  reminders: Reminder[]
  sessions: Session[]
  payments: Payment[]
  tutors: Tutor[]
  children: Child[]
  notificationSettings: NotificationSettings
  onUpdateReminder: (reminder: Reminder) => void
  onDeleteReminder: (id: string) => void
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void
  onUpdateNotificationSettings: (settings: NotificationSettings) => void
}

export function NotificationCenter({
  reminders,
  sessions,
  payments,
  tutors,
  children,
  notificationSettings,
  onUpdateReminder,
  onDeleteReminder,
  onAddReminder,
  onUpdateNotificationSettings
}: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'overdue' | 'settings'>('upcoming')
  const [showReminderForm, setShowReminderForm] = useState(false)
  
  const [reminderForm, setReminderForm] = useState({
    type: 'session' as 'session' | 'payment',
    sessionId: '',
    message: '',
    reminderDateTime: '',
    recipientEmail: '',
    recipientPhone: ''
  })

  // Generate automatic reminders based on sessions and payments
  const generateAutomaticReminders = () => {
    const autoReminders: Omit<Reminder, 'id' | 'createdAt'>[] = []

    // Session reminders
    if (notificationSettings.sessionReminders) {
      sessions
        .filter(session => session.status === 'scheduled')
        .forEach(session => {
          const sessionDate = new Date(session.scheduledDateTime)
          const reminderDate = new Date(sessionDate.getTime() - (notificationSettings.reminderMinutesBefore * 60 * 1000))
          
          if (reminderDate > new Date()) { // Only future reminders
            const tutor = tutors.find(t => t.id === session.tutorId)
            const child = children.find(c => c.id === session.childId)
            
            autoReminders.push({
              type: 'session',
              sessionId: session.id,
              message: `Upcoming ${session.activity} session for ${child?.name} with ${tutor?.name}`,
              reminderDateTime: reminderDate.toISOString(),
              sent: false,
              recipientEmail: notificationSettings.emailNotifications ? 'parent@email.com' : undefined,
              recipientPhone: notificationSettings.smsNotifications ? '+1234567890' : undefined,
              updatedAt: new Date().toISOString()
            })
          }
        })
    }

    // Payment reminders
    if (notificationSettings.paymentReminders) {
      payments
        .filter(payment => payment.status === 'pending')
        .forEach(payment => {
          const dueDate = new Date(payment.dueDate)
          const reminderDate = new Date(dueDate.getTime() - (notificationSettings.paymentReminderDaysBefore * 24 * 60 * 60 * 1000))
          
          if (reminderDate > new Date()) {
            const session = sessions.find(s => s.id === payment.sessionId)
            const tutor = tutors.find(t => t.id === payment.tutorId)
            const child = children.find(c => c.id === payment.childId)
            
            autoReminders.push({
              type: 'payment',
              sessionId: payment.sessionId,
              message: `Payment due for ${session?.activity} session - ${child?.name} with ${tutor?.name} ($${payment.amount})`,
              reminderDateTime: reminderDate.toISOString(),
              sent: false,
              recipientEmail: notificationSettings.emailNotifications ? 'parent@email.com' : undefined,
              recipientPhone: notificationSettings.smsNotifications ? '+1234567890' : undefined,
              updatedAt: new Date().toISOString()
            })
          }
        })
    }

    return autoReminders
  }

  // Categorize reminders
  const categorizedReminders = useMemo(() => {
    const now = new Date()
    
    const upcoming = reminders.filter(r => 
      new Date(r.reminderDateTime) > now && !r.sent
    )
    
    const overdue = reminders.filter(r => 
      new Date(r.reminderDateTime) <= now && !r.sent
    )
    
    const sent = reminders.filter(r => r.sent)

    return { upcoming, overdue, sent }
  }, [reminders])

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reminderForm.sessionId || !reminderForm.message || !reminderForm.reminderDateTime) {
      alert('Please fill in all required fields')
      return
    }

    onAddReminder({
      type: reminderForm.type,
      sessionId: reminderForm.sessionId,
      message: reminderForm.message,
      reminderDateTime: reminderForm.reminderDateTime,
      sent: false,
      recipientEmail: reminderForm.recipientEmail || undefined,
      recipientPhone: reminderForm.recipientPhone || undefined,
      updatedAt: new Date().toISOString()
    })

    setReminderForm({
      type: 'session',
      sessionId: '',
      message: '',
      reminderDateTime: '',
      recipientEmail: '',
      recipientPhone: ''
    })
    setShowReminderForm(false)
  }

  const markAsSent = (reminder: Reminder) => {
    onUpdateReminder({
      ...reminder,
      sent: true,
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
    const session = sessions.find(s => s.id === reminder.sessionId)
    const tutor = tutors.find(t => t.id === session?.tutorId)
    const child = children.find(c => c.id === session?.childId)
    const isOverdue = new Date(reminder.reminderDateTime) <= new Date() && !reminder.sent

    return (
      <div className={`bg-white rounded-lg p-4 border-l-4 ${
        isOverdue ? 'border-red-500 bg-red-50' : 
        reminder.type === 'session' ? 'border-blue-500' : 'border-yellow-500'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              reminder.type === 'session' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {reminder.type === 'session' ? <Calendar size={20} /> : <DollarSign size={20} />}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{reminder.message}</h4>
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <div>Remind at: {new Date(reminder.reminderDateTime).toLocaleString()}</div>
                {session && (
                  <div>{session.activity} • {child?.name} • {tutor?.name}</div>
                )}
                {reminder.recipientEmail && (
                  <div>📧 {reminder.recipientEmail}</div>
                )}
                {reminder.recipientPhone && (
                  <div>📱 {reminder.recipientPhone}</div>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {!reminder.sent && (
              <button
                onClick={() => markAsSent(reminder)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Mark as sent"
              >
                <CheckCircle size={18} />
              </button>
            )}
            <button
              onClick={() => onDeleteReminder(reminder.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete reminder"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>
        {reminder.sent && (
          <div className="mt-2 text-xs text-green-600 flex items-center space-x-1">
            <CheckCircle size={14} />
            <span>Sent on {new Date(reminder.sentAt!).toLocaleString()}</span>
          </div>
        )}
        {isOverdue && (
          <div className="mt-2 text-xs text-red-600 flex items-center space-x-1">
            <AlertTriangle size={14} />
            <span>Overdue - should have been sent</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reminders & Notifications</h2>
        <button
          onClick={() => setShowReminderForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-blue-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-900">{categorizedReminders.upcoming.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-red-600" size={20} />
            <div>
              <p className="text-sm text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{categorizedReminders.overdue.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-green-600">Sent</p>
              <p className="text-2xl font-bold text-green-900">{categorizedReminders.sent.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'upcoming', label: 'Upcoming', count: categorizedReminders.upcoming.length },
            { id: 'overdue', label: 'Overdue', count: categorizedReminders.overdue.length },
            { id: 'settings', label: 'Settings', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {categorizedReminders.upcoming.length > 0 ? (
            categorizedReminders.upcoming.map(reminder => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No upcoming reminders</p>
              <p className="text-sm">Reminders will appear here before sessions and payment due dates</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'overdue' && (
        <div className="space-y-4">
          {categorizedReminders.overdue.length > 0 ? (
            categorizedReminders.overdue.map(reminder => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-300" />
              <p>No overdue reminders</p>
              <p className="text-sm">Great! You're all caught up</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.sessionReminders}
                  onChange={(e) => onUpdateNotificationSettings({
                    ...notificationSettings,
                    sessionReminders: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium">Session Reminders</div>
                  <div className="text-sm text-gray-500">Get notified before upcoming sessions</div>
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.paymentReminders}
                  onChange={(e) => onUpdateNotificationSettings({
                    ...notificationSettings,
                    paymentReminders: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium">Payment Reminders</div>
                  <div className="text-sm text-gray-500">Get notified about upcoming payment due dates</div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Reminder Time
                </label>
                <select
                  value={notificationSettings.reminderMinutesBefore}
                  onChange={(e) => onUpdateNotificationSettings({
                    ...notificationSettings,
                    reminderMinutesBefore: parseInt(e.target.value)
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={120}>2 hours before</option>
                  <option value={1440}>1 day before</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Reminder Time
                </label>
                <select
                  value={notificationSettings.paymentReminderDaysBefore}
                  onChange={(e) => onUpdateNotificationSettings({
                    ...notificationSettings,
                    paymentReminderDaysBefore: parseInt(e.target.value)
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Notification Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => onUpdateNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Email Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => onUpdateNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>SMS Notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Form */}
      {showReminderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create Reminder</h3>
            
            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={reminderForm.type}
                  onChange={(e) => setReminderForm({ ...reminderForm, type: e.target.value as 'session' | 'payment' })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="session">Session Reminder</option>
                  <option value="payment">Payment Reminder</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session
                </label>
                <select
                  value={reminderForm.sessionId}
                  onChange={(e) => setReminderForm({ ...reminderForm, sessionId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select session</option>
                  {sessions.map(session => {
                    const tutor = tutors.find(t => t.id === session.tutorId)
                    const child = children.find(c => c.id === session.childId)
                    return (
                      <option key={session.id} value={session.id}>
                        {session.activity} - {child?.name} with {tutor?.name}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={reminderForm.message}
                  onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Reminder message..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remind At
                </label>
                <input
                  type="datetime-local"
                  value={reminderForm.reminderDateTime}
                  onChange={(e) => setReminderForm({ ...reminderForm, reminderDateTime: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReminderForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
