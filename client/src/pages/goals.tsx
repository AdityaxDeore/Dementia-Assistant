import { GoalTracker } from "@/components/goal-tracker";
import { BackButton } from "@/components/ui/back-button";

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-goals">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <BackButton to="/dashboard" />
        <GoalTracker />
      </div>
    </div>
  );
}