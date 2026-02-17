import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BrainCircuit, PenSquare, Loader2, Info, Share2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { db, appId } from '@/lib/firebase';
// Import 'doc' and 'deleteDoc' from Firestore
import { collection, query, onSnapshot, DocumentData, doc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define the shape of our quiz data from Firestore
type Quiz = {
  id: string;
  title: string;
  questionsCount: number;
  createdAt: Date;
};

const Dashboard = () => {
  const { user } = useUser();
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null); // null = loading

  // This useEffect sets up a REAL-TIME listener for quizzes.
  useEffect(() => {
    if (!user) return; // Wait for the user to be loaded

    const collectionPath = collection(db, "artifacts", appId, "users", user.id, "quizzes");
    const q = query(collectionPath);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const quizzesList: Quiz[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        quizzesList.push({
          id: doc.id,
          title: doc.data().title,
          questionsCount: doc.data().questionsCount,
          createdAt: doc.data().createdAt.toDate(), // Convert Firestore Timestamp to JS Date
        });
      });

      // Sort manually in JavaScript, which is safer
      quizzesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setQuizzes(quizzesList);
    }, (error) => {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load your quizzes.");
    });

    // Cleanup: This stops listening when the component unmounts
    return () => unsubscribe();

  }, [user]); // Re-run this effect if the user changes

  // --- NEW: Delete Function ---
  const handleDeleteQuiz = async (quizId: string) => {
    // We won't add a confirmation modal for simplicity, but you could add one here.
    // e.g., if (window.confirm("Are you sure you want to delete this quiz?")) { ... }
    // NOTE: We avoid window.confirm as it's blocked. A custom modal would be needed.

    if (!user) {
      toast.error("You must be logged in to delete a quiz.");
      return;
    }

    const docPath = doc(db, "artifacts", appId, "users", user.id, "quizzes", quizId);

    try {
      await deleteDoc(docPath);
      toast.success("Quiz deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz", {
        description: error.message,
      });
    }
  };

  const handleShareQuiz = (quizId: string) => {
    if (!user) return;
    const shareUrl = `${window.location.origin}/share/${user.id}/${quizId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Link copied to clipboard!", {
        description: "You can now share this quiz with anyone."
      });
    }).catch(() => {
      toast.error("Failed to copy link.");
    });
  };

  // Helper function to render the list of quizzes
  const renderQuizList = () => {
    // State 1: Loading
    if (quizzes === null) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-golden-light" />
          <p>Loading your quizzes...</p>
        </div>
      );
    }

    // State 2: Empty
    if (quizzes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
          <Info className="w-10 h-10 text-golden-light" />
          <p>You haven't created any quizzes yet.</p>
          <Button asChild>
            <Link to="/create-manual">Create your first quiz!</Link>
          </Button>
        </div>
      );
    }

    // State 3: Quizzes available
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="bg-card/60 backdrop-blur-md border-golden/30 shadow-xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-golden-light">{quiz.title}</CardTitle>
              <CardDescription>{quiz.questionsCount} Questions</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Your custom-built quiz.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">

              {/* --- THIS IS THE CHANGE --- */}
              <Button
                variant="destructive"
                onClick={() => handleDeleteQuiz(quiz.id)}
              >
                Delete
              </Button>
              <Button asChild>
                <Link to={`/quiz/${quiz.id}`}>Start Quiz</Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShareQuiz(quiz.id)}
                title="Share Quiz"
              >
                <Share2 className="w-4 h-4" />
              </Button>

            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Section 1: Creation Options (Same as before) */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-6">Start Creating</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/60 backdrop-blur-md border-golden/30 shadow-xl transition-all duration-300 hover:border-golden-light/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <BrainCircuit className="w-10 h-10 text-golden-light" />
              <CardTitle className="text-2xl font-semibold text-golden-light">
                Create with AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Let our AI generate a quiz for you based on a topic or your pasted text.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/create-quiz">Generate AI Quiz</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-card/60 backdrop-blur-md border-golden/30 shadow-xl transition-all duration-300 hover:border-golden-light/50">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <PenSquare className="w-10 h-10 text-golden-light" />
              <CardTitle className="text-2xl font-semibold text-golden-light">
                Create Manually
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build a custom quiz from scratch. Add questions, options, and set a timer.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/create-manual">Build Manual Quiz</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* --- THIS IS THE CHANGE --- */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-6">Saved Quizzes</h2>
        {renderQuizList()}
      </div>

    </div>
  );
};

export default Dashboard;
