import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  MessageSquare,
  Settings,
  ChevronLeft,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: () => void;
}

// Admin-specific navigation
const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin", icon: Shield, roles: ['admin'] },
  { name: "User Management", href: "/users", icon: UserCog, roles: ['admin'] },
  { name: "SMS Management", href: "/sms", icon: MessageSquare, roles: ['admin'] },
];

// Researcher navigation
const researcherNavigation = [
  { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard, roles: ['researcher', 'viewer'] },
  { name: "Research Questions", href: "/questions", icon: Users, roles: ['researcher'] },
  { name: "Participants", href: "/participants", icon: Users, roles: ['researcher', 'viewer'] },
  { name: "SMS Notifications", href: "/sms", icon: MessageSquare, roles: ['researcher'] },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings, roles: ['admin', 'researcher', 'viewer'] },
];

export function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine which navigation to show based on role
  const navigation = user?.role === 'admin' ? adminNavigation : researcherNavigation;
  
  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'viewer')
  );
  
  const filteredBottomNavigation = bottomNavigation.filter(item =>
    item.roles.includes(user?.role || 'viewer')
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-200 lg:relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground">Navigation</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className={cn(
            "h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "mx-auto"
          )}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")}
          />
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-link",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border p-2">
        {filteredBottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-link",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Project Info */}
      {!isCollapsed && (
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-muted">
            Kenya Health Survey 2024
          </p>
          <p className="text-xs text-sidebar-muted">
            Version 2.1.0
          </p>
        </div>
      )}
    </aside>
  );
}
