'use client'

import { useState } from 'react'
import { BarChart, PieChart, TrendingUp, DollarSign, Calendar, Clock, User, GraduationCap, BookOpen, Award, AlertCircle, CheckCircle } from 'lucide-react'
import { Session, Tutor, Child, Payment, ACTIVITY_CATEGORIES } from '@/types'

interface DashboardProps {
  sessions: Session[]
  tutors: Tutor[]
  children: Child[]
  payments: Payment[]
}

export function Dashboard({ sessions, tutors, children, payments }: DashboardProps) {
  const [reportType, setReportType] = useState<'overview' | 'children' | 'tutors' | 'activities' | 'financial'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [selectedTutor, setSelectedTutor] = useState<string>('')
  const [selectedActivity, setSelectedActivity] = useState<string>('')

  // Helper functions for calculations
  const getFilteredSessions = () => {
    const now = new Date()
    let startDate: Date
    
    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
    }

    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduledDateTime)
      return sessionDate >= startDate && sessionDate <= now
    })
  }

  const calculateTotalCost = (sessionList: Session[]) => {
    return sessionList.reduce((total, session) => {
      const hourlyRate = session.hourlyRate || 0
      const hours = session.duration / 60
      return total + (hourlyRate * hours)
    }, 0)
  }

  const getSessionsByStatus = (sessionList: Session[]) => {
    return {
      scheduled: sessionList.filter(s => s.status === 'scheduled').length,
      completed: sessionList.filter(s => s.status === 'completed').length,
      cancelled: sessionList.filter(s => s.status === 'cancelled').length,
      rescheduled: sessionList.filter(s => s.status === 'rescheduled').length
    }
  }

  const getChildStats = (childId: string) => {
    const childSessions = getFilteredSessions().filter(s => s.childId === childId)
    const child = children.find(c => c.id === childId)
    
    const activitiesMap = new Map<string, number>()
    const tutorsMap = new Map<string, number>()
    
    childSessions.forEach(session => {
      activitiesMap.set(session.activity, (activitiesMap.get(session.activity) || 0) + 1)
      tutorsMap.set(session.tutorId, (tutorsMap.get(session.tutorId) || 0) + 1)
    })

    return {
      child,
      totalSessions: childSessions.length,
      completedSessions: childSessions.filter(s => s.status === 'completed').length,
      totalCost: calculateTotalCost(childSessions),
      activities: Array.from(activitiesMap.entries()).map(([activity, count]) => ({ activity, count })),
      tutors: Array.from(tutorsMap.entries()).map(([tutorId, count]) => ({
        tutor: tutors.find(t => t.id === tutorId)?.name || 'Unknown',
        count
      })),
      statusBreakdown: getSessionsByStatus(childSessions)
    }
  }

  const getTutorStats = (tutorId: string) => {
    const tutorSessions = getFilteredSessions().filter(s => s.tutorId === tutorId)
    const tutor = tutors.find(t => t.id === tutorId)
    
    const childrenMap = new Map<string, number>()
    const activitiesMap = new Map<string, number>()
    
    tutorSessions.forEach(session => {
      childrenMap.set(session.childId, (childrenMap.get(session.childId) || 0) + 1)
      activitiesMap.set(session.activity, (activitiesMap.get(session.activity) || 0) + 1)
    })

    return {
      tutor,
      totalSessions: tutorSessions.length,
      completedSessions: tutorSessions.filter(s => s.status === 'completed').length,
      totalEarnings: calculateTotalCost(tutorSessions),
      children: Array.from(childrenMap.entries()).map(([childId, count]) => ({
        child: children.find(c => c.id === childId)?.name || 'Unknown',
        count
      })),
      activities: Array.from(activitiesMap.entries()).map(([activity, count]) => ({ activity, count })),
      statusBreakdown: getSessionsByStatus(tutorSessions)
    }
  }

  const getActivityStats = (activity: string) => {
    const activitySessions = getFilteredSessions().filter(s => s.activity === activity)
    
    const childrenMap = new Map<string, number>()
    const tutorsMap = new Map<string, number>()
    
    activitySessions.forEach(session => {
      childrenMap.set(session.childId, (childrenMap.get(session.childId) || 0) + 1)
      tutorsMap.set(session.tutorId, (tutorsMap.get(session.tutorId) || 0) + 1)
    })

    return {
      activity,
      totalSessions: activitySessions.length,
      completedSessions: activitySessions.filter(s => s.status === 'completed').length,
      totalCost: calculateTotalCost(activitySessions),
      children: Array.from(childrenMap.entries()).map(([childId, count]) => ({
        child: children.find(c => c.id === childId)?.name || 'Unknown',
        count
      })),
      tutors: Array.from(tutorsMap.entries()).map(([tutorId, count]) => ({
        tutor: tutors.find(t => t.id === tutorId)?.name || 'Unknown',
        count
      })),
      statusBreakdown: getSessionsByStatus(activitySessions)
    }
  }

  const getAllActivities = () => {
    const activities = new Set<string>()
    ACTIVITY_CATEGORIES.forEach(category => {
      category.subcategories.forEach(activity => activities.add(activity))
    })
    return Array.from(activities).sort()
  }

  const filteredSessions = getFilteredSessions()
  const statusStats = getSessionsByStatus(filteredSessions)
  const totalCost = calculateTotalCost(filteredSessions)

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-blue-600">Total Sessions</p>
              <p className="text-2xl font-bold text-blue-800">{filteredSessions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-800">{statusStats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="text-sm text-yellow-600">Scheduled</p>
              <p className="text-2xl font-bold text-yellow-800">{statusStats.scheduled}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <DollarSign className="text-purple-600" size={24} />
            <div>
              <p className="text-sm text-purple-600">Total Cost</p>
              <p className="text-2xl font-bold text-purple-800">${totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <BarChart size={20} />
          <span>Sessions by Activity</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(
            filteredSessions.reduce((acc, session) => {
              acc[session.activity] = (acc[session.activity] || 0) + 1
              return acc
            }, {} as Record<string, number>)
          ).map(([activity, count]) => (
            <div key={activity} className="flex items-center justify-between">
              <span className="text-sm font-medium">{activity}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(count / filteredSessions.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <PieChart size={20} />
          <span>Session Status Distribution</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-blue-800 font-semibold">{statusStats.scheduled}</span>
            </div>
            <p className="text-sm text-gray-600">Scheduled</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-green-800 font-semibold">{statusStats.completed}</span>
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-red-800 font-semibold">{statusStats.cancelled}</span>
            </div>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-yellow-800 font-semibold">{statusStats.rescheduled}</span>
            </div>
            <p className="text-sm text-gray-600">Rescheduled</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderChildrenReport = () => (
    <div className="space-y-6">
      {selectedChild ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedChild('')}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
          >
            ← Back to All Children
          </button>
          {(() => {
            const stats = getChildStats(selectedChild)
            return (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">{stats.child?.name} - Learning Report</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Total Sessions</p>
                      <p className="text-2xl font-bold text-blue-800">{stats.totalSessions}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Completed</p>
                      <p className="text-2xl font-bold text-green-800">{stats.completedSessions}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Total Investment</p>
                      <p className="text-2xl font-bold text-purple-800">${stats.totalCost.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Activities</h4>
                      {stats.activities.map(({ activity, count }) => (
                        <div key={activity} className="flex justify-between items-center mb-2">
                          <span className="text-sm">{activity}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{count}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Tutors</h4>
                      {stats.tutors.map(({ tutor, count }) => (
                        <div key={tutor} className="flex justify-between items-center mb-2">
                          <span className="text-sm">{tutor}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map(child => {
            const stats = getChildStats(child.id)
            return (
              <div key={child.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setSelectedChild(child.id)}>
                <div className="flex items-center space-x-3 mb-4">
                  <User className="text-pink-600" size={24} />
                  <div>
                    <h3 className="font-semibold">{child.name}</h3>
                    <p className="text-sm text-gray-500">Age {child.age} • Grade {child.grade}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Sessions:</span>
                    <span className="font-semibold">{stats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-semibold text-green-600">{stats.completedSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities:</span>
                    <span className="font-semibold">{stats.activities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment:</span>
                    <span className="font-semibold text-purple-600">${stats.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderTutorsReport = () => (
    <div className="space-y-6">
      {selectedTutor ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedTutor('')}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
          >
            ← Back to All Tutors
          </button>
          {(() => {
            const stats = getTutorStats(selectedTutor)
            return (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{stats.tutor?.name} - Performance Report</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.totalSessions}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-800">{stats.completedSessions}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-yellow-800">${stats.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Students</h4>
                    {stats.children.map(({ child, count }) => (
                      <div key={child} className="flex justify-between items-center mb-2">
                        <span className="text-sm">{child}</span>
                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Activities Taught</h4>
                    {stats.activities.map(({ activity, count }) => (
                      <div key={activity} className="flex justify-between items-center mb-2">
                        <span className="text-sm">{activity}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.filter(tutor => tutor.isActive).map(tutor => {
            const stats = getTutorStats(tutor.id)
            return (
              <div key={tutor.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setSelectedTutor(tutor.id)}>
                <div className="flex items-center space-x-3 mb-4">
                  <GraduationCap className="text-blue-600" size={24} />
                  <div>
                    <h3 className="font-semibold">{tutor.name}</h3>
                    <p className="text-sm text-gray-500">{tutor.specialization.join(', ')}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Sessions:</span>
                    <span className="font-semibold">{stats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-semibold text-green-600">{stats.completedSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="font-semibold">{stats.children.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Earnings:</span>
                    <span className="font-semibold text-yellow-600">${stats.totalEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderActivitiesReport = () => (
    <div className="space-y-6">
      {selectedActivity ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedActivity('')}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
          >
            ← Back to All Activities
          </button>
          {(() => {
            const stats = getActivityStats(selectedActivity)
            return (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{selectedActivity} - Activity Report</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.totalSessions}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-800">{stats.completedSessions}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Total Investment</p>
                    <p className="text-2xl font-bold text-purple-800">${stats.totalCost.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Students</h4>
                    {stats.children.map(({ child, count }) => (
                      <div key={child} className="flex justify-between items-center mb-2">
                        <span className="text-sm">{child}</span>
                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Tutors</h4>
                    {stats.tutors.map(({ tutor, count }) => (
                      <div key={tutor} className="flex justify-between items-center mb-2">
                        <span className="text-sm">{tutor}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAllActivities().filter(activity => 
            filteredSessions.some(session => session.activity === activity)
          ).map(activity => {
            const stats = getActivityStats(activity)
            return (
              <div key={activity} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setSelectedActivity(activity)}>
                <div className="flex items-center space-x-3 mb-4">
                  <BookOpen className="text-green-600" size={24} />
                  <div>
                    <h3 className="font-semibold">{activity}</h3>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Sessions:</span>
                    <span className="font-semibold">{stats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-semibold text-green-600">{stats.completedSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="font-semibold">{stats.children.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment:</span>
                    <span className="font-semibold text-purple-600">${stats.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderFinancialReport = () => {
    const completedSessions = filteredSessions.filter(s => s.status === 'completed')
    const pendingPayments = payments.filter(p => p.status === 'pending')
    const overduePaments = payments.filter(p => p.status === 'overdue')
    const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalOverdue = overduePaments.reduce((sum, p) => sum + p.amount, 0)

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <DollarSign className="text-green-600" size={24} />
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

          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-blue-600">Total Cost</p>
                <p className="text-2xl font-bold text-blue-800">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Monthly Spending by Activity</h3>
          <div className="space-y-3">
            {Object.entries(
              completedSessions.reduce((acc, session) => {
                const cost = (session.hourlyRate || 0) * (session.duration / 60)
                acc[session.activity] = (acc[session.activity] || 0) + cost
                return acc
              }, {} as Record<string, number>)
            ).map(([activity, cost]) => (
              <div key={activity} className="flex items-center justify-between">
                <span className="text-sm font-medium">{activity}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(cost / totalCost) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">${cost.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Learning Analytics Dashboard</h2>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-lg">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart },
            { key: 'children', label: 'Children', icon: User },
            { key: 'tutors', label: 'Tutors', icon: GraduationCap },
            { key: 'activities', label: 'Activities', icon: BookOpen },
            { key: 'financial', label: 'Financial', icon: DollarSign }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setReportType(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                reportType === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'overview' && renderOverviewReport()}
      {reportType === 'children' && renderChildrenReport()}
      {reportType === 'tutors' && renderTutorsReport()}
      {reportType === 'activities' && renderActivitiesReport()}
      {reportType === 'financial' && renderFinancialReport()}
    </div>
  )
}
