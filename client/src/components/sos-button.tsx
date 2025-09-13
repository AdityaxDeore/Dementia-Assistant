import { Phone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

  const handleSOSClick = () => {
    setIsPressed(true);
    console.log('SOS Emergency button triggered');
    // TODO: In real app, this would trigger emergency protocols
  };

  const handleCrisisHelpline = () => {
    console.log('Connecting to crisis helpline...');
    // TODO: Connect to actual helpline
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
            Emergency Support
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            You're reaching out for emergency help. Choose how you'd like to get immediate support:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3">
          <Button 
            onClick={handleCrisisHelpline}
            variant="outline" 
            className="w-full justify-start"
            data-testid="button-crisis-helpline"
          >
            <Phone className="w-4 h-4 mr-2" />
            Crisis Helpline (24/7)
          </Button>
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