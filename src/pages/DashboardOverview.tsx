import { useEffect, useState } from "react";
import { Mic, Clock, FileText, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { InterviewsChart } from "@/components/dashboard/InterviewsChart";
import { ResponseDistributionChart } from "@/components/dashboard/ResponseDistributionChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useBackendApi } from "@/hooks/useBackendApi";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalResponses: 0,
    voiceResponses: 0,
    ussdResponses: 0,
    activeQuestions: 0,
    totalMinutes: 0,
    summariesGenerated: 0,
  });
  
  const { loading, error, fetchAnalytics, fetchQuestions, fetchResponses } = useBackendApi();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch analytics data
        const analyticsResult = await fetchAnalytics();
        if (analyticsResult.success && analyticsResult.data) {
          const data = analyticsResult.data.analytics || analyticsResult.data;
          setStats({
            totalResponses: data.responseStats?.total_responses || 0,
            voiceResponses: data.responseStats?.voice_responses || 0,
            ussdResponses: data.responseStats?.ussd_responses || 0,
            activeQuestions: data.responseStats?.questions_answered || 0,
            totalMinutes: Math.round((data.responseStats?.voice_responses || 0) * 3.5), // Estimate
            summariesGenerated: data.aiStats?.total_summaries || 0,
          });
        }

        // Fetch questions to get active count
        const questionsResult = await fetchQuestions({ active: true });
        if (questionsResult.success && questionsResult.data) {
          const questions = questionsResult.data.questions || questionsResult.data;
          setStats(prev => ({
            ...prev,
            activeQuestions: Array.isArray(questions) ? questions.length : prev.activeQuestions,
          }));
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };

    loadDashboardData();
  }, [fetchAnalytics, fetchQuestions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Research data at a glance — Real-time data from backend
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Interviews"
          value={stats.totalResponses.toLocaleString()}
          description="Recorded voice interviews"
          icon={Mic}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Voice Minutes"
          value={stats.totalMinutes.toLocaleString()}
          description="Total recording duration"
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Summaries Generated"
          value={stats.summariesGenerated.toLocaleString()}
          description="AI-processed transcripts"
          icon={FileText}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Active Questions"
          value={stats.activeQuestions.toString()}
          description="Research questions deployed"
          icon={HelpCircle}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <InterviewsChart />
        <ResponseDistributionChart />
      </div>

      {/* Activity and Quick Stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="stat-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Project Status</h3>
            <p className="text-xs text-muted-foreground">Current progress — Real-time data</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Data Collection</span>
                <span className="font-medium">
                  {stats.totalResponses > 0 
                    ? Math.min(100, Math.round((stats.totalResponses / 1000) * 100))
                    : 0}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-1"
                  style={{ 
                    width: `${stats.totalResponses > 0 
                      ? Math.min(100, Math.round((stats.totalResponses / 1000) * 100))
                      : 0}%` 
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transcription</span>
                <span className="font-medium">
                  {stats.voiceResponses > 0 
                    ? Math.round((stats.summariesGenerated / stats.voiceResponses) * 100)
                    : 0}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-2"
                  style={{ 
                    width: `${stats.voiceResponses > 0 
                      ? Math.round((stats.summariesGenerated / stats.voiceResponses) * 100)
                      : 0}%` 
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI Analysis</span>
                <span className="font-medium">
                  {stats.summariesGenerated > 0 
                    ? Math.round((stats.summariesGenerated / Math.max(stats.totalResponses, 1)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-3"
                  style={{ 
                    width: `${stats.summariesGenerated > 0 
                      ? Math.round((stats.summariesGenerated / Math.max(stats.totalResponses, 1)) * 100)
                      : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Total Responses: {stats.totalResponses.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
