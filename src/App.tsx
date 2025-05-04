import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatbotButton from './components/ui/ChatbotButton';

// Eagerly loaded pages
import Index from './pages/Index';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Settings  from './pages/Settings';
import AuthSuccess from './pages/AuthSuccess';
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from './pages/ResetPassword';

console.log("✅ ENV:", import.meta.env.VITE_REACT_APP_API_URL);


// Lazy loaded pages
const Profile = lazy(() => import('./pages/Profile'));
const LibraryDetail = lazy(() => import('./pages/LibraryDetail'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Spinner component for loading states
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spinner h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/profile" replace />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
    <Route path="/reset-password" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/auth-success" element={<AuthSuccess />} />
    <Route path="/verify-code" element={<VerifyCode />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route
      path="/search"
      element={
        <Suspense fallback={<Spinner />}>
          <SearchResults />
        </Suspense>
      }
    />

    {/* Protected routes */}
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Suspense fallback={<Spinner />}>
            <Profile />
          </Suspense>
        </ProtectedRoute>
      }
    />
    <Route
      path="/library/:id"
      element={
        <ProtectedRoute>
          <Suspense fallback={<Spinner />}>
            <LibraryDetail />
          </Suspense>
        </ProtectedRoute>
      }
    />
    <Route
      path="/compare"
      element={
        <ProtectedRoute>
          <Suspense fallback={<Spinner />}>
            <ComparisonPage />
          </Suspense>
        </ProtectedRoute>
      }
    />

    {/* Admin-only route */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <Suspense fallback={<Spinner />}>
            <AdminPanel />
          </Suspense>
        </AdminRoute>
      }
    />

    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Suspense fallback={<Spinner />}>
            <Settings />
          </Suspense>
        </ProtectedRoute>
      }
    />


    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-[73px]">
              <AppRoutes />
            </main>
            <Footer />
            <ChatbotButton />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
