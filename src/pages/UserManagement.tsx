import { useState, useEffect } from "react";
import { Users, UserPlus, CheckCircle, XCircle, Shield, Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'researcher' | 'viewer';
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  is_active: boolean;
  approval_date?: string;
  approved_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
}

export default function UserManagement() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectUserId, setRejectUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    role: "researcher" as 'admin' | 'researcher' | 'viewer',
  });

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active');

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    if (!token) {
      console.warn('No token available, skipping fetch');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error: any) {
      console.error('Fetch users error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password || !newUser.full_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      toast({
        title: "Success",
        description: `User ${newUser.username} created successfully`,
      });

      setIsDialogOpen(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        full_name: "",
        role: "researcher",
      });
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, username: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      toast({
        title: "Success",
        description: `User ${username} ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const handleChangeRole = async (userId: string, username: string, newRole: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      toast({
        title: "Success",
        description: `User ${username} role updated to ${newRole}`,
      });
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${deleteUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      setDeleteUserId(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleApproveUser = async (userId: string, username: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve user');
      }

      toast({
        title: "Success",
        description: `User ${username} approved successfully`,
      });
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  const handleRejectUser = async () => {
    if (!rejectUserId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${rejectUserId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectionReason || 'Not approved by administrator' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject user');
      }

      toast({
        title: "Success",
        description: "User rejected successfully",
      });
      
      setRejectDialogOpen(false);
      setRejectUserId(null);
      setRejectionReason("");
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject user",
        variant: "destructive",
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'inactive':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      case 'inactive':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: Users,
      description: "All registered users",
    },
    {
      title: "Pending Approvals",
      value: pendingUsers.length.toString(),
      icon: Shield,
      description: "Waiting for approval",
      highlight: pendingUsers.length > 0,
    },
    {
      title: "Active Users",
      value: activeUsers.length.toString(),
      icon: CheckCircle,
      description: "Currently active",
    },
    {
      title: "Inactive Users",
      value: users.filter(u => !u.is_active).length.toString(),
      icon: XCircle,
      description: "Deactivated accounts",
    },
  ];

  // Show login prompt if no token
  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access User Management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/auth">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Register, verify, and manage researcher accounts
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Register a new researcher or admin user
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="johndoe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="researcher">Researcher</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={submitting}>
                {submitting ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={stat.highlight ? 'border-yellow-500 border-2' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.highlight ? 'text-yellow-600' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.highlight ? 'text-yellow-600' : ''}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingUsers.length > 0 && (
        <Card className="border-yellow-500 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} waiting for approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      @{user.username} • {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Registered: {new Date(user.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {user.role}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleApproveUser(user.id, user.username)}
                    >
                      <CheckCircle className="mr-2 h-3 w-3" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setRejectUserId(user.id);
                        setRejectDialogOpen(true);
                      }}
                    >
                      <XCircle className="mr-2 h-3 w-3" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No users found</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add First User
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          @{user.username}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleChangeRole(user.id, user.username, value)}
                        disabled={user.status === 'pending' || user.status === 'rejected'}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="researcher">
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              Researcher
                            </div>
                          </SelectItem>
                          <SelectItem value="viewer">
                            <div className="flex items-center gap-2">
                              <Eye className="h-3 w-3" />
                              Viewer
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(user.status || 'active')}>
                        {user.status || 'active'}
                      </Badge>
                      {user.approval_date && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Approved: {new Date(user.approval_date).toLocaleDateString()}
                        </div>
                      )}
                      {user.rejection_reason && (
                        <div className="text-xs text-red-600 mt-1">
                          Reason: {user.rejection_reason}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_active ? "default" : "secondary"}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveUser(user.id, user.username)}
                            >
                              <CheckCircle className="mr-2 h-3 w-3" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setRejectUserId(user.id);
                                setRejectDialogOpen(true);
                              }}
                            >
                              <XCircle className="mr-2 h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant={user.is_active ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id, user.username, user.is_active)}
                              disabled={user.status === 'rejected'}
                            >
                              {user.is_active ? (
                                <>
                                  <XCircle className="mr-2 h-3 w-3" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-3 w-3" />
                                  Activate
                                </>
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteUserId(user.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this user's registration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection_reason">Rejection Reason</Label>
              <Textarea
                id="rejection_reason"
                placeholder="e.g., Does not meet eligibility criteria, Invalid credentials, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectUserId(null);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectUser}
            >
              Reject User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
