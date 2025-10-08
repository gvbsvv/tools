'use client'

import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Baby, Users } from 'lucide-react'
import { Child, ACTIVITY_CATEGORIES } from '@/types'

interface ChildManagerProps {
  children: Child[]
  onAddChild: (child: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateChild: (child: Child) => void
  onDeleteChild: (id: string) => void
}

export function ChildManager({ children, onAddChild, onUpdateChild, onDeleteChild }: ChildManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    interests: [] as string[],
    notes: '',
    isActive: true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      grade: '',
      interests: [],
      notes: '',
      isActive: true
    })
    setEditingChild(null)
    setShowForm(false)
  }

  const handleEdit = (child: Child) => {
    setFormData({
      name: child.name,
      age: child.age?.toString() || '',
      grade: child.grade || '',
      interests: child.interests,
      notes: child.notes || '',
      isActive: child.isActive
    })
    setEditingChild(child)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || formData.interests.length === 0) {
      alert('Please fill in name and select at least one interest')
      return
    }

    const childData = {
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      grade: formData.grade || undefined,
      interests: formData.interests,
      notes: formData.notes || undefined,
      isActive: formData.isActive
    }

    if (editingChild) {
      onUpdateChild({ ...childData, id: editingChild.id, createdAt: editingChild.createdAt, updatedAt: new Date().toISOString() })
    } else {
      onAddChild(childData)
    }

    resetForm()
  }

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Children</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Child</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search children..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingChild ? 'Edit Child' : 'Add New Child'}
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
                    placeholder="Child's name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade/Class
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Grade 5, Class 10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activities/Interests *
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {ACTIVITY_CATEGORIES.map(category => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {category.subcategories.map(activity => (
                          <label key={activity} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(activity)}
                              onChange={() => toggleInterest(activity)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{activity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional notes..."
                />
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
                  Currently taking lessons
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
                  {editingChild ? 'Update' : 'Add'} Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredChildren.map((child) => (
          <div key={child.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                  <Baby className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{child.name}</h3>
                  <div className="text-sm text-gray-500 space-x-4 mt-1">
                    {child.age && <span>Age: {child.age}</span>}
                    {child.grade && <span>Grade: {child.grade}</span>}
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Activities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {child.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {child.notes && (
                    <p className="text-gray-600 text-sm mt-3">{child.notes}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(child)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this child?')) {
                      onDeleteChild(child.id)
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
                child.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {child.isActive ? 'Currently Active' : 'Inactive'}
              </div>
            </div>
          </div>
        ))}
        
        {filteredChildren.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No children found</p>
            <p>Add your children to start managing their learning activities.</p>
          </div>
        )}
      </div>
    </div>
  )
}
