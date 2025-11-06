import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      {/* Hero Title */}
      <h2 className="text-5xl font-extrabold text-white mb-4 mt-8">
        Welcome to the <span className="text-golden-light">AI Quiz Platform</span>
      </h2>

      {/* Main Call-to-Action Card */}
      <Card className="max-w-md mx-auto bg-card/60 backdrop-blur-md border-golden/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-golden-light">Create a Quiz</CardTitle>
          <CardDescription>Start building your first AI-powered quiz.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full text-lg" asChild>
            <Link to="/create-quiz">Get Started</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Feature Cards Section */}
      <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* Card 1: Create & Share */}
        <Card className="bg-card/60 backdrop-blur-md border-golden/30 shadow-xl transition-all duration-300 hover:border-golden-light/50">
          <CardHeader>
            <div className="mb-4">
              <svg className="w-10 h-10 text-golden-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125l-2.685 2.686m0 0l-2.685-2.686m2.685 2.686l2.685 2.686" />
              </svg>
            </div>
            <CardTitle className="text-lg font-semibold text-golden-light">Create & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Build custom quizzes from scratch or with our tools. Share them easily with a unique link for anyone to take.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Engaging Learning */}
        <Card className="bg-card/60 backdrop-blur-md border-golden/30 shadow-xl transition-all duration-300 hover:border-golden-light/50">
          <CardHeader>
            <div className="mb-4">
              <svg className="w-10 h-10 text-golden-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.036a3.375 3.375 0 002.456 2.455l1.035.259-.259 1.035a3.375 3.375 0 00-2.456 2.456zM16.898 20.62L16.5 21.75l-.398-1.13a3.375 3.375 0 00-2.455-2.456L12.75 18l1.13-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.13a3.375 3.375 0 002.456 2.455l1.13.398-.398 1.13a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>
            <CardTitle className="text-lg font-semibold text-golden-light">Engaging Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Turn study materials or training documents into interactive quizzes that boost retention and engagement.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: AI Generation */}
        <Card className="bg-card/60 backdrop-blur-md border-golden/30 shadow-xl transition-all duration-300 hover:border-golden-light/50">
          <CardHeader>
            <div className="mb-4">
              <svg className="w-10 h-10 text-golden-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 16.5V21m3.75-18v1.5m0 16.5V21m-7.5-1.5h1.5m-1.5-6H12m0 6h1.5m-1.5-6H12m0 6h1.5m-1.5-6H12m6.75-4.5h1.5m-1.5 6h1.5m-1.5 6h1.5m-6.75-1.5h1.5m-1.5-6h1.5m-1.5-6h1.5M12 9.75h.008v.008H12V9.75z" />
              </svg>
            </div>
            <CardTitle className="text-lg font-semibold text-golden-light">AI-Powered Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Save time by letting our intelligent assistant create relevant, accurate questions based on any topic.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Home;
