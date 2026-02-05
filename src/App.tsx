 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as Sonner } from "@/components/ui/sonner";
 import { TooltipProvider } from "@/components/ui/tooltip";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { AuthProvider } from "@/contexts/AuthContext";
 import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
 import { DashboardLayout } from "./components/layout/DashboardLayout";
 import DashboardOverview from "./pages/DashboardOverview";
 import VoiceRecords from "./pages/VoiceRecords";
 import Transcriptions from "./pages/Transcriptions";
 import ResearchQuestions from "./pages/ResearchQuestions";
 import Participants from "./pages/Participants";
 import Reports from "./pages/Reports";
 import Settings from "./pages/Settings";
 import Auth from "./pages/Auth";
 import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

 const App = () => (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
       <Toaster />
       <Sonner />
       <BrowserRouter>
         <AuthProvider>
           <Routes>
             <Route path="/auth" element={<Auth />} />
             <Route
               element={
                 <ProtectedRoute>
                   <DashboardLayout />
                 </ProtectedRoute>
               }
             >
               <Route path="/" element={<DashboardOverview />} />
               <Route path="/voice-records" element={<VoiceRecords />} />
               <Route path="/transcriptions" element={<Transcriptions />} />
               <Route path="/summaries" element={<Transcriptions />} />
               <Route path="/questions" element={<ResearchQuestions />} />
               <Route path="/participants" element={<Participants />} />
               <Route path="/reports" element={<Reports />} />
               <Route path="/settings" element={<Settings />} />
             </Route>
             <Route path="*" element={<NotFound />} />
           </Routes>
         </AuthProvider>
       </BrowserRouter>
     </TooltipProvider>
   </QueryClientProvider>
 );

export default App;
