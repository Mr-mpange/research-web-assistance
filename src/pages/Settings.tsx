import { User, Bell, Shield, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and system preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Navigation */}
        <div className="space-y-1 lg:col-span-1">
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Database className="mr-2 h-4 w-4" />
            Data Management
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Globe className="mr-2 h-4 w-4" />
            API Settings
          </Button>
        </div>

        {/* Right column - Settings forms */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Section */}
          <div className="rounded-md border bg-card p-6">
            <h2 className="text-sm font-semibold">Profile Information</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Update your personal details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Amina" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Osei" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="a.osei@university.ac.ke" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" defaultValue="University of Nairobi" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>

          <Separator />

          {/* Notifications Section */}
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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Daily Summary Email</p>
                  <p className="text-xs text-muted-foreground">
                    Receive a daily summary of research activity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Weekly Reports</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically generate and email weekly reports
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <Separator />

          {/* API Settings */}
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
                  defaultValue="••••••••••••••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="voice_research_prod" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select defaultValue="production">
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
              <Button variant="outline">Test Connection</Button>
              <Button>Save Configuration</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
