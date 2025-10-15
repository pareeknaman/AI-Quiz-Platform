import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}