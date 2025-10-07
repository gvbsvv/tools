'use client'

import { useState } from 'react'
import { User, Lock } from 'lucide-react'

interface AuthScreenProps {
  onAuthenticated: (email: string) => void
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier')
  const [loading, setLoading] = useState(false)

  const handleGenerateOTP = () => {
    if (!identifier.trim()) {
      alert('Please enter your identifier')
      return
    }

    setLoading(true)
    
    // Simulate OTP generation
    setTimeout(() => {
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
      console.log('Generated OTP:', generatedOTP) // In real app, this would be sent via email/SMS
      alert(`Your OTP is: ${generatedOTP}`) // For demo purposes
      setLoading(false)
      setStep('otp')
    }, 1500)
  }

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      alert('Please enter the OTP')
      return
    }

    setLoading(true)

    // Simulate OTP verification
    setTimeout(async () => {
      try {
        // Create session
        const sessionExpiry = new Date()
        sessionExpiry.setHours(sessionExpiry.getHours() + 24) // 24 hour session

        const sessionData = {
          email: identifier,
          sessionExpiry: sessionExpiry.toISOString(),
          loginTime: new Date().toISOString()
        }

        // Save session (you'll need to implement TutorStorage.saveUserSession)
        // await TutorStorage.saveUserSession(sessionData)

        onAuthenticated(identifier)
      } catch (error) {
        console.error('Login error:', error)
        alert('Login failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  const handleBackToIdentifier = () => {
    setStep('identifier')
    setOtp('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Tutor Scheduler
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'identifier' 
              ? 'Enter your identifier to continue' 
              : 'Enter the OTP sent to you'
            }
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {step === 'identifier' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="identifier" className="sr-only">
                  Identifier
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your identifier"
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateOTP()}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateOTP}
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  'Generate OTP'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">
                  OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBackToIdentifier}
                  className="flex-1 py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Manage tutors, students, and scheduling with ease
          </p>
        </div>
      </div>
    </div>
  )
}
