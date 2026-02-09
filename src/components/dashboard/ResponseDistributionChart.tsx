import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useBackendApi } from "@/hooks/useBackendApi";
import { Loader2 } from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function ResponseDistributionChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchAnalytics } = useBackendApi();

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const result = await fetchAnalytics();

      if (result.success && result.data) {
        const analytics = result.data.analytics || result.data;
        const topQuestions = analytics.topQuestions || [];

        // Format data for pie chart
        const chartData = topQuestions.map((q: any) => ({
          name: q.title || 'Unknown',
          value: q.response_count || 0
        }));

        // If no data, show placeholder
        if (chartData.length === 0) {
          setData([{ name: 'No data yet', value: 1 }]);
        } else {
          setData(chartData);
        }
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
      setData([{ name: 'No data yet', value: 1 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stat-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Response Distribution</h3>
        <p className="text-xs text-muted-foreground">
          Breakdown by research question category — Real-time data
        </p>
      </div>
      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
