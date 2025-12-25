Campus Hub - Full Stack Web Platform
Project Overview
Campus Hub is a secure, multi-module web platform for academic environments built with React, Node.js, and MySQL as part of COMP 453 - Full Stack Development course requirements.

Features
User Authentication System with role-based access (Student/Teacher/Admin)
Event Management Module with full CRUD operations
Exam Scheduling Module for academic timetable management
Session-based authentication using HTTP-only cookies
Responsive UI design with Bootstrap
RESTful API architecture
MySQL database with proper relationships

Technology Stack
Frontend: React 18.2.0, Bootstrap 5.3.2
Backend: Node.js, Express.js
Database: MySQL 8.0
Authentication: Express-session, bcryptjs
API Client: Axios

Prerequisites
XAMPP (Apache, MySQL, phpMyAdmin)
Node.js (v16 or higher)
Git

Installation Guide
1. XAMPP Setup
Download and install XAMPP from https://www.apachefriends.org/
Start Apache and MySQL services from XAMPP Control Panel
Open phpMyAdmin at http://localhost/phpmyadmin

2. Project Setup
# Clone repository
git clone https://github.com/fasihullahsaeed729-wq/campus-hub.git
cd campus-hub

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
3. Database Configuration
Open phpMyAdmin: http://localhost/phpmyadmin

Create new database: campus_hub

Import database schema: database/schema.sql

4. Environment Configuration
Backend (.env file in backend/):
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=campus_hub
SESSION_SECRET=your_session_secret_key
PORT=5000

5. Running the Application
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm start
Access URLs
Frontend Application: http://localhost:3000
Backend API: http://localhost:5000
phpMyAdmin: http://localhost/phpmyadmin

Default Users
Admin: email: admin@campus.edu, password: admin123
Teacher: email: teacher@campus.edu, password: teacher123
Student: email: student@campus.edu, password: student123

API Endpoints
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/events - Get all events
POST /api/events - Create event (Teacher/Admin only)
GET /api/exams - Get all exams
POST /api/exams - Schedule exam (Admin only)

Project Structure
text
campus-hub/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
├── database/         # SQL schema and sample data
└── README.md        # This file
Testing
Register a new user with different roles
Login with credentials
Test event creation (Teacher/Admin roles)
Test exam scheduling (Admin role only)
Verify role-based access restrictions

Troubleshooting
Common Issues:
MySQL Connection Error: Ensure XAMPP MySQL is running
Port Already in Use: Change PORT in .env file or kill process using port 5000/3000
CORS Errors: Verify backend CORS configuration allows localhost:3000
Session Not Persisting: Check cookie settings and withCredentials: true in API calls
Windows Specific:
cmd
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000
Deployment Notes
For local deployment only. For production deployment, consider:

Environment variable security
HTTPS implementation
Database backup strategy
Load balancing for multiple users

GitHub Repository
https://github.com/fasihullahsaeed729-wq/campus-hub.git
