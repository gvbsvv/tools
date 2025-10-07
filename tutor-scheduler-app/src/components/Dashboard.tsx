'use client'

import { Calendar, Users, GraduationCap, DollarSign, Clock, AlertTriangle } from 'lucide-react'
import { Tutor, Student, Class, Payment, Reminder } from '@/types'

interface DashboardProps {
  tutors: Tutor[]
  students: Student[]
  classes: Class[]
  payments: Payment[]
  reminders: Reminder[]
}

export function Dashboard({ tutors, students, classes, payments, reminders }: DashboardProps) {
  // Calculate statistics
  const activeTutors = tutors.filter(t => t.isActive).length
  const activeStudents = students.filter(s => s.isActive).length
  
  // Get today's classes
  const today = new Date().toISOString().split('T')[0]
  const todaysClasses = classes.filter(cls => 
    cls.scheduledDateTime.startsWith(today) && cls.status === 'scheduled'
  )
  
  // Get upcoming classes (next 7 days)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const upcomingClasses = classes.filter(cls => {
    const classDate = new Date(cls.scheduledDateTime)
    return classDate > new Date() && classDate <= nextWeek && cls.status === 'scheduled'
  })
  
  // Get overdue payments
  const overduePayments = payments.filter(p => {
    const dueDate = new Date(p.dueDate)
    return dueDate < new Date() && p.status === 'pending'
  })
  
  // Calculate total revenue
  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const stats = [
    {
      title: 'Active Tutors',
      value: activeTutors,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Students', 
      value: activeStudents,
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      title: "Today's Classes",
      value: todaysClasses.length,
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your tutoring business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alerts Section */}
      {(overduePayments.length > 0 || todaysClasses.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overdue Payments Alert */}
          {overduePayments.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-red-900">Overdue Payments</h3>
              </div>
              <div className="space-y-2">
                {overduePayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="text-sm text-red-800">
                    Payment of ${payment.amount} overdue by {Math.ceil((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                ))}
                {overduePayments.length > 3 && (
                  <p className="text-sm text-red-600">
                    +{overduePayments.length - 3} more overdue payments
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Today's Classes */}
          {todaysClasses.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-blue-900">Today's Classes</h3>
              </div>
              <div className="space-y-2">
                {todaysClasses.slice(0, 3).map((cls) => {
                  const tutor = tutors.find(t => t.id === cls.tutorId)
                  const student = students.find(s => s.id === cls.studentId)
                  const time = new Date(cls.scheduledDateTime).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })
                  
                  return (
                    <div key={cls.id} className="text-sm text-blue-800">
                      {time} - {student?.name} with {tutor?.name} ({cls.subject})
                    </div>
                  )
                })}
                {todaysClasses.length > 3 && (
                  <p className="text-sm text-blue-600">
                    +{todaysClasses.length - 3} more classes today
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Tutor</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <GraduationCap className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Student</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Schedule Class</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Record Payment</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {upcomingClasses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Classes</h3>
          <div className="space-y-4">
            {upcomingClasses.slice(0, 5).map((cls) => {
              const tutor = tutors.find(t => t.id === cls.tutorId)
              const student = students.find(s => s.id === cls.studentId)
              const date = new Date(cls.scheduledDateTime)
              
              return (
                <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {student?.name} - {cls.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      with {tutor?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {date.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
