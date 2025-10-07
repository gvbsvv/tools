'use client'

import { useState } from 'react'
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Users } from 'lucide-react'
import { Student } from '@/types'

interface StudentManagerProps {
  students: Student[]
  onAddStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateStudent: (student: Student) => void
  onDeleteStudent: (id: string) => void
}

const subjects = [
  'Mathematics', 'English', 'Science', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'Languages', 'Art', 'Music', 'Economics', 'Psychology', 'Philosophy'
]

const grades = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
  'College Freshman', 'College Sophomore', 'College Junior', 'College Senior', 'Graduate'
]

export function StudentManager({ students, onAddStudent, onUpdateStudent, onDeleteStudent }: StudentManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    grade: '',
    subjects: [] as string[],
    notes: '',
    isActive: true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      grade: '',
      subjects: [],
      notes: '',
      isActive: true
    })
    setEditingStudent(null)
    setShowForm(false)
  }

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email || '',
      phone: student.phone || '',
      parentName: student.parentName || '',
      parentEmail: student.parentEmail || '',
      parentPhone: student.parentPhone,
      grade: student.grade || '',
      subjects: student.subjects,
      notes: student.notes || '',
      isActive: student.isActive
    })
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.parentPhone || formData.subjects.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    const studentData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      parentName: formData.parentName || undefined,
      parentEmail: formData.parentEmail || undefined,
      parentPhone: formData.parentPhone,
      grade: formData.grade || undefined,
      subjects: formData.subjects,
      notes: formData.notes || undefined,
      isActive: formData.isActive
    }

    if (editingStudent) {
      onUpdateStudent({
        ...studentData,
        id: editingStudent.id,
        createdAt: editingStudent.createdAt,
        updatedAt: new Date().toISOString()
      })
    } else {
      onAddStudent(studentData)
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

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.parentName && student.parentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    student.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          <p className="text-gray-600">Manage your students and their information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search students by name, parent, or subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Student Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Student Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
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
                    Grade Level
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Parent/Guardian Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects of Interest *
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

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about the student, learning preferences, etc..."
              />
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
                Active Student
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingStudent ? 'Update Student' : 'Add Student'}
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

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Students ({filteredStudents.length})</h3>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No students found</p>
            {searchTerm && <p className="text-sm">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="divide-y">
            {filteredStudents.map(student => (
              <div key={student.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{student.name}</h4>
                      {student.grade && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {student.grade}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <p className="font-medium text-gray-900">Student Contact:</p>
                        {student.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{student.email}</span>
                          </div>
                        )}
                        {student.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">Parent Contact:</p>
                        {student.parentName && (
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{student.parentName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          <span>{student.parentPhone}</span>
                        </div>
                        {student.parentEmail && (
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{student.parentEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {student.subjects.map(subject => (
                        <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {subject}
                        </span>
                      ))}
                    </div>

                    {student.notes && (
                      <p className="text-sm text-gray-600">{student.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit student"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this student?')) {
                          onDeleteStudent(student.id)
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete student"
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
