import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Worker endpoints
export const workerService = {
  getAll: () => api.get('/workers'),
  getById: (id) => api.get(`/workers/${id}`),
  create: (worker) => api.post('/workers', worker),
  update: (id, worker) => api.put(`/workers/${id}`, worker),
  delete: (id) => api.delete(`/workers/${id}`),
  getBySkill: (skill) => api.get(`/workers/skill/${skill}`),
};

// Site endpoints
export const siteService = {
  getAll: () => api.get('/sites'),
  getById: (id) => api.get(`/sites/${id}`),
  create: (site) => api.post('/sites', site),
  update: (id, site) => api.put(`/sites/${id}`, site),
  delete: (id) => api.delete(`/sites/${id}`),
};

export default api;
