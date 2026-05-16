/**
 * Data model constants and shape definitions
 * These define the structure of data used throughout the application
 */

// Worker Status
export const WORKER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
};

// Attendance Status Options
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  HALF_DAY: 'HALF_DAY',
  OVERTIME: 'OVERTIME',
  LEAVE: 'LEAVE',
};

// Site Status Options
export const SITE_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED',
};

// Salary Status Options
export const SALARY_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SUPERVISOR: 'SUPERVISOR',
  WORKER: 'WORKER',
};

// Common API Constants
export const API_BASE_URL = 'http://localhost:8080/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const MONTH_FORMAT = 'YYYY-MM';

// Messages
export const MESSAGES = {
  SUCCESS: 'Operation completed successfully!',
  ERROR: 'Something went wrong. Please try again.',
  CONFIRM_DELETE: 'Are you sure you want to delete this record?',
  NO_DATA: 'No data available.',
  LOADING: 'Loading...',
};

export const SITE_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  HALF_DAY: 'HALF_DAY',
  OVERTIME: 'OVERTIME',
  LEAVE: 'LEAVE',
};

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  CONTRACTOR: 'CONTRACTOR',
  SUPERVISOR: 'SUPERVISOR',
  WORKER: 'WORKER',
};

/**
 * Worker model
 * @typedef {Object} Worker
 * @property {number} [id]
 * @property {string} name
 * @property {string} phone
 * @property {string} skill
 * @property {string} [aadhaarId]
 * @property {number} dailyWage
 * @property {string} joiningDate
 * @property {string} [emergencyContact]
 * @property {string} [emergencyPhone]
 * @property {boolean} active
 * @property {string} [notes]
 */

/**
 * Site model
 * @typedef {Object} Site
 * @property {number} [id]
 * @property {string} projectName
 * @property {string} location
 * @property {string} startDate
 * @property {string} [endDate]
 * @property {string} clientName
 * @property {number} budget
 * @property {number} totalWorkers
 * @property {string} [supervisorName]
 * @property {string} [supervisorPhone]
 * @property {string} status - One of SITE_STATUS values
 * @property {string} [description]
 */

/**
 * Attendance model
 * @typedef {Object} Attendance
 * @property {number} [id]
 * @property {number} workerId
 * @property {number} siteId
 * @property {string} attendanceDate
 * @property {string} status - One of ATTENDANCE_STATUS values
 * @property {number} [hoursWorked]
 * @property {number} [overtimeHours]
 * @property {string} [remarks]
 */

/**
 * User model
 * @typedef {Object} User
 * @property {number} [id]
 * @property {string} username
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} role - One of USER_ROLE values
 */

/**
 * Login request payload
 * @typedef {Object} LoginRequest
 * @property {string} username
 * @property {string} password
 */

/**
 * API Response wrapper
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} [message]
 * @property {*} [data]
 * @property {string} [timestamp]
 */
