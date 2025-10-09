'use client'

import { useState } from 'react'
import { Plus, Search, Edit, Trash2, GraduationCap, Mail, Phone, MapPin, Star, DollarSign } from 'lucide-react'
import { Tutor, ACTIVITY_CATEGORIES } from '@/types'

interface TutorManagerProps {
  tutors: Tutor[]
  onAddTutor: (tutor: Omit<Tutor, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateTutor: (tutor: Tutor) => void
  onDeleteTutor: (id: string) => void
}

const locations = ['Online', 'At my home', 'At tutor\'s place', 'Studio/Center', 'School', 'Other']

export function TutorManager({ tutors, onAddTutor, onUpdateTutor, onDeleteTutor }: TutorManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: [] as string[],
    hourlyRate: '',
    location: '',
    bio: '',
    qualifications: [] as string[],
    rating: 5,
    isActive: true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: [] as string[],
      hourlyRate: '',
      location: '',
      bio: '',
      qualifications: [],
      rating: 5,
      isActive: true
    })
    setEditingTutor(null)
    setShowForm(false)
  }

  const handleEdit = (tutor: Tutor) => {
    setFormData({
      name: tutor.name,
      email: tutor.email || '',
      phone: tutor.phone || '',
      specialization: tutor.specialization,
      hourlyRate: tutor.hourlyRate.toString(),
      location: tutor.location,
      bio: tutor.bio || '',
      qualifications: tutor.qualifications || [],
      rating: tutor.rating || 5,
      isActive: tutor.isActive
    })
    setEditingTutor(tutor)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || formData.specialization.length === 0 || !formData.hourlyRate || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

    const tutorData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      specialization: formData.specialization,
      hourlyRate: parseFloat(formData.hourlyRate),
      location: formData.location,
      bio: formData.bio || undefined,
      qualifications: formData.qualifications.length > 0 ? formData.qualifications : undefined,
      rating: formData.rating,
      totalSessions: editingTutor?.totalSessions || 0,
      isActive: formData.isActive
    }

    if (editingTutor) {
      onUpdateTutor({ ...tutorData, id: editingTutor.id, createdAt: editingTutor.createdAt, updatedAt: new Date().toISOString() })
    } else {
      onAddTutor(tutorData)
    }

    resetForm()
  }

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (tutor.email && tutor.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const addQualification = () => {
    const qual = prompt('Enter qualification:')
    if (qual && qual.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, qual.trim()]
      }))
    }
  }

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }))
  }

  // Get all unique specializations for the dropdown
  const allSpecializations = ACTIVITY_CATEGORIES.flatMap(cat => cat.subcategories)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Tutors</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Tutor</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search tutors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tutor's name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specializations *
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {ACTIVITY_CATEGORIES.map(category => (
                      <div key={category.id} className="mb-2">
                        <div className="font-medium text-gray-600 text-sm mb-1">{category.name}</div>
                        <div className="grid grid-cols-2 gap-1">
                          {category.subcategories.map(activity => (
                            <label key={activity} className="flex items-center space-x-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.specialization.includes(activity)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({ 
                                      ...formData, 
                                      specialization: [...formData.specialization, activity] 
                                    })
                                  } else {
                                    setFormData({ 
                                      ...formData, 
                                      specialization: formData.specialization.filter(s => s !== activity) 
                                    })
                                  }
                                }}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span>{activity}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.specialization.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">Please select at least one specialization</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate *
                  </label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio/Notes
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional notes about the tutor..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications
                </label>
                <div className="space-y-2">
                  {formData.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={qual}
                        onChange={(e) => {
                          const newQuals = [...formData.qualifications]
                          newQuals[index] = e.target.value
                          setFormData({ ...formData, qualifications: newQuals })
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQualification}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={16} className="inline mr-2" />
                    Add Qualification
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Currently active tutor
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTutor ? 'Update' : 'Add'} Tutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredTutors.map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
                  <p className="text-lg text-blue-600 font-medium">{tutor.specialization.join(', ')}</p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    {tutor.email && (
                      <div className="flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{tutor.email}</span>
                      </div>
                    )}
                    {tutor.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone size={14} />
                        <span>{tutor.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{tutor.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="font-semibold">{tutor.hourlyRate}/hr</span>
                    </div>
                    {tutor.rating && (
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span>{tutor.rating}/5</span>
                      </div>
                    )}
                    {tutor.totalSessions && (
                      <div className="text-sm text-gray-500">
                        {tutor.totalSessions} sessions
                      </div>
                    )}
                  </div>
                  
                  {tutor.qualifications && tutor.qualifications.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Qualifications:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tutor.qualifications.map((qual, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {qual}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {tutor.bio && (
                    <p className="text-gray-600 text-sm mt-3">{tutor.bio}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(tutor)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this tutor?')) {
                      onDeleteTutor(tutor.id)
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                tutor.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tutor.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        ))}
        
        {filteredTutors.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <GraduationCap size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No tutors found</p>
            <p>Add tutors for your children's various learning activities.</p>
          </div>
        )}
      </div>
    </div>
  )
}
