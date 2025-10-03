'use client'

import { useState, useEffect } from 'react'
import { Preferences } from '@capacitor/preferences'
import { Mail, Clock, Lock } from 'lucide-react'

interface AuthProps {
  onAuthenticated: (email: string) => void
}

export function AuthScreen({ onAuthenticated }: AuthProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && step === 'otp') {
      // OTP expired
      setStep('email')
      setGeneratedOtp('')
      alert('OTP expired. Please request a new one.')
    }
  }, [countdown, step])

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const sendOTP = async () => {
    if (!email || !isValidEmail(email)) {
      alert('Please enter a valid email address')
      return
    }

    setLoading(true)
    const newOtp = generateOTP()
    setGeneratedOtp(newOtp)
    
    // Simulate sending OTP via email service
    console.log(`OTP for ${email}: ${newOtp}`)
    
    // For demo purposes, show OTP in alert
    alert(`Demo Mode - Your OTP: ${newOtp}\n\nIn production, this would be sent to your email.`)
    
    setStep('otp')
    setCountdown(600) // 10 minutes
    setLoading(false)
  }

  const verifyOTP = async () => {
    if (otp !== generatedOtp) {
      alert('Invalid OTP. Please try again.')
      return
    }

    setLoading(true)
    
    // Store session data
    const sessionData = {
      email,
      sessionStart: new Date().toISOString(),
      sessionExpiry: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
    }

    await Preferences.set({
      key: 'userSession',
      value: JSON.stringify(sessionData)
    })

    setLoading(false)
    onAuthenticated(email)
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">
            {step === 'email' ? 'Enter something which you remember to track your tasks' : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {step === 'email' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1" />
                  {formatTime(countdown)}
                </div>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl font-mono"
                placeholder="000000"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-2">
                OTP sent to {email}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                onClick={() => setStep('email')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Change Email
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          {/* Removed secure authentication message */}
        </div>
      </div>
    </div>
  )
}
