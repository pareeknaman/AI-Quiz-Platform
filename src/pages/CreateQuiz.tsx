import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Wand2, ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { createQuiz, generateAIQuestions, type Question } from '@/lib/storage';
import Navbar from '@/components/Navbar';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) return;
    
    setIsGenerating(true);
    try {
      const aiQuestions = await generateAIQuestions(aiTopic, 5);
      setQuestions([...questions, ...aiQuestions]);
      setAiTopic('');
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = () => {
    if (!title.trim() || questions.length === 0) return;
    
    const validQuestions = questions.filter(q => 
      q.question.trim() && 
      q.options.every(opt => opt.trim()) &&
      q.correctAnswer >= 0 && q.correctAnswer < 4
    );

    if (validQuestions.length === 0) {
      alert('Please add at least one complete question');
      return;
    }

    createQuiz({
      title: title.trim(),
      description: description.trim(),
      questions: validQuestions,
      creatorId: user.id
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600">Build an engaging quiz for your audience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Information</CardTitle>
                <CardDescription>Basic details about your quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter quiz title..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this quiz is about..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  AI Question Generator
                </CardTitle>
                <CardDescription>Let AI help you create questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., 'JavaScript basics', 'World History')..."
                  />
                  <Button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !aiTopic.trim()}
                  >
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>Add questions to your quiz</CardDescription>
                  </div>
                  <Badge variant="secondary">{questions.length} questions</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.map((question, qIndex) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <Label>Question {qIndex + 1}</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        placeholder="Enter your question..."
                        className="mb-4"
                      />
                      
                      <div className="space-y-2">
                        <Label>Answer Options</Label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}...`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addQuestion} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <p className="text-sm text-gray-600">{title || 'Untitled Quiz'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Questions</Label>
                    <p className="text-sm text-gray-600">{questions.length} questions</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant={questions.length > 0 ? 'default' : 'secondary'}>
                      {questions.length > 0 ? 'Ready to save' : 'Add questions'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSaveQuiz}
              className="w-full"
              disabled={!title.trim() || questions.length === 0}
            >
              Save Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}