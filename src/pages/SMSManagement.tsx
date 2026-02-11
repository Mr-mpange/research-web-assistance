import { useState, useEffect } from "react";
import { MessageSquare, Send, Users, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/config/api";

interface SMSStats {
  todayCount: number;
  yesterdayCount: number;
  percentageChange: number;
  totalRecipients: number;
  last30DaysCount: number;
  deliveryRate: number;
}

interface RecentActivity {
  phone_number: string;
  response_type: string;
  language: string;
  created_at: string;
  question_title: string;
  response_text: string;
}

export default function SMSManagement() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SMSStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (token) {
      fetchStatistics();
    }
  }, [token]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sms/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch SMS statistics');
      }

      const data = await response.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch (error: any) {
      console.error('Fetch SMS statistics error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch SMS statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const handleSendSMS = async () => {
    if (!phoneNumber || !message) {
      toast({
        title: "Error",
        description: "Please enter both phone number and message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // TODO: Implement actual SMS sending via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "SMS sent successfully!",
      });
      
      setPhoneNumber("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send SMS",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const statsCards = [
    {
      title: "SMS Sent Today",
      value: loading ? "..." : (stats?.todayCount || 0).toString(),
      icon: Send,
      description: loading ? "Loading..." : `${stats?.percentageChange && stats.percentageChange > 0 ? '+' : ''}${stats?.percentageChange || 0}% from yesterday`,
      trend: stats?.percentageChange && stats.percentageChange > 0 ? 'up' : 'down',
    },
    {
      title: "Total Recipients",
      value: loading ? "..." : (stats?.totalRecipients || 0).toLocaleString(),
      icon: Users,
      description: "Active participants",
    },
    {
      title: "Delivery Rate",
      value: loading ? "..." : `${stats?.deliveryRate || 0}%`,
      icon: CheckCircle,
      description: "Last 30 days",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SMS Management</h1>
        <p className="text-muted-foreground">
          Send SMS notifications and manage bulk messaging
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {stat.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Send SMS Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send SMS
          </CardTitle>
          <CardDescription>
            Send SMS to participants or bulk messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/160 characters
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSendSMS} disabled={sending}>
              <Send className="mr-2 h-4 w-4" />
              {sending ? "Sending..." : "Send SMS"}
            </Button>
            {user?.role === 'admin' && (
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Send Bulk SMS
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent SMS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent SMS</CardTitle>
          <CardDescription>
            Recently sent messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading recent activity...
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent SMS activity</p>
              <p className="text-xs mt-1">Send your first SMS to see activity here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.phone_number}</p>
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                        {activity.response_type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.question_title || 'Research Response'}
                    </p>
                    {activity.response_text && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {activity.response_text}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
