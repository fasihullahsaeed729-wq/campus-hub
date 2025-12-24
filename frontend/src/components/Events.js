import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: ''
    });
    const [error, setError] = useState('');
    
    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventAPI.getAll();
            setEvents(response.data);
        } catch (err) {
            setError('Failed to load events');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (editingEvent) {
                await eventAPI.update(editingEvent.id, formData);
            } else {
                await eventAPI.create(formData);
            }
            fetchEvents();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        
        try {
            await eventAPI.delete(id);
            fetchEvents();
        } catch (err) {
            setError('Delete failed. Admin access required.');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: ''
        });
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>Event Management</h2>
                {user && (
                    <Button onClick={() => setShowModal(true)}>
                        Create Event
                    </Button>
                )}
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Created By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{event.title}</td>
                            <td>{new Date(event.date).toLocaleDateString()}</td>
                            <td>{event.time}</td>
                            <td>{event.location}</td>
                            <td>{event.creator_name}</td>
                            <td>
                                <Button 
                                    variant="warning" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleEdit(event)}
                                    disabled={user?.role !== 'admin' && user?.id !== event.created_by}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(event.id)}
                                    disabled={user?.role !== 'admin'}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Create/Edit */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingEvent ? 'Edit Event' : 'Create Event'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingEvent ? 'Update' : 'Create'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Events;