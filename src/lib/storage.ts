export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  creatorId: string;
  createdAt: string;
  timeLimit?: number; // in minutes
  isPublic: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number; // in seconds
  answers: number[]; // user's selected answers
}

const QUIZZES_STORAGE_KEY = 'quizmaster_quizzes';
const RESULTS_STORAGE_KEY = 'quizmaster_results';

export const getQuizzes = (): Quiz[] => {
  try {
    const stored = localStorage.getItem(QUIZZES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const createQuiz = (quizData: { title: string; description: string; questions: Question[]; creatorId: string }): Quiz => {
  const quiz: Quiz = {
    id: Date.now().toString(),
    title: quizData.title,
    description: quizData.description,
    questions: quizData.questions,
    creatorId: quizData.creatorId,
    createdAt: new Date().toISOString(),
    isPublic: false
  };
  
  saveQuiz(quiz);
  return quiz;
};

export const saveQuiz = (quiz: Quiz): void => {
  try {
    const quizzes = getQuizzes();
    const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
    
    if (existingIndex >= 0) {
      quizzes[existingIndex] = quiz;
    } else {
      quizzes.push(quiz);
    }
    
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
  } catch (error) {
    console.error('Error saving quiz:', error);
  }
};

export const deleteQuiz = (quizId: string): void => {
  try {
    const quizzes = getQuizzes().filter(q => q.id !== quizId);
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
  } catch (error) {
    console.error('Error deleting quiz:', error);
  }
};

export const getQuizById = (id: string): Quiz | null => {
  const quizzes = getQuizzes();
  return quizzes.find(q => q.id === id) || null;
};

export const getUserQuizzes = (userId: string): Quiz[] => {
  return getQuizzes().filter(q => q.creatorId === userId);
};

export const getResults = (): QuizResult[] => {
  try {
    const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveResult = (result: QuizResult): void => {
  try {
    const results = getResults();
    results.push(result);
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
  } catch (error) {
    console.error('Error saving result:', error);
  }
};

export const getUserResults = (userId: string): QuizResult[] => {
  return getResults().filter(r => r.userId === userId);
};

// Mock AI quiz generation
export const generateAIQuestions = async (topic: string, questionCount: number = 10): Promise<Question[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock questions based on topic
  const mockQuestions: Question[] = [];
  
  for (let i = 1; i <= questionCount; i++) {
    mockQuestions.push({
      id: `q_${Date.now()}_${i}`,
      question: `Sample question ${i} about ${topic}?`,
      options: [
        `Option A for ${topic}`,
        `Option B for ${topic}`,
        `Option C for ${topic}`,
        `Option D for ${topic}`
      ],
      correctAnswer: Math.floor(Math.random() * 4)
    });
  }
  
  return mockQuestions;
};