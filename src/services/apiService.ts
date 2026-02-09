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

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
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

// Authentication
export const authService = {
  login: async (username: string, password: string) => {
    return apiRequest(API_ENDPOINTS.auth.login, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (userData: any) => {
    return apiRequest(API_ENDPOINTS.auth.register, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
  },
};

// Research Questions
export const questionsService = {
  list: async (params?: { language?: string; category?: string; active?: boolean }, token?: string) => {
    const queryParams = new URLSearchParams();
    if (params?.language) queryParams.append('language', params.language);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.active !== undefined) queryParams.append('active', String(params.active));

    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.questions.list}?${query}` : API_ENDPOINTS.questions.list;

    return apiRequest(endpoint, {
      headers: getHeaders(token),
    });
  },

  create: async (questionData: any, token: string) => {
    return apiRequest(API_ENDPOINTS.questions.create, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(questionData),
    });
  },

  update: async (id: string, questionData: any, token: string) => {
    return apiRequest(API_ENDPOINTS.questions.update(id), {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(questionData),
    });
  },

  delete: async (id: string, token: string) => {
    return apiRequest(API_ENDPOINTS.questions.delete(id), {
      method: 'DELETE',
      headers: getHeaders(token),
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
    },
    token?: string
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.type) queryParams.append('type', params.type);
    if (params?.includeAI !== undefined) queryParams.append('includeAI', String(params.includeAI));

    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.responses.list}?${query}` : API_ENDPOINTS.responses.list;

    return apiRequest(endpoint, {
      headers: getHeaders(token),
    });
  },

  single: async (id: string, token: string) => {
    return apiRequest(API_ENDPOINTS.responses.single(id), {
      headers: getHeaders(token),
    });
  },

  export: async (format: 'csv' | 'json', token: string) => {
    return apiRequest(`${API_ENDPOINTS.responses.export}?format=${format}`, {
      headers: getHeaders(token),
    });
  },
};

// Analytics
export const analyticsService = {
  summary: async (
    params?: {
      startDate?: string;
      endDate?: string;
      granularity?: 'day' | 'week' | 'month';
    },
    token?: string
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.granularity) queryParams.append('granularity', params.granularity);

    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.analytics.summary}?${query}` : API_ENDPOINTS.analytics.summary;

    return apiRequest(endpoint, {
      headers: getHeaders(token),
    });
  },
};

// AI Processing
export const aiService = {
  process: async (limit?: number, token?: string) => {
    const endpoint = limit ? `${API_ENDPOINTS.ai.process}?limit=${limit}` : API_ENDPOINTS.ai.process;
    
    return apiRequest(endpoint, {
      method: 'POST',
      headers: getHeaders(token),
    });
  },

  status: async (token?: string) => {
    return apiRequest(API_ENDPOINTS.ai.status, {
      headers: getHeaders(token),
    });
  },
};

// SMS Service
export const smsService = {
  sendThankYou: async (data: { phoneNumber: string; language: string; questionTitle: string }, token: string) => {
    return apiRequest(API_ENDPOINTS.sms.thankYou, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
  },

  sendInvite: async (data: { phoneNumber: string; language: string; researchTitle: string }, token: string) => {
    return apiRequest(API_ENDPOINTS.sms.invite, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
  },

  statistics: async (token: string) => {
    return apiRequest(API_ENDPOINTS.sms.statistics, {
      headers: getHeaders(token),
    });
  },
};
