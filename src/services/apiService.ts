// API Service for Backend Communication
import { API_BASE_URL, API_ENDPOINTS, getHeaders, REQUEST_TIMEOUT } from '@/config/api';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const token = getToken();
    const headers = {
      ...getHeaders(token || undefined),
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // Return the data directly if it already has success property
    // This prevents double-wrapping the backend response
    if (data.success !== undefined) {
      return data;
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout - please try again',
      };
    }

    return {
      success: false,
      error: error.message || 'Network error - please check your connection',
    };
  }
}

// Health Check
export const healthCheck = async () => {
  return apiRequest(API_ENDPOINTS.health);
};

// Authentication (no token needed for these)
export const authService = {
  login: async (username: string, password: string) => {
    return apiRequest(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (userData: any) => {
    return apiRequest(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Research Questions
export const questionsService = {
  list: async (params?: { language?: string; category?: string; active?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.language) queryParams.append('language', params.language);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.active !== undefined) queryParams.append('active', String(params.active));

    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.questions.list}?${query}` : API_ENDPOINTS.questions.list;

    return apiRequest(endpoint);
  },

  create: async (questionData: any) => {
    return apiRequest(API_ENDPOINTS.questions.create, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  update: async (id: string, questionData: any) => {
    return apiRequest(API_ENDPOINTS.questions.update(id), {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(API_ENDPOINTS.questions.delete(id), {
      method: 'DELETE',
    });
  },
};

// Research Responses
export const responsesService = {
  list: async (
    params?: {
      page?: number;
      limit?: number;
      type?: 'ussd' | 'voice';
      includeAI?: boolean;
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.type) queryParams.append('type', params.type);
    if (params?.includeAI !== undefined) queryParams.append('includeAI', String(params.includeAI));

    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.responses.list}?${query}` : API_ENDPOINTS.responses.list;

    return apiRequest(endpoint);
  },

  single: async (id: string) => {
    return apiRequest(API_ENDPOINTS.responses.single(id));
  },

  export: async (format: 'csv' | 'json') => {
    return apiRequest(`${API_ENDPOINTS.responses.export}?format=${format}`);
  },
};

// Analytics
export const analyticsService = {
  summary: async (
    params?: {
      startDate?: string;
      endDate?: string;
      granularity?: 'day' | 'week' | 'month';
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.granularity) queryParams.append('granularity', params.granularity);

    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.analytics.summary}?${query}` : API_ENDPOINTS.analytics.summary;

    return apiRequest(endpoint);
  },
};

// AI Processing
export const aiService = {
  process: async (limit?: number) => {
    const endpoint = limit ? `${API_ENDPOINTS.ai.process}?limit=${limit}` : API_ENDPOINTS.ai.process;
    
    return apiRequest(endpoint, {
      method: 'POST',
    });
  },

  status: async () => {
    return apiRequest(API_ENDPOINTS.ai.status);
  },
};

// SMS Service
export const smsService = {
  sendThankYou: async (data: { phoneNumber: string; language: string; questionTitle: string }) => {
    return apiRequest(API_ENDPOINTS.sms.thankYou, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  sendInvite: async (data: { phoneNumber: string; language: string; researchTitle: string }) => {
    return apiRequest(API_ENDPOINTS.sms.invite, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  statistics: async () => {
    return apiRequest(API_ENDPOINTS.sms.statistics);
  },
};

// ── Projects Service (multi-tenant) ──────────────────────────────────────────
export const projectsService = {
  list: async () => apiRequest(API_ENDPOINTS.projects.list),

  get: async (id: string) => apiRequest(API_ENDPOINTS.projects.get(id)),

  create: async (data: { title: string; description?: string }) =>
    apiRequest(API_ENDPOINTS.projects.create, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: async (id: string, data: Partial<{ title: string; description: string; is_active: boolean }>) =>
    apiRequest(API_ENDPOINTS.projects.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: async (id: string) =>
    apiRequest(API_ENDPOINTS.projects.delete(id), { method: 'DELETE' }),

  getQuestions: async (id: string) => apiRequest(API_ENDPOINTS.projects.questions(id)),

  getResponses: async (id: string) => apiRequest(API_ENDPOINTS.projects.responses(id)),

  submitResponse: async (
    projectId: string,
    data: { question_id: string; phone_number: string; response_text: string; name?: string; audio_url?: string }
  ) =>
    apiRequest(API_ENDPOINTS.projects.submitResponse(projectId), {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAISummary: async (id: string, question_id?: string) => {
    const ep = question_id
      ? `${API_ENDPOINTS.projects.aiSummary(id)}?question_id=${question_id}`
      : API_ENDPOINTS.projects.aiSummary(id);
    return apiRequest(ep);
  },

  generateAI: async (id: string, question_id?: string) =>
    apiRequest(API_ENDPOINTS.projects.generateAI(id), {
      method: 'POST',
      body: JSON.stringify({ question_id }),
    }),
};
