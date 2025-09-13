import { AIChat } from "@/components/ai-chat";

export default function AIBuddyPage() {
  return (
    <div className="space-y-6" data-testid="page-ai-buddy">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Wellness Buddy</h1>
        <p className="text-muted-foreground">
          Chat with your AI companion for instant support, coping strategies, and guidance. 
          Your conversations are private and designed to help you manage stress and emotional challenges.
        </p>
      </div>
      
      <div className="max-w-4xl">
        <AIChat />
      </div>
    </div>
  );
}