CREATE DATABASE IF NOT EXISTS campus_hub;
USE campus_hub;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(200),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100),
    table_name VARCHAR(50),
    record_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_name VARCHAR(200) NOT NULL,
    course_code VARCHAR(50),
    course_name VARCHAR(200),
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    building VARCHAR(100),
    total_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 40,
    examiner_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Sample data
INSERT INTO exams (exam_name, course_code, course_name, exam_date, start_time, end_time, room_number, building, examiner_id, created_by) 
VALUES 
('Final Exam - Database Systems', 'CS-301', 'Database Systems', '2025-12-25', '09:00:00', '12:00:00', 'LAB-5', 'CS Building', 1, 1),
('Mid Term - Web Development', 'CS-453', 'Full Stack Development', '2025-12-20', '14:00:00', '16:00:00', 'Room-202', 'Main Building', 2, 1);