 import {
   createContext,
   useContext,
   useEffect,
   useState,
   ReactNode,
 } from "react";
 import { User, Session } from "@supabase/supabase-js";
 import { supabase } from "@/integrations/supabase/client";
 import { Tables } from "@/integrations/supabase/types";
 
 type Profile = Tables<"profiles">;
 
 interface AuthContextType {
   user: User | null;
   session: Session | null;
   profile: Profile | null;
   loading: boolean;
   signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
   signUp: (
     email: string,
     password: string,
     firstName: string,
     lastName: string,
     organization?: string
   ) => Promise<{ error: Error | null }>;
   signOut: () => Promise<void>;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [profile, setProfile] = useState<Profile | null>(null);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     let mounted = true;
     
     // Set up auth state listener FIRST
     const {
       data: { subscription },
     } = supabase.auth.onAuthStateChange((event, session) => {
       if (!mounted) return;
       
       setSession(session);
       setUser(session?.user ?? null);
 
       // Defer profile fetch with setTimeout to avoid deadlock
       if (session?.user) {
         setTimeout(() => {
           if (mounted) {
             fetchProfile(session.user.id);
           }
         }, 0);
       } else {
         setProfile(null);
       }
     });
 
     // THEN check for existing session with timeout protection
     const loadSession = async () => {
       try {
         const { data: { session }, error } = await supabase.auth.getSession();
         
         if (!mounted) return;
         
         if (error) {
           console.error('Session load error:', error);
         }
         
         setSession(session);
         setUser(session?.user ?? null);
 
         if (session?.user) {
           await fetchProfile(session.user.id);
         }
       } catch (err) {
         console.error('Failed to load session:', err);
       } finally {
         if (mounted) {
           setLoading(false);
         }
       }
     };
     
     loadSession();
 
     return () => {
       mounted = false;
       subscription.unsubscribe();
     };
   }, []);
 
   const fetchProfile = async (userId: string) => {
     try {
       const { data, error } = await supabase
         .from("profiles")
         .select("*")
         .eq("user_id", userId)
         .maybeSingle();
 
       if (!error && data) {
         setProfile(data);
       } else if (error) {
         console.error('Profile fetch error:', error);
       }
     } catch (err) {
       console.error('Failed to fetch profile:', err);
     }
   };
 
   const signIn = async (email: string, password: string) => {
     try {
       const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
       return { error: error as Error | null };
     } catch (err: any) {
       console.error('Sign in error:', err);
       return { error: new Error(err.message || 'Failed to sign in') };
     }
   };
 
   const signUp = async (
     email: string,
     password: string,
     firstName: string,
     lastName: string,
     organization?: string
   ) => {
     const redirectUrl = `${window.location.origin}/dashboard`;
 
     const { error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         emailRedirectTo: redirectUrl,
         data: {
           first_name: firstName,
           last_name: lastName,
           organization: organization || "",
         },
       },
     });
     return { error: error as Error | null };
   };
 
   const signOut = async () => {
     await supabase.auth.signOut();
     setUser(null);
     setSession(null);
     setProfile(null);
   };
 
   return (
     <AuthContext.Provider
       value={{
         user,
         session,
         profile,
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