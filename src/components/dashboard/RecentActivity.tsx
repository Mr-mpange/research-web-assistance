import { Mic, FileText, Brain, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "recording" | "transcription" | "summary";
  description: string;
  time: string;
  phone?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "recording",
    description: "New voice interview recorded",
    phone: "+254 712 XXX XXX",
    time: "5 minutes ago",
  },
  {
    id: "2",
    type: "transcription",
    description: "Transcription completed",
    phone: "+254 733 XXX XXX",
    time: "12 minutes ago",
  },
  {
    id: "3",
    type: "summary",
    description: "AI summary generated",
    phone: "+254 722 XXX XXX",
    time: "25 minutes ago",
  },
  {
    id: "4",
    type: "recording",
    description: "New voice interview recorded",
    phone: "+254 745 XXX XXX",
    time: "1 hour ago",
  },
  {
    id: "5",
    type: "transcription",
    description: "Transcription completed",
    phone: "+254 701 XXX XXX",
    time: "2 hours ago",
  },
];

const iconMap = {
  recording: Mic,
  transcription: FileText,
  summary: Brain,
};

const colorMap = {
  recording: "bg-chart-1/10 text-chart-1",
  transcription: "bg-chart-2/10 text-chart-2",
  summary: "bg-chart-3/10 text-chart-3",
};

export function RecentActivity() {
  return (
    <div className="stat-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">
          Latest system events
        </p>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  colorMap[activity.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                {activity.phone && (
                  <p className="text-xs text-muted-foreground">{activity.phone}</p>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
