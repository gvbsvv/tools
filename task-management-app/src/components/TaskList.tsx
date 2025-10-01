'use client'

import { Edit2, Trash2, Calendar, AlertTriangle } from 'lucide-react'
import { Task, Category } from '@/app/page'
import { clsx } from 'clsx'

interface TaskListProps {
  tasks: Task[]
  categories: Category[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  selectedCategory: string
}

export function TaskList({ 
  tasks, 
  categories, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  selectedCategory 
}: TaskListProps) {
  
  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500 text-lg">No tasks yet</p>
        <p className="text-gray-400 text-sm mt-2">
          {selectedCategory === 'all' 
            ? 'Add your first task to get started' 
            : `No tasks in this category yet`
          }
        </p>
      </div>
    )
  }

  // Sort tasks: incomplete first, then by priority (high to low), then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Sort by priority (high to low)
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    
    // Sort by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    
    // Finally sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">
          {selectedCategory === 'all' ? 'All Tasks' : `${getCategoryById(selectedCategory)?.name || 'Tasks'}`}
        </h3>
      </div>
      
      <div className="divide-y">
        {sortedTasks.map((task) => {
          const category = getCategoryById(task.category)
          const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && !task.completed
          
          return (
            <div 
              key={task.id} 
              className={clsx(
                'px-6 py-4 hover:bg-gray-50 transition-colors task-item',
                task.completed && 'task-complete'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className={clsx(
                      'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                      task.completed
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    )}
                  >
                    {task.completed && '✓'}
                  </button>
                  
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={clsx(
                        'font-medium',
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      )}>
                        {task.title}
                      </h4>
                      
                      {/* Priority Badge */}
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium border',
                        getPriorityColor(task.priority)
                      )}>
                        {getPriorityIcon(task.priority)} {task.priority}
                      </span>
                      
                      {/* Overdue Badge */}
                      {isTaskOverdue && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    {/* Description */}
                    {task.description && (
                      <p className={clsx(
                        'text-sm mb-2',
                        task.completed ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {task.description}
                      </p>
                    )}
                    
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {/* Category */}
                      {category && selectedCategory === 'all' && (
                        <span className="flex items-center gap-1">
                          {category.icon} {category.name}
                        </span>
                      )}
                      
                      {/* Due Date */}
                      {task.dueDate && (
                        <span className={clsx(
                          'flex items-center gap-1',
                          isTaskOverdue ? 'text-red-600 font-medium' : ''
                        )}>
                          <Calendar size={14} />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                      
                      {/* Completion Date */}
                      {task.completed && task.completedAt && (
                        <span className="flex items-center gap-1 text-green-600">
                          ✓ Completed {formatDate(task.completedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit task"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this task?')) {
                        onDelete(task.id)
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
