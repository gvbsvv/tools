'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Expense } from '@/app/page'

interface ExpenseChartProps {
  expenses: Expense[]
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Group expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category
    if (acc[category]) {
      acc[category] += expense.amount
    } else {
      acc[category] = expense.amount
    }
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  // Group expenses by month for the last 6 months
  const monthData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    
    if (acc[monthKey]) {
      acc[monthKey] += expense.amount
    } else {
      acc[monthKey] = expense.amount
    }
    return acc
  }, {} as Record<string, number>)

  const barData = Object.entries(monthData)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-6)
    .map(([month, amount]) => ({
      month,
      amount,
    }))

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
    '#FFC658',
    '#FF7C7C',
    '#8DD1E1',
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  if (expenses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Expense Analytics</h3>
          <p className="text-gray-500 text-center py-8">No data to display</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Expenses by Category */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Expenses */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="amount" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(categoryData)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => {
              const percentage = (amount / Object.values(categoryData).reduce((sum, val) => sum + val, 0)) * 100
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                    <span className="font-semibold">{formatCurrency(amount)}</span>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
