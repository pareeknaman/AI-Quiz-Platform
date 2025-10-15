import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, Clock, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Amazing Quizzes with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build engaging quizzes in seconds using our AI assistant, or create them manually. 
            Perfect for educators, trainers, and anyone who loves learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to create and share quizzes
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features designed to make quiz creation simple and engaging
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>AI-Powered Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate quiz questions automatically on any topic using advanced AI technology
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Easy Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share your quizzes with students, colleagues, or friends with just a link
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Timed Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set time limits for your quizzes to create engaging, challenging experiences
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Instant Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get immediate feedback with detailed results and performance analytics
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to revolutionize your quizzes?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of educators and learners who are already using QuizMaster AI
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}