import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useBackendApi } from "@/hooks/useBackendApi";
import { Loader2 } from "lucide-react";

export function InterviewsChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchAnalytics } = useBackendApi();

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Last 7 days

      const result = await fetchAnalytics({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        granularity: 'day'
      });

      if (result.success) {
        const analytics = result.analytics || result.data?.analytics || result.data;
        const trends = analytics?.trends || [];

        // Format data for chart
        const chartData = trends.map((trend: any) => {
          const date = new Date(trend.period);
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return {
            day: dayNames[date.getDay()],
            interviews: trend.responses || 0
          };
        });

        // If no data, show empty chart
        if (chartData.length === 0) {
          const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          setData(dayNames.map(day => ({ day, interviews: 0 })));
        } else {
          setData(chartData);
        }
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
      // Fallback to empty data
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      setData(dayNames.map(day => ({ day, interviews: 0 })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stat-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Interviews This Week</h3>
        <p className="text-xs text-muted-foreground">
          Daily interview count for the current week — Real-time data
        </p>
      </div>
      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="interviews"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
