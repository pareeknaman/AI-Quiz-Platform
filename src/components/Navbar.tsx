import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getAuthState, logout } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [authState, setAuthState] = useState(getAuthState());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(getAuthState());
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom auth events
    window.addEventListener('authStateChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setAuthState({ user: null, isAuthenticated: false });
    window.dispatchEvent(new Event('authStateChanged'));
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900">QuizMaster AI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <>
                <span className="text-gray-700">Welcome, {authState.user?.name}</span>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}