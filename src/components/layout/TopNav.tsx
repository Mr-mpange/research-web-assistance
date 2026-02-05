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

interface TopNavProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

 export function TopNav({ onToggleSidebar }: TopNavProps) {
   const { profile, signOut } = useAuth();
   const navigate = useNavigate();
 
   const handleSignOut = async () => {
     await signOut();
     navigate("/auth");
   };
 
   const displayName = profile?.first_name && profile?.last_name
     ? `${profile.first_name} ${profile.last_name}`
     : "Researcher";
   const role = profile?.role || "Researcher";
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="shrink-0"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground text-sm font-bold">
          VR
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-foreground">Voice Research System</h1>
          <p className="text-xs text-muted-foreground">Africa's Talking Integration</p>
        </div>
      </div>

       <div className="ml-auto flex items-center gap-2">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="flex items-center gap-2 px-2">
               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                 <UserIcon className="h-4 w-4 text-muted-foreground" />
               </div>
               <div className="hidden text-left md:block">
                 <p className="text-sm font-medium">{displayName}</p>
                 <p className="text-xs text-muted-foreground capitalize">{role}</p>
               </div>
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-48">
             <DropdownMenuItem onClick={() => navigate("/settings")}>
               <UserIcon className="mr-2 h-4 w-4" />
               Profile
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
               <LogOut className="mr-2 h-4 w-4" />
               Logout
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       </div>
    </header>
  );
}
