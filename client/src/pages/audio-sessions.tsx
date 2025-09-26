import { AudioSessions } from "@/components/audio-sessions";
import { BackButton } from "@/components/ui/back-button";

export default function AudioSessionsPage() {
  return (
    <div>
      <div className="p-4">
        <BackButton to="/dashboard" />
      </div>
      <AudioSessions />
    </div>
  );
}