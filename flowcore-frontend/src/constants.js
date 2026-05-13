/**
 * Data model constants and shape definitions
 * These define the structure of data used throughout the application
 */

export const WORKER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
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
