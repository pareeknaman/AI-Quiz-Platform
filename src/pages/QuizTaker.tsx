import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { db, appId } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, Info, Check, X, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the shape of the quiz *data*
type QuizData = {
  title: string;
  timeLimit: number;
  questions: string; // This is a JSON string
};

// Define the shape of a *parsed* question
type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
};

const QuizTaker = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // in seconds
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerInitializedRef = useRef(false);

  // 1. Fetch the quiz data
  useEffect(() => {
    if (!user || !quizId) return;

    const fetchQuiz = async () => {
      setLoading(true);
      const docPath = doc(db, "artifacts", appId, "users", user.id, "quizzes", quizId);
      try {
        const docSnap = await getDoc(docPath);
        if (docSnap.exists()) {
          const data = docSnap.data() as QuizData;
          setQuiz(data);
          // Parse the questions from the JSON string
          const parsedQuestions: Question[] = JSON.parse(data.questions);
          setQuestions(parsedQuestions);
          // Initialize an array to hold user's answers - default to option 0 (first option) for each question
          setSelectedAnswers(new Array(parsedQuestions.length).fill(0));
          // Initialize timer if timeLimit is set and greater than 0
          if (data.timeLimit && data.timeLimit > 0) {
            const initialTime = data.timeLimit * 60; // Convert minutes to seconds
            setTimeRemaining(initialTime);
            
            // Start the timer immediately after setting timeRemaining
            // Use setTimeout to ensure state is set before starting timer
            setTimeout(() => {
              if (!timerInitializedRef.current) {
                timerInitializedRef.current = true;
                timerIntervalRef.current = setInterval(() => {
                  setTimeRemaining((prev) => {
                    if (prev === null || prev <= 1) {
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }
            }, 0);
          }
        } else {
          setError("Quiz not found.");
        }
      } catch (err) {
        setError("Failed to load quiz.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, user, appId]);

  // Cleanup timer on unmount or when finished
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, []);

  // Stop timer when quiz is finished
  useEffect(() => {
    if (isFinished && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [isFinished]);

  // 4. Handle finishing the quiz (memoized with useCallback)
  const handleFinish = useCallback(() => {
    // Stop the timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Calculate score
    let newScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === questions[i].correctAnswerIndex) {
        newScore++;
      }
    }
    setScore(newScore);
    setIsFinished(true);
  }, [selectedAnswers, questions]);

  // 3. Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && !isFinished && timerInitializedRef.current) {
      handleFinish();
    }
  }, [timeRemaining, isFinished, handleFinish]);

  // 5. Handle user selecting an answer
  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  // 6. Handle moving to next question - ensure next question defaults to option 0 if not answered
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      // If the next question doesn't have an answer, default to option 0
      if (selectedAnswers[nextIndex] === null || selectedAnswers[nextIndex] === undefined) {
        const newAnswers = [...selectedAnswers];
        newAnswers[nextIndex] = 0;
        setSelectedAnswers(newAnswers);
      }
      setCurrentQuestionIndex(nextIndex);
    }
  };

  // Helper function to format time remaining
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Render States ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-golden-light" />
        <p>Loading your quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-red-500">
        <Info className="w-10 h-10" />
        <p>{error}</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!quiz) return null; // Should be covered by loading/error

  // --- Render Quiz Finished State ---
  if (isFinished) {
    return (
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-xl bg-card/60 backdrop-blur-md border-golden/30 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-golden-light">Quiz Completed!</CardTitle>
            <CardDescription>You took the quiz: {quiz.title}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-5xl font-bold text-white">
              {score} / {questions.length}
            </p>
            <p className="text-xl text-muted-foreground">
              You got {((score / questions.length) * 100).toFixed(0)}%
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Render Active Quiz State ---
  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestionIndex];
  
  // Determine timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining === null) return 'text-muted-foreground';
    if (timeRemaining <= 30) return 'text-red-500';
    if (timeRemaining <= 60) return 'text-yellow-500';
    return 'text-golden-light';
  };

  const getTimerBgColor = () => {
    if (timeRemaining === null) return 'bg-muted/20';
    if (timeRemaining <= 30) return 'bg-red-500/20 border-red-500/50';
    if (timeRemaining <= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-golden/20 border-golden/30';
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-xl bg-card/60 backdrop-blur-md border-golden/30 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold text-golden-light">{quiz.title}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardDescription>
            </div>
            {timeRemaining !== null && timeRemaining > 0 && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getTimerBgColor()}`}>
                <Clock className={`w-5 h-5 ${getTimerColor()}`} />
                <span className={`text-xl font-bold ${getTimerColor()}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {timeRemaining !== null && timeRemaining <= 60 && timeRemaining > 0 && (
            <Alert className={`${timeRemaining <= 30 ? 'bg-red-500/10 border-red-500/50' : 'bg-yellow-500/10 border-yellow-500/50'}`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-white">
                {timeRemaining <= 30 
                  ? `⚠️ Less than 30 seconds remaining!` 
                  : `⏰ Less than 1 minute remaining!`}
              </AlertDescription>
            </Alert>
          )}
          {timeRemaining === 0 && (
            <Alert className="bg-red-500/10 border-red-500/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-white">
                ⏰ Time's up! Your quiz has been automatically submitted.
              </AlertDescription>
            </Alert>
          )}
          <p className="text-lg text-white font-medium">{currentQuestion.text}</p>
          
          <RadioGroup
            value={selectedOption !== null && selectedOption !== undefined ? selectedOption.toString() : "0"}
            onValueChange={(val) => handleSelectAnswer(parseInt(val))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-lg text-white">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-end">
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                Finish Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizTaker;

