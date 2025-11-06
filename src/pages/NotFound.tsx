import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-24">
      <h2 className="text-6xl font-extrabold text-golden-light mb-4">404</h2>
      <p className="text-2xl text-white mb-8">Page Not Found</p>
      <p className="text-muted-foreground mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
