import { OnboardingQuiz } from "@/components/onboarding-quiz";
import { BackButton } from "@/components/ui/back-button";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding before
    const completed = localStorage.getItem('onboardingCompleted');
    if (completed === 'true') {
      setHasCompletedBefore(true);
    }
  }, []);

  return (
    <div className="space-y-6" data-testid="page-onboarding">
      <BackButton to="/dashboard" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {hasCompletedBefore ? 'Retake Assessment' : 'Welcome to Clarity'}
        </h1>
        <p className="text-muted-foreground">
          {hasCompletedBefore 
            ? 'You can retake this assessment anytime to update your mental health profile.'
            : 'Let\'s start by understanding your current mental health to provide you with personalized support.'
          }
        </p>
      </div>
      
      <OnboardingQuiz />
    </div>
  );
}