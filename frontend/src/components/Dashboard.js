import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventAPI, examAPI } from '../services/api'; // Add these
import { Card, Container, Row, Col, Alert, Table, Badge, ProgressBar,Button } from 'react-bootstrap';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEvents: 0,
        upcomingExams: 0,
        recentActivities: []
    });
    const [upcomingExams, setUpcomingExams] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch events
            const eventsRes = await eventAPI.getAll();
            const upcomingEvents = eventsRes.data.filter(event => 
                new Date(event.date) >= new Date()
            );
            setRecentEvents(eventsRes.data.slice(0, 3));
            
            // Fetch exams
            const examsRes = await examAPI.getUpcoming();
            setUpcomingExams(examsRes.data.slice(0, 3));
            
            setStats({
                totalEvents: eventsRes.data.length,
                upcomingExams: examsRes.data.length,
                recentActivities: []
            });
        } catch (error) {
            console.error('Dashboard data error:', error);
        }
    };

    return (
        <Container className="mt-4">
            {/* Welcome Alert */}
            <Alert variant="info" className="shadow">
                <h4>👋 Welcome back, {user?.username}!</h4>
                <p className="mb-0">
                    You are logged in as <Badge bg="primary">{user?.role}</Badge>. 
                    Last login: {new Date().toLocaleDateString()}
                </p>
            </Alert>

            {/* Quick Stats Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center shadow border-primary">
                        <Card.Body>
                            <h1>📊</h1>
                            <Card.Title>Total Events</Card.Title>
                            <h2>{stats.totalEvents}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow border-warning">
                        <Card.Body>
                            <h1>📚</h1>
                            <Card.Title>Upcoming Exams</Card.Title>
                            <h2>{stats.upcomingExams}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow border-success">
                        <Card.Body>
                            <h1>✅</h1>
                            <Card.Title>Tasks Completed</Card.Title>
                            <h2>12</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow border-info">
                        <Card.Body>
                            <h1>👥</h1>
                            <Card.Title>Active Users</Card.Title>
                            <h2>156</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Upcoming Exams Section */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow">
                        <Card.Header className="bg-warning text-dark">
                            <h5>📚 Upcoming Exams</h5>
                        </Card.Header>
                        <Card.Body>
                            {upcomingExams.length > 0 ? (
                                <Table hover size="sm">
                                    <tbody>
                                        {upcomingExams.map(exam => (
                                            <tr key={exam.id}>
                                                <td>
                                                    <strong>{exam.course_code}</strong><br/>
                                                    <small>{exam.exam_name}</small>
                                                </td>
                                                <td>
                                                    {new Date(exam.exam_date).toLocaleDateString()}<br/>
                                                    <small>{exam.start_time}</small>
                                                </td>
                                                <td>
                                                    <Badge bg="warning" text="dark">
                                                        {exam.room_number}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted">No upcoming exams</p>
                            )}
                            <Button variant="outline-warning" size="sm" href="/exams">
                                View All Exams →
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Recent Events Section */}
                <Col md={6}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <h5>📅 Recent Events</h5>
                        </Card.Header>
                        <Card.Body>
                            {recentEvents.length > 0 ? (
                                <Table hover size="sm">
                                    <tbody>
                                        {recentEvents.map(event => (
                                            <tr key={event.id}>
                                                <td>
                                                    <strong>{event.title}</strong><br/>
                                                    <small>{event.location}</small>
                                                </td>
                                                <td>
                                                    {new Date(event.date).toLocaleDateString()}<br/>
                                                    <small>{event.time}</small>
                                                </td>
                                                <td>
                                                    <Badge bg="primary">
                                                        {event.creator_name}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted">No recent events</p>
                            )}
                            <Button variant="outline-primary" size="sm" href="/events">
                                View All Events →
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Card className="shadow">
                <Card.Header className="bg-dark text-white">
                    <h5>⚡ Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3} className="text-center">
                            <Button variant="outline-primary" className="w-100 mb-2" href="/events">
                                📅 Create Event
                            </Button>
                        </Col>
                        <Col md={3} className="text-center">
                            <Button variant="outline-success" className="w-100 mb-2" href="/exams">
                                📚 Schedule Exam
                            </Button>
                        </Col>
                        <Col md={3} className="text-center">
                            <Button variant="outline-info" className="w-100 mb-2" href="/profile">
                                👤 Edit Profile
                            </Button>
                        </Col>
                        <Col md={3} className="text-center">
                            {user?.role === 'admin' && (
                                <Button variant="outline-danger" className="w-100 mb-2" href="/admin">
                                    ⚙️ Admin Panel
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Dashboard;