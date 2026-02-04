import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import VoiceRecords from "./pages/VoiceRecords";
import Transcriptions from "./pages/Transcriptions";
import ResearchQuestions from "./pages/ResearchQuestions";
import Participants from "./pages/Participants";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
