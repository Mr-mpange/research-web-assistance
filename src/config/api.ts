// API Configuration for Backend Communication

// Backend API URL - Update this with your Google Cloud Run URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://africastalking-api-864580156744.us-central1.run.app';

// API Endpoints
export const API_ENDPOINTS = {
  // Health Check
  health: '/health',
  
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  
  // Research Questions
  questions: {
    list: '/api/questions',
    create: '/api/questions',
    update: (id: string) => `/api/questions/${id}`,
    delete: (id: string) => `/api/questions/${id}`,
    single: (id: string) => `/api/questions/${id}`,
  },
  
  // Research Responses
  responses: {
    list: '/api/responses',
    single: (id: string) => `/api/responses/${id}`,
    export: '/api/responses/export',
  },
  
  // Analytics
  analytics: {
    summary: '/api/analytics',
    trends: '/api/analytics/trends',
    sentiments: '/api/analytics/sentiments',
  },
  
  // AI Processing
  ai: {
    process: '/api/ai/process',
    status: '/api/ai/status',
  },

  // Projects (multi-tenant)
  projects: {
    list: '/api/projects',
    create: '/api/projects',
    get: (id: string) => `/api/projects/${id}`,
    update: (id: string) => `/api/projects/${id}`,
    delete: (id: string) => `/api/projects/${id}`,
    questions: (id: string) => `/api/projects/${id}/questions`,
    responses: (id: string) => `/api/projects/${id}/responses`,
    submitResponse: (id: string) => `/api/projects/${id}/responses`,
    aiSummary: (id: string) => `/api/projects/${id}/ai-summary`,
    generateAI: (id: string) => `/api/projects/${id}/ai-summary/generate`,
    rewards: (id: string) => `/api/projects/${id}/rewards`,
  },
  
  // USSD & Voice (for testing)
  ussd: {
    callback: '/ussd/callback',
    test: '/test/ussd',
  },
  
  voice: {
    callback: '/voice/callback',
    recording: '/voice/recording',
  },
  
  // SMS
  sms: {
    thankYou: '/sms/thank-you',
    invite: '/sms/invite',
    bulk: '/sms/bulk',
    statistics: '/sms/statistics',
  },
};

// Request timeout (30 seconds)
export const REQUEST_TIMEOUT = 30000;

// API Headers
export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
