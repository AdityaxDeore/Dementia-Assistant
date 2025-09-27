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
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

const GHQ28_QUESTIONS = [
  // Scale A: Somatic Symptoms
  "Have you recently been feeling perfectly well and in good health?",
  "Have you recently been feeling in need of a good tonic?",
  "Have you recently been feeling run down and out of sorts?",
  "Have you recently felt that you are ill?",
  "Have you recently been getting any pains in your head?",
  "Have you recently been getting a feeling of tightness or pressure in your head?",
  "Have you recently been having hot or cold spells?",
  // Scale B: Anxiety & Insomnia
  "Have you recently lost much sleep over worry?",
  "Have you recently had difficulty in staying asleep once you are off?",
  "Have you recently felt constantly under strain?",
  "Have you recently been getting edgy and bad-tempered?",
  "Have you recently been getting scared or panicky for no good reason?",
  "Have you recently found everything getting on top of you?",
  "Have you recently been feeling nervous and strung-up all the time?",
  // Scale C: Social Dysfunction
  "Have you recently been managing to keep yourself busy and occupied?",
  "Have you recently been taking longer over the things you do?",
  "Have you recently felt on the whole you were doing things well?",
  "Have you recently been satisfied with the way you've carried out your task?",
  "Have you recently felt that you are playing a useful part in things?",
  "Have you recently felt capable of making decisions about things?",
  "Have you recently been able to enjoy your normal day-to-day activities?",
  // Scale D: Severe Depression
  "Have you recently been thinking of yourself as a worthless person?",
  "Have you recently felt that life is entirely hopeless?",
  "Have you recently felt that life isn't worth living?",
  "Have you recently thought of the possibility that you might make away with yourself?",
  "Have you recently found at times you couldn't do anything because your nerves were too bad?",
  "Have you recently found yourself wishing you were dead and away from it all?",
  "Have you recently found that the idea of taking your own life kept coming into your mind?"
];

const DASS21_QUESTIONS = [
  { text: "I found it hard to wind down", scale: "stress" },
  { text: "I was aware of dryness of my mouth", scale: "anxiety" },
  { text: "I couldn't seem to experience any positive feeling at all", scale: "depression" },
  { text: "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)", scale: "anxiety" },
  { text: "I found it difficult to work up the initiative to do things", scale: "depression" },
  { text: "I tended to over-react to situations", scale: "stress" },
  { text: "I experienced trembling (e.g. in the hands)", scale: "anxiety" },
  { text: "I felt that I was using a lot of nervous energy", scale: "stress" },
  { text: "I was worried about situations in which I might panic and make a fool of myself", scale: "anxiety" },
  { text: "I felt that I had nothing to look forward to", scale: "depression" },
  { text: "I found myself getting agitated", scale: "stress" },
  { text: "I found it difficult to relax", scale: "stress" },
  { text: "I felt down-hearted and blue", scale: "depression" },
  { text: "I was intolerant of anything that kept me from getting on with what I was doing", scale: "stress" },
  { text: "I felt I was close to panic", scale: "anxiety" },
  { text: "I was unable to become enthusiastic about anything", scale: "depression" },
  { text: "I felt I wasn't worth much as a person", scale: "depression" },
  { text: "I felt that I was rather touchy", scale: "stress" },
  { text: "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)", scale: "anxiety" },
  { text: "I felt scared without any good reason", scale: "anxiety" },
  { text: "I felt that life was meaningless", scale: "depression" }
];

const ANSWER_OPTIONS_STANDARD = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
];

const ANSWER_OPTIONS_GHQ28_STANDARD = [
  { label: "Not at all", value: 0 },
  { label: "No more than usual", value: 0 },
  { label: "Rather more than usual", value: 1 },
  { label: "Much more than usual", value: 1 }
];

const ANSWER_OPTIONS_DASS21 = [
  { label: "Did not apply to me at all", value: 0 },
  { label: "Applied to me to some degree, or some of the time", value: 1 },
  { label: "Applied to me to a considerable degree or a good part of time", value: 2 },
  { label: "Applied to me very much or most of the time", value: 3 }
];

type AssessmentType = 'PHQ9' | 'GAD7' | 'GHQ28' | 'DASS21';

interface AssessmentResults {
  phq9?: number;
  gad7?: number;
  ghq28?: number;
  dass21?: {
    depression: number;
    anxiety: number;
    stress: number;
  };
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
      case 'GHQ28': return GHQ28_QUESTIONS;
      case 'DASS21': return DASS21_QUESTIONS.map(q => q.text);
    }
  };

  const getAnswerOptions = (type: AssessmentType) => {
    switch (type) {
      case 'PHQ9':
      case 'GAD7':
        return ANSWER_OPTIONS_STANDARD;
      case 'GHQ28':
        return ANSWER_OPTIONS_GHQ28_STANDARD;
      case 'DASS21':
        return ANSWER_OPTIONS_DASS21;
      default:
        return ANSWER_OPTIONS_STANDARD;
    }
  };

  const getInstruction = (type: AssessmentType) => {
    switch (type) {
      case 'PHQ9': return "Over the last 2 weeks, how often have you been bothered by the following problems?";
      case 'GAD7': return "Over the last 2 weeks, how often have you been bothered by the following problems?";
      case 'GHQ28': return "Thinking about the past few weeks, please answer how each statement applies to you:";
      case 'DASS21': return "Please read each statement and indicate how much the statement applied to you over the past week:";
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
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      
      if (currentAssessment === 'DASS21') {
        // Calculate DASS-21 subscales
        const depressionItems = [2, 4, 9, 12, 15, 16, 20]; // 0-based indices
        const anxietyItems = [1, 3, 6, 8, 14, 18, 19];
        const stressItems = [0, 5, 7, 10, 11, 13, 17];
        
        const depression = depressionItems.reduce((sum, idx) => sum + newAnswers[idx], 0) * 2;
        const anxiety = anxietyItems.reduce((sum, idx) => sum + newAnswers[idx], 0) * 2;
        const stress = stressItems.reduce((sum, idx) => sum + newAnswers[idx], 0) * 2;
        
        setResults(prev => ({
          ...prev,
          dass21: { depression, anxiety, stress }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          [currentAssessment!.toLowerCase()]: totalScore
        }));
      }
      
      setIsCompleted(true);
      setCurrentAssessment(null);
      setCurrentQuestion(0);
      setAnswers([]);
    }
  };

  const saveAssessmentResults = async () => {
    try {
      await submitAssessment.mutateAsync(results);
      
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
            Each assessment takes about 2-5 minutes to complete.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Clinically validated
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Confidential
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Professional guidance
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PHQ-9 Depression Screening */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.phq9 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">PHQ-9</CardTitle>
                {results.phq9 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>Depression Screening</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Assesses depression symptoms over the past 2 weeks.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">9</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">2-3 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => startAssessment('PHQ9')} 
                className="w-full"
                variant={results.phq9 !== undefined ? "outline" : "default"}
              >
                {results.phq9 !== undefined ? "Retake" : "Start PHQ-9"}
              </Button>
            </CardFooter>
          </Card>

          {/* GAD-7 Anxiety Screening */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.gad7 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">GAD-7</CardTitle>
                {results.gad7 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>Anxiety Screening</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Measures anxiety symptoms and worry patterns.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">2-3 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => startAssessment('GAD7')} 
                className="w-full"
                variant={results.gad7 !== undefined ? "outline" : "default"}
              >
                {results.gad7 !== undefined ? "Retake" : "Start GAD-7"}
              </Button>
            </CardFooter>
          </Card>

          {/* GHQ-28 General Mental Health */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.ghq28 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">GHQ-28</CardTitle>
                {results.ghq28 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>General Health Questionnaire</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive assessment of psychological wellbeing.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">28</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">5-7 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => startAssessment('GHQ28')} 
                className="w-full"
                variant={results.ghq28 !== undefined ? "outline" : "default"}
              >
                {results.ghq28 !== undefined ? "Retake" : "Start GHQ-28"}
              </Button>
            </CardFooter>
          </Card>

          {/* DASS-21 */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${results.dass21 !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">DASS-21</CardTitle>
                {results.dass21 !== undefined && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardDescription>Depression, Anxiety & Stress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Measures depression, anxiety, and stress levels.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">21</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">3-5 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => startAssessment('DASS21')} 
                className="w-full"
                variant={results.dass21 !== undefined ? "outline" : "default"}
              >
                {results.dass21 !== undefined ? "Retake" : "Start DASS-21"}
              </Button>
            </CardFooter>
          </Card>
        </div>

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
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Assessment Complete</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Thank you for completing the mental health assessment. Your responses have been securely recorded.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Assessment Submitted Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your assessment data has been saved and will be reviewed by healthcare professionals. 
              If you need immediate support, please contact campus counseling services.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={saveAssessmentResults} 
            size="lg"
            disabled={submitAssessment.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {submitAssessment.isPending ? "Saving..." : "Confirm Submission"}
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
            <strong>Important:</strong> These assessments are screening tools and not diagnostic instruments. 
            If you're experiencing mental health concerns, please consult with a qualified healthcare professional.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}