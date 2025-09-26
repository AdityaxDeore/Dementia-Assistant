import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Brain, Heart, Shield, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSubmitAssessment, useAssessmentHistory } from "@/hooks/use-assessment";
import { useToast } from "@/hooks/use-toast";

// Assessment data structures
const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure",
  "Trouble concentrating on studies, assignments, or other tasks",
  "Moving or speaking so slowly that others notice, or being overly restless",
  "Thoughts of being better off dead or self-harm"
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

const GHQ12_QUESTIONS = [
  "Have you been able to concentrate on whatever you are doing?",
  "Have you lost much sleep over worry?",
  "Have you felt you are playing a useful role in things?",
  "Have you felt capable of making decisions?",
  "Have you felt constantly under strain?",
  "Have you felt you could not overcome your difficulties?",
  "Have you been able to enjoy normal day-to-day activities?",
  "Have you been able to face up to problems?",
  "Have you felt unhappy or depressed?",
  "Have you lost confidence in yourself?",
  "Have you thought of yourself as a worthless person?",
  "Have you been feeling reasonably happy, all things considered?"
];

const ANSWER_OPTIONS_STANDARD = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
];

const ANSWER_OPTIONS_GHQ = [
  { label: "Better than usual", value: 0 },
  { label: "Same as usual", value: 1 },
  { label: "Less than usual", value: 2 },
  { label: "Much less than usual", value: 3 }
];

type AssessmentType = 'PHQ9' | 'GAD7' | 'GHQ12';

interface AssessmentResults {
  phq9?: number;
  gad7?: number;
  ghq12?: number;
}

interface ScoreLevel {
  level: string;
  color: 'green' | 'yellow' | 'red';
  description: string;
  recommendations: string[];
}

export default function MentalHealthAssessment() {
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<AssessmentResults>({});
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { toast } = useToast();
  const submitAssessment = useSubmitAssessment();
  const { data: history } = useAssessmentHistory();

  const getQuestions = (type: AssessmentType) => {
    switch (type) {
      case 'PHQ9': return PHQ9_QUESTIONS;
      case 'GAD7': return GAD7_QUESTIONS;
      case 'GHQ12': return GHQ12_QUESTIONS;
    }
  };

  const getAnswerOptions = (type: AssessmentType) => {
    return type === 'GHQ12' ? ANSWER_OPTIONS_GHQ : ANSWER_OPTIONS_STANDARD;
  };

  const getInstruction = (type: AssessmentType) => {
    switch (type) {
      case 'PHQ9': return "Over the last 2 weeks, how often have you been bothered by the following problems?";
      case 'GAD7': return "Over the last 2 weeks, how often have you been bothered by the following problems?";
      case 'GHQ12': return "Thinking about the past few weeks, please answer:";
    }
  };

  const calculateScore = (type: AssessmentType, answers: number[]): ScoreLevel => {
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    
    switch (type) {
      case 'PHQ9':
        if (totalScore <= 4) return {
          level: "Minimal Depression",
          color: 'green',
          description: "Little to no depression symptoms",
          recommendations: ["Continue healthy habits", "Regular exercise and sleep", "Stay connected with friends"]
        };
        if (totalScore <= 9) return {
          level: "Mild Depression",
          color: 'yellow',
          description: "Mild depression symptoms",
          recommendations: ["Consider talking to a counselor", "Practice stress management", "Monitor your mood"]
        };
        if (totalScore <= 14) return {
          level: "Moderate Depression",
          color: 'yellow',
          description: "Moderate depression symptoms",
          recommendations: ["Seek professional help", "Consider therapy or counseling", "Talk to trusted friends/family"]
        };
        if (totalScore <= 19) return {
          level: "Moderately Severe Depression",
          color: 'red',
          description: "Significant depression symptoms",
          recommendations: ["Seek immediate professional help", "Contact campus counseling", "Consider medication consultation"]
        };
        return {
          level: "Severe Depression",
          color: 'red',
          description: "Severe depression symptoms",
          recommendations: ["Seek immediate professional help", "Contact emergency services if needed", "Don't face this alone"]
        };

      case 'GAD7':
        if (totalScore <= 4) return {
          level: "Minimal Anxiety",
          color: 'green',
          description: "Little to no anxiety symptoms",
          recommendations: ["Continue stress management", "Regular relaxation techniques", "Maintain work-life balance"]
        };
        if (totalScore <= 9) return {
          level: "Mild Anxiety",
          color: 'yellow',
          description: "Mild anxiety symptoms",
          recommendations: ["Practice deep breathing", "Try mindfulness exercises", "Consider stress reduction techniques"]
        };
        if (totalScore <= 14) return {
          level: "Moderate Anxiety",
          color: 'yellow',
          description: "Moderate anxiety symptoms",
          recommendations: ["Seek counseling support", "Learn anxiety management skills", "Consider professional guidance"]
        };
        return {
          level: "Severe Anxiety",
          color: 'red',
          description: "Severe anxiety symptoms",
          recommendations: ["Seek immediate professional help", "Contact campus mental health services", "Don't suffer in silence"]
        };

      case 'GHQ12':
        if (totalScore <= 11) return {
          level: "Good Mental Health",
          color: 'green',
          description: "Overall good psychological wellbeing",
          recommendations: ["Keep up healthy habits", "Continue self-care practices", "Stay socially connected"]
        };
        if (totalScore <= 23) return {
          level: "Moderate Distress",
          color: 'yellow',
          description: "Some psychological distress present",
          recommendations: ["Focus on stress management", "Consider counseling support", "Practice self-care regularly"]
        };
        return {
          level: "High Distress",
          color: 'red',
          description: "Significant psychological distress",
          recommendations: ["Seek professional mental health support", "Contact counseling services", "Prioritize your mental health"]
        };
    }
  };

  const startAssessment = (type: AssessmentType) => {
    setCurrentAssessment(type);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    const questions = getQuestions(currentAssessment!);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment completed
      const score = calculateScore(currentAssessment!, newAnswers);
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      
      setResults(prev => ({
        ...prev,
        [currentAssessment!.toLowerCase()]: totalScore
      }));
      
      setCurrentAssessment(null);
      setCurrentQuestion(0);
      setAnswers([]);
    }
  };

  const getCompletedAssessments = () => {
    return Object.keys(results).length;
  };

  const generateOverallRecommendations = (): string[] => {
    const recommendations = new Set<string>();
    
    // Check each assessment result and add recommendations
    if (results.phq9 !== undefined) {
      const phq9Level = calculateScore('PHQ9', Array(9).fill(0).map((_, i) => Math.floor(results.phq9! * (i + 1) / 9)));
      phq9Level.recommendations.forEach(rec => recommendations.add(rec));
    }
    
    if (results.gad7 !== undefined) {
      const gad7Level = calculateScore('GAD7', Array(7).fill(0).map((_, i) => Math.floor(results.gad7! * (i + 1) / 7)));
      gad7Level.recommendations.forEach(rec => recommendations.add(rec));
    }
    
    if (results.ghq12 !== undefined) {
      const ghq12Level = calculateScore('GHQ12', Array(12).fill(0).map((_, i) => Math.floor(results.ghq12! * (i + 1) / 12)));
      ghq12Level.recommendations.forEach(rec => recommendations.add(rec));
    }
    
    return Array.from(recommendations).slice(0, 5); // Limit to top 5 recommendations
  };

  const saveAssessmentResults = async () => {
    try {
      const recommendations = generateOverallRecommendations();
      
      await submitAssessment.mutateAsync({
        ...results,
        recommendations
      });
      
      toast({
        title: "Assessment Saved",
        description: "Your assessment results have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetAssessment = () => {
    setResults({});
    setIsCompleted(false);
    setCurrentAssessment(null);
  };

  if (getCompletedAssessments() === 3 && !isCompleted) {
    setIsCompleted(true);
  }

  // Main menu view
  if (!currentAssessment && !isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Mental Health Assessment</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete these validated mental health questionnaires to get insights into your wellbeing. 
            Each assessment takes about 2-3 minutes to complete.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              ~8 minutes total
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Clinically validated
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Confidential
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* PHQ-9 Depression Screening */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.phq9 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">PHQ-9</CardTitle>
                {results.phq9 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>Depression Screening</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Assesses depression symptoms over the past 2 weeks. 9 questions focusing on mood, interest, and daily functioning.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">2-3 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">9</span>
                </div>
                {results.phq9 !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span>Score:</span>
                    <span className="font-medium">{results.phq9}/27</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => startAssessment('PHQ9')} 
                className="w-full"
                variant={results.phq9 !== undefined ? "outline" : "default"}
              >
                {results.phq9 !== undefined ? "Retake Assessment" : "Start PHQ-9"}
              </Button>
            </CardFooter>
          </Card>

          {/* GAD-7 Anxiety Screening */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.gad7 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">GAD-7</CardTitle>
                {results.gad7 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>Anxiety Screening</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Measures anxiety symptoms and worry patterns. 7 questions about nervousness, control, and fear.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">2-3 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">7</span>
                </div>
                {results.gad7 !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span>Score:</span>
                    <span className="font-medium">{results.gad7}/21</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => startAssessment('GAD7')} 
                className="w-full"
                variant={results.gad7 !== undefined ? "outline" : "default"}
              >
                {results.gad7 !== undefined ? "Retake Assessment" : "Start GAD-7"}
              </Button>
            </CardFooter>
          </Card>

          {/* GHQ-12 General Mental Health */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.ghq12 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">GHQ-12</CardTitle>
                {results.ghq12 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>General Mental Health</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Evaluates overall psychological wellbeing and distress. 12 questions about daily functioning and happiness.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">3-4 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">12</span>
                </div>
                {results.ghq12 !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span>Score:</span>
                    <span className="font-medium">{results.ghq12}/36</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => startAssessment('GHQ12')} 
                className="w-full"
                variant={results.ghq12 !== undefined ? "outline" : "default"}
              >
                {results.ghq12 !== undefined ? "Retake Assessment" : "Start GHQ-12"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {getCompletedAssessments() > 0 && (
          <div className="text-center">
            <Button onClick={() => setIsCompleted(true)} size="lg" className="px-8">
              View Assessment Results ({getCompletedAssessments()}/3 completed)
            </Button>
          </div>
        )}

        {/* Assessment History */}
        {history && history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>
                Your assessment history from the past few weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.slice(0, 3).map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="text-sm font-medium">
                        {new Date(assessment.completedAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {assessment.phq9 !== undefined && `PHQ-9: ${assessment.phq9}/27`}
                        {assessment.gad7 !== undefined && ` • GAD-7: ${assessment.gad7}/21`}
                        {assessment.ghq12 !== undefined && ` • GHQ-12: ${assessment.ghq12}/36`}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Completed
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> These assessments are screening tools and not diagnostic instruments. 
            If you're experiencing mental health concerns, please consult with a qualified healthcare professional.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Assessment question view
  if (currentAssessment) {
    const questions = getQuestions(currentAssessment);
    const answerOptions = getAnswerOptions(currentAssessment);
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">
              {currentAssessment} Assessment
            </h2>
            <p className="text-muted-foreground">
              {getInstruction(currentAssessment)}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {questions[currentQuestion]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {answerOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-sm text-muted-foreground mt-0.5">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="ghost" onClick={() => setCurrentAssessment(null)}>
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results view
  if (isCompleted) {
    const overallRecommendations = generateOverallRecommendations();
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Assessment Complete</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Here are your mental health assessment results and personalized recommendations.
          </p>
        </div>

        {/* Results Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {results.phq9 !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  PHQ-9 Depression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Score:</span>
                    <Badge variant="secondary">{results.phq9}/27</Badge>
                  </div>
                  <div className="text-center">
                    <Badge 
                      variant={calculateScore('PHQ9', Array(9).fill(Math.floor(results.phq9/3))).color === 'green' ? 'default' : 
                               calculateScore('PHQ9', Array(9).fill(Math.floor(results.phq9/3))).color === 'yellow' ? 'secondary' : 'destructive'}
                      className="text-sm px-3 py-1"
                    >
                      {calculateScore('PHQ9', Array(9).fill(Math.floor(results.phq9/3))).level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {results.gad7 !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  GAD-7 Anxiety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Score:</span>
                    <Badge variant="secondary">{results.gad7}/21</Badge>
                  </div>
                  <div className="text-center">
                    <Badge 
                      variant={calculateScore('GAD7', Array(7).fill(Math.floor(results.gad7/3))).color === 'green' ? 'default' : 
                               calculateScore('GAD7', Array(7).fill(Math.floor(results.gad7/3))).color === 'yellow' ? 'secondary' : 'destructive'}
                      className="text-sm px-3 py-1"
                    >
                      {calculateScore('GAD7', Array(7).fill(Math.floor(results.gad7/3))).level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {results.ghq12 !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  GHQ-12 General Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Score:</span>
                    <Badge variant="secondary">{results.ghq12}/36</Badge>
                  </div>
                  <div className="text-center">
                    <Badge 
                      variant={calculateScore('GHQ12', Array(12).fill(Math.floor(results.ghq12/3))).color === 'green' ? 'default' : 
                               calculateScore('GHQ12', Array(12).fill(Math.floor(results.ghq12/3))).color === 'yellow' ? 'secondary' : 'destructive'}
                      className="text-sm px-3 py-1"
                    >
                      {calculateScore('GHQ12', Array(12).fill(Math.floor(results.ghq12/3))).level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        {overallRecommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Based on your assessment results, here are some suggestions for your wellbeing:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {overallRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={saveAssessmentResults} 
            size="lg"
            disabled={submitAssessment.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {submitAssessment.isPending ? "Saving..." : "Save Results"}
          </Button>
          <Button onClick={resetAssessment} variant="outline" size="lg">
            Take Assessment Again
          </Button>
          <Button onClick={() => setIsCompleted(false)} size="lg" variant="secondary">
            Back to Menu
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Remember:</strong> These results are for informational purposes only and should not replace professional medical advice. 
            If you're experiencing concerning symptoms, please reach out to a healthcare provider or counselor.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}