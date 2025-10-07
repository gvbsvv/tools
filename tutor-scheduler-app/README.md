# Tutor Scheduling App

A comprehensive tutor scheduling and management application built with Next.js 15, TypeScript, and Tailwind CSS. This app allows you to manage tutors, students, class scheduling (one-time and recurring), payments, and reminders.

## 🌟 Features

### 👨‍🏫 Tutor Management
- Add, edit, and manage tutor profiles
- Track qualifications, subjects, and hourly rates
- Manage tutor availability and active status
- Search and filter tutors

### 👥 Student Management
- Comprehensive student profiles with parent/guardian information
- Track subjects of interest and grade levels
- Manage contact information for students and parents
- Active/inactive student status management

### 📅 Class Scheduling
- Schedule one-time and recurring classes
- Class status tracking (scheduled, completed, cancelled, rescheduled)
- Easy rescheduling and cancellation with reasons
- Duration and location management
- Comprehensive class filtering and search

### 💰 Payment Tracking
- Track payments for completed classes
- Payment status management (pending, paid, overdue)
- Multiple payment methods support
- Overdue payment alerts
- Revenue tracking and statistics

### 🔔 Notification Center
- Automated class reminders
- Payment due reminders
- Configurable notification settings
- Email and SMS notification support (configurable)
- Today's classes overview
- Overdue payments alerts

### 📊 Dashboard
- Overview of all key metrics
- Upcoming classes and reminders
- Payment statistics
- Quick access to all major functions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd tutor-scheduler-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## 📱 Mobile Support

This app is built with Capacitor for cross-platform mobile deployment:

### iOS Development
```bash
npx cap add ios
npx cap run ios
```

### Android Development  
```bash
npx cap add android
npx cap run android
```

## 🏗️ Project Structure

```
tutor-scheduler-app/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main application page
│   ├── components/          # React components
│   │   ├── AuthScreen.tsx           # Authentication
│   │   ├── ClassScheduler.tsx       # Class scheduling
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── NotificationCenter.tsx   # Notifications & reminders
│   │   ├── PaymentTracker.tsx       # Payment management
│   │   ├── SessionManager.tsx       # Session handling
│   │   ├── StudentManager.tsx       # Student management
│   │   └── TutorManager.tsx         # Tutor management
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All interface definitions
│   └── utils/               # Utility functions
│       └── storage.ts       # Local storage management
├── android/                 # Android Capacitor project
├── ios/                     # iOS Capacitor project
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🎯 Key Components

### TutorManager
- **Purpose:** Manage tutor profiles, qualifications, and availability
- **Features:** CRUD operations, search/filter, subject management
- **Data:** Name, email, phone, subjects, hourly rate, bio, qualifications

### StudentManager  
- **Purpose:** Manage student and parent/guardian information
- **Features:** CRUD operations, grade levels, subject interests
- **Data:** Student details, parent contacts, grades, subjects, notes

### ClassScheduler
- **Purpose:** Schedule and manage tutoring sessions
- **Features:** One-time/recurring classes, status management, rescheduling
- **Data:** Tutor-student pairing, subject, date/time, duration, location

### PaymentTracker
- **Purpose:** Track payments and financial management
- **Features:** Payment status, overdue alerts, multiple payment methods
- **Data:** Amount, due date, payment method, status, class association

### NotificationCenter
- **Purpose:** Manage reminders and notification settings
- **Features:** Class reminders, payment alerts, configurable settings
- **Data:** Reminder types, delivery methods, timing preferences

## 🛠️ Technologies Used

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Mobile:** Capacitor
- **Storage:** Capacitor Preferences (local storage)
- **Build:** Next.js build system

## 📋 Data Models

### Core Interfaces

- **Tutor:** Profile, subjects, rates, availability
- **Student:** Personal info, parent contacts, subjects
- **Class:** Scheduling info, participants, status, payments
- **Payment:** Amount, dates, status, methods
- **Reminder:** Type, timing, delivery preferences
- **NotificationSettings:** Preferences for all notifications

## 🎨 UI/UX Features

- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Modern Interface:** Clean, professional design
- **Intuitive Navigation:** Tab-based navigation with clear sections
- **Real-time Updates:** Dynamic stats and status updates
- **Search & Filter:** Comprehensive search across all entities
- **Status Indicators:** Visual status badges and color coding
- **Form Validation:** Client-side validation for all forms

## 🔄 Workflow Examples

### Scheduling a Class
1. Navigate to Class Scheduler
2. Select tutor and student
3. Choose date, time, and duration
4. Set subject and location
5. Save (creates automatic payment if needed)

### Payment Management
1. Complete a class (mark as completed)
2. Add payment entry for the class
3. Track payment status (pending → paid)
4. Handle overdue payments with alerts

### Setting up Reminders
1. Configure notification settings
2. Set reminder timing (minutes/hours/days before)
3. Choose delivery methods (email/SMS)
4. Auto-generated reminders for classes and payments

## 🚀 Deployment Options

### Cloudflare Pages (Recommended)
- Static export optimized for Cloudflare
- Fast global CDN delivery
- Easy GitHub integration

### Mobile App Stores
- Build with Capacitor for iOS/Android
- Native mobile experience
- Offline storage capabilities

### Self-Hosted
- Any static hosting provider
- Vercel, Netlify, AWS S3, etc.

## 📄 License

This project is part of the TrackEnds tools suite.

## 🤝 Contributing

This is a personal project within the TrackEnds ecosystem. For improvements or feature requests, please create issues or pull requests in the main tools repository.

## 📞 Support

For questions about this tutor scheduling app or the broader TrackEnds suite, please refer to the main tools repository documentation.
