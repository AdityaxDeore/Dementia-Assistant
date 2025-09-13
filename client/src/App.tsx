import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SOSButton } from "@/components/sos-button";
import { ThemeToggle } from "@/components/theme-toggle";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AIBuddyPage from "@/pages/ai-buddy";
import WellnessPage from "@/pages/wellness";
import GoalsPage from "@/pages/goals";
import PeerSupportPage from "@/pages/peer-support";
import ResourcesPage from "@/pages/resources";
import CreativePage from "@/pages/creative";
import CrisisPage from "@/pages/crisis";
import SettingsPage from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/ai-buddy" component={AIBuddyPage} />
      <Route path="/wellness" component={WellnessPage} />
      <Route path="/goals" component={GoalsPage} />
      <Route path="/peer-support" component={PeerSupportPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/creative" component={CreativePage} />
      <Route path="/crisis" component={CrisisPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Custom sidebar width for mental health application
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-4">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="hidden md:block">
                    <h2 className="font-semibold text-lg text-primary">MindWell</h2>
                    <p className="text-xs text-muted-foreground">Student Mental Health Support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SOSButton />
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1 overflow-auto p-6">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
