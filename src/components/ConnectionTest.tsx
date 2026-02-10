import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

export function ConnectionTest() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
        setError(`Server returned ${response.status}`);
      }
    } catch (err: any) {
      setStatus('disconnected');
      
      if (err.name === 'AbortError') {
        setError('Connection timeout - server not responding');
      } else if (err.message === 'Failed to fetch') {
        setError('Cannot reach server - check your internet connection');
      } else {
        setError(err.message || 'Unknown error');
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (status === 'connected') {
    return null; // Don't show anything if connected
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant={status === 'disconnected' ? 'destructive' : 'default'}>
        <div className="flex items-start gap-3">
          {status === 'checking' && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === 'connected' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'disconnected' && <XCircle className="h-5 w-5" />}
          
          <div className="flex-1">
            <AlertTitle>
              {status === 'checking' && 'Checking connection...'}
              {status === 'connected' && 'Connected'}
              {status === 'disconnected' && 'Connection Error'}
            </AlertTitle>
            <AlertDescription>
              {status === 'checking' && 'Connecting to backend server...'}
              {status === 'connected' && 'Backend se