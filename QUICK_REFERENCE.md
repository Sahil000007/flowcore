# FlowCore Quick Reference

## 🚀 Access the Running System

### Frontend Application
**URL**: http://localhost:5173

### Backend API
**URL**: http://localhost:8080/api

### Database
**Host**: localhost:3307
**Database**: flowcore_db
**User**: root
**Password**: root

---

## 🔐 Test Credentials

```
Username: admin | Password: admin123 | Role: Administrator
Username: supervisor | Password: supervisor123 | Role: Supervisor  
Username: contractor | Password: contractor123 | Role: Contractor
Username: worker | Password: worker123 | Role: Worker
```

---

## 📱 Main Features

### 1. Dashboard
- Overview statistics
- Recent workers and sites
- Quick access to all modules

### 2. Workers Module
- **Add Worker**: Create new worker record
- **View Workers**: List all workers with details
- **Edit Worker**: Modify worker information
- **Delete Worker**: Remove worker from system
- **Fields**: Name, Phone, Skill, Daily Wage, Joining Date, Emergency Contact

### 3. Sites Module
- **Add Site**: Create new construction project
- **View Sites**: List all projects
- **Edit Site**: Update project details
- **Delete Site**: Remove project
- **Fields**: Project Name, Location, Client, Budget, Status, Supervisor Info

### 4. Attendance Module
- **Mark Attendance**: Record daily attendance
- **View Records**: See all attendance history
- **Edit Record**: Update attendance status
- **Delete Record**: Remove attendance record
- **Statuses**: PRESENT, ABSENT, HALF_DAY, OVERTIME, LEAVE

### 5. Salary Module
- **Create Salary**: Generate salary record
- **Calculate**: Automatic net salary calculation
- **View Salary**: List all salary records
- **Edit Salary**: Modify salary details
- **Payment Status**: PENDING, APPROVED, PAID, CANCELLED

### 6. Settings
- User profile management
- Password change
- Preferences
- Session management

---

## 🔌 API Quick Test

### Login (Get JWT Token)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {...}
}
```

### Get All Workers
```bash
curl -X GET http://localhost:8080/api/workers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create New Worker
```bash
curl -X POST http://localhost:8080/api/workers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "skill": "Electrician",
    "dailyWage": 500,
    "joiningDate": "2026-05-22"
  }'
```

### Get All Sites
```bash
curl -X GET http://localhost:8080/api/sites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🗄️ Database Quick Access

```bash
# Connect to database
mysql -u root -p -h localhost -P 3307

# Use database
USE flowcore_db;

# View users
SELECT username, role FROM users;

# View workers count
SELECT COUNT(*) as total_workers FROM workers;

# View sites count
SELECT COUNT(*) as total_sites FROM sites;

# View recent attendance
SELECT * FROM attendance ORDER BY date DESC LIMIT 10;

# View salary records
SELECT sr.*, w.name FROM salary_records sr 
JOIN workers w ON sr.worker_id = w.id 
ORDER BY sr.payroll_date DESC LIMIT 10;
```

---

## 📝 Common Tasks

### Add a New Worker
1. Click "Workers" in sidebar
2. Click "Add Worker" button
3. Fill the form:
   - Name: Worker's full name
   - Phone: Contact number
   - Skill: Type of work (Electrician, Carpenter, etc.)
   - Daily Wage: Daily rate
   - Joining Date: Start date
4. Click "Add Worker"

### Assign Worker to Site
1. Go to Sites or Attendance
2. Create attendance/assignment record
3. Select Worker and Site
4. Save

### Calculate Worker Salary
1. Go to Salary page
2. Click "Add Salary Record"
3. Select Worker
4. Enter:
   - Month
   - Days Worked
   - Total Wage
   - Advance (optional)
   - Deduction (optional)
5. Net Amount calculates automatically
6. Click "Add Salary Record"

### Generate Report
1. Go to Salary page
2. Use date filters if available
3. Export data (if available)

### Update Worker Status
1. Go to Workers page
2. Click Edit on any worker
3. Modify details
4. Click "Update Worker"

---

## 🐛 Troubleshooting

### Cannot Login
- Verify correct credentials
- Check backend is running on port 8080
- Check database connection
- Clear browser cache and try again

### API Returns 401 Unauthorized
- Get new token using login endpoint
- Token may have expired (24 hours)
- Check Authorization header format: `Bearer TOKEN`

### Frontend Cannot Connect to Backend
- Ensure backend running on :8080
- Check CORS configuration
- Check browser console for errors
- Verify firewall not blocking port 8080

### Database Connection Failed
- Check MySQL is running
- Verify connection details:
  - Host: localhost
  - Port: 3307
  - User: root
  - Password: root
- Check database exists: `SHOW DATABASES;`

### Out of Memory Error
- Increase Java heap size:
  ```bash
  java -Xmx1024m -jar flowcore-backend-1.0.0.jar
  ```

---

## 📊 Data Structure

### Worker
```json
{
  "id": 1,
  "name": "John Doe",
  "phone": "9876543210",
  "skill": "Electrician",
  "dailyWage": 500,
  "joiningDate": "2026-05-22",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "9123456789",
  "notes": "Optional notes"
}
```

### Site
```json
{
  "id": 1,
  "projectName": "Office Building",
  "location": "Downtown",
  "startDate": "2026-05-22",
  "endDate": "2026-12-31",
  "clientName": "ABC Corp",
  "budget": 1000000,
  "totalWorkers": 10,
  "supervisorName": "John Manager",
  "supervisorPhone": "8765432109",
  "status": "ACTIVE",
  "description": "Description"
}
```

### Attendance
```json
{
  "id": 1,
  "worker": {...},
  "site": {...},
  "date": "2026-05-22",
  "status": "PRESENT",
  "hoursWorked": 8,
  "overtimeHours": 0,
  "remarks": "Optional remarks"
}
```

### Salary Record
```json
{
  "id": 1,
  "worker": {...},
  "payrollDate": "2026-05-01",
  "daysWorked": 20,
  "totalWage": 10000,
  "advance": 2000,
  "deduction": 500,
  "netAmount": 7500,
  "status": "PENDING",
  "remarks": "Optional remarks"
}
```

---

## 🔐 Security Notes

1. **JWT Token**: Valid for 24 hours
2. **Password**: Change default credentials in production
3. **CORS**: Restricted to localhost:5173 in development
4. **HTTPS**: Use in production only
5. **Database**: Change default root password in production

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| PROJECT_COMPLETION.md | Complete project overview |
| DEPLOYMENT_GUIDE.md | How to run and manage the system |
| E2E_TESTING.md | Step-by-step testing procedures |
| PRODUCTION_BUILD_GUIDE.md | Build and deploy to production |
| TESTING_GUIDE.md | API endpoint testing |
| README.md | Project introduction |

---

## ⚡ Performance Tips

### Frontend
- Close unnecessary browser tabs
- Clear cache if slow: DevTools > Application > Clear storage
- Use modern browser (Chrome/Firefox)

### Backend
- Monitor database queries
- Check system resources
- Review logs for errors

### Database
- Run backups regularly
- Clean up old records periodically
- Optimize indexes for large datasets

---

## 🆘 Getting Help

1. Check documentation files
2. Review backend logs (server console)
3. Check frontend logs (F12 → Console)
4. Verify database connection
5. Check API endpoints with Postman/curl

---

## 📞 Common Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 8080 | http://localhost:8080 |
| MySQL | 3307 | localhost:3307 |

---

## ✅ Status Check

Run this to verify all systems:

```bash
# Check backend (should return 200)
curl http://localhost:8080/api/auth/me

# Check frontend (should load HTML)
curl http://localhost:5173

# Check database
mysql -u root -p flowcore_db -e "SELECT 1;"
```

All should succeed without errors.

---

**Last Updated**: May 22, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
