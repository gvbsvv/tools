'use client'

import { Category } from '@/app/page'
import { clsx } from 'clsx'

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  tasksCount: (categoryId: string) => { total: number; completed: number; pending: number; high: number }
}

export function CategorySelector({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  tasksCount 
}: CategorySelectorProps) {
  const allStats = tasksCount('all')

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* All Categories */}
        <button
          onClick={() => onSelectCategory('all')}
          className={clsx(
            'p-4 rounded-lg border-2 transition-all duration-200',
            selectedCategory === 'all'
              ? 'border-gray-600 bg-gray-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
          )}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-medium text-gray-900">All Tasks</h4>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total: {allStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Done: {allStats.completed}</span>
                <span>Left: {allStats.pending}</span>
              </div>
            </div>
          </div>
        </button>

        {/* Individual Categories */}
        {categories.map((category) => {
          const stats = tasksCount(category.id)
          
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={clsx(
                'p-4 rounded-lg border-2 transition-all duration-200',
                selectedCategory === category.id
                  ? 'border-green-600 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              )}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{category.description}</p>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total: {stats.total}</span>
                  </div>
                  {stats.total > 0 && (
                    <div className="flex justify-between">
                      <span>Done: {stats.completed}</span>
                      <span>Left: {stats.pending}</span>
                    </div>
                  )}
                  {stats.high > 0 && (
                    <div className="text-red-600 font-medium">
                      High: {stats.high}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
