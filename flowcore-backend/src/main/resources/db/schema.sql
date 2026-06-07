-- FlowCore Database Schema Initialization
-- This script sets up the database structure and initial data

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    skill VARCHAR(100) NOT NULL,
    aadhaar_id VARCHAR(20) UNIQUE,
    daily_wage DECIMAL(10, 2) NOT NULL,
    joining_date DATE NOT NULL,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    INDEX idx_phone (phone),
    INDEX idx_skill (skill),
    INDEX idx_active (active),
    INDEX idx_aadhaar (aadhaar_id)
);

-- Create sites table
CREATE TABLE IF NOT EXISTS sites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    client_name VARCHAR(255) NOT NULL,
    budget DECIMAL(15, 2) NOT NULL,
    total_workers INT NOT NULL,
    supervisor_name VARCHAR(255),
    supervisor_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    description TEXT,
    INDEX idx_status (status),
    INDEX idx_project_name (project_name),
    INDEX idx_client (client_name)
);

-- Create worker_assignments table
CREATE TABLE IF NOT EXISTS worker_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    site_id BIGINT NOT NULL,
    assignment_date DATE NOT NULL,
    completion_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    INDEX idx_worker (worker_id),
    INDEX idx_site (site_id),
    INDEX idx_status (status)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    site_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    hours_worked DECIMAL(5, 2),
    overtime_hours INT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (worker_id, site_id, attendance_date),
    INDEX idx_worker (worker_id),
    INDEX idx_site (site_id),
    INDEX idx_date (attendance_date),
    INDEX idx_status (status)
);

-- Create salary_records table
CREATE TABLE IF NOT EXISTS salary_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    payroll_date DATE NOT NULL,
    days_worked INT NOT NULL,
    basic_wage DECIMAL(10, 2) NOT NULL,
    overtime_amount DECIMAL(10, 2),
    advances DECIMAL(10, 2),
    deductions DECIMAL(10, 2),
    net_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_date DATE,
    payment_method VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    INDEX idx_worker (worker_id),
    INDEX idx_payroll_date (payroll_date),
    INDEX idx_payment_status (payment_status)
);

-- Insert sample admin user (password: password)
INSERT INTO users (username, password, email, first_name, last_name, role, active) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBS/O.', 'admin@flowcore.com', 'Admin', 'User', 'ADMIN', true)
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample supervisor user (password: password)
INSERT INTO users (username, password, email, first_name, last_name, role, active) 
VALUES ('supervisor', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBS/O.', 'supervisor@flowcore.com', 'John', 'Supervisor', 'SUPERVISOR', true)
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample contractor user (password: password)
INSERT INTO users (username, password, email, first_name, last_name, role, active) 
VALUES ('contractor', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBS/O.', 'contractor@flowcore.com', 'Jane', 'Contractor', 'CONTRACTOR', true)
ON DUPLICATE KEY UPDATE username=username;
