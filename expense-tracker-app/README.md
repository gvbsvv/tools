# Expense Tracker

A modern, responsive expense tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ **Add, Edit, and Delete Expenses**: Manage your expenses with a user-friendly interface
- ✅ **Categorization**: Organize expenses into predefined categories (Food, Transportation, Shopping, etc.)
- ✅ **Visual Analytics**: View your spending patterns with interactive charts
- ✅ **Monthly Statistics**: Track current month spending and overall totals
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Local Storage**: Data persists locally in your browser
- ✅ **Real-time Updates**: Instant feedback when adding or modifying expenses

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Development**: ESLint, Turbopack

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Adding Expenses

1. Click the "Add Expense" button
2. Fill in the expense details:
   - Description: Brief description of the expense
   - Amount: Cost of the expense
   - Category: Select from predefined categories
   - Date: When the expense occurred
3. Click "Add Expense" to save

### Managing Expenses

- **Edit**: Click the edit icon (pencil) next to any expense
- **Delete**: Click the delete icon (trash) and confirm deletion
- **View Analytics**: Check the charts section for spending insights

### Categories

The application includes the following expense categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Travel
- Education
- Other

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind CSS
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main page component
├── components/
│   ├── ExpenseChart.tsx # Charts and analytics
│   ├── ExpenseForm.tsx  # Add/edit expense form
│   ├── ExpenseList.tsx  # Expense listing component
│   └── ExpenseStats.tsx # Statistics cards
```

## Key Components

- **ExpenseForm**: Handles adding and editing expenses with form validation
- **ExpenseList**: Displays expenses in a organized list with edit/delete actions
- **ExpenseChart**: Shows pie charts, bar charts, and category breakdowns
- **ExpenseStats**: Displays key metrics like total expenses, monthly spending, and averages

## Data Storage

The application uses localStorage to persist data locally in your browser. This means:
- Data is saved automatically when you add/edit/delete expenses
- Data persists between browser sessions
- Data is specific to the browser and device you're using

## Customization

### Adding New Categories

To add new expense categories, modify the `categories` array in `src/components/ExpenseForm.tsx`:

```typescript
const categories = [
  'Food & Dining',
  'Transportation',
  // Add your new categories here
  'Your New Category',
]
```

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by:
- Modifying the CSS variables in `src/app/globals.css`
- Updating Tailwind classes in individual components
- Extending the Tailwind config in `tailwind.config.ts`

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- 🔄 Data export/import functionality
- 📊 More advanced analytics and reporting
- 💾 Database integration for data persistence
- 👥 Multi-user support
- 📱 Progressive Web App (PWA) features
- 🔔 Spending notifications and budgets
- 📈 Expense forecasting and trends
