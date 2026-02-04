import { Mic, Clock, FileText, HelpCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { InterviewsChart } from "@/components/dashboard/InterviewsChart";
import { ResponseDistributionChart } from "@/components/dashboard/ResponseDistributionChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Kenya Health Survey 2024 — Research data at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Interviews"
          value="1,247"
          description="Recorded voice interviews"
          icon={Mic}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Voice Minutes"
          value="4,832"
          description="Total recording duration"
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Summaries Generated"
          value="1,189"
          description="AI-processed transcripts"
          icon={FileText}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Active Questions"
          value="24"
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
            <p className="text-xs text-muted-foreground">Current progress</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Data Collection</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-1"
                  style={{ width: "78%" }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transcription</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-2"
                  style={{ width: "92%" }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Analysis</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-3"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Target completion: March 15, 2024
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: Today, 2:45 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
