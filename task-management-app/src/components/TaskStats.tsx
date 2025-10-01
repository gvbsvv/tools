'use client'

import { CheckCircle, Circle, AlertTriangle, BarChart3 } from 'lucide-react'

interface TaskStatsProps {
  stats: {
    total: number
    completed: number
    pending: number
    high: number
  }
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Tasks */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <BarChart3 className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-sm text-green-600">{completionPercentage}% done</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <Circle className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* High Priority */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">High Priority</p>
            <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  )
}
