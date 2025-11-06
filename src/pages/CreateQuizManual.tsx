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
import { X } from "lucide-react"
import { useUser } from "@clerk/clerk-react" // Import Clerk's useUser hook
import { db, appId } from "@/lib/firebase" // Import our Firebase setup
import { addDoc, collection } from "firebase/firestore" // Import Firestore functions
import { toast } from "sonner" // Import the toast notification
import { useNavigate } from "react-router-dom" // To redirect after saving

// Define the shape of a question
type Question = {
  id: number
  text: string
  options: string[]
  correctAnswerIndex: number
}

const CreateQuizManual = () => {
  const { user } = useUser() // Get the authenticated user
  const navigate = useNavigate() // Get the navigation function
  const [title, setTitle] = useState("")
  const [timeLimit, setTimeLimit] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    },
  ])
  const [isSaving, setIsSaving] = useState(false)

  // --- Question Handlers ---
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(), // Simple unique ID
        text: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ])
  }

  const removeQuestion = (id: number) => {
    // Keep at least one question
    if (questions.length <= 1) return;
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateQuestionText = (id: number, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text } : q))
    )
  }

  const updateOptionText = (qId: number, oIndex: number, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === oIndex ? text : opt)),
            }
          : q
      )
    )
  }

  const setCorrectAnswer = (qId: number, oIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, correctAnswerIndex: oIndex } : q
      )
    )
  }

  // --- Form Submit ---
  const handleSaveQuiz = async () => {
    if (!user) {
      toast.error("You must be logged in to save a quiz.")
      return
    }
    if (!title.trim()) {
      toast.error("Please enter a quiz title.")
      return
    }

    setIsSaving(true)
    
    // This is the quiz data we will save
    const quizData = {
      title,
      timeLimit,
      // We must stringify the questions array to save it in Firestore
      // as Firestore has limitations on complex nested arrays.
      questions: JSON.stringify(questions), 
      questionsCount: questions.length, // Store the count for easy display
      clerkUserId: user.id, // Link the quiz to the user
      createdAt: new Date(),
    }

    try {
      // This is the path to the user's private quiz collection
      // /artifacts/{appId}/users/{userId}/quizzes
      const collectionPath = collection(db, "artifacts", appId, "users", user.id, "quizzes")
      
      // Save the document
      await addDoc(collectionPath, quizData)

      toast.success("Quiz saved successfully!")
      navigate("/dashboard") // Go back to the dashboard
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast.error("Failed to save quiz. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex justify-center items-start py-12">
      <Card className="w-full max-w-3xl bg-card/60 backdrop-blur-md border-golden/30 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-golden-light">
            Create Quiz Manually
          </CardTitle>
          <CardDescription>
            Build your custom quiz, question by question.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* --- Quiz Details --- */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                placeholder="e.g., 'Solar System Basics'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timer">Time Limit (in minutes)</Label>
              <Input
                id="timer"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Set to 0 for no time limit.
              </p>
            </div>
          </div>

          <Separator className="bg-golden/30" />

          {/* --- Questions List --- */}
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <Card key={q.id} className="bg-card/80 border-golden/20 p-4 relative">
                <CardContent className="space-y-4 pt-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length <= 1 || isSaving}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`q-text-${q.id}`}>
                      Question {qIndex + 1}
                    </Label>
                    <Textarea
                      id={`q-text-${q.id}`}
                      placeholder="e.g., 'What is the 3rd planet from the sun?'"
                      value={q.text}
                      onChange={(e) => updateQuestionText(q.id, e.target.value)}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options (Select the correct answer)</Label>
                    <RadioGroup
                      value={q.correctAnswerIndex.toString()}
                      onValueChange={(val) => setCorrectAnswer(q.id, parseInt(val))}
                      disabled={isSaving}
                    >
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={oIndex.toString()}
                            id={`q-${q.id}-o-${oIndex}`}
                          />
                          <Input
                            id={`q-${q.id}-o-${oIndex}-text`}
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) =>
                              updateOptionText(q.id, oIndex, e.target.value)
                            }
                            disabled={isSaving}
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={addQuestion}
            disabled={isSaving}
          >
            Add Another Question
          </Button>
          <Button
            className="w-full"
            size="lg"
            onClick={handleSaveQuiz}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CreateQuizManual
