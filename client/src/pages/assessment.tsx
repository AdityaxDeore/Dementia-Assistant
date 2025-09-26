import MentalHealthAssessment from "@/components/mental-health-assessment";
import { BackButton } from "@/components/ui/back-button";

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-4 pt-6">
        <BackButton to="/dashboard" />
      </div>
      <MentalHealthAssessment />
    </div>
  );
}