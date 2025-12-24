import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Events from './components/Events';
import ExamSchedule from './components/ExamSchedule';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }
    return children;
};

// Navigation Component
const Navigation = () => {
    const { user, logout } = useAuth();
    
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow" fixed="top">
            <Container>
                <Navbar.Brand href="/" className="fw-bold">
                    🏛️ Campus Hub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <>
                                <Nav.Link href="/dashboard">🏠 Dashboard</Nav.Link>
                                <Dropdown as={Nav.Item}>
                                    <Dropdown.Toggle as={Nav.Link}>📋 Modules</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="/events">📅 Events</Dropdown.Item>
                                        <Dropdown.Item href="/exams">📚 Exam Schedule</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="/profile">👤 My Profile</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {user.role === 'admin' && (
                                    <Dropdown as={Nav.Item}>
                                        <Dropdown.Toggle as={Nav.Link}>⚙️ Admin</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/admin">Dashboard</Dropdown.Item>
                                            <Dropdown.Item href="/admin/users">User Management</Dropdown.Item>
                                            <Dropdown.Item href="/admin/reports">Reports</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                                    👤 {user.username} ({user.role})
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                                    <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={logout}>🚪 Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <Nav.Link href="/login" className="me-2">
                                    🔑 Login
                                </Nav.Link>
                                <Button variant="success" href="/register">
                                    📝 Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <Navigation />
                    <Container fluid className="flex-grow-1 mt-5 pt-3">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            {/* Protected Routes */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/events" element={
                                <ProtectedRoute>
                                    <Events />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/exams" element={
                                <ProtectedRoute>
                                    <ExamSchedule />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/admin" element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminPanel />
                                </ProtectedRoute>
                            } />
                            
                            {/* Default Route */}
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            
                            {/* Error Routes */}
                            <Route path="/unauthorized" element={
                                <div className="d-flex align-items-center justify-content-center min-vh-100">
                                    <Container className="text-center">
                                        <h1 className="text-danger">⛔ 401 - Unauthorized</h1>
                                        <p className="lead">You don't have permission to access this page.</p>
                                        <Button href="/dashboard" variant="primary">
                                            Go to Dashboard
                                        </Button>
                                    </Container>
                                </div>
                            } />
                            
                            <Route path="*" element={
                                <div className="d-flex align-items-center justify-content-center min-vh-100">
                                    <Container className="text-center">
                                        <h1 className="text-warning">🔍 404 - Page Not Found</h1>
                                        <p className="lead">The page you're looking for doesn't exist.</p>
                                        <Button href="/dashboard" variant="primary">
                                            Go to Dashboard
                                        </Button>
                                    </Container>
                                </div>
                            } />
                        </Routes>
                    </Container>
                    
                    {/* Footer */}
                    <footer className="py-3 bg-light text-center border-top mt-auto">
                        <Container>
                            <p className="mb-0 text-muted">
                                © 2025 Campus Hub - Full Stack Development Project | 
                                Pak-Austria Fachhochschule | COMP 453
                            </p>
                            <small className="text-muted">
                                Developed with using React, Node.js & MySQL
                            </small>
                        </Container>
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;