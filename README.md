# FlowCore - Contractor Management System

A comprehensive, enterprise-grade contractor workforce management solution built with React, TypeScript, Java Spring Boot, and MySQL.

## Features (MVP)

✅ **Worker Management**
- Add/edit/delete workers
- Track skills and qualifications
- Manage contact information
- Daily wage tracking

✅ **Site/Project Management**
- Create and manage construction sites
- Track project details and client information
- Assign workers to sites
- Budget and cost tracking

✅ **Attendance Tracking**
- Daily attendance marking
- Present/Absent/Half-day/Overtime tracking
- Supervisor updates with remarks
- Attendance reports

✅ **Salary & Wage Management**
- Daily wage calculation
- Overtime tracking
- Advances and deductions
- Pending payment tracking
- Salary slip generation

✅ **Worker Assignment**
- Track worker-to-site assignments
- Monitor active and idle workers
- Assignment status management

✅ **Notifications** (Future)
- WhatsApp/SMS integration for worker payments
- Site updates and alerts
- Payment notifications

## Tech Stack

### Backend
- **Framework**: Java Spring Boot 3.2
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Authentication**: JWT + Spring Security
- **API**: RESTful with CORS support
- **Build**: Maven

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: React Context
- **Routing**: React Router v6

### Deployment
- **Backend**: Render / AWS EC2
- **Frontend**: Vercel / Netlify
- **Version Control**: Git + GitHub

## Project Structure

```
flowcore/
├── flowcore-backend/          # Java Spring Boot REST API
│   ├── src/main/java/com/flowcore/
│   │   ├── config/           # Security & CORS configuration
│   │   ├── controller/       # REST API endpoints
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Data access layer
│   │   ├── service/          # Business logic
│   │   └── security/         # JWT & authentication
│   ├── pom.xml              # Maven dependencies
│   └── application.properties # Configuration
│
├── flowcore-frontend/         # React + TypeScript web application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API client
│   │   ├── context/         # React Context for auth
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # Entry point
│   ├── package.json         # npm dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── tailwind.config.js   # Tailwind CSS config
│
└── .github/                  # GitHub configuration
```

## Getting Started

### Prerequisites
- Java JDK 17+
- MySQL 8.0+
- Node.js 18+
- Git

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd flowcore-backend
   ```

2. **Create MySQL Database**
   ```sql
   CREATE DATABASE flowcore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Configure database** (`application.properties`)
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/flowcore_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

4. **Build and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

Backend will start at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd flowcore-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

Frontend will start at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Workers
- `GET /api/workers` - List all workers
- `POST /api/workers` - Create worker
- `GET /api/workers/{id}` - Get worker details
- `PUT /api/workers/{id}` - Update worker
- `DELETE /api/workers/{id}` - Delete worker
- `GET /api/workers/skill/{skill}` - Get workers by skill

### Sites
- `GET /api/sites` - List all sites
- `POST /api/sites` - Create site
- `GET /api/sites/{id}` - Get site details
- `PUT /api/sites/{id}` - Update site
- `DELETE /api/sites/{id}` - Delete site

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/worker/{workerId}` - Get worker attendance

### Salary
- `GET /api/salary` - List salary records
- `POST /api/salary/calculate` - Calculate salaries
- `GET /api/salary/pending` - Get pending payments

## Demo Credentials

```
Username: admin
Password: admin123
Role: ADMIN
```

## Database Schema

### Key Tables
- `users` - User accounts and roles
- `workers` - Worker information
- `sites` - Construction sites/projects
- `attendance` - Daily attendance records
- `salary_records` - Payroll information
- `worker_assignments` - Worker-site assignments

## Features Coming Soon

- GPS-based attendance tracking
- Selfie-based attendance verification
- QR code check-in
- Mobile app (React Native)
- WhatsApp/SMS notifications
- Advanced analytics and reporting
- Material tracking and inventory management
- File uploads (ID proofs, documents)
- Multi-language support (Hindi, Marathi)

## Development Guidelines

- Use TypeScript for type safety
- Follow REST API conventions
- Use JWT tokens for authentication
- Implement proper error handling
- Add CORS headers for frontend communication
- Use Tailwind CSS for styling
- Keep components small and reusable

## Deployment

### Backend (Render/AWS)
1. Push code to GitHub
2. Connect repository to Render/AWS
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set API endpoint variables
4. Deploy

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

Proprietary - FlowCore Contractor Management System

## Support

For issues and feature requests, please create an issue in the repository.

---

Built with ❤️ for construction contractors
