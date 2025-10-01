'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { AuthScreen } from '@/components/AuthScreen'
import { SessionManager } from '@/components/SessionManager'
import { CategorySelector } from '@/components/CategorySelector'
import { TaskList } from '@/components/TaskList'
import { TaskForm } from '@/components/TaskForm'
import { TaskStats } from '@/components/TaskStats'
import { CapacitorStorage } from '@/utils/storage'
import { Preferences } from '@capacitor/preferences'

export interface Task {
  id: string
  title: string
  description?: string
  category: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  completedAt?: string
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  description: string
}

const defaultCategories: Category[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    color: 'bg-green-500',
    icon: '🛒',
    description: 'Shopping lists and grocery items'
  },
  {
    id: 'studies',
    name: 'Kids Studies',
    color: 'bg-blue-500',
    icon: '📚',
    description: 'Educational tasks and study materials'
  },
  {
    id: 'utilities',
    name: 'Utility Payments',
    color: 'bg-yellow-500',
    icon: '💡',
    description: 'Bills and utility payments'
  },
  {
    id: 'maintenance',
    name: 'Home Maintenance',
    color: 'bg-purple-500',
    icon: '🏠',
    description: 'Home repair and maintenance tasks'
  },
  {
    id: 'work',
    name: 'Work Tasks',
    color: 'bg-red-500',
    icon: '💼',
    description: 'Professional and work-related tasks'
  },
  {
    id: 'personal',
    name: 'Personal Goals',
    color: 'bg-pink-500',
    icon: '🎯',
    description: 'Personal development and goals'
  },
  {
    id: 'appointments',
    name: 'Appointments',
    color: 'bg-cyan-500',
    icon: '📅',
    description: 'Meetings and scheduled appointments'
  }
]

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  // Check authentication status
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      loadUserData()
    }
  }, [isAuthenticated, userEmail])

  // Save tasks whenever they change
  useEffect(() => {
    if (isAuthenticated && userEmail && tasks.length >= 0) {
      saveUserTasks()
    }
  }, [tasks, isAuthenticated, userEmail])

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
          await Preferences.remove({ key: 'userSession' })
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    try {
      const userTasks = await CapacitorStorage.loadUserTasks(userEmail)
      const userCategories = await CapacitorStorage.loadUserCategories(userEmail)
      
      setTasks(userTasks)
      if (userCategories.length > 0) {
        setCategories(userCategories)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const saveUserTasks = async () => {
    try {
      await CapacitorStorage.saveUserTasks(userEmail, tasks)
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }

  const handleAuthenticated = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  const handleSessionExpired = async () => {
    setIsAuthenticated(false)
    setUserEmail('')
    setTasks([])
    await Preferences.remove({ key: 'userSession' })
  }

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
    setShowForm(false)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined
        }
      }
      return task
    }))
  }

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory)

  const getStatsForCategory = (categoryId: string) => {
    const categoryTasks = categoryId === 'all' ? tasks : tasks.filter(t => t.category === categoryId)
    return {
      total: categoryTasks.length,
      completed: categoryTasks.filter(t => t.completed).length,
      pending: categoryTasks.filter(t => !t.completed).length,
      high: categoryTasks.filter(t => t.priority === 'high' && !t.completed).length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">Stay organized across all your categories</p>
        </div>

        {/* Stats Overview */}
        <TaskStats stats={getStatsForCategory(selectedCategory)} />

        {/* Category Filter */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          tasksCount={(categoryId) => getStatsForCategory(categoryId)}
        />

        {/* Action Buttons */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        {/* Task Form */}
        {(showForm || editingTask) && (
          <div className="mb-8">
            <TaskForm
              task={editingTask}
              categories={categories}
              onSubmit={editingTask ? updateTask : addTask}
              onCancel={() => {
                setShowForm(false)
                setEditingTask(null)
              }}
            />
          </div>
        )}

        {/* Tasks List */}
        <TaskList
          tasks={filteredTasks}
          categories={categories}
          onEdit={setEditingTask}
          onDelete={deleteTask}
          onToggleComplete={toggleTaskComplete}
          selectedCategory={selectedCategory}
        />
      </div>
    </SessionManager>
  )
}
