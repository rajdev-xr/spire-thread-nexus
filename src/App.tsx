
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateThreadPage from "./pages/CreateThreadPage";
import EditThreadPage from "./pages/EditThreadPage";
import ThreadDetailPage from "./pages/ThreadDetailPage";
import MyThreadsPage from "./pages/MyThreadsPage";
import CollectionsPage from "./pages/CollectionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/create" element={<CreateThreadPage />} />
                <Route path="/edit/:id" element={<EditThreadPage />} />
                <Route path="/thread/:id" element={<ThreadDetailPage />} />
                <Route path="/my-threads" element={<MyThreadsPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
