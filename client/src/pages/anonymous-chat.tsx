import { CounselorConnect } from "@/components/counselor-connect";
import { BackButton } from "@/components/ui/back-button";

export default function AnonymousChatPage() {
  return (
    <div className="space-y-6" data-testid="page-anonymous-chat">
      <BackButton to="/dashboard" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Counselor Connect</h1>
        <p className="text-muted-foreground">
          Connect with licensed college counselors for professional mental health support. 
          Schedule appointments and get real-time assistance from qualified professionals.
        </p>
      </div>
      
      <CounselorConnect />
    </div>
  );
}