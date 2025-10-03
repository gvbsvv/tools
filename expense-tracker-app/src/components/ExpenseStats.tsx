'use client'

import { DollarSign, TrendingDown, Calendar, PieChart } from 'lucide-react'

interface ExpenseStatsProps {
  totalExpenses: number
  thisMonthTotal: number
  expenseCount: number
}

export function ExpenseStats({ totalExpenses, thisMonthTotal, expenseCount }: ExpenseStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Expenses */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <DollarSign className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* This Month */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthTotal)}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Calendar className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Average Expense */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Expense</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageExpense)}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <TrendingDown className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Total Count */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Entries</p>
            <p className="text-2xl font-bold text-gray-900">{expenseCount}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <PieChart className="text-purple-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  )
}
