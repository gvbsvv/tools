import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.expensetracker.app',
  appName: 'ExpenseTracker',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Preferences: {
      group: 'ExpenseTracker'
    }
  }
};

export default config;
