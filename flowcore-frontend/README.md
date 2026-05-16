# FlowCore Frontend - Contractor Management System

A modern React-based web application for managing contractors, sites, attendance, and payroll.

## Features

- **Worker Management**: Create, update, and manage worker profiles with skills and daily wages
- **Site Management**: Track multiple construction/development sites with project details
- **Attendance Tracking**: Record and monitor worker attendance with status options
- **Salary Management**: Complete payroll system with advances, deductions, and net calculations
- **User Authentication**: Secure login with JWT-based authentication
- **Settings & Profile**: User profile management and system preferences
- **Dashboard**: Overview of key metrics and statistics

## Tech Stack

- **Frontend Framework**: React 18.2
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Top navigation
│   ├── Sidebar.jsx     # Side navigation
│   └── common.jsx      # Common components (Button, Modal, etc.)
├── context/            # React Context for state management
│   └── AuthContext.jsx # Authentication context
├── hooks/              # Custom React hooks
│   └── index.js        # useForm, useFetch, usePagination, useToast, useLocalStorage
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Workers.jsx     # Worker management
│   ├── Sites.jsx       # Site management
│   ├── Attendance.jsx  # Attendance tracking
│   ├── Salary.jsx      # Payroll management
│   └── Settings.jsx    # User settings
├── services/           # API service modules
│   ├── api.js          # Main API client with Axios
│   └── attendanceService.js # Attendance API calls
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions (formatting, validation, etc.)
├── constants.js        # Application constants
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## Installation

1. **Clone the repository**
```bash
cd d:\CRM\flowcore\flowcore-frontend
```

2. **Install dependencies**
```bash
npm install
```

## Running the Application

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Configuration

The application communicates with the backend API at `http://localhost:8080/api`. In development, requests are proxied through Vite.

### API Endpoints

- **Authentication**
  - `POST /auth/login` - User login
  - `GET /auth/me` - Get current user

- **Workers**
  - `GET /workers` - List all workers
  - `GET /workers/:id` - Get worker details
  - `POST /workers` - Create worker
  - `PUT /workers/:id` - Update worker
  - `DELETE /workers/:id` - Delete worker

- **Sites**
  - `GET /sites` - List all sites
  - `GET /sites/:id` - Get site details
  - `POST /sites` - Create site
  - `PUT /sites/:id` - Update site
  - `DELETE /sites/:id` - Delete site

- **Attendance**
  - `GET /attendance` - List all attendance records
  - `POST /attendance` - Create attendance record
  - `PUT /attendance/:id` - Update attendance
  - `DELETE /attendance/:id` - Delete attendance

- **Salary**
  - `GET /salary` - List all salary records
  - `POST /salary` - Create salary record
  - `PUT /salary/:id` - Update salary
  - `DELETE /salary/:id` - Delete salary

## Demo Credentials

For testing purposes, use:
- **Username**: admin
- **Password**: admin123

## Key Features

### Authentication
- JWT-based authentication
- Auto-login recovery from localStorage
- Protected routes

### State Management
- React Context for global auth state
- Component-level state with hooks
- Custom hooks for common patterns

### UI Components
- Reusable button, modal, alert, badge, card components
- Loading spinners and pagination
- Responsive design with Tailwind CSS

### Utilities
- Date formatting and currency formatting
- Status color mapping
- Form validation helpers
- localStorage helpers

## Custom Hooks

- `useFetch(fetchFn, dependencies)` - For async data fetching
- `useForm(initialValues, onSubmit)` - For form state management
- `usePagination(items, pageSize)` - For pagination logic
- `useToast()` - For toast notifications
- `useLocalStorage(key, initialValue)` - For localStorage management

## Best Practices

1. **API Calls**: Centralize all API calls in the `services/` folder
2. **Reusable Components**: Use components from `common.jsx` for consistency
3. **Utilities**: Use helper functions from `utils/helpers.js` for common operations
4. **Form Handling**: Use `useForm` hook for form state management
5. **Error Handling**: Always wrap API calls in try-catch blocks

## Styling

The application uses Tailwind CSS with a custom color scheme:
- Primary: Blue (#0066cc)
- Secondary: Cyan (#00d4ff)
- Danger: Red (#ff3333)
- Success: Green (#00cc44)
- Warning: Yellow (#ffcc00)

## Environment Variables

Create a `.env` file in the project root (if needed for production builds):

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=FlowCore
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### API Connection Issues
Ensure the backend server is running on `http://localhost:8080` and CORS is properly configured.

### Module Not Found
Run `npm install` again to ensure all dependencies are installed correctly.

## Contributing

1. Follow the existing code structure and naming conventions
2. Use the custom hooks and utility functions
3. Create reusable components in the `components/` folder
4. Keep components focused and single-responsibility

## License

Proprietary - FlowCore Contractor Management System

## Support

For support or issues, contact the development team.
