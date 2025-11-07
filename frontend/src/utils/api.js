import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Services

// Auth Services
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// AI Services
export const aiAPI = {
  generateContent: (data) => api.post('/ai/generate-content', data),
  summarize: (data) => api.post('/ai/summarize', data),
  chat: (data) => api.post('/ai/chat', data),
  analyzeResume: (data) => api.post('/ai/analyze-resume', data),
  themeRecommendation: (data) => api.post('/ai/theme-recommendation', data),
  analyticsSummary: (data) => api.post('/ai/analytics-summary', data),
};

// Career Services
export const careerAPI = {
  getJobs: (params) => api.get('/career/jobs', { params }),
  getJob: (id) => api.get(`/career/jobs/${id}`),
  createJob: (data) => api.post('/career/jobs', data),
  updateJob: (id, data) => api.put(`/career/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/career/jobs/${id}`),
  applyJob: (jobId, formData) => api.post(`/career/apply/${jobId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getApplications: (params) => api.get('/career/applications', { params }),
  getApplication: (id) => api.get(`/career/applications/${id}`),
  updateApplicationStatus: (id, data) => api.put(`/career/applications/${id}/status`, data),
};

// Jobs Services (New API)
export const jobsAPI = {
  getJobs: () => api.get('/jobs'),
  getJob: (id) => api.get(`/jobs/${id}`),
  seedJobs: () => api.post('/jobs/seed'),
  applyJob: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  getApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
};

// Contact Services
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getContacts: (params) => api.get('/contact', { params }),
  getContact: (id) => api.get(`/contact/${id}`),
  updateContact: (id, data) => api.put(`/contact/${id}`, data),
  deleteContact: (id) => api.delete(`/contact/${id}`),
};

// Blog Services
export const blogAPI = {
  getBlogs: (params) => api.get('/blog', { params }),
  getBlog: (slug) => api.get(`/blog/${slug}`),
  createBlog: (data) => api.post('/blog', data),
  updateBlog: (id, data) => api.put(`/blog/${id}`, data),
  deleteBlog: (id) => api.delete(`/blog/${id}`),
  likeBlog: (id) => api.post(`/blog/${id}/like`),
  generateSummary: (id, data) => api.post(`/blog/${id}/generate-summary`, data),
  generateSEO: (data) => api.post('/blog/generate-seo', data),
};

// Content Services
export const contentAPI = {
  getSiteContent: (params) => api.get('/content/site', { params }),
  updateSiteContent: (section, data) => api.put(`/content/site/${section}`, data),
  
  getProjects: (params) => api.get('/content/projects', { params }),
  getProject: (id) => api.get(`/content/projects/${id}`),
  createProject: (data) => api.post('/content/projects', data),
  updateProject: (id, data) => api.put(`/content/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/content/projects/${id}`),
  
  getTestimonials: (params) => api.get('/content/testimonials', { params }),
  getTestimonial: (id) => api.get(`/content/testimonials/${id}`),
  createTestimonial: (data) => api.post('/content/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/content/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/content/testimonials/${id}`),
};

// Analytics Services
export const analyticsAPI = {
  trackPageView: (data) => api.post('/analytics/track', data),
  trackConversion: (data) => api.post('/analytics/conversion', data),
  getAnalytics: (params) => api.get('/analytics', { params }),
  getSummary: () => api.get('/analytics/summary'),
};
