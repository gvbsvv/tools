'use client'

import { useState } from 'react'
import { CapacitorStorage } from '@/utils/storage'
import { Preferences } from '@capacitor/preferences'
import { Database, Users, Mail } from 'lucide-react'

export function DataDebugger() {
  const [storageData, setStorageData] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const loadAllStorageData = async () => {
    setLoading(true)
    try {
      const allKeys = await CapacitorStorage.getAllKeys()
      const data: any = {}
      
      for (const key of allKeys.keys) {
        const result = await Preferences.get({ key })
        if (result.value) {
          try {
            data[key] = JSON.parse(result.value)
          } catch {
            data[key] = result.value
          }
        }
      }
      
      setStorageData(data)
    } catch (error) {
      console.error('Error loading storage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearAllData = async () => {
    if (window.confirm('Clear all storage data? This will remove all users and expenses.')) {
      try {
        const allKeys = await CapacitorStorage.getAllKeys()
        for (const key of allKeys.keys) {
          await Preferences.remove({ key })
        }
        setStorageData({})
        alert('All data cleared!')
      } catch (error) {
        console.error('Error clearing data:', error)
      }
    }
  }

  const simulateMultipleUsers = async () => {
    setLoading(true)
    try {
      // Create sample data for different users
      const users = [
        {
          email: 'john@gmail.com',
          expenses: [
            { id: '1', description: 'Coffee', amount: 5.50, category: 'Food & Dining', date: '2025-09-30' },
            { id: '2', description: 'Gas', amount: 45.00, category: 'Transportation', date: '2025-09-29' }
          ]
        },
        {
          email: 'mary@yahoo.com', 
          expenses: [
            { id: '3', description: 'Groceries', amount: 120.00, category: 'Food & Dining', date: '2025-09-30' },
            { id: '4', description: 'Movie', amount: 15.00, category: 'Entertainment', date: '2025-09-28' }
          ]
        },
        {
          email: 'alex@hotmail.com',
          expenses: [
            { id: '5', description: 'Lunch', amount: 25.00, category: 'Food & Dining', date: '2025-09-30' }
          ]
        }
      ]

      for (const user of users) {
        await CapacitorStorage.saveUserExpenses(user.email, user.expenses)
      }

      await loadAllStorageData()
      alert('Sample multi-user data created!')
    } catch (error) {
      console.error('Error creating sample data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUsersFromStorage = () => {
    const users = new Set<string>()
    Object.keys(storageData).forEach(key => {
      if (key.startsWith('user_') && key.endsWith('_expenses')) {
        const email = key.replace('user_', '').replace('_expenses', '')
        users.add(email)
      }
    })
    return Array.from(users)
  }

  const getUserExpenseCount = (email: string) => {
    const key = `user_${email}_expenses`
    return storageData[key]?.length || 0
  }

  const getUserTotalAmount = (email: string) => {
    const key = `user_${email}_expenses`
    const expenses = storageData[key] || []
    return expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Database className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold">Data Storage Debugger</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={simulateMultipleUsers}
            disabled={loading}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            Create Sample Users
          </button>
          <button
            onClick={loadAllStorageData}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Refresh Data
          </button>
          <button
            onClick={clearAllData}
            disabled={loading}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* Users Overview */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users size={20} />
              Registered Users ({getUsersFromStorage().length})
            </h4>
            
            {getUsersFromStorage().length === 0 ? (
              <p className="text-gray-500 text-sm">No users found. Create sample users or login with an email.</p>
            ) : (
              <div className="grid gap-3">
                {getUsersFromStorage().map(email => (
                  <div key={email} className="border rounded p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-600" />
                        <span className="font-medium">{email}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {getUserExpenseCount(email)} expenses • ${getUserTotalAmount(email).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Raw Storage Data */}
          <div>
            <h4 className="font-medium mb-3">Raw Storage Keys</h4>
            <div className="bg-gray-100 p-3 rounded text-sm max-h-60 overflow-y-auto">
              {Object.keys(storageData).length === 0 ? (
                <p className="text-gray-500">No storage data found</p>
              ) : (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(storageData, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
