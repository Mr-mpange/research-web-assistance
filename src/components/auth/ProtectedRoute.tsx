 import { Navigate, useLocation } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
 import { Loader2 } from "lucide-react";
 
 interface ProtectedRouteProps {
   children: React.ReactNode;
 }
 
 export function ProtectedRoute({ children }: ProtectedRouteProps) {
   const { user, loading } = useAuth();
   const location = useLocation();
 
   if (loading) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-background">
         <div className="text-center">
           <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
           <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
         </div>
       </div>
     );
   }
 
   // For development: Allow access without authentication
   // Comment this out when you implement proper authentication
   if (process.env.NODE_ENV === 'development') {
     return <>{children}</>;
   }
 
   if (!user) {
     return <Navigate to="/auth" state={{ from: location }} replace />;
   }
 
   return <>{children}</>;
 }