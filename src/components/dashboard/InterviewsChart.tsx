import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", interviews: 12 },
  { day: "Tue", interviews: 19 },
  { day: "Wed", interviews: 15 },
  { day: "Thu", interviews: 22 },
  { day: "Fri", interviews: 18 },
  { day: "Sat", interviews: 8 },
  { day: "Sun", interviews: 5 },
];

export function InterviewsChart() {
  return (
    <div className="stat-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Interviews This Week</h3>
        <p className="text-xs text-muted-foreground">
          Daily interview count for the current week
        </p>
      </div>
      <div className="h-64">
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
      </div>
    </div>
  );
}
