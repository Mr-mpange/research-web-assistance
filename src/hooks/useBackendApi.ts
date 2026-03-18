// Custom hook for Backend API integration
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  questionsService,
  responsesService,
  analyticsService,
  aiService,
  smsService,
  projectsService,
  healthCheck,
} from '@/services/apiService';

export const useBackendApi = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from localStorage
  const getToken = useCallback(() => {
    return localStorage.getItem('auth_token') || '';
  }, []);

  // Health check
  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await healthCheck();
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Questions
  const fetchQuestions = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await questionsService.list(params, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  const createQuestion = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await questionsService.create(data, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  const updateQuestion = useCallback(async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await questionsService.update(id, data, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  const deleteQuestion = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await questionsService.delete(id, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  // Responses
  const fetchResponses = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await responsesService.list(params, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  const fetchResponse = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await responsesService.single(id, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  // Analytics
  const fetchAnalytics = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyticsService.summary(params, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  // AI Processing
  const triggerAiProcessing = useCallback(async (limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.process(limit, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  const getAIStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.status(getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  // Alias for compatibility
  const processAI = triggerAiProcessing;

  // SMS
  const sendThankYouSms = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await smsService.sendThankYou(data, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  const sendInviteSms = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await smsService.sendInvite(data, getToken());
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [getToken]);

  return {
    loading,
    error,
    checkHealth,
    // Questions
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    // Responses
    fetchResponses,
    fetchResponse,
    // Analytics
    fetchAnalytics,
    // AI
    triggerAiProcessing,
    processAI,
    getAIStatus,
    // SMS
    sendThankYouSms,
    sendInviteSms,
    // Projects
    fetchProjects: useCallback(async () => {
      setLoading(true); setError(null);
      try { const r = await projectsService.list(); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    fetchProject: useCallback(async (id: string) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.get(id); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    createProject: useCallback(async (data: any) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.create(data); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    updateProject: useCallback(async (id: string, data: any) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.update(id, data); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    deleteProject: useCallback(async (id: string) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.delete(id); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    fetchProjectQuestions: useCallback(async (id: string) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.getQuestions(id); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    fetchProjectResponses: useCallback(async (id: string) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.getResponses(id); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    submitProjectResponse: useCallback(async (projectId: string, data: any) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.submitResponse(projectId, data); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    fetchProjectAISummary: useCallback(async (id: string, question_id?: string) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.getAISummary(id, question_id); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
    generateProjectAI: useCallback(async (id: string, question_id?: string) => {
      setLoading(true); setError(null);
      try { const r = await projectsService.generateAI(id, question_id); setLoading(false); return r; }
      catch (e: any) { setError(e.message); setLoading(false); return { success: false, error: e.message }; }
    }, []),
  };
};
