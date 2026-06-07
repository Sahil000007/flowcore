# FlowCore - End-to-End Testing Guide

## System Status

✅ **Backend**: Running on http://localhost:8080
✅ **Frontend**: Running on http://localhost:5173
✅ **Database**: Connected and initialized
✅ **Both services**: Fully operational

## Testing Checklist

### 1. Authentication Tests

#### Test 1.1: Login with Admin Credentials
- [ ] Open http://localhost:5173
- [ ] Enter username: `admin`
- [ ] Enter password: `admin123`
- [ ] Click "Login"
- [ ] Expected: Redirected to Dashboard

#### Test 1.2: Login with Different Roles
- [ ] Test login with `supervisor` / `supervisor123`
- [ ] Test login with `contractor` / `contractor123`
- [ ] Test login with `worker` / `worker123`
- [ ] Verify each role has appropriate permissions

#### Test 1.3: Logout Functionality
- [ ] Log in as admin
- [ ] Click logout button (top right)
- [ ] Expected: Redirected to login page, localStorage cleared

### 2. Dashboard Tests

#### Test 2.1: Statistics Display
- [ ] Log in as admin
- [ ] Verify statistics show:
  - [ ] Number of workers
  - [ ] Number of sites
  - [ ] Payroll amount
  - [ ] Attendance percentage

#### Test 2.2: Recent Data Display
- [ ] Recent workers section visible
- [ ] Recent sites section visible
- [ ] Data refreshes on page reload

### 3. Workers Management Tests

#### Test 3.1: Create New Worker
- [ ] Navigate to Workers page
- [ ] Click "Add Worker" button
- [ ] Fill form:
  - [ ] Name: "Test Worker 1"
  - [ ] Phone: "9876543210"
  - [ ] Skill: "Electrician"
  - [ ] Daily Wage: "500"
  - [ ] Joining Date: Select current date
  - [ ] Emergency Contact: "Jane Doe"
  - [ ] Emergency Phone: "9123456789"
  - [ ] Notes: "Test worker"
- [ ] Click "Add Worker"
- [ ] Expected: Worker appears in table, success message shown

#### Test 3.2: Display Workers List
- [ ] Navigate to Workers page
- [ ] Verify table displays:
  - [ ] Worker ID
  - [ ] Name
  - [ ] Phone
  - [ ] Skill
  - [ ] Daily Wage
  - [ ] Status
  - [ ] Edit/Delete buttons

#### Test 3.3: Edit Worker
- [ ] Click edit button on any worker
- [ ] Modify details (e.g., change phone number)
- [ ] Click "Update Worker"
- [ ] Expected: Changes reflected in table

#### Test 3.4: Delete Worker
- [ ] Click delete button on any worker
- [ ] Confirm deletion
- [ ] Expected: Worker removed from table

#### Test 3.5: Search/Filter Workers
- [ ] Type in search box (if available)
- [ ] Filter by skill or status
- [ ] Results update in real-time

### 4. Sites Management Tests

#### Test 4.1: Create New Site
- [ ] Navigate to Sites page
- [ ] Click "Add Site" button
- [ ] Fill form:
  - [ ] Project Name: "Test Construction Project"
  - [ ] Location: "Downtown Area"
  - [ ] Start Date: Select a date
  - [ ] End Date: Select future date
  - [ ] Client Name: "ABC Construction Ltd"
  - [ ] Budget: "1000000"
  - [ ] Total Workers: "10"
  - [ ] Supervisor Name: "John Manager"
  - [ ] Supervisor Phone: "8765432109"
  - [ ] Status: "ACTIVE"
  - [ ] Description: "Test site description"
- [ ] Click "Add Site"
- [ ] Expected: Site appears in table

#### Test 4.2: Display Sites List
- [ ] Verify table shows all site information
- [ ] Status badges display correctly
- [ ] Budget formatted as currency

#### Test 4.3: Edit Site
- [ ] Click edit on any site
- [ ] Modify details
- [ ] Update and verify

#### Test 4.4: Delete Site
- [ ] Click delete button
- [ ] Confirm deletion
- [ ] Verify removal from table

### 5. Attendance Tests

#### Test 5.1: Mark Attendance
- [ ] Navigate to Attendance page
- [ ] Click "Add Attendance" button
- [ ] Fill form:
  - [ ] Select Worker: Select any worker
  - [ ] Select Site: Select any site
  - [ ] Date: Select today
  - [ ] Status: "PRESENT"
  - [ ] Hours Worked: "8"
  - [ ] Remarks: "Regular attendance"
- [ ] Click "Add Attendance"
- [ ] Expected: Record appears in table

#### Test 5.2: Attendance Statuses
- [ ] Create records with different statuses:
  - [ ] PRESENT
  - [ ] ABSENT
  - [ ] HALF_DAY
  - [ ] OVERTIME
  - [ ] LEAVE
- [ ] Verify status badges color-code correctly

#### Test 5.3: Edit Attendance
- [ ] Click edit on attendance record
- [ ] Change status or hours
- [ ] Update and verify

#### Test 5.4: Monthly Attendance View (if available)
- [ ] Filter by date range if available
- [ ] View attendance percentage
- [ ] Export report if available

### 6. Salary Management Tests

#### Test 6.1: Create Salary Record
- [ ] Navigate to Salary page
- [ ] Click "Add Salary Record" button
- [ ] Fill form:
  - [ ] Worker: Select any worker
  - [ ] Month: Select current month
  - [ ] Days Worked: "20"
  - [ ] Total Wage: "10000"
  - [ ] Advance: "2000"
  - [ ] Deduction: "500"
- [ ] Verify Net Amount calculation: 10000 - (2000 + 500) = 7500
- [ ] Status: "PENDING"
- [ ] Click "Add Salary Record"
- [ ] Expected: Record appears in table

#### Test 6.2: Salary Calculations
- [ ] Verify automatic calculation:
  - [ ] Net Amount = Total Wage - (Advance + Deduction)
- [ ] Try different values
- [ ] Verify precision (2 decimal places)

#### Test 6.3: Salary Payment Status
- [ ] Create salary record
- [ ] Change status from PENDING to APPROVED
- [ ] Change to PAID
- [ ] Verify status badges update

#### Test 6.4: Edit Salary Record
- [ ] Edit existing salary record
- [ ] Modify amounts
- [ ] Verify recalculation
- [ ] Update and verify

#### Test 6.5: Delete Salary Record
- [ ] Delete salary record
- [ ] Confirm deletion
- [ ] Verify removal

### 7. Error Handling Tests

#### Test 7.1: Validation Errors
- [ ] Try to add worker without filling required fields
- [ ] Expected: Error messages shown
- [ ] Try to add site with invalid budget (negative/text)
- [ ] Expected: Validation error shown

#### Test 7.2: Network Error Handling
- [ ] Stop backend server temporarily
- [ ] Try API call from frontend
- [ ] Expected: Error message displayed to user
- [ ] Restart backend
- [ ] Verify system recovers gracefully

#### Test 7.3: Authorization Errors
- [ ] Try to access endpoints without token
- [ ] Expected: Redirected to login page

### 8. Data Persistence Tests

#### Test 8.1: Reload Page
- [ ] Add new worker/site/attendance
- [ ] Refresh page (F5)
- [ ] Expected: Data persists and displays

#### Test 8.2: Browser Close/Reopen
- [ ] Log in and navigate to different pages
- [ ] Close browser
- [ ] Reopen and navigate to app
- [ ] Expected: Auto-login works (if token valid)

### 9. UI/UX Tests

#### Test 9.1: Responsive Design
- [ ] Test on different screen sizes
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Verify layout adjusts appropriately

#### Test 9.2: Navigation
- [ ] Test all menu links
- [ ] Verify routing works
- [ ] Test breadcrumbs if available

#### Test 9.3: Form Validation
- [ ] Empty required fields
- [ ] Invalid data types
- [ ] Verify error message clarity

### 10. Performance Tests

#### Test 10.1: Load Time
- [ ] Measure page load time
- [ ] Target: < 3 seconds
- [ ] Check network tab in DevTools

#### Test 10.2: API Response Time
- [ ] Monitor network requests
- [ ] Target: API responses < 500ms
- [ ] Check for slow queries

#### Test 10.3: Memory Usage
- [ ] Open DevTools
- [ ] Monitor memory usage
- [ ] Add/delete items
- [ ] Verify no memory leaks

## Database Verification

### Test D1: Database Connection
```bash
mysql -u root -p -h localhost -P 3307
USE flowcore_db;
SHOW TABLES;
```
Expected tables: users, workers, sites, attendance, wage_records, salary_records

### Test D2: Data Initialization
```sql
SELECT COUNT(*) FROM users;           -- Should be 4 (admin, supervisor, contractor, worker)
SELECT COUNT(*) FROM workers;         -- Should be > 0
SELECT COUNT(*) FROM sites;           -- Should be > 0
```

## API Testing (Using Postman/cURL)

### Test API1: Authentication
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
Expected: JWT token in response

### Test API2: Get Workers
```bash
curl -X GET http://localhost:8080/api/workers \
  -H "Authorization: Bearer <token>"
```
Expected: Array of workers

### Test API3: Create Worker
```bash
curl -X POST http://localhost:8080/api/workers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Worker",
    "phone":"9876543210",
    "skill":"Electrician",
    "dailyWage":500,
    "joiningDate":"2026-05-22"
  }'
```

## Test Results Summary

| Test Category | Status | Notes |
|---------------|--------|-------|
| Authentication | ⬜ | To be tested |
| Dashboard | ⬜ | To be tested |
| Workers CRUD | ⬜ | To be tested |
| Sites CRUD | ⬜ | To be tested |
| Attendance | ⬜ | To be tested |
| Salary | ⬜ | To be tested |
| Error Handling | ⬜ | To be tested |
| Data Persistence | ⬜ | To be tested |
| UI/UX | ⬜ | To be tested |
| Performance | ⬜ | To be tested |

**Legend**: ✅ = Passed, ❌ = Failed, ⚠️ = Warning, ⬜ = Not Tested

---

**Instructions**: 
1. Go through each test systematically
2. Mark tests as you complete them
3. Document any issues found
4. For each issue, create a bug report
5. Retest after fixes applied

**Date**: May 22, 2026
**Tested By**: [Your Name]
**Environment**: Local Development (http://localhost:5173)
