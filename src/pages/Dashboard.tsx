import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Users, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/auth';
import { getQuizzes, deleteQuiz, type Quiz } from '@/lib/storage';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load user's quizzes
    const userQuizzes = getQuizzes().filter(quiz => quiz.creatorId === user.id);
    setQuizzes(userQuizzes);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteQuiz = (quizId: string) => {
    deleteQuiz(quizId);
    const userQuizzes = getQuizzes().filter(quiz => quiz.creatorId === user?.id);
    setQuizzes(userQuizzes);
  };

  if (!user) return null;

  const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">Manage your quizzes and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
              <p className="text-xs text-muted-foreground">
                {quizzes.length > 0 ? '+1 from last week' : 'Create your first quiz'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                Across all your quizzes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Quiz Length</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes.length > 0 ? Math.round(totalQuestions / quizzes.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Questions per quiz
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/create-quiz')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Quiz
            </Button>
          </div>
        </div>

        {/* Quizzes List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Quizzes</h2>
          {quizzes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
                <p className="text-gray-600 mb-4">Create your first quiz to get started</p>
                <Button onClick={() => navigate('/create-quiz')}>
                  Create Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {quiz.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {quiz.questions.length} questions
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Created: {new Date(quiz.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}