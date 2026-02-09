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
  const [exportFormat, setExportFormat] = useState("csv");
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
        fetchResponses({ page: 1, limit: 100, includeAI: true }), // Reduced from 1000
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

  const handleExport = async (format: string) => {
    toast({
      title: "Exporting Data",
      description: `Preparing ${format.toUpperCase()} export...`,
    });

    try {
      console.log('Starting export, fetching data...');
      
      const [responsesResult, questionsResult] = await Promise.all([
        fetchResponses({ page: 1, limit: 100, includeAI: true }),
        fetchQuestions()
      ]);

      console.log('Responses result:', responsesResult);
      console.log('Questions result:', questionsResult);

      // Check if responses fetch failed
      if (!responsesResult.success) {
        throw new Error(responsesResult.error || 'Failed to fetch responses');
      }

      // Handle different response formats
      let responses = [];
      if (responsesResult.responses) {
        // Direct responses array (backend format: { success: true, responses: [...] })
        responses = responsesResult.responses;
      } else if (responsesResult.data) {
        if (Array.isArray(responsesResult.data)) {
          responses = responsesResult.data;
        } else if (responsesResult.data.responses) {
          responses = responsesResult.data.responses;
        } else if (Array.isArray(responsesResult.data.data)) {
          responses = responsesResult.data.data;
        }
      }

      // Get questions
      let questions = [];
      if (questionsResult.success && questionsResult.data) {
        if (Array.isArray(questionsResult.data)) {
          questions = questionsResult.data;
        } else if (questionsResult.data.questions) {
          questions = questionsResult.data.questions;
        }
      }

      console.log(`Found ${responses.length} responses and ${questions.length} questions`);

      if (responses.length === 0) {
        toast({
          title: "No Data",
          description: "No responses found to export",
          variant: "destructive",
        });
        return;
      }

      switch (format) {
        case 'csv':
          exportAsCSV(responses);
          break;
        case 'excel':
          exportAsExcel(responses, questions);
          break;
        case 'pdf':
          exportAsPDF(responses, questions, analytics);
          break;
        case 'json':
          exportAsJSON(responses, questions, analytics);
          break;
        default:
          throw new Error('Unsupported format');
      }

      toast({
        title: "Export Complete",
        description: `Data exported as ${format.toUpperCase()} successfully`,
      });
    } catch (err: any) {
      console.error('Export error:', err);
      toast({
        title: "Export Failed",
        description: err.message || "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const exportAsCSV = (responses: any[]) => {
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

    downloadFile(csv, `research_data_${new Date().toISOString().split('T')[0]}.csv`, "text/csv");
  };

  const exportAsExcel = (responses: any[], questions: any[]) => {
    // Create a simple TSV format that Excel can open
    const sheets = {
      responses: [
        ["ID", "Date", "Phone", "Type", "Question", "Response", "Transcript", "Summary", "Sentiment"],
        ...responses.map((r: any) => [
          r.id,
          new Date(r.created_at).toLocaleString(),
          r.phone_number || "N/A",
          r.response_type,
          r.question_title || "N/A",
          (r.response_text || "").substring(0, 500),
          (r.transcribed_text || "").substring(0, 500),
          (r.summary_text || "").substring(0, 500),
          r.sentiment || "N/A"
        ])
      ],
      questions: [
        ["ID", "Title", "Question Text", "Category", "Language", "Active", "Created"],
        ...questions.map((q: any) => [
          q.id,
          q.title,
          q.question_text,
          q.category || "N/A",
          q.language,
          q.is_active ? "Yes" : "No",
          new Date(q.created_at).toLocaleString()
        ])
      ]
    };

    // Create TSV content
    let content = "=== RESPONSES ===\n";
    content += sheets.responses.map(row => row.join("\t")).join("\n");
    content += "\n\n=== QUESTIONS ===\n";
    content += sheets.questions.map(row => row.join("\t")).join("\n");

    downloadFile(content, `research_data_${new Date().toISOString().split('T')[0]}.xls`, "application/vnd.ms-excel");
  };

  const exportAsPDF = (responses: any[], questions: any[], analytics: any) => {
    // Create a professional HTML report that can be printed to PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Research Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #2563eb; margin: 0; font-size: 28px; }
    .header p { color: #666; margin: 5px 0; }
    .section { margin: 30px 0; page-break-inside: avoid; }
    .section h2 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
    .stat-card { background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; }
    .stat-card .label { font-size: 12px; color: #666; text-transform: uppercase; }
    .stat-card .value { font-size: 24px; font-weight: bold; color: #2563eb; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: 600; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    tr:hover { background: #f9fafb; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
    @media print { body { margin: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Research Data Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
    <p>Research Assistance System - Comprehensive Analysis</p>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Total Responses</div>
        <div class="value">${analytics?.responseStats?.total_responses || 0}</div>
      </div>
      <div class="stat-card">
        <div class="label">Voice Recordings</div>
        <div class="value">${analytics?.responseStats?.voice_responses || 0}</div>
      </div>
      <div class="stat-card">
        <div class="label">USSD Responses</div>
        <div class="value">${analytics?.responseStats?.ussd_responses || 0}</div>
      </div>
      <div class="stat-card">
        <div class="label">Participants</div>
        <div class="value">${analytics?.responseStats?.unique_participants || 0}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>AI Processing Statistics</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Transcriptions</div>
        <div class="value">${analytics?.aiStats?.total_transcriptions || 0}</div>
      </div>
      <div class="stat-card">
        <div class="label">AI Summaries</div>
        <div class="value">${analytics?.aiStats?.total_summaries || 0}</div>
      </div>
      <div class="stat-card">
        <div class="label">Avg Confidence</div>
        <div class="value">${((analytics?.aiStats?.avg_transcription_confidence || 0) * 100).toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <div class="label">Positive Sentiment</div>
        <div class="value">${analytics?.aiStats?.positive_responses || 0}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Top Research Questions</h2>
    <table>
      <thead>
        <tr>
          <th>Question Title</th>
          <th>Response Count</th>
        </tr>
      </thead>
      <tbody>
        ${(analytics?.topQuestions || []).slice(0, 10).map((q: any) => `
          <tr>
            <td>${q.title}</td>
            <td>${q.response_count}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Recent Responses (Last ${Math.min(responses.length, 20)})</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Question</th>
          <th>Sentiment</th>
        </tr>
      </thead>
      <tbody>
        ${responses.slice(0, 20).map((r: any) => `
          <tr>
            <td>${new Date(r.created_at).toLocaleDateString()}</td>
            <td>${r.response_type?.toUpperCase()}</td>
            <td>${r.question_title || 'N/A'}</td>
            <td>${r.sentiment || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p><strong>Research Assistance System</strong></p>
    <p>This report contains ${responses.length} total responses from ${analytics?.responseStats?.unique_participants || 0} participants</p>
    <p>For more information, visit your dashboard at http://localhost:8080</p>
  </div>

  <script class="no-print">
    // Auto-print dialog on load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    } else {
      // Fallback: download as HTML
      downloadFile(html, `research_report_${new Date().toISOString().split('T')[0]}.html`, "text/html");
    }
  };

  const exportAsJSON = (responses: any[], questions: any[], analytics: any) => {
    const data = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalResponses: responses.length,
        totalQuestions: questions.length,
        version: "1.0"
      },
      analytics: analytics || {},
      questions: questions,
      responses: responses
    };

    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `research_data_${new Date().toISOString().split('T')[0]}.json`, "application/json");
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Export Data</h2>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">📊 CSV Format</SelectItem>
              <SelectItem value="excel">📗 Excel Format</SelectItem>
              <SelectItem value="pdf">📄 PDF Report</SelectItem>
              <SelectItem value="json">🔧 JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {exportFormat === 'csv' && '📊'}
                {exportFormat === 'excel' && '📗'}
                {exportFormat === 'pdf' && '📄'}
                {exportFormat === 'json' && '🔧'}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {exportFormat === 'csv' && 'CSV Export'}
                  {exportFormat === 'excel' && 'Excel Workbook'}
                  {exportFormat === 'pdf' && 'PDF Report'}
                  {exportFormat === 'json' && 'JSON Data'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exportFormat === 'csv' && 'Comma-separated values for spreadsheet applications'}
                  {exportFormat === 'excel' && 'Microsoft Excel format with formatted sheets'}
                  {exportFormat === 'pdf' && 'Professional PDF report with charts and analysis'}
                  {exportFormat === 'json' && 'Raw JSON data for developers and integrations'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport(exportFormat)}
              disabled={loading}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
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
