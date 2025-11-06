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

const CreateQuiz = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-2xl bg-card/60 backdrop-blur-md border-golden/30 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-golden-light">Create a New Quiz</CardTitle>
          <CardDescription>Fill in the details below to generate your quiz.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Quiz Topic</Label>
            <Input id="topic" placeholder="e.g., 'The Solar System' or 'React Hooks'" />
            <p className="text-xs text-muted-foreground">
              Provide a topic for the AI to generate questions.
            </p>
          </div>
          
          <div className="relative">
             <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-golden/30" />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or
                </span>
             </div>
          </div>

           <div className="space-y-2">
            <Label htmlFor="manual-text">Paste Text to Generate From (Optional)</Label>
            <Textarea id="manual-text" placeholder="Paste your article, notes, or text here..." className="min-h-[150px]" />
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" size="lg">
            Generate Quiz with AI
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CreateQuiz
