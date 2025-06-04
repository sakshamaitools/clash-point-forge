
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateTournament = lazy(() => import("./pages/CreateTournament"));
const TournamentDetail = lazy(() => import("./pages/TournamentDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Social = lazy(() => import("./pages/Social"));
const Chat = lazy(() => import("./pages/Chat"));
const Profile = lazy(() => import("./pages/Profile"));
const Players = lazy(() => import("./pages/Players"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/create-tournament" element={<CreateTournament />} />
                <Route path="/tournament/:id" element={<TournamentDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/social" element={<Social />} />
                <Route path="/chat/:userId" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/players" element={<Players />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
