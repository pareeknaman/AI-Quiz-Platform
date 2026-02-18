import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, useUser } from '@clerk/clerk-react';
import Navbar from '@/components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateQuizAI from './pages/CreateQuizAI';
import CreateQuizManual from './pages/CreateQuizManual';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
// We no longer import useSyncAuth
import QuizTaker from './pages/QuizTaker';
import PastScores from './pages/PastScores';

const queryClient = new QueryClient();

// Clerk's Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// 1. ProtectedRoute Component (no changes)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="text-center py-24">
        <p className="text-white">Loading user...</p>
      </div>
    );
  }

  if (isSignedIn) {
    return <>{children}</>;
  }

  return null;
}

// 2. MainApp Component
// We removed the useSyncAuth hook.
function MainApp() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login/*"
            element={
              <div className="flex justify-center items-center py-12">
                <SignIn
                  routing="path"
                  path="/login"
                  appearance={{
                    elements: { card: "bg-card/60 backdrop-blur-md border-golden/30 shadow-xl" }
                  }}
                  afterSignInUrl="/dashboard"
                />
              </div>
            }
          />
          <Route
            path="/signup/*"
            element={
              <div className="flex justify-center items-center py-12">
                <SignUp
                  routing="path"
                  path="/signup"
                  appearance={{
                    elements: { card: "bg-card/60 backdrop-blur-md border-golden/30 shadow-xl" }
                  }}
                  afterSignUpUrl="/dashboard"
                />
              </div>
            }
          />

          {/* --- PROTECTED ROUTES --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute>
                <CreateQuizAI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-manual"
            element={
              <ProtectedRoute>
                <CreateQuizManual />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizTaker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <PastScores />
              </ProtectedRoute>
            }
          />
          {/* Public Share Route - No ProtectedRoute wrapper */}
          <Route path="/share/:userId/:quizId" element={<QuizTaker />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

// 3. ClerkProviderWithRoutes (no changes)
function ClerkProviderWithRoutes() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
    >
      <MainApp />
    </ClerkProvider>
  );
}

// 4. Top-level App Component (no changes)
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <ClerkProviderWithRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
