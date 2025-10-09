'use client'

import { useState } from 'react'
import { DollarSign, Calendar, User, GraduationCap, Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, AlertCircle, CreditCard } from 'lucide-react'
import { Payment, Session, Tutor, Child } from '@/types'

interface PaymentTrackerProps {
  payments: Payment[]
  sessions: Session[]
  tutors: Tutor[]
  children: Child[]
  onAddPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdatePayment: (payment: Payment) => void
  onDeletePayment: (id: string) => void
}

type PaymentFormData = {
  sessionId: string
  tutorId: string
  childId: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  paymentMethod?: string
  notes?: string
}

export function PaymentTracker({ payments, sessions, tutors, children, onAddPayment, onUpdatePayment, onDeletePayment }: PaymentTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [viewFilter, setViewFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all')
  const [selectedTutor, setSelectedTutor] = useState<string>('')
  const [selectedChild, setSelectedChild] = useState<string>('')

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    sessionId: '',
    tutorId: '',
    childId: '',
    amount: 0,
    dueDate: '',
    status: 'pending',
    paymentMethod: '',
    notes: ''
  })

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!paymentForm.sessionId || !paymentForm.amount || !paymentForm.dueDate) {
      alert('Please fill in all required fields')
      return
    }

    onAddPayment(paymentForm)

    setPaymentForm({
      sessionId: '',
      tutorId: '',
      childId: '',
      amount: 0,
      dueDate: '',
      status: 'pending',
      paymentMethod: '',
      notes: ''
    })
    setShowAddForm(false)
  }

  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingPayment) return

    onUpdatePayment({
      ...editingPayment,
      ...paymentForm,
      paidAt: paymentForm.status === 'paid' ? new Date().toISOString() : editingPayment.paidAt
    })

    setEditingPayment(null)
    setPaymentForm({
      sessionId: '',
      tutorId: '',
      childId: '',
      amount: 0,
      dueDate: '',
      status: 'pending',
      paymentMethod: '',
      notes: ''
    })
  }

  const startEdit = (payment: Payment) => {
    setEditingPayment(payment)
    setPaymentForm({
      sessionId: payment.sessionId,
      tutorId: payment.tutorId,
      childId: payment.childId,
      amount: payment.amount,
      dueDate: payment.dueDate,
      status: payment.status,
      paymentMethod: payment.paymentMethod || '',
      notes: payment.notes || ''
    })
  }

  const markAsPaid = (payment: Payment) => {
    onUpdatePayment({
      ...payment,
      status: 'paid',
      paidAt: new Date().toISOString()
    })
  }

  const filteredPayments = payments.filter(payment => {
    const statusMatch = viewFilter === 'all' || payment.status === viewFilter
    const tutorMatch = !selectedTutor || payment.tutorId === selectedTutor
    const childMatch = !selectedChild || payment.childId === selectedChild
    
    return statusMatch && tutorMatch && childMatch
  })

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'paid': return <CheckCircle size={16} />
      case 'overdue': return <AlertCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const generatePaymentsFromSessions = () => {
    const completedSessions = sessions.filter(session => 
      session.status === 'completed' && 
      !payments.some(payment => payment.sessionId === session.id)
    )

    completedSessions.forEach(session => {
      const amount = (session.hourlyRate || 0) * (session.duration / 60)
      const dueDate = new Date(session.scheduledDateTime)
      dueDate.setDate(dueDate.getDate() + 7) // Due 1 week after session

      onAddPayment({
        sessionId: session.id,
        tutorId: session.tutorId,
        childId: session.childId,
        amount: amount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pending'
      })
    })
  }

  // Calculate totals
  const totalPending = filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = filteredPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={generatePaymentsFromSessions}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <CreditCard size={20} />
            <span>Generate from Sessions</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-green-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-800">${totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-800">${totalPending.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-800">${totalOverdue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Filter Payments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={viewFilter}
              onChange={(e) => setViewFilter(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tutor</label>
            <select
              value={selectedTutor}
              onChange={(e) => setSelectedTutor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tutors</option>
              {tutors.map(tutor => (
                <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Children</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Payments Found</h3>
            <p className="text-gray-600 mb-4">
              {payments.length === 0 
                ? "Start by adding payments or generating them from completed sessions."
                : "No payments match your current filters."
              }
            </p>
            {payments.length === 0 && (
              <div className="flex justify-center space-x-3">
                <button
                  onClick={generatePaymentsFromSessions}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Generate from Sessions
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Manual Payment
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredPayments.map(payment => {
            const session = sessions.find(s => s.id === payment.sessionId)
            const tutor = tutors.find(t => t.id === payment.tutorId)
            const child = children.find(c => c.id === payment.childId)
            const dueDate = new Date(payment.dueDate)
            const isOverdue = payment.status === 'pending' && dueDate < new Date()
            
            return (
              <div key={payment.id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">${payment.amount.toFixed(2)}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>{child?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap size={16} />
                        <span>{tutor?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>Due: {dueDate.toLocaleDateString()}</span>
                      </div>
                      {session && (
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>Session: {session.activity}</span>
                        </div>
                      )}
                    </div>

                    {payment.paymentMethod && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Payment Method:</strong> {payment.paymentMethod}
                      </p>
                    )}

                    {payment.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-gray-600">{payment.notes}</p>
                      </div>
                    )}

                    {payment.paidAt && (
                      <p className="text-sm text-green-600">
                        <strong>Paid on:</strong> {new Date(payment.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => markAsPaid(payment)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as Paid"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(payment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Payment"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeletePayment(payment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Payment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add/Edit Payment Modal */}
      {(showAddForm || editingPayment) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={editingPayment ? handleUpdatePayment : handleAddPayment} className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingPayment ? 'Edit Payment' : 'Add New Payment'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingPayment(null)
                    setPaymentForm({
                      sessionId: '',
                      tutorId: '',
                      childId: '',
                      amount: 0,
                      dueDate: '',
                      status: 'pending',
                      paymentMethod: '',
                      notes: ''
                    })
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session *</label>
                  <select
                    value={paymentForm.sessionId}
                    onChange={(e) => {
                      const session = sessions.find(s => s.id === e.target.value)
                      setPaymentForm({ 
                        ...paymentForm, 
                        sessionId: e.target.value,
                        tutorId: session?.tutorId || '',
                        childId: session?.childId || '',
                        amount: session ? (session.hourlyRate * (session.duration / 60)) : 0
                      })
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Session</option>
                    {sessions.filter(s => s.status === 'completed').map(session => {
                      const child = children.find(c => c.id === session.childId)
                      const tutor = tutors.find(t => t.id === session.tutorId)
                      return (
                        <option key={session.id} value={session.id}>
                          {session.activity} - {child?.name} with {tutor?.name} ({new Date(session.scheduledDateTime).toLocaleDateString()})
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={paymentForm.dueDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={paymentForm.status}
                    onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value as Payment['status'] })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Method</option>
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="venmo">Venmo</option>
                    <option value="paypal">PayPal</option>
                    <option value="check">Check</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="Additional notes about this payment..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingPayment(null)
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPayment ? 'Update Payment' : 'Add Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
