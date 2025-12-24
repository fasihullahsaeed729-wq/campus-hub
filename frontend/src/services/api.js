import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true // Important for sessions
});

// Request interceptor to add auth token if using JWT
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;

// Auth services
export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    logout: () => API.post('/auth/logout'),
    checkSession: () => API.get('/auth/session')
};

// Event services (example module)
export const eventAPI = {
    getAll: () => API.get('/events'),
    create: (eventData) => API.post('/events', eventData),
    update: (id, eventData) => API.put(`/events/${id}`, eventData),
    delete: (id) => API.delete(`/events/${id}`)
};

// Add Exam
export const examAPI = {
    getAll: () => API.get('/exams'),
    getUpcoming: () => API.get('/exams/upcoming'),
    getByCourse: (code) => API.get(`/exams/course/${code}`),
    create: (examData) => API.post('/exams', examData),
    update: (id, examData) => API.put(`/exams/${id}`, examData),
    delete: (id) => API.delete(`/exams/${id}`)
};