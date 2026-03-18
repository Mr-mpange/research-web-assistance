import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { RoleBasedRedirect } from "@/components/auth/RoleBasedRedirect";
import { PublicLayout } from "@/components/public/PublicLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DataEthics from "./pages/DataEthics";
import CaseStudies from "./pages/CaseStudies";
import Pricing from "./pages/Pricing";
import Resources from "./pages/Resources";
import Auth from "./pages/Auth";

// Dashboard pages
import DashboardOverview from "./pages/DashboardOverview";
import VoiceRecords from "./pages/VoiceRecords";
import Transcriptions from "./pages/Transcriptions";
import AISummaries from "./pages/AISummaries";
import ResearchQuestions from "./pages/ResearchQuestions";
import Participants from "./pages/Participants";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import SMSManagement from "./pages/SMSManagement";
import UserManagement from "./pages/UserManagement";
import ResearchMarketplace from "./pages/ResearchMarketplace";
import ProjectQuestionFlow from "./pages/ProjectQuestionFlow";
import Projects from "./pages/Projects";
import ProjectInsights from "./pages/ProjectInsights";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

 const App = () => (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
       <Toaster />
       <Sonner />
       <BrowserRouter
         basename={import.meta.env.BASE_URL}
         future={{
           v7_startTransition: true,
           v7_relativeSplatPath: true,
         }}
       >
         <AuthProvider>
           <Routes>
             {/* Public Routes */}
             <Route element={<PublicLayout />}>
               <Route path="/" element={<Home />} />
               <Route path="/features" element={<Features />} />
               <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/data-ethics" element={<DataEthics />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/resources" element={<Resources />} />
              </Route>
             <Route path="/auth" element={<Auth />} />
             {/* Public participant routes */}
             <Route path="/marketplace" element={<ResearchMarketplace />} />
             <Route path="/project/:id" element={<ProjectQuestionFlow />} />
 
             {/* Protected Dashboard Routes */}
             <Route
               element={
                 <ProtectedRoute>
                   <DashboardLayout />
                 </ProtectedRoute>
               }
             >
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/voice-records" element={<VoiceRecords />} />
              <Route path="/transcriptions" element={<Transcriptions />} />
              <Route path="/summaries" element={<AISummaries />} />
              <Route path="/questions" element={<ResearchQuestions />} />
              <Route path="/participants" element={<Participants />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/dashboard/projects/:id/insights" element={<ProjectInsights />} />
            </Route>
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <DashboardLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="sms" element={<SMSManagement />} />
            </Route>
            
            {/* Admin-only User Management */}
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <DashboardLayout />
                </AdminRoute>
              }
            >
              <Route index element={<UserManagement />} />
            </Route>
            
            {/* Admin-only SMS Management */}
            <Route
              path="/sms"
              element={
                <AdminRoute>
                  <DashboardLayout />
                </AdminRoute>
              }
            >
              <Route index element={<SMSManagement />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
           </Routes>
         </AuthProvider>
       </BrowserRouter>
     </TooltipProvider>
   </QueryClientProvider>
 );

export default App;
