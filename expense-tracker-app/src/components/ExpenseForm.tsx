'use client'

import { useState } from 'react'
import { Expense } from '@/app/page'

interface ExpenseFormProps {
  expense?: Expense | null
  onSubmit: (expense: any) => void
  onCancel: () => void
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other'
]

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount?.toString() || '',
    category: expense?.category || categories[0],
    date: expense?.date || new Date().toISOString().split('T')[0],
    claimable: expense?.claimable || false,
    claimNotes: expense?.claimNotes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      alert('Please fill in all fields')
      return
    }

    const expenseData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      claimable: formData.claimable,
      claimStatus: formData.claimable ? 'claimable' as const : undefined,
      claimNotes: formData.claimNotes,
    }

    if (expense) {
      onSubmit({ 
        ...expenseData, 
        id: expense.id,
        // Preserve existing claim dates if editing
        claimSubmittedDate: expense.claimSubmittedDate,
        claimApprovedDate: expense.claimApprovedDate,
        claimPaidDate: expense.claimPaidDate,
        claimRejectedReason: expense.claimRejectedReason,
      })
    } else {
      onSubmit(expenseData)
    }

    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: categories[0],
      date: new Date().toISOString().split('T')[0],
      claimable: false,
      claimNotes: '',
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        {expense ? 'Edit Expense' : 'Add New Expense'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter expense description"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Claim Section */}
        <div className="border-t pt-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="claimable"
              checked={formData.claimable}
              onChange={(e) => setFormData({ ...formData, claimable: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="claimable" className="ml-2 text-sm font-medium text-gray-700">
              This expense can be claimed for reimbursement
            </label>
          </div>

          {formData.claimable && (
            <div>
              <label htmlFor="claimNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Claim Notes (optional)
              </label>
              <textarea
                id="claimNotes"
                value={formData.claimNotes}
                onChange={(e) => setFormData({ ...formData, claimNotes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes for the claim (e.g., client meeting, business travel)"
                rows={2}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {expense ? 'Update Expense' : 'Add Expense'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
