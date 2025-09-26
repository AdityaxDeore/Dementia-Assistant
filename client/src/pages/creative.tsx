import { CreativeZone } from "@/components/creative-zone";
import { BackButton } from "@/components/ui/back-button";

export default function CreativePage() {
  return (
    <div className="space-y-6" data-testid="page-creative">
      <BackButton to="/dashboard" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Creative Expression Zone</h1>
        <p className="text-muted-foreground">
          Express yourself through art, writing, and creativity. Creative expression is a powerful tool for 
          processing emotions, reducing stress, and improving mental wellbeing.
        </p>
      </div>
      
      <CreativeZone />
    </div>
  );
}