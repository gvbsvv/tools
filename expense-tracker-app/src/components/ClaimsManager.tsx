'use client'

import { Expense } from '@/app/page'
import { Clock, CheckCircle, XCircle, DollarSign, FileText, Calendar } from 'lucide-react'

interface ClaimsManagerProps {
  expenses: Expense[]
  onUpdateClaimStatus: (expenseId: string, status: Expense['claimStatus'], additionalData?: any) => void
}

const claimStatusConfig = {
  claimable: { 
    label: 'Ready to Submit', 
    color: 'bg-gray-100 text-gray-800', 
    icon: FileText 
  },
  submitted: { 
    label: 'Submitted', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Clock 
  },
  under_review: { 
    label: 'Under Review', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock 
  },
  approved: { 
    label: 'Approved', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle 
  },
  paid: { 
    label: 'Paid', 
    color: 'bg-emerald-100 text-emerald-800', 
    icon: DollarSign 
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-800', 
    icon: XCircle 
  }
}

export function ClaimsManager({ expenses, onUpdateClaimStatus }: ClaimsManagerProps) {
  const claimableExpenses = expenses.filter(expense => expense.claimable)
  
  const getStatusStats = () => {
    const stats = {
      claimable: 0,
      submitted: 0,
      under_review: 0,
      approved: 0,
      paid: 0,
      rejected: 0,
      totalAmount: 0,
      paidAmount: 0
    }

    claimableExpenses.forEach(expense => {
      const status = expense.claimStatus || 'claimable'
      stats[status]++
      stats.totalAmount += expense.amount
      if (status === 'paid') {
        stats.paidAmount += expense.amount
      }
    })

    return stats
  }

  const stats = getStatusStats()

  const handleStatusUpdate = (expense: Expense, newStatus: Expense['claimStatus']) => {
    const additionalData: any = {}
    
    if (newStatus === 'submitted') {
      additionalData.claimSubmittedDate = new Date().toISOString().split('T')[0]
    } else if (newStatus === 'approved') {
      additionalData.claimApprovedDate = new Date().toISOString().split('T')[0]
    } else if (newStatus === 'paid') {
      additionalData.claimPaidDate = new Date().toISOString().split('T')[0]
    } else if (newStatus === 'rejected') {
      const reason = prompt('Reason for rejection (optional):')
      additionalData.claimRejectedReason = reason || ''
    }

    onUpdateClaimStatus(expense.id, newStatus, additionalData)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
  }

  const getNextActions = (expense: Expense) => {
    const currentStatus = expense.claimStatus || 'claimable'
    const actions: Array<{ status: Expense['claimStatus'], label: string, color: string }> = []

    switch (currentStatus) {
      case 'claimable':
        actions.push({ status: 'submitted' as const, label: 'Submit Claim', color: 'bg-blue-600' })
        break
      case 'submitted':
        actions.push({ status: 'under_review' as const, label: 'Mark Under Review', color: 'bg-yellow-600' })
        actions.push({ status: 'rejected' as const, label: 'Mark Rejected', color: 'bg-red-600' })
        break
      case 'under_review':
        actions.push({ status: 'approved' as const, label: 'Approve', color: 'bg-green-600' })
        actions.push({ status: 'rejected' as const, label: 'Reject', color: 'bg-red-600' })
        break
      case 'approved':
        actions.push({ status: 'paid' as const, label: 'Mark as Paid', color: 'bg-emerald-600' })
        break
    }

    return actions
  }

  if (claimableExpenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <FileText className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Claimable Expenses</h3>
        <p className="text-gray-600">
          Mark expenses as claimable when adding them to track reimbursements here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Claims Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.claimable + stats.submitted}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">${stats.paidAmount.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${stats.totalAmount.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Claims</div>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Expense Claims</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {claimableExpenses.map((expense) => {
            const status = expense.claimStatus || 'claimable'
            const config = claimStatusConfig[status]
            const StatusIcon = config.icon
            const nextActions = getNextActions(expense)

            return (
              <div key={expense.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{expense.description}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon size={12} className="mr-1" />
                        {config.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Amount:</span> ${expense.amount.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {expense.category}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(expense.date)}
                      </div>
                      {expense.claimSubmittedDate && (
                        <div>
                          <span className="font-medium">Submitted:</span> {formatDate(expense.claimSubmittedDate)}
                        </div>
                      )}
                    </div>

                    {expense.claimNotes && (
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Notes:</span> {expense.claimNotes}
                      </div>
                    )}

                    {expense.claimRejectedReason && (
                      <div className="text-sm text-red-600 mb-3">
                        <span className="font-medium">Rejection Reason:</span> {expense.claimRejectedReason}
                      </div>
                    )}
                  </div>

                  {nextActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-4">
                      {nextActions.map((action) => (
                        <button
                          key={action.status}
                          onClick={() => handleStatusUpdate(expense, action.status)}
                          className={`px-3 py-1 text-sm text-white rounded-md hover:opacity-90 transition-opacity ${action.color}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
