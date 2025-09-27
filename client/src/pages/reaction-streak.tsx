import { ReactionStreakDemo } from "@/components/reaction-streak-demo";
import { BackButton } from "@/components/ui/back-button";

export default function ReactionStreakPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="p-6">
        <BackButton to="/dashboard" />
        <ReactionStreakDemo />
      </div>
    </div>
  );
}