
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
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
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen bg-gray-50 flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <header className="h-12 flex items-center border-b border-purple-500/30 bg-gradient-to-r from-gray-900 to-purple-900/50 px-4">
                  <SidebarTrigger className="text-white" />
                  <div className="flex-1">
                    <Navbar />
                  </div>
                </header>
                <main className="flex-1">
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
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
