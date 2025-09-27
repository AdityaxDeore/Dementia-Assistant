import { Phone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SOSButton() {
  const [isPressed, setIsPressed] = useState(false);
  const { toast } = useToast();

  const handleTelemanus = () => {
    const telmanusNumber = '18008914416';
    console.log(`Connecting to Telemanus helpline: ${telmanusNumber}`);
    
    // Show immediate feedback
    toast({
      title: "Connecting to Telemanus Helpline",
      description: "Redirecting to call 1800 891 4416. Help is on the way.",
      duration: 5000,
    });
    
    // For web browsers, try to initiate a phone call
    try {
      window.location.href = `tel:${telmanusNumber}`;
    } catch (error) {
      console.error('Failed to initiate call:', error);
      // Fallback: Copy number to clipboard
      navigator.clipboard.writeText(telmanusNumber).then(() => {
        toast({
          title: "Number Copied",
          description: `Telemanus helpline number copied: ${telmanusNumber}`,
          duration: 5000,
        });
      }).catch(() => {
        toast({
          title: "Call Telemanus",
          description: `Please call: ${telmanusNumber}`,
          variant: "destructive",
          duration: 8000,
        });
      });
    }
  };

  const handleCampusAuthorities = () => {
    console.log('Contacting campus authorities...');
    // TODO: Contact campus security/counselors
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="default"
          className="bg-destructive hover:bg-destructive/90 font-medium"
          data-testid="button-sos"
        >
          <Phone className="w-4 h-4 mr-2" />
          SOS
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Emergency Mental Health Support
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            You're reaching out for emergency help. Get immediate professional mental health support:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 mb-2 font-medium">🇮🇳 Professional Mental Health Support - India</p>
            <Button 
              onClick={handleTelemanus}
              className="w-full justify-start bg-red-600 hover:bg-red-700 text-white font-semibold"
              data-testid="button-telemanus-helpline"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Telemanus - 1800 891 4416
            </Button>
            <p className="text-xs text-red-700 mt-2">
              Free 24/7 mental health helpline staffed by trained counselors
            </p>
          </div>
          <Button 
            onClick={handleCampusAuthorities}
            variant="outline" 
            className="w-full justify-start"
            data-testid="button-campus-authorities"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Campus Authorities
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="button-cancel-sos">I'm Safe Now</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}