'use client'

import { Calculator, CheckSquare, Plus, ArrowRight, Globe, Smartphone, GraduationCap } from 'lucide-react'

export default function Home() {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TrackEnds",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": ["Web Browser", "Android", "iOS"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "100"
    },
    "description": "Free productivity tools suite including expense tracker, task reminders, tutor scheduler, budget planner, time tracker, note taking, password manager for web and mobile devices.",
    "url": "https://www.trackends.com",
    "publisher": {
      "@type": "Organization",
      "name": "TrackEnds"
    },
    "featureList": [
      "Expense tracking and budget management",
      "Task reminders and organization",
      "Tutor scheduling and payment management", 
      "Budget planning and analysis",
      "Time tracking and productivity monitoring",
      "Note taking and digital organization",
      "Cross-platform synchronization",
      "Data export and backup",
      "Category management",
      "Visual charts and analytics"
    ]
  };

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
    },
    {
      name: 'Tutor Scheduler',
      description: 'Comprehensive tutoring management with scheduling, payments & reminders',
      url: 'https://tutor.trackends.com',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      features: ['Class Scheduling', 'Payment Tracking', 'Student Management']
    }
  ]

  const upcomingTools = [
    'Time Tracker & Productivity Monitor',
    'Password Manager & Security Vault', 
    'Note Taking & Digital Organizer',
    'Budget Planner & Financial Dashboard',
    'Habit Tracker & Goal Manager',
    'Invoice Generator & Billing System',
    'Expense Reports & Analytics',
    'Team Collaboration Tools'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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

      {/* Hero Section with Tools */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Side - Available Tools */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Available Tools</h3>
              <p className="text-gray-600 text-sm mb-6">
                Choose from our productivity suite. All tools are free and work on any device.
              </p>
              <div className="space-y-4">
                {tools.map((tool, index) => (
                  <a 
                    key={index}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`bg-gradient-to-r ${tool.color} p-2 rounded-lg group-hover:scale-105 transition-transform`}>
                      <tool.icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</div>
                      <div className="text-xs text-gray-500">{tool.features[0]}</div>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Hero Content */}
          <div className="lg:col-span-2">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Personal Productivity Tools</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Complete productivity suite with expense tracker, task reminders, tutor scheduler, budget planner, time tracker, note taking, and password manager. 
                Free web and mobile apps to track spending, manage tasks, schedule tutoring sessions, and boost your productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
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
          </div>
        </div>
      </section>

      {/* Featured Tools Details */}
      <section id="tools" className="container mx-auto px-6 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Tool Features</h3>
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

      {/* About Section */}
      <section id="about" className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">About TrackEnds</h3>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div className="text-left">
                <h4 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  TrackEnds was born from a simple belief: productivity tools should be simple, accessible, and effective. 
                  We create free, cross-platform applications that help people manage their finances, organize their tasks, 
                  and stay productive without the complexity of enterprise software.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Every tool we build focuses on the essentials—no bloated features, no confusing interfaces, 
                  just clean, intuitive apps that get the job done. Whether you're tracking expenses, managing tasks, 
                  or planning your budget, TrackEnds provides the tools you need to stay organized and in control.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Globe className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Global Access</h5>
                      <p className="text-sm text-gray-600">Available worldwide on web and mobile</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CheckSquare className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Always Free</h5>
                      <p className="text-sm text-gray-600">Core features remain free forever</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Plus className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Privacy First</h5>
                      <p className="text-sm text-gray-600">Your data stays on your device</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Why We Built TrackEnds</h4>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Simplicity Over Complexity</h5>
                  <p className="text-sm text-gray-600">
                    Most productivity tools are overengineered. We believe in doing fewer things, but doing them exceptionally well.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Privacy by Design</h5>
                  <p className="text-sm text-gray-600">
                    Your personal data shouldn't be a product. Our tools work offline-first and keep your information private.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Universal Access</h5>
                  <p className="text-sm text-gray-600">
                    Great tools should be available to everyone, regardless of budget or device. That's why we're committed to keeping TrackEnds free.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">The Road Ahead</h4>
              <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                We're constantly working on new tools and features based on user feedback. Our roadmap includes advanced 
                analytics, team collaboration features, and integrations with popular services—all while maintaining 
                our core principles of simplicity and privacy.
              </p>
              <p className="text-gray-600 font-medium">
                Join thousands of users who trust TrackEnds to keep their digital life organized.
              </p>
            </div>
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
            <div className="flex flex-wrap gap-6">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#tools" className="text-gray-300 hover:text-white transition-colors">Tools</a>
              <a href="https://expenses.trackends.com" className="text-gray-300 hover:text-white transition-colors">Expense Tracker</a>
              <a href="https://remind.trackends.com" className="text-gray-300 hover:text-white transition-colors">Task Reminders</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p className="mb-2">&copy; 2025 TrackEnds. Simple tools for productive life.</p>
            <p className="text-sm">
              Free expense tracker, task reminders, budget planner & productivity tools. 
              Available on web, Android & iOS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
