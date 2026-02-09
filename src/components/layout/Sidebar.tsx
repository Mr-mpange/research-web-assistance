import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  FileText,
  Brain,
  HelpCircle,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: () => void;
}

const navigation = [
  { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Voice Records", href: "/voice-records", icon: Mic },
  { name: "Transcriptions", href: "/transcriptions", icon: FileText },
  { name: "AI Summaries", href: "/summaries", icon: Brain },
  { name: "Research Questions", href: "/questions", icon: HelpCircle },
  { name: "Participants", href: "/participants", icon: Users },
  { name: "Reports & Exports", href: "/reports", icon: BarChart3 },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
  const location = useLocation();

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
        {navigation.map((item) => {
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
        {bottomNavigation.map((item) => {
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
