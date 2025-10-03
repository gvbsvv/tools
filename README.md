# TrackEnds Tools Collection

This repository contains multiple mobile and web applications built with Next.js and Capacitor for cross-platform deployment.

## Applications

### 1. Expense Tracker App
A comprehensive expense tracking application with data visualization and analytics.

**Features:**
- Track income and expenses
- Categorize transactions  
- Visual charts and statistics
- Cross-platform (Web, Android, iOS)

**Live Demo:** [expenses.trackends.com](https://expenses.trackends.com) *(coming soon)*

### 2. Task Management App
A productivity-focused task management application with organizational features.

**Features:**
- Create and manage tasks
- Category-based organization
- Task statistics and progress tracking
- Cross-platform (Web, Android, iOS)

**Live Demo:** [remind.trackends.com](https://remind.trackends.com) *(coming soon)*

## Tech Stack

- **Frontend:** Next.js 15 with TypeScript
- **Styling:** Tailwind CSS
- **Mobile:** Capacitor for Android & iOS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Deployment:** Cloudflare Pages

## Project Structure

```
tools/
├── expense-tracker-app/          # Expense tracking application
│   ├── src/
│   │   ├── app/                 # Next.js app router
│   │   ├── components/          # React components
│   │   └── utils/               # Utility functions
│   ├── android/                 # Android Capacitor project
│   ├── ios/                     # iOS Capacitor project
│   └── package.json
├── task-management-app/          # Task management application
│   ├── src/
│   │   ├── app/                 # Next.js app router
│   │   ├── components/          # React components
│   │   └── utils/               # Utility functions
│   ├── android/                 # Android Capacitor project
│   ├── ios/                     # iOS Capacitor project
│   └── package.json
└── README.md
```

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gvbsvv/tools.git
cd tools
```

2. Install dependencies for both applications:
```bash
# Expense Tracker App
cd expense-tracker-app
npm install

# Task Management App  
cd ../task-management-app
npm install
```

### Running the Applications

#### Web Development
```bash
# Expense Tracker
cd expense-tracker-app
npm run dev

# Task Management
cd task-management-app  
npm run dev
```

#### Mobile Development
```bash
# Build and sync with Capacitor
npm run cap:build

# Open in Android Studio
npm run cap:android

# Open in Xcode (macOS only)
npm run cap:ios
```

### Building for Production

#### Web Build
```bash
npm run build
```
This creates an optimized static export in the `out/` directory.

#### Mobile Build
```bash
npm run cap:build
```
This builds the web assets and copies them to the native mobile projects.

## Deployment

### Web Deployment (Cloudflare Pages)
Both applications are configured for static export and deployed to Cloudflare Pages:

- **Expense Tracker:** `expenses.trackends.com`
- **Task Management:** `remind.trackends.com`

### Mobile Deployment
- **Android:** Build APK/AAB through Android Studio
- **iOS:** Build IPA through Xcode and deploy via App Store Connect

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

- GitHub: [@gvbsvv](https://github.com/gvbsvv)
- Website: [trackends.com](https://trackends.com)
