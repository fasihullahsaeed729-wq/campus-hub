import React from 'react';
import { Card, Container, Row, Col, Table, Button } from 'react-bootstrap';

const AdminPanel = () => {
    return (
        <Container className="mt-4">
            <h2>⚙️ Admin Panel</h2>
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>👥 Users</Card.Title>
                            <Card.Text>Manage all users</Card.Text>
                            <Button variant="primary">Manage Users</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>📊 Reports</Card.Title>
                            <Card.Text>View system reports</Card.Text>
                            <Button variant="success">View Reports</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>⚙️ Settings</Card.Title>
                            <Card.Text>System configuration</Card.Text>
                            <Button variant="warning">System Settings</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPanel;