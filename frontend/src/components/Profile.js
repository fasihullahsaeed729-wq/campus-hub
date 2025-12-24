import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Form, Button, Alert } from 'react-bootstrap';

const Profile = () => {
    const { user } = useAuth();
    
    return (
        <Container className="mt-4">
            <h2>👤 My Profile</h2>
            <Card>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" value={user?.username || ''} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={user?.email || ''} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" value={user?.role || ''} readOnly />
                        </Form.Group>
                        <Button variant="primary">Update Profile (Coming Soon)</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;