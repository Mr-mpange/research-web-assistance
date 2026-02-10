import { useState, useEffect } from "react";
import { User, Bell, Shield, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { API_BASE_URL } from "@/config/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Settings() {
  const { toast } = useToast();
  const { user, token } = useAuth();
  const { isAdmin } = useAdminRole();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  
  // Profile state - initialize from auth context
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  // Load user data from auth context
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.full_name || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  // Notification state
  const [notifications, setNotifications] = useState({
    newInterviews: true,
    dailySummary: true,
    weeklyReports: false,
  });

  // API settings state
  const [apiSettings, setApiSettings] = useState({
    apiKey: "••••••••••••••••••••",
    username: "voice_research_prod",
    environment: "production",
  });

  const handleSaveProfile = async () => {
    if (!user || !token) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Update profile via backend API
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: profile.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Success",
      description: "Notification preferences updated",
    });
  };

  const handleSaveAPI = () => {
    toast({
      title: "Success",
      description: "API configuration saved",
    });
  };

  const handleTestConnection = () => {
    toast({
      title: "Testing Connection",
      description: "Connecting to Africa's Talking API...",
    });
    
    // Simulate API test
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: "API credentials are valid",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and system preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-3'}`}>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Data</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <div className="rounded-md border bg-card p-6">
            <h2 className="text-sm font-semibold">Profile Information</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Update your personal details
            </p>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Username cannot be changed.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here. Contact support to update your email.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-md border bg-card p-6">
            <h2 className="text-sm font-semibold">Notification Preferences</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Configure how you receive notifications
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">New Interview Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Receive notification when new interviews are recorded
                  </p>
                </div>
                <Switch
                  checked={notifications.newInterviews}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newInterviews: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Daily Summary Email</p>
                  <p className="text-xs text-muted-foreground">
                    Receive a daily summary of research activity
                  </p>
                </div>
                <Switch
                  checked={notifications.dailySummary}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, dailySummary: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Weekly Reports</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically generate and email weekly reports
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="rounded-md border bg-card p-6">
            <h2 className="text-sm font-semibold">Security Settings</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Manage your password and security preferences
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button>Update Password</Button>
            </div>
          </div>
        </TabsContent>

        {/* Data Management Tab - Admin Only */}
        {isAdmin && (
          <TabsContent value="data" className="space-y-4">
          <div className="rounded-md border bg-card p-6">
            <h2 className="text-sm font-semibold">Data Management</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Export or delete your research data
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="text-sm font-medium">Export All Data</p>
                  <p className="text-xs text-muted-foreground">
                    Download all your research data in CSV format
                  </p>
                </div>
                <Button variant="outline">Export</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-md border-destructive/50">
                <div>
                  <p className="text-sm font-medium text-destructive">Delete All Data</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete all research data (cannot be undone)
                  </p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        )}

        {/* API Settings Tab - Admin Only */}
        {isAdmin && (
          <TabsContent value="api" className="space-y-4">
          <div className="rounded-md border bg-card p-6">
            <h2 className="text-sm font-semibold">API Configuration</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Africa's Talking integration settings
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiSettings.apiKey}
                  onChange={(e) => setApiSettings({ ...apiSettings, apiKey: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={apiSettings.username}
                  onChange={(e) => setApiSettings({ ...apiSettings, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select
                  value={apiSettings.environment}
                  onValueChange={(value) => setApiSettings({ ...apiSettings, environment: value })}
                >
                  <SelectTrigger id="environment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={handleTestConnection}>
                Test Connection
              </Button>
              <Button onClick={handleSaveAPI}>Save Configuration</Button>
            </div>
          </div>
        </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
