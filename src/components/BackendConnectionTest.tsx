// Backend Connection Test Component
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { healthCheck } from '@/services/apiService';
import { useBackendApi } from '@/hooks/useBackendApi';

export function BackendConnectionTest() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const { 
    loading, 
    error, 
    fetchQuestions, 
    fetchResponses, 
    fetchAnalytics 
  } = useBackendApi();

  const [testResults, setTestResults] = useState({
    questions: null as any,
    responses: null as any,
    analytics: null as any,
  });

  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await healthCheck();
      setHealthStatus(result);
      setLastChecked(new Date());
    } catch (err) {
      setHealthStatus({ success: false, error: 'Connection failed' });
    }
    setTesting(false);
  };

  const testEndpoints = async () => {
    // Test questions endpoint
    const questionsResult = await fetchQuestions({ active: true });
    setTestResults(prev => ({ ...prev, questions: questionsResult }));

    // Test responses endpoint
    const responsesResult = await fetchResponses({ page: 1, limit: 10 });
    setTestResults(prev => ({ ...prev, responses: responsesResult }));

    // Test analytics endpoint
    const analyticsResult = await fetchAnalytics();
    setTestResults(prev => ({ ...prev, analytics: analyticsResult }));
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = (success?: boolean) => {
    if (success === undefined) return <Loader2 className="h-4 w-4 animate-spin" />;
    return success ? (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (success?: boolean) => {
    if (success === undefined) return <Badge variant="secondary">Testing...</Badge>;
    return success ? (
      <Badge variant="default" className="bg-green-500">Connected</Badge>
    ) : (
      <Badge variant="destructive">Disconnected</Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Backend Connection Status</CardTitle>
              <CardDescription>
                Testing connection to Google Cloud Run backend
              </CardDescription>
            </div>
            {getStatusBadge(healthStatus?.success)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Check */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(healthStatus?.success)}
              <div>
                <p className="font-medium">Health Check</p>
                <p className="text-sm text-muted-foreground">
                  {healthStatus?.success 
                    ? `Backend is healthy (v${healthStatus.data?.version || '1.0.0'})`
                    : healthStatus?.error || 'Not tested yet'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={testing}
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {lastChecked && (
            <p className="text-xs text-muted-foreground">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}

          {/* Backend URL */}
          <Alert>
            <AlertDescription>
              <strong>Backend URL:</strong>{' '}
              <code className="text-xs">
                https://research-system-864580156744.us-central1.run.app
              </code>
            </AlertDescription>
          </Alert>

          {/* Test Endpoints Button */}
          <Button 
            onClick={testEndpoints} 
            disabled={loading || !healthStatus?.success}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Endpoints...
              </>
            ) : (
              'Test API Endpoints'
            )}
          </Button>

          {/* Endpoint Test Results */}
          {(testResults.questions || testResults.responses || testResults.analytics) && (
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-medium text-sm">Endpoint Test Results:</h4>
              
              <div className="space-y-2">
                {testResults.questions && (
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(testResults.questions.success)}
                    <span>Questions API: {testResults.questions.success ? 'Success' : 'Failed'}</span>
                  </div>
                )}
                
                {testResults.responses && (
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(testResults.responses.success)}
                    <span>Responses API: {testResults.responses.success ? 'Success' : 'Failed'}</span>
                  </div>
                )}
                
                {testResults.analytics && (
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(testResults.analytics.success)}
                    <span>Analytics API: {testResults.analytics.success ? 'Success' : 'Failed'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>To use the backend API in your components:</p>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto">
{`import { useBackendApi } from '@/hooks/useBackendApi';

function MyComponent() {
  const { fetchQuestions } = useBackendApi();
  
  useEffect(() => {
    const load = async () => {
      const result = await fetchQuestions();
      console.log(result);
    };
    load();
  }, []);
}`}
          </pre>
          <p className="text-muted-foreground pt-2">
            See <code>BACKEND_INTEGRATION.md</code> for complete documentation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
