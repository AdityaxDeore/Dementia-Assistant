import { GoalTracker } from "@/components/goal-tracker";

export default function GoalsPage() {
  return (
    <div className="space-y-6" data-testid="page-goals">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Goal Tracker</h1>
        <p className="text-muted-foreground">
          Set and track your personal wellness and academic goals. Break down big objectives into manageable steps 
          and celebrate your progress along the way.
        </p>
      </div>
      
      <GoalTracker />
    </div>
  );
}