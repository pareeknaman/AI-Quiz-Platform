import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { db, appId } from "@/lib/firebase"
import { addDoc, collection } from "firebase/firestore"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
// We NO LONGER import @google/generative-ai here

// ... (Type definitions and parseAIResponse are the same)
type GeneratedQuestion = {
  text: string
  options: string[]
  correctAnswerIndex: number
}

type GeneratedQuiz = {
  title: string
  questions: GeneratedQuestion[]
}

const parseAIResponse = (responseText: string): GeneratedQuiz | null => {
  try {
    const cleanedText = responseText
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "")
      .trim()
    return JSON.parse(cleanedText) as GeneratedQuiz
  } catch (error) {
    console.error("Failed to parse AI response:", error)
    return null
  }
}

const CreateQuizAI = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [topic, setTopic] = useState("")
  const [text, setText] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [timeLimit, setTimeLimit] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null)

  const handleGenerateQuiz = async () => {
    if (!topic.trim() && !text.trim()) {
      toast.error("Please provide a topic or paste some text.")
      return
    }

    setIsLoading(true)
    setGeneratedQuiz(null)

    // --- THIS ENTIRE FUNCTION HAS CHANGED ---
    try {
      // 1. Create the Prompts
      const systemPrompt = `
        You are an expert quiz generation API. Your sole purpose is to generate a quiz
        with ${numQuestions} multiple-choice questions based on a user's prompt.
        You MUST return ONLY a single, valid JSON object. Do not include markdown \`\`\`json or any other text.
        Your JSON MUST follow this exact structure:
        {
          "title": "A creative title for the quiz",
          "questions": [
            {
              "text": "The question text",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
              "correctAnswerIndex": 0
            }
          ]
        }
        The "correctAnswerIndex" MUST be a number between 0 and 3.
      `
      const userPrompt = text.trim() 
        ? `Generate a ${numQuestions}-question quiz based on the following text: ${text}`
        : `Generate a ${numQuestions}-question quiz on the topic of: ${topic}`

      // 2. Call OUR OWN backend API, not Google's
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ systemPrompt, userPrompt }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      const responseText = data.text;

      // 3. Parse the Response
      const parsedQuiz = parseAIResponse(responseText)

      if (parsedQuiz && parsedQuiz.questions) {
        setGeneratedQuiz(parsedQuiz)
        toast.success("Quiz generated! Review it below.")
      } else {
        throw new Error("AI returned an invalid quiz format.")
      }

    } catch (error: any) {
      console.error("Error generating quiz:", error)
      toast.error("Failed to generate quiz", {
        description: error.message || "Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
    // --- END OF CHANGES ---
  }

  // ... (handleSaveQuiz is the same)
  const handleSaveQuiz = async () => {
    if (!user || !generatedQuiz) {
      toast.error("No quiz to save.")
      return
    }

    setIsSaving(true)
    const questionsToSave = generatedQuiz.questions.map((q, index) => ({
      ...q,
      id: Date.now() + index,
    }))

    const quizData = {
      title: generatedQuiz.title,
      timeLimit: timeLimit,
      questions: JSON.stringify(questionsToSave),
      questionsCount: questionsToSave.length,
      clerkUserId: user.id,
      createdAt: new Date(),
    }

    try {
      const collectionPath = collection(db, "artifacts", appId, "users", user.id, "quizzes")
      await addDoc(collectionPath, quizData)

      toast.success("AI Quiz saved successfully!")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error saving AI quiz:", error)
      toast.error("Failed to save quiz. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // ... (The rest of the JSX is identical to before)
  return (
    <div className="flex justify-center items-start py-12">
      <Card className="w-full max-w-3xl bg-card/60 backdrop-blur-md border-golden/30 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-golden-light">
            Create Quiz with AI
          </CardTitle>
          <CardDescription>
            Provide a topic or paste text to generate your quiz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Quiz Topic</Label>
            <Input 
              id="topic" 
              placeholder="e.g., 'The Solar System' or 'React Hooks'" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading || isSaving}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="num-questions">Number of Questions</Label>
              <Input
                id="num-questions"
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={isLoading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timer">Time Limit (in minutes)</Label>
              <Input
                id="timer"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                disabled={isLoading || isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Set to 0 for no time limit.
              </p>
            </div>
          </div>
          
          <div className="relative">
             <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-golden/30" />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
             </div>
          </div>

           <div className="space-y-2">
            <Label htmlFor="manual-text">Paste Text to Generate From</Label>
            <Textarea 
              id="manual-text" 
              placeholder="Paste your article, notes, or text here..." 
              className="min-h-[150px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading || isSaving}
            />
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleGenerateQuiz}
            disabled={isLoading || isSaving}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Generate Quiz with AI"}
          </Button>

          {/* --- Review Section --- */}
          {generatedQuiz && (
            <div className="space-y-6 pt-6">
              <Separator className="bg-golden/30" />
              <h3 className="text-2xl font-semibold text-center text-white">
                Review Your Quiz
              </h3>
              <p className="text-2xl text-center font-bold text-golden-light">
                {generatedQuiz.title}
              </p>
              
              <div className="space-y-6">
                {generatedQuiz.questions.map((q, qIndex) => (
                  <Card key={qIndex} className="bg-card/80 border-golden/20 p-4">
                    <CardContent className="space-y-4 pt-6">
                      <Label className="text-lg text-white">
                        Question {qIndex + 1}: {q.text}
                      </Label>
                      <RadioGroup
                        value={q.correctAnswerIndex.toString()}
                        disabled
                      >
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <RadioGroupItem
                              value={oIndex.toString()}
                              id={`q-${qIndex}-o-${oIndex}`}
                            />
                            <Label 
                              htmlFor={`q-${qIndex}-o-${oIndex}`}
                              className={q.correctAnswerIndex === oIndex ? 'text-golden-light' : 'text-white'}
                            >
                              {opt}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </CardContent>

        {/* --- Save Button --- */}
        {generatedQuiz && (
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSaveQuiz}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Quiz...
                </>
              ) : "Save This Quiz"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default CreateQuizAI
