import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useAdminRole() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Check if user role is admin
    setIsAdmin(user.role === 'admin');
    setLoading(false);
  }, [user]);

  return { isAdmin, loading };
}
