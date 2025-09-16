import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Heart, 
  Target, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  AlertTriangle,
  Info,
  Shield
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface QuizQuestion {
  id: string;
  category: 'phq9' | 'gad7' | 'ghq';
  question: string;
  options: {
    value: number;
    label: string;
  }[];
}

interface QuizResults {
  phq9Score: number;
  gad7Score: number;
  ghqScore: number;
  phq9Level: string;
  gad7Level: string;
  ghqLevel: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

const phq9Questions: QuizQuestion[] = [
  {
    id: 'phq9-1',
    category: 'phq9',
    question: 'Little interest or pleasure in doing things',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9-2',
    category: 'phq9',
    question: 'Feeling down, depressed, or hopeless',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9-3',
    category: 'phq9',
    question: 'Trouble falling or staying asleep, or sleeping too much',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9-4',
    category: 'phq9',
    question: 'Feeling tired or having little energy',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9-5',
    category: 'phq9',
    question: 'Poor appetite or overeating',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const gad7Questions: QuizQuestion[] = [
  {
    id: 'gad7-1',
    category: 'gad7',
    question: 'Feeling nervous, anxious, or on edge',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7-2',
    category: 'gad7',
    question: 'Not being able to stop or control worrying',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7-3',
    category: 'gad7',
    question: 'Worrying too much about different things',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7-4',
    category: 'gad7',
    question: 'Trouble relaxing',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7-5',
    category: 'gad7',
    question: 'Being so restless that it is hard to sit still',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const ghqQuestions: QuizQuestion[] = [
  {
    id: 'ghq-1',
    category: 'ghq',
    question: 'Been able to concentrate on whatever you\'re doing',
    options: [
      { value: 0, label: 'Better than usual' },
      { value: 1, label: 'Same as usual' },
      { value: 2, label: 'Less than usual' },
      { value: 3, label: 'Much less than usual' }
    ]
  },
  {
    id: 'ghq-2',
    category: 'ghq',
    question: 'Lost much sleep over worry',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'No more than usual' },
      { value: 2, label: 'Rather more than usual' },
      { value: 3, label: 'Much more than usual' }
    ]
  },
  {
    id: 'ghq-3',
    category: 'ghq',
    question: 'Felt that you are playing a useful part in things',
    options: [
      { value: 0, label: 'More so than usual' },
      { value: 1, label: 'Same as usual' },
      { value: 2, label: 'Less than usual' },
      { value: 3, label: 'Much less than usual' }
    ]
  },
  {
    id: 'ghq-4',
    category: 'ghq',
    question: 'Felt capable of making decisions about things',
    options: [
      { value: 0, label: 'More so than usual' },
      { value: 1, label: 'Same as usual' },
      { value: 2, label: 'Less than usual' },
      { value: 3, label: 'Much less than usual' }
    ]
  },
  {
    id: 'ghq-5',
    category: 'ghq',
    question: 'Felt constantly under strain',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'No more than usual' },
      { value: 2, label: 'Rather more than usual' },
      { value: 3, label: 'Much more than usual' }
    ]
  }
];

const allQuestions = [...phq9Questions, ...gad7Questions, ...ghqQuestions];

export function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  const totalSteps = allQuestions.length + 1; // +1 for introduction
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateResults = (): QuizResults => {
    const phq9Score = phq9Questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const gad7Score = gad7Questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const ghqScore = ghqQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);

    // PHQ-9 Depression levels
    let phq9Level = 'Minimal';
    if (phq9Score >= 15) phq9Level = 'Severe';
    else if (phq9Score >= 10) phq9Level = 'Moderate';
    else if (phq9Score >= 5) phq9Level = 'Mild';

    // GAD-7 Anxiety levels
    let gad7Level = 'Minimal';
    if (gad7Score >= 15) gad7Level = 'Severe';
    else if (gad7Score >= 10) gad7Level = 'Moderate';
    else if (gad7Score >= 5) gad7Level = 'Mild';

    // GHQ General health levels
    let ghqLevel = 'Good';
    if (ghqScore >= 15) ghqLevel = 'Poor';
    else if (ghqScore >= 10) ghqLevel = 'Moderate concern';
    else if (ghqScore >= 5) ghqLevel = 'Some concern';

    // Risk assessment
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    if (phq9Score >= 10 || gad7Score >= 10 || ghqScore >= 15) {
      riskLevel = 'high';
    } else if (phq9Score >= 5 || gad7Score >= 5 || ghqScore >= 10) {
      riskLevel = 'moderate';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (phq9Score >= 10) {
      recommendations.push('Consider speaking with a counselor about depression symptoms');
      recommendations.push('Establish a regular sleep schedule and daily routine');
    }
    
    if (gad7Score >= 10) {
      recommendations.push('Practice anxiety management techniques like deep breathing');
      recommendations.push('Consider mindfulness and meditation practices');
    }
    
    if (ghqScore >= 10) {
      recommendations.push('Focus on stress management and self-care activities');
      recommendations.push('Connect with supportive friends and family');
    }

    if (riskLevel === 'low') {
      recommendations.push('Continue maintaining good mental health habits');
      recommendations.push('Use our wellness tracking features to monitor your mood');
    }

    return {
      phq9Score,
      gad7Score,
      ghqScore,
      phq9Level,
      gad7Level,
      ghqLevel,
      recommendations,
      riskLevel
    };
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep < allQuestions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completed
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setIsCompleted(true);
      
      // Save results to localStorage (in real app, would save to backend)
      localStorage.setItem('onboardingResults', JSON.stringify(calculatedResults));
      localStorage.setItem('onboardingCompleted', 'true');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep <= allQuestions.length) {
      const currentQuestion = allQuestions[currentStep - 1];
      return answers[currentQuestion.id] !== undefined;
    }
    return false;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isCompleted && results) {
    return (
      <div className="space-y-6" data-testid="quiz-results">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-6 h-6" />
              Assessment Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              Thank you for completing your mental health assessment. Your responses help us provide personalized support.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4 text-blue-600" />
                Depression Screen (PHQ-9)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{results.phq9Score}/15</div>
                <Badge className={getRiskLevelColor(results.phq9Level.toLowerCase())}>
                  {results.phq9Level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-red-600" />
                Anxiety Screen (GAD-7)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{results.gad7Score}/15</div>
                <Badge className={getRiskLevelColor(results.gad7Level.toLowerCase())}>
                  {results.gad7Level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-purple-600" />
                General Health (GHQ)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{results.ghqScore}/15</div>
                <Badge className={getRiskLevelColor(results.ghqLevel.toLowerCase())}>
                  {results.ghqLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {results.riskLevel === 'high' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription>
              Your assessment indicates you may benefit from professional support. Consider reaching out to campus counseling services or using our crisis resources.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Privacy & Confidentiality</AlertTitle>
          <AlertDescription>
            Your assessment results are confidential and stored securely. This screening is not a diagnosis - please consult with a healthcare provider for professional evaluation.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="onboarding-quiz">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Mental Health Assessment</CardTitle>
            <Badge variant="outline">{currentStep}/{totalSteps - 1}</Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Introduction Step */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Welcome to Your Mental Health Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This brief assessment will help us understand your current mental health and provide personalized support. 
              It includes three standardized screening tools:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">PHQ-9 Depression Screen</div>
                  <div className="text-sm text-muted-foreground">Assesses symptoms of depression</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium">GAD-7 Anxiety Screen</div>
                  <div className="text-sm text-muted-foreground">Evaluates anxiety symptoms</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">GHQ General Health</div>
                  <div className="text-sm text-muted-foreground">Overall mental wellbeing assessment</div>
                </div>
              </div>
            </div>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Your Privacy Matters</AlertTitle>
              <AlertDescription>
                Your responses are confidential and will only be used to provide personalized recommendations. 
                This is not a medical diagnosis.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Question Steps */}
      {currentStep > 0 && currentStep <= allQuestions.length && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {allQuestions[currentStep - 1].category === 'phq9' && <Brain className="w-4 h-4" />}
              {allQuestions[currentStep - 1].category === 'gad7' && <Heart className="w-4 h-4" />}
              {allQuestions[currentStep - 1].category === 'ghq' && <Target className="w-4 h-4" />}
              <span className="capitalize">{allQuestions[currentStep - 1].category} Assessment</span>
            </div>
            <CardTitle className="text-lg">
              Over the last 2 weeks, how often have you been bothered by...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-base font-medium">
                {allQuestions[currentStep - 1].question}
              </h3>
              
              <RadioGroup
                value={answers[allQuestions[currentStep - 1].id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(allQuestions[currentStep - 1].id, parseInt(value))}
              >
                {allQuestions[currentStep - 1].options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2"
        >
          {currentStep === allQuestions.length ? 'Complete Assessment' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}