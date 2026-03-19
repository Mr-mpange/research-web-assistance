import { useEffect, useState, useCallback } from "react";
import { Mic, Clock, FileText, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { InterviewsChart } from "@/components/dashboard/InterviewsChart";
import { ResponseDistributionChart } from "@/components/dashboard/ResponseDistributionChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { analyticsService, questionsService } from "@/services/apiService";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalResponses: 0,
    voiceResponses: 0,
    ussdResponses: 0,
    activeQuestions: 0,
    totalMinutes: 0,
    summariesGenerated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Run both requests in parallel
      const [analyticsResult, questionsResult] = await Promise.all([
        analyticsService.summary(),
        questionsService.list({ active: true }),
      ]);

      if (analyticsResult.success) {
        // Backend returns { success, analytics: { responseStats, topQuestions } }
        const analytics = (analyticsResult as any).analytics || analyticsResult.data?.analytics || analyticsResult.data;
        const rs = analytics?.responseStats;
        setStats(prev => ({
          ...prev,
          totalResponses: parseInt(rs?.total_responses || 0),
          voiceResponses: parseInt(rs?.voice_responses || 0),
          ussdResponses: parseInt(rs?.ussd_responses || 0),
          totalMinutes: Math.round(parseInt(rs?.voice_responses || 0) * 3.5),
          summariesGenerated: parseInt(analytics?.aiStats?.total_summaries || 0),
        }));
      } else {
        setError((analyticsResult as any).error || 'Failed to load analytics');
      }

      if (questionsResult.success) {
        // Backend returns { success, data: { questions: [...] } }
        const questions = (questionsResult as any).data?.questions
          || (questionsResult as any).questions
          || questionsResult.data;
        setStats(prev => ({
          ...prev,
          activeQuestions: Array.isArray(questions) ? questions.length : prev.activeQuestions,
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
