import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercept requests and attach authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Auth Services
export const authAPI = {
  registerCandidate: (data) => api.post('/auth/register', data),
  registerCompany: (data) => api.post('/auth/register-company', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Jobs Services
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobBySlug: (slug) => api.get(`/jobs/${slug}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  applyToJob: (id, data) => api.post(`/jobs/${id}/apply`, data),
  toggleSaveJob: (id) => api.post(`/jobs/${id}/save`),
  getSavedJobs: () => api.get('/jobs/saved'),
};

// Candidate Services
export const candidateAPI = {
  getProfile: () => api.get('/candidates/profile'),
  updateProfile: (data) => api.put('/candidates/profile', data),
  getDashboard: () => api.get('/candidates/dashboard'),
  uploadResume: (formData) =>
    api.post('/candidates/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getResumes: () => api.get('/candidates/resumes'),
  deleteResume: (id) => api.delete(`/candidates/resume/${id}`),
  getApplications: () => api.get('/candidates/applications'),
  getRecommendations: () => api.get('/candidates/recommendations'),
};

// Company Services
export const companyAPI = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  getDashboard: () => api.get('/companies/dashboard'),
  getJobs: () => api.get('/companies/jobs'),
  getApplicants: (params) => api.get('/companies/applicants', { params }),
};

// Application Services
export const applicationAPI = {
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  shortlist: (id, data) => api.post(`/applications/${id}/shortlist`, data),
  reject: (id, data) => api.post(`/applications/${id}/reject`, data),
  scheduleInterview: (id, data) => api.post(`/applications/${id}/interview`, data),
  getInterviews: () => api.get('/applications/interviews'),
};

// AI Services
export const aiAPI = {
  analyzeResume: (data) => api.post('/ai/resume/analyze', data),
  improveResume: (data) => api.post('/ai/resume/improve', data),
  matchJob: (data) => api.post('/ai/matching/jobs', data),
  matchCandidates: (data) => api.post('/ai/matching/candidates', data),
};

// Admin Services
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (id, data) => api.patch(`/admin/users/${id}/status`, data),
  getCompanies: () => api.get('/admin/companies'),
  toggleCompanyVerification: (id) => api.patch(`/admin/companies/${id}/verify`),
  getJobs: () => api.get('/admin/jobs'),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getReports: () => api.get('/admin/reports'),
};

// Support Services
export const supportAPI = {
  createTicket: (data) => api.post('/support/tickets', data),
  getTicketStatus: (ticketId) => api.get(`/support/tickets/${ticketId}`),
  getFaqs: (params) => api.get('/support/faqs', { params }),
};

export default api;
