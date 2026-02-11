import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageSquare, 
  Search, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
  FileText,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalResponses: 0,
    totalParticipants: 0,
  });
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch analytics for stats directly
      const analyticsResponse = await fetch(`${API_BASE_URL}/api/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let totalResponses = 0;
      let totalParticipants = 0;

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        const stats = analyticsData.analytics || analyticsData;
        totalResponses = parseInt(stats.responseStats?.total_responses || 0);
        totalParticipants = parseInt(stats.responseStats?.unique_participants || 0);
      }

      setStats({
        totalUsers: 0, // Will be updated from users fetch
        totalQuestions: 0, // Will be updated from questions fetch
        totalResponses,
        totalParticipants,
      });

      // Fetch real users from API
      const usersResponse = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const usersList = Array.isArray(usersData) ? usersData : usersData.users || [];
        setUsers(usersList);
        setStats(prev => ({ ...prev, totalUsers: usersList.length }));
      } else {
        throw new Error('Failed to fetch users');
      }

      // Fetch questions to get active count
      const questionsResponse = await fetch(`${API_BASE_URL}/api/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        const questionsList = questionsData.data?.questions || questionsData.questions || [];
        const activeQuestions = questionsList.filter((q: any) => q.is_active === true);
        setStats(prev => ({ ...prev, totalQuestions: activeQuestions.length }));
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load admin data",
        variant: "destructive",
      });
      // Set empty array on error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage research system users and monitor activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResponses}</div>
            <p className="text-xs text-muted-foreground">From all channels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Questions</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Research questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">Unique participants</p>
          </CardContent>
        </Card>
      </div>

      {/* System Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                System Users
              </CardTitle>
              <CardDescription>
                Manage admin and researcher accounts
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Button variant="outline" size="icon" onClick={fetchData}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No users match your search" : "No users found"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/questions')}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Manage Questions</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Create and edit research questions
                </span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/voice-records')}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">View Voice Records</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Access voice recordings
                </span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/reports')}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Generate Reports</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Export research data
                </span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
