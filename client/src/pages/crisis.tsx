import { CrisisSupport } from "@/components/crisis-support";

export default function CrisisPage() {
  return (
    <div className="space-y-6" data-testid="page-crisis">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Crisis Support</h1>
        <p className="text-muted-foreground">
          Immediate help and emergency resources. If you're in crisis or need urgent support, 
          these resources are available 24/7 to help you stay safe.
        </p>
      </div>
      
      <CrisisSupport />
    </div>
  );
}