'use client'

import { useState } from 'react'
import { Plus, Search, Edit, Trash2, User, Mail, Phone, GraduationCap, DollarSign } from 'lucide-react'
import { Tutor, TimeSlot } from '@/types'

interface TutorManagerProps {
  tutors: Tutor[]
  onAddTutor: (tutor: Omit<Tutor, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateTutor: (tutor: Tutor) => void
  onDeleteTutor: (id: string) => void
}

const subjects = [
  'Mathematics', 'English', 'Science', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'Languages', 'Art', 'Music', 'Economics', 'Psychology', 'Philosophy'
]

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function TutorManager({ tutors, onAddTutor, onUpdateTutor, onDeleteTutor }: TutorManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [] as string[],
    hourlyRate: '',
    bio: '',
    qualifications: [] as string[],
    availability: [] as TimeSlot[],
    isActive: true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subjects: [],
      hourlyRate: '',
      bio: '',
      qualifications: [],
      availability: [] as TimeSlot[],
      isActive: true
    })
    setEditingTutor(null)
    setShowForm(false)
  }

  const handleEdit = (tutor: Tutor) => {
    setFormData({
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      subjects: tutor.subjects,
      hourlyRate: tutor.hourlyRate.toString(),
      bio: tutor.bio || '',
      qualifications: tutor.qualifications || [],
      availability: tutor.availability,
      isActive: tutor.isActive
    })
    setEditingTutor(tutor)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone || formData.subjects.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    const tutorData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subjects: formData.subjects,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      bio: formData.bio,
      qualifications: formData.qualifications,
      availability: formData.availability,
      isActive: formData.isActive
    }

    if (editingTutor) {
      onUpdateTutor({
        ...tutorData,
        id: editingTutor.id,
        createdAt: editingTutor.createdAt,
        updatedAt: new Date().toISOString()
      })
    } else {
      onAddTutor(tutorData)
    }

    resetForm()
  }

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const addQualification = () => {
    const qualification = prompt('Enter qualification:')
    if (qualification) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, qualification]
      }))
    }
  }

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }))
  }

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tutor Management</h2>
          <p className="text-gray-600">Manage your tutors and their information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Tutor
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search tutors by name, email, or subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tutor Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingTutor ? 'Edit Tutor' : 'Add New Tutor'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {subjects.map(subject => (
                  <label key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description about the tutor..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Qualifications
                </label>
                <button
                  type="button"
                  onClick={addQualification}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Qualification
                </button>
              </div>
              <div className="space-y-2">
                {formData.qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-gray-50 rounded">{qual}</span>
                    <button
                      type="button"
                      onClick={() => removeQualification(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active Tutor
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingTutor ? 'Update Tutor' : 'Add Tutor'}
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

      {/* Tutors List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Tutors ({filteredTutors.length})</h3>
        </div>

        {filteredTutors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <User size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No tutors found</p>
            {searchTerm && <p className="text-sm">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="divide-y">
            {filteredTutors.map(tutor => (
              <div key={tutor.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{tutor.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tutor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tutor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{tutor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{tutor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        <span>${tutor.hourlyRate}/hour</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {tutor.subjects.map(subject => (
                        <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {subject}
                        </span>
                      ))}
                    </div>

                    {tutor.bio && (
                      <p className="text-sm text-gray-600 mb-2">{tutor.bio}</p>
                    )}

                    {tutor.qualifications && tutor.qualifications.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GraduationCap size={16} />
                        <span>{tutor.qualifications.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(tutor)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit tutor"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this tutor?')) {
                          onDeleteTutor(tutor.id)
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete tutor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
