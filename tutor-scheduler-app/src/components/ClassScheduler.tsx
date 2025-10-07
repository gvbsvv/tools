'use client'

import { useState, useMemo } from 'react'
import { Plus, Calendar, Clock, User, Search, Edit, Trash2, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { Class, Tutor, Student, RecurrencePattern } from '@/types'

interface ClassSchedulerProps {
  classes: Class[]
  tutors: Tutor[]
  students: Student[]
  onAddClass: (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateClass: (classData: Class) => void
  onDeleteClass: (id: string) => void
  onRescheduleClass: (id: string, newDateTime: string) => void
  onCancelClass: (id: string, reason?: string) => void
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  rescheduled: 'bg-yellow-100 text-yellow-800'
}

const statusIcons = {
  scheduled: Clock,
  completed: CheckCircle,
  cancelled: XCircle,
  rescheduled: RotateCcw
}

export function ClassScheduler({ 
  classes, 
  tutors, 
  students, 
  onAddClass, 
  onUpdateClass, 
  onDeleteClass,
  onRescheduleClass,
  onCancelClass 
}: ClassSchedulerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [viewFilter, setViewFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    tutorId: '',
    studentId: '',
    subject: '',
    type: 'one-time' as 'one-time' | 'recurring',
    scheduledDateTime: '',
    duration: '60',
    rate: '',
    location: '',
    notes: '',
    recurrencePattern: null as RecurrencePattern | null
  })

  const resetForm = () => {
    setFormData({
      tutorId: '',
      studentId: '',
      subject: '',
      type: 'one-time',
      scheduledDateTime: '',
      duration: '60',
      rate: '',
      location: '',
      notes: '',
      recurrencePattern: null
    })
    setEditingClass(null)
    setShowForm(false)
  }

  const handleEdit = (classItem: Class) => {
    setFormData({
      tutorId: classItem.tutorId,
      studentId: classItem.studentId,
      subject: classItem.subject,
      type: classItem.type,
      scheduledDateTime: classItem.scheduledDateTime.slice(0, 16), // Format for datetime-local input
      duration: classItem.duration.toString(),
      rate: classItem.rate.toString(),
      location: classItem.location,
      notes: classItem.notes || '',
      recurrencePattern: classItem.recurrencePattern || null
    })
    setEditingClass(classItem)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.tutorId || !formData.studentId || !formData.subject || !formData.scheduledDateTime) {
      alert('Please fill in all required fields')
      return
    }

    const classData = {
      tutorId: formData.tutorId,
      studentId: formData.studentId,
      subject: formData.subject,
      type: formData.type,
      status: 'scheduled' as const,
      scheduledDateTime: new Date(formData.scheduledDateTime).toISOString(),
      duration: parseInt(formData.duration),
      rate: parseFloat(formData.rate) || 0,
      location: formData.location,
      notes: formData.notes || undefined,
      recurrencePattern: formData.type === 'recurring' ? formData.recurrencePattern : undefined,
      paymentStatus: 'unpaid' as const
    }

    if (editingClass) {
      onUpdateClass({
        ...classData,
        id: editingClass.id,
        createdAt: editingClass.createdAt,
        updatedAt: new Date().toISOString()
      })
    } else {
      onAddClass(classData)
    }

    resetForm()
  }

  const handleReschedule = (classItem: Class) => {
    const newDateTime = prompt('Enter new date and time (YYYY-MM-DD HH:MM):')
    if (newDateTime) {
      const isoDateTime = new Date(newDateTime).toISOString()
      onRescheduleClass(classItem.id, isoDateTime)
    }
  }

  const handleCancel = (classItem: Class) => {
    const reason = prompt('Reason for cancellation (optional):')
    if (window.confirm('Are you sure you want to cancel this class?')) {
      onCancelClass(classItem.id, reason || undefined)
    }
  }

  const filteredClasses = useMemo(() => {
    return classes.filter(classItem => {
      const matchesFilter = viewFilter === 'all' || classItem.status === viewFilter
      const matchesSearch = searchTerm === '' || 
        getTutorName(classItem.tutorId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(classItem.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.subject.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesFilter && matchesSearch
    }).sort((a, b) => new Date(b.scheduledDateTime).getTime() - new Date(a.scheduledDateTime).getTime())
  }, [classes, viewFilter, searchTerm])

  const getTutorName = (tutorId: string) => {
    return tutors.find(t => t.id === tutorId)?.name || 'Unknown Tutor'
  }

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student'
  }

  const upcomingClasses = classes.filter(c => 
    c.status === 'scheduled' && 
    new Date(c.scheduledDateTime) > new Date()
  ).length

  const completedClasses = classes.filter(c => c.status === 'completed').length
  const cancelledClasses = classes.filter(c => c.status === 'cancelled').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Class Scheduler</h2>
          <p className="text-gray-600">Schedule and manage tutoring sessions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Schedule Class
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingClasses}</p>
            </div>
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedClasses}</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{cancelledClasses}</p>
            </div>
            <XCircle className="text-red-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            </div>
            <Clock className="text-gray-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          {['all', 'scheduled', 'completed', 'cancelled'].map(filter => (
            <button
              key={filter}
              onClick={() => setViewFilter(filter as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by tutor, student, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Class Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingClass ? 'Edit Class' : 'Schedule New Class'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tutor *
                </label>
                <select
                  value={formData.tutorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, tutorId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Tutor</option>
                  {tutors.filter(t => t.isActive).map(tutor => (
                    <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student *
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Student</option>
                  {students.filter(s => s.isActive).map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'one-time' | 'recurring' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="one-time">One-time</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledDateTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDateTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Online, At home, Library, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about the class..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingClass ? 'Update Class' : 'Schedule Class'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            Classes ({filteredClasses.length})
          </h3>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No classes found</p>
            {searchTerm && <p className="text-sm">Try adjusting your search or filter</p>}
          </div>
        ) : (
          <div className="divide-y">
            {filteredClasses.map(classItem => {
              const StatusIcon = statusIcons[classItem.status]
              const isUpcoming = new Date(classItem.scheduledDateTime) > new Date()
              
              return (
                <div key={classItem.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{classItem.subject}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[classItem.status]}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                        </span>
                        {classItem.type === 'recurring' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            Recurring
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>Tutor: {getTutorName(classItem.tutorId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>Student: {getStudentName(classItem.studentId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{classItem.duration} minutes</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(classItem.scheduledDateTime).toLocaleString()}</span>
                        </div>
                        {classItem.rate > 0 && (
                          <div>
                            <span className="font-medium">Rate:</span> ${classItem.rate}
                          </div>
                        )}
                      </div>

                      {classItem.location && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Location:</span> {classItem.location}
                        </p>
                      )}

                      {classItem.notes && (
                        <p className="text-sm text-gray-600">{classItem.notes}</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {classItem.status === 'scheduled' && isUpcoming && (
                        <>
                          <button
                            onClick={() => handleReschedule(classItem)}
                            className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                            title="Reschedule class"
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            onClick={() => handleCancel(classItem)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Cancel class"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit class"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this class?')) {
                            onDeleteClass(classItem.id)
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete class"
                      >
                        <Trash2 size={16} />
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
