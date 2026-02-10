import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

// User type matching backend schema
interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'researcher' | 'viewer';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null; // Alias for backward compatibility
  token: string | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    username: string,
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token and user from localStorage on mount
    const loadAuth = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load auth from storage:', err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Login failed') };
      }

      if (data.success && data.token && data.user) {
        // Store token and user
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        
        return { error: null };
      }

      return { error: new Error('Invalid response from server') };
    } catch (err: any) {
      console.error('Sign in error:', err);
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to sign in';
      
      if (err.message === 'Failed to fetch') {
        errorMessage = 'Cannot connect to server. Please check your internet connection and try again.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = err.message || 'Failed to sign in';
      }
      
      return { error: new Error(errorMessage) };
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
          role: 'researcher',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Registration failed') };
      }

      if (data.success) {
        // After successful registration, automatically sign in
        return await signIn(username, password);
      }

      return { error: new Error('Registration failed') };
    } catch (err: any) {
      console.error('Sign up error:', err);
      return { error: new Error(err.message || 'Failed to sign up') };
    }
  };

  const signOut = async () => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state and storage regardless of API call result
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user, // Alias for backward compatibility
        token,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}