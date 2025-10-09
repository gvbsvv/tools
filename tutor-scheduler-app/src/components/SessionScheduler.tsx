'use client'

import { useState } from 'react'
import { Calendar, Clock, User, GraduationCap, Plus, Edit2, Trash2, CheckCircle, XCircle, MessageCircle } from 'lucide-react'
import { Session, Tutor, Child, ACTIVITY_CATEGORIES } from '@/types'

interface SessionSchedulerProps {
  sessions: Session[]
  tutors: Tutor[]
  children: Child[]
  onAddSession: (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateSession: (session: Session) => void
  onDeleteSession: (id: string) => void
}

type SessionFormData = {
  childId: string
  tutorId: string
  activity: string
  scheduledDateTime: string
  duration: number
  location: string
  sessionType: 'in-person' | 'online'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  notes: string
  tutorComments: string
  parentComments: string
}

export function SessionScheduler({ sessions, tutors, children, onAddSession, onUpdateSession, onDeleteSession }: SessionSchedulerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [selectedTutor, setSelectedTutor] = useState<string>('')
  const [selectedActivity, setSelectedActivity] = useState<string>('')
  const [viewFilter, setViewFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'>('all')

  const [sessionForm, setSessionForm] = useState<SessionFormData>({
    childId: '',
    tutorId: '',
    activity: '',
    scheduledDateTime: '',
    duration: 60,
    location: '',
    sessionType: 'in-person',
    status: 'scheduled',
    notes: '',
    tutorComments: '',
    parentComments: ''
  })

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sessionForm.childId || !sessionForm.tutorId || !sessionForm.activity || !sessionForm.scheduledDateTime) {
      alert('Please fill in all required fields')
      return
    }

    const selectedTutor = tutors.find(t => t.id === sessionForm.tutorId)
    onAddSession({
      ...sessionForm,
      type: 'one-time',
      hourlyRate: selectedTutor?.hourlyRate || 0,
      rate: selectedTutor?.hourlyRate || 0,
      paymentStatus: 'unpaid'
    })

    setSessionForm({
      childId: '',
      tutorId: '',
      activity: '',
      scheduledDateTime: '',
      duration: 60,
      location: '',
      sessionType: 'in-person',
      status: 'scheduled',
      notes: '',
      tutorComments: '',
      parentComments: ''
    })
    setShowAddForm(false)
  }

  const handleUpdateSession = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingSession) return

    onUpdateSession({
      ...editingSession,
      ...sessionForm
    })

    setEditingSession(null)
    setSessionForm({
      childId: '',
      tutorId: '',
      activity: '',
      scheduledDateTime: '',
      duration: 60,
      location: '',
      sessionType: 'in-person',
      status: 'scheduled',
      notes: '',
      tutorComments: '',
      parentComments: ''
    })
  }

  const startEdit = (session: Session) => {
    setEditingSession(session)
    setSessionForm({
      childId: session.childId,
      tutorId: session.tutorId,
      activity: session.activity,
      scheduledDateTime: session.scheduledDateTime,
      duration: session.duration,
      location: session.location,
      sessionType: session.sessionType,
      status: session.status,
      notes: session.notes || '',
      tutorComments: session.tutorComments || '',
      parentComments: session.parentComments || ''
    })
  }

  const filteredSessions = sessions.filter(session => {
    const childMatch = !selectedChild || session.childId === selectedChild
    const tutorMatch = !selectedTutor || session.tutorId === selectedTutor
    const activityMatch = !selectedActivity || session.activity === selectedActivity
    const statusMatch = viewFilter === 'all' || session.status === viewFilter
    
    return childMatch && tutorMatch && activityMatch && statusMatch
  })

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return <Clock size={16} />
      case 'completed': return <CheckCircle size={16} />
      case 'cancelled': return <XCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const getAllActivities = () => {
    const activities = new Set<string>()
    ACTIVITY_CATEGORIES.forEach(category => {
      category.subcategories.forEach(activity => activities.add(activity))
    })
    return Array.from(activities).sort()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Learning Sessions</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Filter Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Children</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tutor</label>
            <select
              value={selectedTutor}
              onChange={(e) => setSelectedTutor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tutors</option>
              {tutors.map(tutor => (
                <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Activities</option>
              {getAllActivities().map(activity => (
                <option key={activity} value={activity}>{activity}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={viewFilter}
              onChange={(e) => setViewFilter(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sessions</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Sessions Found</h3>
            <p className="text-gray-600 mb-4">
              {sessions.length === 0 
                ? "Start by scheduling your first learning session."
                : "No sessions match your current filters."
              }
            </p>
            {sessions.length === 0 && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Schedule First Session
              </button>
            )}
          </div>
        ) : (
          filteredSessions.map(session => {
            const child = children.find(c => c.id === session.childId)
            const tutor = tutors.find(t => t.id === session.tutorId)
            const sessionDate = new Date(session.scheduledDateTime)
            
            return (
              <div key={session.id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{session.activity}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="capitalize">{session.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>{child?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap size={16} />
                        <span>{tutor?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{sessionDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{sessionDate.toLocaleTimeString()} ({session.duration} mins)</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {session.location} ({session.sessionType})
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Rate:</strong> ${session.hourlyRate}/hour
                      </p>
                    </div>

                    {/* Comments Section */}
                    {(session.notes || session.tutorComments || session.parentComments) && (
                      <div className="mt-4 space-y-2">
                        {session.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <MessageCircle size={14} />
                              <span className="text-xs font-medium text-gray-700">Session Notes</span>
                            </div>
                            <p className="text-sm text-gray-600">{session.notes}</p>
                          </div>
                        )}
                        
                        {session.tutorComments && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <GraduationCap size={14} />
                              <span className="text-xs font-medium text-blue-700">Tutor Comments</span>
                            </div>
                            <p className="text-sm text-blue-600">{session.tutorComments}</p>
                          </div>
                        )}
                        
                        {session.parentComments && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <User size={14} />
                              <span className="text-xs font-medium text-green-700">Parent Comments</span>
                            </div>
                            <p className="text-sm text-green-600">{session.parentComments}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => startEdit(session)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Session"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add/Edit Session Modal */}
      {(showAddForm || editingSession) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={editingSession ? handleUpdateSession : handleAddSession} className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingSession ? 'Edit Session' : 'Schedule New Session'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingSession(null)
                    setSessionForm({
                      childId: '',
                      tutorId: '',
                      activity: '',
                      scheduledDateTime: '',
                      duration: 60,
                      location: '',
                      sessionType: 'in-person',
                      status: 'scheduled',
                      notes: '',
                      tutorComments: '',
                      parentComments: ''
                    })
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Child *</label>
                  <select
                    value={sessionForm.childId}
                    onChange={(e) => setSessionForm({ ...sessionForm, childId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Child</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tutor *</label>
                  <select
                    value={sessionForm.tutorId}
                    onChange={(e) => setSessionForm({ ...sessionForm, tutorId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Tutor</option>
                    {tutors.filter(tutor => tutor.isActive).map(tutor => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.name} - {tutor.specialization.join(', ')} (${tutor.hourlyRate}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity *</label>
                  <select
                    value={sessionForm.activity}
                    onChange={(e) => setSessionForm({ ...sessionForm, activity: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Activity</option>
                    {getAllActivities().map(activity => (
                      <option key={activity} value={activity}>{activity}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={sessionForm.scheduledDateTime}
                    onChange={(e) => setSessionForm({ ...sessionForm, scheduledDateTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="15"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    value={sessionForm.sessionType}
                    onChange={(e) => setSessionForm({ ...sessionForm, sessionType: e.target.value as 'in-person' | 'online' })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={sessionForm.location}
                    onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })}
                    placeholder="Home, Tutor's place, Online (Zoom), etc."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {editingSession && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={sessionForm.status}
                      onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value as Session['status'] })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rescheduled">Rescheduled</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Notes</label>
                <textarea
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                  placeholder="General notes about the session..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutor Comments</label>
                <textarea
                  value={sessionForm.tutorComments}
                  onChange={(e) => setSessionForm({ ...sessionForm, tutorComments: e.target.value })}
                  placeholder="Tutor's feedback and observations..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Comments</label>
                <textarea
                  value={sessionForm.parentComments}
                  onChange={(e) => setSessionForm({ ...sessionForm, parentComments: e.target.value })}
                  placeholder="Your observations and feedback..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingSession(null)
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSession ? 'Update Session' : 'Schedule Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
