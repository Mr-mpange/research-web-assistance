import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Loader2 } from "lucide-react";

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

export function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, loading } = useAdminRole();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // In development mode, skip role check
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // Only redirect once when user first lands on /dashboard
    if (!loading && !hasRedirected && location.pathname === '/dashboard') {
      if (isAdmin) {
        // Redirect admin users to admin dashboard only on first visit
        setHasRedirected(true);
        navigate("/admin", { replace: true });
      }
    }
  }, [isAdmin, loading, navigate, location.pathname, hasRedirected]);

  if (loading && process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
