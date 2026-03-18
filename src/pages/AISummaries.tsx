import { useState, useEffect } from "react";
import { Brain, Loader2, AlertCircle, CheckCircle, TrendingUp, MessageSquare } from "lucide-react";
import { useBackendApi } from "@/hooks/useBackendApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AISummary {
  id: string;
  response_id: string;
  response_type?: 'voice' | 'ussd';
  summary_text: string;
  key_points: string[];
  themes: Array<{ name: string; relevance: number; keywords: string[] }>;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence_score: number;
  word_count: number;
  created_at: string;
  phone_number?: string;
  question_title?: string;
  transcribed_text?: string;
}

export default function AISummaries() {
  const [summaries, setSummaries] = useState<AISummary[]>([]);
  const [aiStatus, setAiStatus] = useState<any>(null);
  const { loading, error, fetchResponses, getAIStatus } = useBackendApi();

  useEffect(() => {
    loadSummaries();
    loadAIStatus();
  }, []);

  const loadSummaries = async () => {
    // Fetch both voice and USSD responses with AI summaries
    const result = await fetchResponses({ includeAI: true });
    if (result.success) {
      const responsesData = (result as any).data?.responses || (result as any).data || [];
      // Filter only responses that have AI summaries
      const withSummaries = responsesData.filter((r: any) => r.summary_text);
      setSummaries(withSummaries);
    }
  };

  const loadAIStatus = async () => {
    const result = await getAIStatus();
    if (result.success) {
      setAiStatus((result as any).data?.status || (result as any).data);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      default:
        return '😐';
    }
  };

  const getResponseTypeColor = (type?: string) => {
    switch (type) {
      case 'voice':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ussd':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getResponseTypeIcon = (type?: string) => {
    switch (type) {
      case 'voice':
        return '🎤';
      case 'ussd':
        return '📱';
      default:
        return '💬';
    }
  };

  if (loading && summaries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">AI Summaries</h1>
          <p className="text-sm text-muted-foreground">
            AI-generated summaries and insights from voice and USSD responses
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* AI Status Card */}
      {aiStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Gemini AI</p>
                <div className="flex items-center gap-2 mt-1">
                  {aiStatus.gemini?.available ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Available</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Not configured</span>
                    </>
                  )}
                </div>
                {aiStatus.gemini?.model && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Model: {aiStatus.gemini.model}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">OpenAI</p>
                <div className="flex items-center gap-2 mt-1">
                  {aiStatus.openai?.available ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Available</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Not configured</span>
                    </>
                  )}
                </div>
                {aiStatus.openai?.model && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Model: {aiStatus.openai.model}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Preferred Service</p>
                <p className="text-sm font-medium mt-1 capitalize">
                  {aiStatus.preferred || 'Not set'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Summaries</p>
          <p className="text-2xl font-semibold">{summaries.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            🎤 {summaries.filter((s) => s.response_type === 'voice').length} voice · 
            📱 {summaries.filter((s) => s.response_type === 'ussd').length} USSD
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Positive Sentiment</p>
          <p className="text-2xl font-semibold">
            {summaries.filter((s) => s.sentiment === 'positive').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Negative Sentiment</p>
          <p className="text-2xl font-semibold">
            {summaries.filter((s) => s.sentiment === 'negative').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
          <p className="text-2xl font-semibold">
            {summaries.length > 0
              ? Math.round(
                  (summaries.reduce((sum, s) => sum + (s.confidence_score || 0), 0) /
                    summaries.length) *
                    100
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Summaries List */}
      {summaries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No AI Summaries Yet</p>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              AI summaries will appear here once responses are processed by the system
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {summaries.map((summary) => (
            <Card key={summary.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {summary.question_title || 'Voice Response'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>{summary.phone_number || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(summary.created_at).toLocaleDateString()}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getResponseTypeColor(summary.response_type)}>
                      {getResponseTypeIcon(summary.response_type)} {summary.response_type || 'response'}
                    </Badge>
                    <Badge className={getSentimentColor(summary.sentiment)}>
                      {getSentimentIcon(summary.sentiment)} {summary.sentiment}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round((summary.confidence_score || 0) * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Text */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">{summary.summary_text}</p>
                </div>

                {/* Key Points */}
                {summary.key_points && summary.key_points.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Key Points</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {summary.key_points.map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Themes */}
                {summary.themes && summary.themes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Themes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {summary.themes.map((theme, index) => (
                        <Badge key={index} variant="secondary">
                          {theme.name} ({Math.round(theme.relevance * 100)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transcription (collapsible) */}
                {summary.transcribed_text && (
                  <details className="text-sm">
                    <summary className="cursor-pointer font-semibold mb-2">
                      View Full Transcription
                    </summary>
                    <p className="text-muted-foreground mt-2 p-3 bg-muted rounded-md">
                      {summary.transcribed_text}
                    </p>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
