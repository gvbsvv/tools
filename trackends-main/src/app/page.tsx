'use client'

import { Calculator, CheckSquare, Plus, ArrowRight, Globe, Smartphone } from 'lucide-react'

export default function Home() {
  const tools = [
    {
      name: 'Expense Tracker',
      description: 'Track and manage your expenses with beautiful charts and analytics',
      url: 'https://expenses.trackends.com',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      features: ['Visual Charts', 'Category Management', 'Export Data']
    },
    {
      name: 'Task Reminders', 
      description: 'Organize your tasks and reminders with smart categorization',
      url: 'https://remind.trackends.com',
      icon: CheckSquare,
      color: 'from-green-500 to-green-600',
      features: ['Smart Categories', 'Progress Tracking', 'Quick Actions']
    }
  ]

  const upcomingTools = [
    'Time Tracker',
    'Password Manager', 
    'Note Taking',
    'Budget Planner'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
              <Globe className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TrackEnds</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#tools" className="text-gray-600 hover:text-blue-600 transition-colors">Tools</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Personal 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Productivity </span>
            Tools
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            A growing collection of simple, powerful tools designed to help you manage your daily life. 
            Track expenses, organize tasks, and stay productive - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#tools"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all inline-flex items-center justify-center space-x-2"
            >
              <span>Explore Tools</span>
              <ArrowRight size={20} />
            </a>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Globe size={16} />
                <span>Web</span>
              </div>
              <div className="flex items-center space-x-1">
                <Smartphone size={16} />
                <span>Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Available Tools</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each tool is designed with simplicity in mind. Access them on any device - your data stays private and secure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {tools.map((tool, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="flex items-start space-x-4">
                <div className={`bg-gradient-to-r ${tool.color} p-3 rounded-lg`}>
                  <tool.icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h4>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <ul className="space-y-1 mb-4">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center space-x-2">
                        <CheckSquare size={14} className="text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a 
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-2 bg-gradient-to-r ${tool.color} text-white px-4 py-2 rounded-lg hover:shadow-md transition-all`}
                  >
                    <span>Launch App</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
              <Plus className="text-white" size={24} />
            </div>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">More Tools Coming Soon</h4>
          <p className="text-gray-600 mb-6">We're working on additional productivity tools to help you stay organized.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {upcomingTools.map((tool, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-600">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TrackEnds?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-blue-600" size={32} />
              </div>
              <h4 className="text-lg font-semibold mb-2">Cross-Platform</h4>
              <p className="text-gray-600">Works on web, Android, and iOS. Your data syncs across all devices.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="text-green-600" size={32} />
              </div>
              <h4 className="text-lg font-semibold mb-2">Simple & Effective</h4>
              <p className="text-gray-600">Clean interfaces designed for productivity, not complexity.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-purple-600" size={32} />
              </div>
              <h4 className="text-lg font-semibold mb-2">Always Growing</h4>
              <p className="text-gray-600">New tools and features added regularly based on your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                <Globe className="text-white" size={20} />
              </div>
              <span className="text-lg font-semibold">TrackEnds</span>
            </div>
            <div className="flex space-x-6">
              <a href="https://expenses.trackends.com" className="text-gray-300 hover:text-white transition-colors">Expenses</a>
              <a href="https://remind.trackends.com" className="text-gray-300 hover:text-white transition-colors">Reminders</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TrackEnds. Simple tools for productive life.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
