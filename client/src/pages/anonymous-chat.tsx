import { AnonymousChat } from "@/components/anonymous-chat";

export default function AnonymousChatPage() {
  return (
    <div className="space-y-6" data-testid="page-anonymous-chat">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Anonymous Therapy Chat</h1>
        <p className="text-muted-foreground">
          Connect with licensed mental health professionals in a safe, confidential environment. 
          Get real-time support when you need it most.
        </p>
      </div>
      
      <AnonymousChat />
    </div>
  );
}