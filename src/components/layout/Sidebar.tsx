import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  MessageSquare,
  Settings,
  ChevronLeft,
  UserCog,
  FlaskConical,
  Brain,
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
  { name: "Research Questions", href: "/questions", icon: FlaskConical, roles: ['researcher'] },
  { name: "Participants", href: "/participants", icon: Users, roles: ['researcher', 'viewer'] },
  { name: "AI Summaries", href: "/summaries", icon: Brain, roles: ['researcher', 'viewer'] },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings, roles: ['admin', 'researcher', 'viewer'] },
];

export function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = user?.role === 'admin' ? adminNavigation : researcherNavigation;

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
      {/* Sidebar Header – Brand */}
      <div className={cn(
        "flex h-14 items-center border-b border-sidebar-border px-3",
        isCollapsed ? "justify-center" : "gap-3"
      )}>
        {/* Logo mark */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-accent text-white font-bold text-sm shadow-sm">
          RH
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">ResearchHub</p>
            <p className="text-[10px] text-sidebar-muted truncate">Kenya Health Survey</p>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className={cn(
            "h-7 w-7 shrink-0 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "hidden"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Collapsed expand button */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="mx-auto mt-1 h-7 w-7 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </Button>
      )}

      {/* Section label */}
      {!isCollapsed && (
        <div className="px-4 pt-4 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
            {user?.role === 'admin' ? 'Administration' : 'Research'}
          </p>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-link",
                isActive
                  ? "active bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-sidebar-primary" : "text-sidebar-muted"
              )} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border px-2 py-2 space-y-0.5">
        {filteredBottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-link",
                isActive
                  ? "active bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-sidebar-primary" : "text-sidebar-muted"
              )} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Version pill */}
      {!isCollapsed && (
        <div className="border-t border-sidebar-border px-4 py-3">
          <span className="inline-flex items-center rounded-full bg-sidebar-accent px-2.5 py-0.5 text-[10px] font-medium text-sidebar-muted">
            v2.1.0
          </span>
        </div>
      )}
    </aside>
  );
}
