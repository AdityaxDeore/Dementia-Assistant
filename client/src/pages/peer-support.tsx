import { PeerSupportForum } from "@/components/peer-support-forum";

export default function PeerSupportPage() {
  return (
    <div className="space-y-6" data-testid="page-peer-support">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Peer Support Community</h1>
        <p className="text-muted-foreground">
          Connect with fellow students in a safe, moderated environment. Share experiences, offer support, 
          and find study partners. All discussions are monitored to ensure a positive and helpful community.
        </p>
      </div>
      
      <PeerSupportForum />
    </div>
  );
}