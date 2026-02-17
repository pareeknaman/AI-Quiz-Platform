import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserQuizAttempts } from '@/lib/firebase';
import type { QuizAttempt } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Info, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import { toast } from 'sonner';

const PastScores = () => {
    const { user } = useUser();
    const [attempts, setAttempts] = useState<QuizAttempt[] | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchAttempts = async () => {
            try {
                const data = await getUserQuizAttempts(user.id);
                setAttempts(data);
            } catch (error) {
                console.error("Failed to fetch attempts:", error);
                toast.error("Failed to load history. Please refresh.");
                setAttempts([]);
            }
        };

        fetchAttempts();
    }, [user]);

    if (attempts === null) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin text-golden-light" />
                <p>Loading your history...</p>
            </div>
        );
    }

    if (attempts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
                <Info className="w-10 h-10 text-golden-light" />
                <p>You haven't taken any quizzes yet.</p>
                <Button asChild>
                    <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <History className="w-8 h-8 text-golden-light" />
                <h2 className="text-3xl font-bold text-white">Your Quiz History</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {attempts.map((attempt, index) => (
                    <Card key={index} className="bg-card/60 backdrop-blur-md border-golden/30 shadow-md hover:border-golden-light/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-xl text-golden-light">{attempt.quizTitle}</CardTitle>
                                <CardDescription>
                                    {attempt.timestamp.toLocaleDateString()} at {attempt.timestamp.toLocaleTimeString()}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-white">
                                    {attempt.score} / {attempt.totalQuestions}
                                </span>
                                <div className="text-xs text-muted-foreground">
                                    Score: {((attempt.score / attempt.totalQuestions) * 100).toFixed(0)}%
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PastScores;
