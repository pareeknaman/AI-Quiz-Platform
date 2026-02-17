import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b border-golden/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-golden-light">
          AI Quiz Platform
        </Link>
        <div>
          {/* Show profile button if logged in */}
          <SignedIn>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link to="/history">History</Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          {/* Show Log In/Sign Up if logged out */}
          <SignedOut>
            <div className="space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
