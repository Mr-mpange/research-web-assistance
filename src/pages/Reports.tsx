import { useState, useEffect } from "react";
import { FileText, Download, Calendar, BarChart3, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBackendApi } from "@/hooks/useBackendApi";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Reports() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [analytics, setAnalytics] = useState<any>(null);
  const { loading, error, fetchAnalytics, fetchResponses, fetchQuestions } = useBackendApi();
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const result = await fetchAnalytics();
    if (result.success && result.data) {
      setAnalytics(result.data.analytics || result.data);
    }
  };

  const generateWeeklySummary = async () => {
    toast({
      title: "Generating Report",
      description: "Creating weekly summary report...",
    });

    try {
      const result = await fetchAnalytics({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        granularity: 'day'
      });

      if (result.success && result.data) {
        const data = result.data.analytics || result.data;
        
        // Create report content
        const report = `
WEEKLY SUMMARY REPORT
Generated: ${new Date().toLocaleString()}

=== OVERVIEW ===
Total Responses: ${data.responseStats?.total_responses || 0}
Voice Responses: ${data.responseStats?.voice_responses || 0}
USSD Responses: ${data.responseStats?.ussd_responses || 0}
Unique Participants: ${data.responseStats?.unique_participants || 0}

=== AI PROCESSING ===
Total Transcriptions: ${data.aiStats?.total_transcriptions || 0}
Total Summaries: ${data.aiStats?.total_summaries || 0}
Average Confidence: ${((data.aiStats?.avg_transcription_confidence || 0) * 100).toFixed(1)}%

=== SENTIMENT ANALYSIS ===
Positive: ${data.aiStats?.positive_responses || 0}
Negative: ${data.aiStats?.negative_responses || 0}
Neutral: ${data.aiStats?.neutral_responses || 0}

=== TOP QUESTIONS ===
${(data.topQuestions || []).map((q: any, i: number) => 
  `${i + 1}. ${q.title} (${q.response_count} responses)`
).join('\n')}
        `.trim();

        // Download as text file
        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `weekly_summary_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: "Report Generated",
          description: "Weekly summary downloaded successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const exportAllData = async () => {
    toast({
      title: "Exporting Data",
      description: "Preparing complete dataset...",
    });

    try {
      const [responsesResult, questionsResult] = await Promise.all([
        fetchResponses({ page: 1, limit: 1000, includeAI: true }),
        fetchQuestions()
      ]);

      if (responsesResult.success && responsesResult.data) {
        const responses = responsesResult.data.responses || responsesResult.data;
        
        // Create CSV
        const headers = [
          "ID", "Date", "Phone", "Type", "Question", 
          "Response", "Transcript", "Summary", "Sentiment"
        ];
        
        const rows = (Array.isArray(responses) ? responses : []).map((r: any) => [
          r.id,
          new Date(r.created_at).toLocaleString(),
          r.phone_number || "N/A",
          r.response_type,
          r.question_title || "N/A",
          (r.response_text || "").replace(/"/g, '""').substring(0, 500),
          (r.transcribed_text || "").replace(/"/g, '""').substring(0, 500),
          (r.summary_text || "").replace(/"/g, '""').substring(0, 500),
          r.sentiment || "N/A"
        ]);

        const csv = [
          headers.join(","),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        // Download CSV
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `complete_dataset_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: "Export Complete",
          description: `Exported ${rows.length} records to CSV`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const createCustomReport = () => {
    toast({
      title: "Custom Report",
      description: "Custom report builder coming soon",
    });
  };

  if (loading && !analytics) {
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
          <h1 className="text-xl font-semibold text-foreground">Reports & Exports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and download research data reports — Real-time data
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

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold">Weekly Summary</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Generate this week's summary report
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateWeeklySummary}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Report
          </Button>
        </div>
        <div className="stat-card flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold">Export All Data</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Download complete dataset as CSV
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportAllData}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Export CSV
          </Button>
        </div>
        <div className="stat-card flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold">Custom Report</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Create a report with custom parameters
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={createCustomReport}
          >
            Create Custom
          </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      {analytics && (
        <div className="rounded-md border bg-card p-6">
          <h2 className="text-sm font-semibold mb-4">Current Statistics</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Responses</p>
              <p className="text-2xl font-semibold">
                {analytics.responseStats?.total_responses || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Voice Recordings</p>
              <p className="text-2xl font-semibold">
                {analytics.responseStats?.voice_responses || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AI Summaries</p>
              <p className="text-2xl font-semibold">
                {analytics.aiStats?.total_summaries || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Participants</p>
              <p className="text-2xl font-semibold">
                {analytics.responseStats?.unique_participants || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="rounded-md border bg-card p-6">
        <h2 className="text-sm font-semibold mb-4">Available Export Formats</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <p className="text-sm font-medium">CSV Export</p>
                <p className="text-xs text-muted-foreground">
                  Complete dataset with all responses and AI analysis
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportAllData}
              disabled={loading}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📄</div>
              <div>
                <p className="text-sm font-medium">Weekly Summary</p>
                <p className="text-xs text-muted-foreground">
                  Text report with statistics and insights
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateWeeklySummary}
              disabled={loading}
            >
              <Download className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📈</div>
              <div>
                <p className="text-sm font-medium">Analytics Report</p>
                <p className="text-xs text-muted-foreground">
                  Detailed analytics with charts and trends
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={createCustomReport}
            >
              <Download className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </div>
        </div>
      </div>

      {/* Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          All exports include real-time data from the backend. Reports are generated on-demand and downloaded directly to your device.
        </AlertDescription>
      </Alert>
    </div>
  );
}
