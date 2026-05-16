import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const attendanceService = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to headers
attendanceService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const attendanceApi = {
  getAll: () => attendanceService.get('/attendance'),
  getById: (id) => attendanceService.get(`/attendance/${id}`),
  create: (payload) => attendanceService.post('/attendance', payload),
  update: (id, payload) => attendanceService.put(`/attendance/${id}`, payload),
  delete: (id) => attendanceService.delete(`/attendance/${id}`),
};

export default attendanceApi;

