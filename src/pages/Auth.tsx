 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { z } from "zod";
 import { useAuth } from "@/contexts/AuthContext";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Loader2, Mail, Lock, User, Building } from "lucide-react";
 
 const loginSchema = z.object({
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
 });
 
 const signupSchema = z.object({
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
   firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
   lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
   organization: z.string().max(100, "Organization name is too long").optional(),
 });
 
 export default function Auth() {
   const [isLogin, setIsLogin] = useState(true);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);
   const [formData, setFormData] = useState({
     email: "",
     password: "",
     firstName: "",
     lastName: "",
     organization: "",
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
           email: formData.email,
           password: formData.password,
         });
 
         setLoading(true);
         const { error } = await signIn(validatedData.email, validatedData.password);
 
         if (error) {
           if (error.message.includes("Invalid login credentials")) {
             setError("Invalid email or password. Please try again.");
           } else if (error.message.includes("Email not confirmed")) {
             setError("Please verify your email address before signing in.");
           } else {
           setError(error.message);
           }
         } else {
           navigate("/dashboard");
         }
       } else {
         const validatedData = signupSchema.parse({
           email: formData.email,
           password: formData.password,
           firstName: formData.firstName,
           lastName: formData.lastName,
           organization: formData.organization || undefined,
         });
 
         setLoading(true);
         const { error } = await signUp(
           validatedData.email,
           validatedData.password,
           validatedData.firstName,
           validatedData.lastName,
           validatedData.organization
         );
 
         if (error) {
           if (error.message.includes("already registered")) {
             setError("This email is already registered. Please sign in instead.");
           } else {
             setError(error.message);
           }
         } else {
           setSuccessMessage(
             "Account created! Please check your email to verify your account before signing in."
           );
           setFormData({
             email: "",
             password: "",
             firstName: "",
             lastName: "",
             organization: "",
           });
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
 
             {!isLogin && (
               <>
                 <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                     <Label htmlFor="firstName">First Name</Label>
                     <div className="relative">
                       <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                       <Input
                         id="firstName"
                         name="firstName"
                         placeholder="Amina"
                         value={formData.firstName}
                         onChange={handleInputChange}
                         className="pl-9"
                       />
                     </div>
                     {fieldErrors.firstName && (
                       <p className="text-xs text-destructive">{fieldErrors.firstName}</p>
                     )}
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="lastName">Last Name</Label>
                     <div className="relative">
                       <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                       <Input
                         id="lastName"
                         name="lastName"
                         placeholder="Osei"
                         value={formData.lastName}
                         onChange={handleInputChange}
                         className="pl-9"
                       />
                     </div>
                     {fieldErrors.lastName && (
                       <p className="text-xs text-destructive">{fieldErrors.lastName}</p>
                     )}
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="organization">Organization (Optional)</Label>
                   <div className="relative">
                     <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input
                       id="organization"
                       name="organization"
                       placeholder="University of Nairobi"
                       value={formData.organization}
                       onChange={handleInputChange}
                       className="pl-9"
                     />
                   </div>
                   {fieldErrors.organization && (
                     <p className="text-xs text-destructive">{fieldErrors.organization}</p>
                   )}
                 </div>
               </>
             )}
 
             <div className="space-y-2">
               <Label htmlFor="email">Email Address</Label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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