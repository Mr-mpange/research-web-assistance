import { useState, useEffect } from "react";
import { MessageSquare, Send, Users, CheckCircle, TrendingUp, TrendingDown, Filter, Search, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  
  // Filter states
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterDateRange, setFilterDateRange] = useState<string>("all");

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

  // Filter recent activity
  const filteredActivity = recentActivity.filter((activity) => {
    // Filter by type
    if (filterType !== "all" && activity.response_type !== filterType) {
      return false;
    }

    // Filter by search (phone number or question title)
    if (filterSearch) {
      const searchLower = filterSearch.toLowerCase();
      const matchesPhone = activity.phone_number.toLowerCase().includes(searchLower);
      const matchesQuestion = activity.question_title?.toLowerCase().includes(searchLower);
      if (!matchesPhone && !matchesQuestion) {
        return false;
      }
    }

    // Filter by date range
    if (filterDateRange !== "all") {
      const activityDate = new Date(activity.created_at);
      const now = new Date();
      const diffHours = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60);

      if (filterDateRange === "today" && diffHours > 24) return false;
      if (filterDateRange === "week" && diffHours > 168) return false;
      if (filterDateRange === "month" && diffHours > 720) return false;
    }

    return true;
  });

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest participant responses and interactions
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredActivity.length} {filteredActivity.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by phone or question..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="h-9 bg-background"
              />
              {filterSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterSearch("")}
                  className="h-9 px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 bg-background">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="voice">Voice</SelectItem>
                <SelectItem value="ussd">USSD</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDateRange} onValueChange={setFilterDateRange}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 bg-background">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            {(filterType !== "all" || filterSearch || filterDateRange !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterType("all");
                  setFilterSearch("");
                  setFilterDateRange("all");
                }}
                className="h-9"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Activity List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">Loading recent activity...</p>
              </div>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-secondary p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">No activity yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Participant responses will appear here once they start interacting with your research questions
              </p>
            </div>
          ) : filteredActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-secondary p-4 mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Try adjusting your filters to see more results
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterType("all");
                  setFilterSearch("");
                  setFilterDateRange("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="group relative flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Left side - Icon and status */}
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="relative">
                      <div className="rounded-full bg-primary/10 p-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 bg-background rounded-full" />
                      </div>
                    </div>
                    {index < filteredActivity.length - 1 && (
                      <div className="w-px h-full bg-border" />
                    )}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          {activity.phone_number}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          activity.response_type === 'voice' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : activity.response_type === 'ussd'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {activity.response_type.toUpperCase()}
                        </span>
                        {activity.language && activity.language !== 'en' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {activity.language.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(activity.created_at)}
                      </span>
                    </div>

                    {/* Question title */}
                    {activity.question_title && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground">Question:</span>
                        <p className="text-sm font-medium text-foreground line-clamp-1 flex-1">
                          {activity.question_title}
                        </p>
                      </div>
                    )}

                    {/* Response text */}
                    {activity.response_text && (
                      <div className="bg-muted/50 rounded-md p-3 border border-border/50">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          "{activity.response_text}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
