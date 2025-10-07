'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react'
import { Payment, Class, Tutor, Student } from '@/types'

interface PaymentTrackerProps {
  payments: Payment[]
  classes: Class[]
  tutors: Tutor[]
  students: Student[]
  onAddPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdatePayment: (payment: Payment) => void
  onDeletePayment: (id: string) => void
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  pending: Clock,
  paid: CheckCircle,
  overdue: AlertCircle,
  cancelled: CheckCircle
}

export function PaymentTracker({
  payments,
  classes,
  tutors,
  students,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment
}: PaymentTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue' | 'cancelled'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    classId: '',
    amount: '',
    dueDate: '',
    method: '',
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      classId: '',
      amount: '',
      dueDate: '',
      method: '',
      notes: ''
    })
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedClass = classes.find(c => c.id === formData.classId)
    if (!selectedClass || !formData.amount || !formData.dueDate) {
      alert('Please fill in all required fields')
      return
    }

    const paymentData = {
      classId: formData.classId,
      tutorId: selectedClass.tutorId,
      studentId: selectedClass.studentId,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      method: formData.method || undefined,
      status: 'pending' as const,
      notes: formData.notes || undefined
    }

    onAddPayment(paymentData)
    resetForm()
  }

  const markAsPaid = (payment: Payment) => {
    const method = prompt('Payment method (cash, card, transfer, etc.):')
    if (method !== null) {
      onUpdatePayment({
        ...payment,
        status: 'paid',
        paidDate: new Date().toISOString(),
        method: method || payment.method,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Status filter
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
      
      // Check for overdue payments
      const isOverdue = payment.status === 'pending' && new Date(payment.dueDate) < new Date()
      const actualStatus = isOverdue ? 'overdue' : payment.status
      const matchesStatusWithOverdue = statusFilter === 'all' || actualStatus === statusFilter
      
      // Search filter
      const tutor = tutors.find(t => t.id === payment.tutorId)
      const student = students.find(s => s.id === payment.studentId)
      const classItem = classes.find(c => c.id === payment.classId)
      
      const matchesSearch = searchTerm === '' || 
        tutor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem?.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm)
      
      return matchesStatusWithOverdue && matchesSearch
    }).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  }, [payments, statusFilter, searchTerm, tutors, students, classes])

  const getTutorName = (tutorId: string) => {
    return tutors.find(t => t.id === tutorId)?.name || 'Unknown Tutor'
  }

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student'
  }

  const getClassSubject = (classId: string) => {
    return classes.find(c => c.id === classId)?.subject || 'Unknown Subject'
  }

  const stats = useMemo(() => {
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
    const overdueAmount = payments
      .filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date())
      .reduce((sum, p) => sum + p.amount, 0)

    return {
      total: totalAmount,
      paid: paidAmount,
      pending: pendingAmount,
      overdue: overdueAmount,
      pendingCount: payments.filter(p => p.status === 'pending').length,
      overdueCount: payments.filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date()).length
    }
  }, [payments])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Tracker</h2>
          <p className="text-gray-600">Track and manage tutor payments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.total.toFixed(2)}</p>
            </div>
            <DollarSign className="text-gray-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">${stats.paid.toFixed(2)}</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending ({stats.pendingCount})</p>
              <p className="text-2xl font-bold text-yellow-600">${stats.pending.toFixed(2)}</p>
            </div>
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue ({stats.overdueCount})</p>
              <p className="text-2xl font-bold text-red-600">${stats.overdue.toFixed(2)}</p>
            </div>
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          {(['all', 'pending', 'paid', 'overdue', 'cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by tutor, student, subject, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Payment Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Payment</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Class</option>
                  {classes
                    .filter(c => c.status === 'completed')
                    .map(classItem => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.subject} - {getTutorName(classItem.tutorId)} & {getStudentName(classItem.studentId)}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Additional payment notes..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Payment
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            Payments ({filteredPayments.length})
          </h3>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No payments found</p>
            {searchTerm && <p className="text-sm">Try adjusting your search or filter</p>}
          </div>
        ) : (
          <div className="divide-y">
            {filteredPayments.map(payment => {
              const isOverdue = payment.status === 'pending' && new Date(payment.dueDate) < new Date()
              const displayStatus = isOverdue ? 'overdue' : payment.status
              const StatusIcon = statusIcons[displayStatus]
              
              return (
                <div key={payment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {getClassSubject(payment.classId)}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[displayStatus]}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          ${payment.amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Tutor:</span> {getTutorName(payment.tutorId)}
                        </div>
                        <div>
                          <span className="font-medium">Student:</span> {getStudentName(payment.studentId)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {payment.paidDate && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Paid on:</span> {new Date(payment.paidDate).toLocaleDateString()}
                          {payment.method && <span> via {payment.method}</span>}
                        </div>
                      )}

                      {payment.notes && (
                        <p className="text-sm text-gray-600">{payment.notes}</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => markAsPaid(payment)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Mark as Paid
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this payment?')) {
                            onDeletePayment(payment.id)
                          }
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
