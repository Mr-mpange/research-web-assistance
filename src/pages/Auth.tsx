 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { z } from "zod";
 import { useAuth } from "@/contexts/AuthContext";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Loader2, Lock, User } from "lucide-react";
 
 const loginSchema = z.object({
   username: z.string().min(3, "Username must be at least 3 characters"),
   password: z.string().min(6, "Password must be at least 6 characters"),
 });
 
 const signupSchema = z.object({
   username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username is too long"),
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
   fullName: z.string().min(1, "Full name is required").max(255, "Full name is too long"),
 });
 
 export default function Auth() {
   const [isLogin, setIsLogin] = useState(true);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);
   const [formData, setFormData] = useState({
     username: "",
     email: "",
     password: "",
     fullName: "",
   });
   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
 
   const { signIn, signUp } = useAuth();
   const navigate = useNavigate();
 
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
     if (fieldErrors[name]) {
       setFieldErrors((prev) => ({ ...prev, [name]: "" }));
     }
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null);
     setSuccessMessage(null);
     setFieldErrors({});
 
     try {
       if (isLogin) {
         const validatedData = loginSchema.parse({
           username: formData.username,
           password: formData.password,
         });
 
         setLoading(true);
         const { error } = await signIn(validatedData.username, validatedData.password);
 
         if (error) {
           if (error.message.includes("Invalid credentials")) {
             setError("Invalid username or password. Please try again.");
           } else if (error.message.includes("deactivated")) {
             setError("Your account has been deactivated. Please contact support.");
           } else if (error.message.includes("pending approval") || error.message.includes("Account pending")) {
             setError("Your account is pending admin approval. You will be notified once approved.");
           } else if (error.message.includes("rejected") || error.message.includes("not approved")) {
             setError("Your account registration was not approved. Please contact support for more information.");
           } else if (error.message.includes("inactive")) {
             setError("Your account has been deactivated. Please contact support.");
           } else {
             setError(error.message);
           }
         } else {
           navigate("/dashboard");
         }
       } else {
         const validatedData = signupSchema.parse({
           username: formData.username,
           email: formData.email,
           password: formData.password,
           fullName: formData.fullName,
         });
 
         setLoading(true);
         const { error } = await signUp(
           validatedData.username,
           validatedData.email,
           validatedData.password,
           validatedData.fullName
         );
 
         if (error) {
           if (error.message.includes("already exists")) {
             setError("This username or email is already registered. Please sign in instead.");
           } else {
             setError(error.message);
           }
         } else {
           setSuccessMessage(
             "Account created successfully! Your account is pending admin approval. You will be notified once approved and can then sign in."
           );
           setFormData({
             username: "",
             email: "",
             password: "",
             fullName: "",
           });
           // Don't auto-switch to login since they can't login yet
         }
       }
     } catch (err) {
       if (err instanceof z.ZodError) {
         const errors: Record<string, string> = {};
         err.errors.forEach((e) => {
           if (e.path[0]) {
             errors[e.path[0] as string] = e.message;
           }
         });
         setFieldErrors(errors);
       }
     } finally {
       setLoading(false);
     }
   };
 
   const toggleMode = () => {
     setIsLogin(!isLogin);
     setError(null);
     setSuccessMessage(null);
     setFieldErrors({});
   };
 
   return (
     <div className="flex min-h-screen items-center justify-center bg-background px-4">
       <div className="w-full max-w-md space-y-6">
         <div className="text-center">
           <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded bg-primary text-primary-foreground text-lg font-bold">
             VR
           </div>
           <h1 className="text-xl font-semibold text-foreground">
             Voice Research System
           </h1>
           <p className="text-sm text-muted-foreground">
             {isLogin ? "Sign in to your account" : "Create a new account"}
           </p>
         </div>
 
         <div className="rounded-md border bg-card p-6">
           <form onSubmit={handleSubmit} className="space-y-4">
             {successMessage && (
               <div className="rounded-md bg-success/10 p-3 text-sm text-success">
                 {successMessage}
               </div>
             )}
 
             {error && (
               <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                 {error}
               </div>
             )}
 
             <div className="space-y-2">
               <Label htmlFor="username">Username</Label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                 <Input
                   id="username"
                   name="username"
                   placeholder="johndoe"
                   value={formData.username}
                   onChange={handleInputChange}
                   className="pl-9"
                 />
               </div>
               {fieldErrors.username && (
                 <p className="text-xs text-destructive">{fieldErrors.username}</p>
               )}
             </div>

             {!isLogin && (
               <>
                 <div className="space-y-2">
                   <Label htmlFor="email">Email Address</Label>
                   <div className="relative">
                     <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input
                       id="email"
                       name="email"
                       type="email"
                       placeholder="you@example.com"
                       value={formData.email}
                       onChange={handleInputChange}
                       className="pl-9"
                     />
                   </div>
                   {fieldErrors.email && (
                     <p className="text-xs text-destructive">{fieldErrors.email}</p>
                   )}
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="fullName">Full Name</Label>
                   <div className="relative">
                     <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input
                       id="fullName"
                       name="fullName"
                       placeholder="John Doe"
                       value={formData.fullName}
                       onChange={handleInputChange}
                       className="pl-9"
                     />
                   </div>
                   {fieldErrors.fullName && (
                     <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
                   )}
                 </div>
               </>
             )}
 
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                 <Input
                   id="password"
                   name="password"
                   type="password"
                   placeholder="••••••••"
                   value={formData.password}
                   onChange={handleInputChange}
                   className="pl-9"
                 />
               </div>
               {fieldErrors.password && (
                 <p className="text-xs text-destructive">{fieldErrors.password}</p>
               )}
             </div>
 
             <Button type="submit" className="w-full" disabled={loading}>
               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isLogin ? "Sign In" : "Create Account"}
             </Button>
           </form>
 
           <div className="mt-4 text-center text-sm">
             <span className="text-muted-foreground">
               {isLogin ? "Don't have an account? " : "Already have an account? "}
             </span>
             <button
               type="button"
               onClick={toggleMode}
               className="font-medium text-primary hover:underline"
             >
               {isLogin ? "Sign up" : "Sign in"}
             </button>
           </div>
         </div>
 
         <p className="text-center text-xs text-muted-foreground">
           Kenya Health Survey 2024 • Research Dashboard
         </p>
       </div>
     </div>
   );
 }