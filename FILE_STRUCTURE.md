# FlowCore Frontend - Final File Structure

```
flowcore-frontend/
├── .env.example                    # Environment variables template
├── .eslintrc.cjs                  # ESLint configuration
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── package-lock.json             # Dependency lock file
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.js                # Vite configuration
├── README.md                      # Project documentation
│
└── src/
    ├── main.jsx                  # React application entry point
    ├── App.jsx                   # Main application component with routing
    ├── index.css                 # Global styles
    ├── constants.js              # Application constants
    │
    ├── components/               # Reusable UI components
    │   ├── Header.jsx            # Top navigation bar
    │   ├── Sidebar.jsx           # Side navigation menu
    │   ├── ErrorBoundary.jsx     # Error boundary component
    │   ├── common.jsx            # Common components (Button, Modal, Alert, etc.)
    │   └── FormComponents.jsx    # Form input components
    │
    ├── context/                  # React Context
    │   └── AuthContext.jsx       # Authentication context
    │
    ├── pages/                    # Page components
    │   ├── Login.jsx             # Login page
    │   ├── Dashboard.jsx         # Dashboard page
    │   ├── Workers.jsx           # Workers management page
    │   ├── Sites.jsx             # Sites management page
    │   ├── Attendance.jsx        # Attendance tracking page
    │   ├── Salary.jsx            # Salary/Payroll management page
    │   └── Settings.jsx          # Settings page
    │
    ├── services/                 # API services
    │   ├── api.js                # Main API client with Axios
    │   └── attendanceService.js  # Attendance specific API client
    │
    ├── hooks/                    # Custom React hooks
    │   └── index.js              # useFetch, useForm, usePagination, useToast, useLocalStorage
    │
    ├── utils/                    # Utility functions
    │   └── helpers.js            # Helper functions and storage utilities
    │
    └── types/                    # TypeScript types (if needed)
```

## Component Documentation

### Pages
| Page | File | Status | Description |
|------|------|--------|-------------|
| Login | Login.jsx | ✅ Complete | Authentication form with demo credentials |
| Dashboard | Dashboard.jsx | ✅ Complete | Overview with statistics and widgets |
| Workers | Workers.jsx | ✅ Complete | CRUD operations for workers |
| Sites | Sites.jsx | ✅ Complete | CRUD operations for construction sites |
| Attendance | Attendance.jsx | ✅ Complete | Record and manage attendance |
| Salary | Salary.jsx | ✅ Complete | Payroll management with calculations |
| Settings | Settings.jsx | ✅ Complete | User profile and preferences |

### Components
| Component | File | Status | Type |
|-----------|------|--------|------|
| Header | Header.jsx | ✅ Complete | Navigation |
| Sidebar | Sidebar.jsx | ✅ Complete | Navigation |
| ErrorBoundary | ErrorBoundary.jsx | ✅ Complete | Error Handling |
| LoadingSpinner | common.jsx | ✅ Complete | UI |
| Button | common.jsx | ✅ Complete | UI |
| Alert | common.jsx | ✅ Complete | UI |
| Badge | common.jsx | ✅ Complete | UI |
| Card | common.jsx | ✅ Complete | UI |
| Modal | common.jsx | ✅ Complete | UI |
| Pagination | common.jsx | ✅ Complete | UI |
| Table | common.jsx | ✅ Complete | UI |
| Tooltip | common.jsx | ✅ Complete | UI |
| FormInput | FormComponents.jsx | ✅ Complete | Form |
| FormSelect | FormComponents.jsx | ✅ Complete | Form |
| FormTextArea | FormComponents.jsx | ✅ Complete | Form |
| FormCheckbox | FormComponents.jsx | ✅ Complete | Form |

### Services
| Service | File | Status | Endpoints |
|---------|------|--------|-----------|
| Authentication | api.js | ✅ Complete | login, getCurrentUser |
| Workers | api.js | ✅ Complete | getAll, getById, create, update, delete, getBySkill |
| Sites | api.js | ✅ Complete | getAll, getById, create, update, delete |
| Attendance | api.js & attendanceService.js | ✅ Complete | getAll, getById, create, update, delete |
| Salary | api.js | ✅ Complete | getAll, getById, create, update, delete, getByWorker, getByDateRange |

### Custom Hooks
| Hook | File | Status | Description |
|------|------|--------|-------------|
| useFetch | hooks/index.js | ✅ Complete | Async data fetching with loading/error states |
| useForm | hooks/index.js | ✅ Complete | Form state management with validation |
| usePagination | hooks/index.js | ✅ Complete | Pagination logic |
| useToast | hooks/index.js | ✅ Complete | Toast notification system |
| useLocalStorage | hooks/index.js | ✅ Complete | localStorage hook |

### Utility Functions
| Function | File | Status | Description |
|----------|------|--------|-------------|
| formatDate | utils/helpers.js | ✅ Complete | Format dates to readable format |
| formatCurrency | utils/helpers.js | ✅ Complete | Format currency amounts |
| capitalize | utils/helpers.js | ✅ Complete | Capitalize strings |
| formatStatus | utils/helpers.js | ✅ Complete | Format status strings |
| debounce | utils/helpers.js | ✅ Complete | Debounce function |
| validateEmail | utils/helpers.js | ✅ Complete | Email validation |
| validatePhone | utils/helpers.js | ✅ Complete | Phone validation |
| getStatusColor | utils/helpers.js | ✅ Complete | Get status badge colors |
| calculateAttendancePercentage | utils/helpers.js | ✅ Complete | Calculate attendance percentage |
| calculateDaysBetween | utils/helpers.js | ✅ Complete | Calculate days between dates |
| getErrorMessage | utils/helpers.js | ✅ Complete | Parse API error messages |
| storage | utils/helpers.js | ✅ Complete | localStorage helper methods |

## Data Models

### Worker
```javascript
{
  id: number,
  name: string,
  phone: string,
  skill: string,
  dailyWage: number,
  joiningDate: date,
  aadhaarId?: string,
  active: boolean
}
```

### Site
```javascript
{
  id: number,
  projectName: string,
  location: string,
  startDate: date,
  endDate?: date,
  clientName: string,
  budget: number,
  totalWorkers: number,
  supervisorName: string,
  supervisorPhone: string,
  status: enum (ACTIVE, COMPLETED, ON_HOLD, CANCELLED),
  description?: string
}
```

### Attendance
```javascript
{
  id: number,
  workerId: number,
  siteId: number,
  attendanceDate: date,
  status: enum (PRESENT, ABSENT, HALF_DAY, OVERTIME, LEAVE),
  hoursWorked: number,
  overtimeHours: number,
  remarks?: string
}
```

### Salary
```javascript
{
  id: number,
  workerId: number,
  month: string (YYYY-MM),
  daysWorked: number,
  totalWage: number,
  advance: number,
  deduction: number,
  netAmount: number,
  status: enum (PENDING, APPROVED, PAID, CANCELLED),
  remarks?: string
}
```

### User
```javascript
{
  id: number,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  role: enum (ADMIN, MANAGER, SUPERVISOR, WORKER)
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd flowcore-frontend
npm install
```

### 2. Configure Environment (Optional)
Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication
- `POST /auth/login` - Login with credentials
- `GET /auth/me` - Get current user info

### Workers
- `GET /workers` - Get all workers
- `GET /workers/:id` - Get worker by ID
- `POST /workers` - Create new worker
- `PUT /workers/:id` - Update worker
- `DELETE /workers/:id` - Delete worker
- `GET /workers/skill/:skill` - Get workers by skill

### Sites
- `GET /sites` - Get all sites
- `GET /sites/:id` - Get site by ID
- `POST /sites` - Create new site
- `PUT /sites/:id` - Update site
- `DELETE /sites/:id` - Delete site

### Attendance
- `GET /attendance` - Get all attendance records
- `GET /attendance/:id` - Get attendance by ID
- `POST /attendance` - Create new attendance
- `PUT /attendance/:id` - Update attendance
- `DELETE /attendance/:id` - Delete attendance

### Salary
- `GET /salary` - Get all salary records
- `GET /salary/:id` - Get salary by ID
- `POST /salary` - Create new salary record
- `PUT /salary/:id` - Update salary record
- `DELETE /salary/:id` - Delete salary record
- `GET /salary/worker/:workerId` - Get salary by worker
- `GET /salary/report?startDate=&endDate=` - Get salary report by date range

## Demo Credentials
```
Username: admin
Password: admin123
```

## Features Checklist

### Pages & Routing ✅
- [x] Login page with authentication
- [x] Dashboard with statistics
- [x] Workers management page
- [x] Sites management page
- [x] Attendance tracking page
- [x] Salary/Payroll management page
- [x] Settings page
- [x] Protected routes with auth check
- [x] Default redirect to dashboard

### Authentication ✅
- [x] Login form
- [x] Token-based authentication
- [x] Auto-login from localStorage
- [x] Logout functionality
- [x] Protected routes
- [x] Request interceptors for auth

### Worker Module ✅
- [x] View all workers
- [x] Add new worker
- [x] Edit worker information
- [x] Delete worker
- [x] Search/filter workers
- [x] Display worker list in table

### Site Module ✅
- [x] View all sites
- [x] Add new site
- [x] Edit site information
- [x] Delete site
- [x] Track project budget
- [x] Monitor site status
- [x] Display site details in table

### Attendance Module ✅
- [x] Record attendance
- [x] Edit attendance records
- [x] Delete attendance records
- [x] Track hours worked
- [x] Record overtime hours
- [x] Add remarks/notes
- [x] Status options (Present, Absent, Half-day, Overtime, Leave)
- [x] Display attendance in table

### Salary Module ✅
- [x] View all salary records
- [x] Add new salary record
- [x] Edit salary information
- [x] Delete salary record
- [x] Calculate net amount (Total - Advance - Deduction)
- [x] Track salary status (Pending, Approved, Paid, Cancelled)
- [x] Monthly payroll summary
- [x] Worker selection from dropdown
- [x] Status badges with colors

### Settings Module ✅
- [x] Profile management
- [x] Password change
- [x] Notification preferences
- [x] Session management
- [x] Application information

### UI/UX Components ✅
- [x] Header/Navigation bar
- [x] Sidebar navigation
- [x] Responsive design
- [x] Loading spinners
- [x] Modal dialogs
- [x] Alert messages
- [x] Status badges
- [x] Tables for data display
- [x] Forms with validation
- [x] Error boundary
- [x] Buttons with variants
- [x] Tooltips

### Utilities & Helpers ✅
- [x] Date formatting
- [x] Currency formatting
- [x] Email validation
- [x] Phone validation
- [x] Status color mapping
- [x] Authentication token management
- [x] API error handling
- [x] localStorage helpers

### Configuration ✅
- [x] Vite configuration
- [x] Tailwind CSS setup
- [x] ESLint configuration
- [x] Axios configuration
- [x] Environment variables
- [x] PostCSS configuration

### Documentation ✅
- [x] README.md with setup instructions
- [x] Component documentation
- [x] API endpoints documentation
- [x] File structure documentation
- [x] Completion summary

## Performance Optimizations
- Lazy loading with React Router
- Component memoization
- Efficient re-renders
- Debounced search/filter
- Optimized Tailwind CSS

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Features
- JWT token-based authentication
- Protected routes
- Request authorization headers
- Error message masking in production
- Client-side form validation

## Code Quality
- ESLint configuration
- Consistent naming conventions
- Modular component architecture
- Reusable utilities and hooks
- Comprehensive error handling

## Accessibility Features
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Focus management
