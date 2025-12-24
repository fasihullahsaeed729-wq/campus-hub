import React, { useState, useEffect } from 'react';
import { examAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Table, Button, Modal, Form, Alert, Card, Badge } from 'react-bootstrap';

const ExamSchedule = () => {
    const [exams, setExams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [formData, setFormData] = useState({
        exam_name: '',
        course_code: '',
        course_name: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        room_number: '',
        building: '',
        total_marks: 100,
        passing_marks: 40,
        examiner_id: ''
    });
    const [error, setError] = useState('');
    
    const { user } = useAuth();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await examAPI.getAll();
            setExams(response.data);
        } catch (err) {
            setError('Failed to load exam schedule');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (editingExam) {
                await examAPI.update(editingExam.id, formData);
            } else {
                await examAPI.create(formData);
            }
            fetchExams();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this exam schedule?')) return;
        
        try {
            await examAPI.delete(id);
            fetchExams();
        } catch (err) {
            setError('Delete failed. Admin access required.');
        }
    };

    const handleEdit = (exam) => {
        setEditingExam(exam);
        setFormData({
            exam_name: exam.exam_name,
            course_code: exam.course_code,
            course_name: exam.course_name,
            exam_date: exam.exam_date,
            start_time: exam.start_time,
            end_time: exam.end_time,
            room_number: exam.room_number,
            building: exam.building,
            total_marks: exam.total_marks,
            passing_marks: exam.passing_marks,
            examiner_id: exam.examiner_id || ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingExam(null);
        setFormData({
            exam_name: '',
            course_code: '',
            course_name: '',
            exam_date: '',
            start_time: '',
            end_time: '',
            room_number: '',
            building: '',
            total_marks: 100,
            passing_marks: 40,
            examiner_id: ''
        });
    };

    // Check if exam is upcoming
    const isUpcoming = (examDate) => {
        const today = new Date();
        const exam = new Date(examDate);
        return exam >= today;
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>📅 Exam Schedule</h2>
                {user?.role === 'admin' && (
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        + Schedule Exam
                    </Button>
                )}
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            {/* Upcoming Exams Card */}
            <Card className="mb-4">
                <Card.Header className="bg-warning text-dark">
                    <h5>⚠️ Upcoming Exams</h5>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Exam</th>
                                <th>Course</th>
                                <th>Date & Time</th>
                                <th>Venue</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.filter(exam => isUpcoming(exam.exam_date)).map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.exam_name}</td>
                                    <td>{exam.course_code} - {exam.course_name}</td>
                                    <td>
                                        {new Date(exam.exam_date).toLocaleDateString()} <br/>
                                        {exam.start_time} to {exam.end_time}
                                    </td>
                                    <td>{exam.building}, Room {exam.room_number}</td>
                                    <td>
                                        <Badge bg="warning" text="dark">
                                            Upcoming
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* All Exams Table */}
            <h4 className="mb-3">All Exams</h4>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Exam Name</th>
                        <th>Course</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Venue</th>
                        <th>Marks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map(exam => (
                        <tr key={exam.id}>
                            <td>{exam.exam_name}</td>
                            <td>
                                <div><strong>{exam.course_code}</strong></div>
                                <small>{exam.course_name}</small>
                            </td>
                            <td>{new Date(exam.exam_date).toLocaleDateString()}</td>
                            <td>{exam.start_time} - {exam.end_time}</td>
                            <td>
                                {exam.building}<br/>
                                <small>Room: {exam.room_number}</small>
                            </td>
                            <td>
                                Total: {exam.total_marks}<br/>
                                Pass: {exam.passing_marks}
                            </td>
                            <td>
                                {user?.role === 'admin' && (
                                    <>
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleEdit(exam)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleDelete(exam.id)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingExam ? 'Edit Exam Schedule' : 'Schedule New Exam'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Exam Name *</Form.Label>
                                    <Form.Control
                                        value={formData.exam_name}
                                        onChange={(e) => setFormData({...formData, exam_name: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Code *</Form.Label>
                                    <Form.Control
                                        value={formData.course_code}
                                        onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Name *</Form.Label>
                                    <Form.Control
                                        value={formData.course_name}
                                        onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Exam Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.exam_date}
                                        onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Time *</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Time *</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Building</Form.Label>
                                    <Form.Control
                                        value={formData.building}
                                        onChange={(e) => setFormData({...formData, building: e.target.value})}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room Number</Form.Label>
                                    <Form.Control
                                        value={formData.room_number}
                                        onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                                    />
                                </Form.Group>
                                <div className="row">
                                    <div className="col">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Total Marks</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formData.total_marks}
                                                onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Passing Marks</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formData.passing_marks}
                                                onChange={(e) => setFormData({...formData, passing_marks: e.target.value})}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingExam ? 'Update' : 'Schedule Exam'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ExamSchedule;