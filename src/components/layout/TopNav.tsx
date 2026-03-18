import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TopNavProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const roleMeta: Record<string, { label: string; cls: string }> = {
  admin: { label: "Admin", cls: "role-admin" },
  researcher: { label: "Researcher", cls: "role-researcher" },
  viewer: { label: "Viewer", cls: "role-viewer" },
};

export function TopNav({ onToggleSidebar }: TopNavProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const displayName = user?.full_name || user?.username || "User";
  const role = user?.role || "researcher";
  const roleBadge = roleMeta[role] ?? { label: role, cls: "role-viewer" };

  // Initials for avatar
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-card/95 backdrop-blur-sm px-4 lg:px-6 shadow-sm">
      {/* Gradient accent line at the very bottom of the header */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-accent/60 to-secondary/40" />

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Brand area */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold shadow-sm">
          VR
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-foreground leading-tight">Voice Research System</h1>
          <p className="text-[10px] text-muted-foreground">Africa's Talking Integration</p>
        </div>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2.5 px-2 rounded-xl hover:bg-muted/60">
              {/* Avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold shadow-sm">
                {initials}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground leading-tight">{displayName}</p>
                <span className={cn(
                  "inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-semibold",
                  roleBadge.cls
                )}>
                  {roleBadge.label}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg border border-border">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-semibold text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="mt-1">
              <UserIcon className="mr-2 h-4 w-4" />
              Profile & Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive mb-1" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
