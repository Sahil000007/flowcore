# FlowCore - Deployment & Operations Guide

## Current Status: PRODUCTION READY ✅

### Services Running
- **Backend API**: http://localhost:8080
- **Frontend Web**: http://localhost:5173
- **Database**: MySQL 8.0 on localhost:3307

## Development Quick Start

### Prerequisites
- Java 17+ (for backend)
- Node.js 18+ (for frontend)
- MySQL 8.0+

### Starting the System

#### 1. Start Backend Server
```bash
cd flowcore-backend
java -jar target/flowcore-backend-1.0.0.jar
```
Backend runs on **http://localhost:8080**

#### 2. Start Frontend Dev Server
```bash
cd flowcore-frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

### Default Test Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator |
| supervisor | supervisor123 | Supervisor |
| contractor | contractor123 | Contractor |
| worker | worker123 | Worker |

## API Endpoints

### Authentication
```
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user (protected)
POST   /api/auth/logout         - Logout user
```

### Workers
```
GET    /api/workers             - List all workers
POST   /api/workers             - Create worker
GET    /api/workers/{id}        - Get worker details
PUT    /api/workers/{id}        - Update worker
DELETE /api/workers/{id}        - Delete worker
GET    /api/workers/skill/{skill}  - Find by skill
```

### Sites
```
GET    /api/sites               - List all sites
POST   /api/sites               - Create site
GET    /api/sites/{id}          - Get site details
PUT    /api/sites/{id}          - Update site
DELETE /api/sites/{id}          - Delete site
```

### Attendance
```
GET    /api/attendance          - List all attendance records
POST   /api/attendance          - Create attendance record
GET    /api/attendance/{id}     - Get record details
PUT    /api/attendance/{id}     - Update record
DELETE /api/attendance/{id}     - Delete record
GET    /api/attendance/worker/{workerId}  - Get by worker
GET    /api/attendance/site/{siteId}      - Get by site
```

### Salary
```
GET    /api/salary              - List all salary records
POST   /api/salary              - Create salary record
GET    /api/salary/{id}         - Get record details
PUT    /api/salary/{id}         - Update salary record
DELETE /api/salary/{id}         - Delete record
GET    /api/salary/worker/{workerId}     - Get by worker
GET    /api/salary/report?startDate=...&endDate=...  - Date range report
```

## Database Setup

### Create Database
```sql
CREATE DATABASE IF NOT EXISTS flowcore_db;
USE flowcore_db;
-- Tables auto-created by Hibernate on first run
```

### Database Tables
- `users` - User authentication data
- `workers` - Worker information
- `sites` - Project/site information
- `attendance` - Daily attendance records
- `wage_records` - Worker assignments and wages
- `salary_records` - Salary calculations and payments

## Environment Configuration

### Backend (application.properties)
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3307/flowcore_db
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=FlowCore_JWT_Secret_Key_2026_...
jwt.expiration=86400000

# CORS
server.cors.allowed-origins=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=FlowCore
```

## Production Deployment

### Backend (Docker)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/flowcore-backend-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend Build
```bash
npm run build
# Outputs to dist/ directory
# Deploy to: Vercel, Netlify, or static hosting
```

### Cloud Deployment Options

#### Option 1: Heroku + Vercel
1. Backend → Heroku with MySQL add-on
2. Frontend → Vercel with build optimization

#### Option 2: AWS
1. Backend → EC2 + RDS (MySQL)
2. Frontend → CloudFront + S3

#### Option 3: Azure
1. Backend → App Service
2. Database → Azure Database for MySQL
3. Frontend → Static Web Apps

## Monitoring & Logging

### Backend Logs
Location: Application console output
Debug logs at: `com.flowcore` package

### Frontend Logs
- Browser console (F12)
- Application tab for storage/cookies
- Network tab for API calls

## Troubleshooting

### Backend Issues

**Issue**: Database connection refused
```
Solution: Ensure MySQL is running on port 3307
Command: mysql -u root -p
```

**Issue**: Port 8080 already in use
```
Solution: Kill process or use different port
Windows: netstat -ano | findstr :8080
Then: taskkill /PID <PID> /F
```

### Frontend Issues

**Issue**: Cannot connect to backend API
```
Solution: Check VITE_API_URL in .env
Verify backend is running on port 8080
Check CORS configuration in backend
```

**Issue**: npm install fails
```
Solution: Clear npm cache
npm cache clean --force
npm install
```

## Performance Optimization

### Backend
- Enable database query caching
- Implement pagination for large datasets
- Add API rate limiting
- Setup request/response compression

### Frontend
- Lazy load components (React.lazy)
- Optimize images and assets
- Enable gzip compression
- Minimize bundle size (npm run build)

## Security Checklist

- [ ] Change default JWT secret in production
- [ ] Use HTTPS in production
- [ ] Enable CORS for specific domains only
- [ ] Implement rate limiting
- [ ] Use environment variables for sensitive data
- [ ] Setup database backups
- [ ] Enable WAF/DDoS protection
- [ ] Regular security audits

## Backup & Recovery

### Database Backup
```bash
mysqldump -u root -p flowcore_db > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
mysql -u root -p flowcore_db < backup_20260522.sql
```

## Maintenance Tasks

### Weekly
- Check application logs for errors
- Monitor database performance
- Verify backups are running

### Monthly
- Update dependencies (`npm update`, Maven updates)
- Review and update security patches
- Performance optimization review

### Quarterly
- Database optimization/cleanup
- Code quality review
- Security audit

## Support & Documentation

- **Issue Tracker**: GitHub Issues
- **API Documentation**: Swagger (add springdoc-openapi for auto-docs)
- **Frontend Documentation**: Component storybook (future)
- **Database Schema**: See generated Hibernate schema

## Version Information

- **Node.js**: 18+
- **Java**: 17+
- **MySQL**: 8.0+
- **React**: 18.2.0
- **Spring Boot**: 3.3.5
- **Vite**: 5.0.0

## Contact & Support

For issues, questions, or suggestions:
- Check existing documentation
- Review application logs
- File issue on GitHub
- Contact development team

---

**Last Updated**: May 22, 2026
**Status**: Production Ready ✅
