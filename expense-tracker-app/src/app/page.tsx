'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { ExpenseForm } from '@/components/ExpenseForm'
import { ExpenseList } from '@/components/ExpenseList'
import { ExpenseChart } from '@/components/ExpenseChart'
import { ExpenseStats } from '@/components/ExpenseStats'
import { AuthScreen } from '@/components/AuthScreen'
import { SessionManager } from '@/components/SessionManager'
import { DataDebugger } from '@/components/DataDebugger'
import { CapacitorStorage } from '@/utils/storage'
import { Preferences } from '@capacitor/preferences'

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  // Check if user is already authenticated
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Load user expenses when authenticated
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      loadUserExpenses()
    }
  }, [isAuthenticated, userEmail])

  // Save expenses whenever they change
  useEffect(() => {
    if (isAuthenticated && userEmail && expenses.length > 0) {
      saveUserExpenses()
    }
  }, [expenses, isAuthenticated, userEmail])

  const checkAuthStatus = async () => {
    try {
      const sessionData = await Preferences.get({ key: 'userSession' })
      
      if (sessionData.value) {
        const session = JSON.parse(sessionData.value)
        const now = new Date().getTime()
        const expiry = new Date(session.sessionExpiry).getTime()
        
        if (now < expiry) {
          setUserEmail(session.email)
          setIsAuthenticated(true)
        } else {
          // Session expired
          await Preferences.remove({ key: 'userSession' })
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserExpenses = async () => {
    try {
      const userExpenses = await CapacitorStorage.loadUserExpenses(userEmail)
      setExpenses(userExpenses)
    } catch (error) {
      console.error('Error loading expenses:', error)
    }
  }

  const saveUserExpenses = async () => {
    try {
      await CapacitorStorage.saveUserExpenses(userEmail, expenses)
    } catch (error) {
      console.error('Error saving expenses:', error)
    }
  }

  const handleAuthenticated = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  const handleSessionExpired = async () => {
    setIsAuthenticated(false)
    setUserEmail('')
    setExpenses([])
    await Preferences.remove({ key: 'userSession' })
  }

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses([newExpense, ...expenses])
    setShowForm(false)
  }

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ))
    setEditingExpense(null)
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  })
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />
  }

  return (
    <SessionManager onSessionExpired={handleSessionExpired}>
      <div className="container mx-auto px-4 py-8">

        {/* Stats Cards */}
        <ExpenseStats 
          totalExpenses={totalExpenses}
          thisMonthTotal={thisMonthTotal}
          expenseCount={expenses.length}
        />

        {/* Action Buttons */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Expense
          </button>
        </div>

        {/* Expense Form */}
        {(showForm || editingExpense) && (
          <div className="mb-8">
            <ExpenseForm
              expense={editingExpense}
              onSubmit={editingExpense ? updateExpense : addExpense}
              onCancel={() => {
                setShowForm(false)
                setEditingExpense(null)
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expense List */}
          <div className="lg:col-span-2">
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={deleteExpense}
            />
          </div>

          {/* Charts */}
          <div className="space-y-6">
            <ExpenseChart expenses={expenses} />
            <DataDebugger />
          </div>
        </div>
      </div>
    </SessionManager>
  )
}
