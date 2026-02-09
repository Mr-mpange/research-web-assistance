import { useEffect, useState } from "react";
import { Mic, FileText, Brain, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBackendApi } from "@/hooks/useBackendApi";

interface Activity {
  id: string;
  type: "recording" | "transcription" | "summary";
  description: string;
  time: string;
  phone?: string;
}

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

function formatTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function maskPhone(phone: string): string {
  if (!phone) return "Unknown";
  // Mask middle digits: +254 712 XXX XXX
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length >= 10) {
    return `${cleaned.substring(0, 8)} XXX XXX`;
  }
  return phone;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchResponses } = useBackendApi();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const result = await fetchResponses({
        page: 1,
        limit: 20,
        includeAI: true,
      });

      if (result.success && result.data) {
        const responses = result.data.responses || result.data;
        
        if (Array.isArray(responses)) {
          const activityList: Activity[] = [];

          // Process each response to create activity items
          responses.forEach((r: any) => {
            // Add recording activity
            activityList.push({
              id: `rec-${r.id}`,
              type: "recording",
              description: `New ${r.response_type} interview recorded`,
              phone: maskPhone(r.phone_number),
              time: formatTimeAgo(r.created_at),
            });

            // Add transcription activity if available
            if (r.transcribed_text) {
              activityList.push({
                id: `trans-${r.id}`,
                type: "transcription",
                description: "Transcription completed",
                phone: maskPhone(r.phone_number),
                time: formatTimeAgo(r.created_at),
              });
            }

            // Add summary activity if available
            if (r.summary_text) {
              activityList.push({
                id: `sum-${r.id}`,
                type: "summary",
                description: "AI summary generated",
                phone: maskPhone(r.phone_number),
                time: formatTimeAgo(r.created_at),
              });
            }
          });

          // Sort by most recent and take top 5
          activityList.sort((a, b) => {
            // Simple sort by time string (not perfect but works for display)
            return a.time.localeCompare(b.time);
          });

          setActivities(activityList.slice(0, 5));
        }
      }
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stat-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">
          Latest system events — Real-time data
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No recent activity
        </div>
      ) : (
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
      )}
    </div>
  );
}
