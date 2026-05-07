import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ThemeProvider } from "next-themes";
import FacebookPixelTracker from "./components/FacebookPixelTracker";
import Index from "./pages/Index";
import Cadastro from "./pages/Cadastro";
import DashboardPage from "./pages/DashboardPage";
import DashboardPago from "./pages/DashboardPago";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AdminRegister from "./pages/AdminRegister";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FacebookPixelTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/cadastroadmin" element={<AdminRegister />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboardpago" element={<DashboardPago />} />
              <Route path="/privacidade" element={<PrivacyPolicy />} />
              <Route path="/termos" element={<TermsOfUse />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;