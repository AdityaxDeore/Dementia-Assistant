import { Switch, Route, useLocation } from "wouter";
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
import OnboardingPage from "@/pages/onboarding";
import AnonymousChatPage from "@/pages/anonymous-chat";
import AdminPage from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import ReportPage from "@/pages/report";
import CommunityRoute from "@/pages/community";
import AudioSessionsPage from "@/pages/audio-sessions";
import DiaryPage from "@/pages/diary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/ai-buddy" component={AIBuddyPage} />
      <Route path="/anonymous-chat" component={AnonymousChatPage} />
      <Route path="/wellness" component={WellnessPage} />
      <Route path="/audio-sessions" component={AudioSessionsPage} />
      <Route path="/diary" component={DiaryPage} />
      <Route path="/goals" component={GoalsPage} />
      <Route path="/peer-support" component={PeerSupportPage} />
      <Route path="/community/:id" component={CommunityRoute} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/creative" component={CreativePage} />
      <Route path="/crisis" component={CrisisPage} />
      <Route path="/report" component={ReportPage} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  
  // Show SOS button only on dashboard page
  const showSOSButton = location === "/" || location === "/dashboard";
  
  // Admin routes should not show the normal app layout
  const isAdminRoute = location === "/admin-login" || location === "/admin";
  
  // Custom sidebar width for mental health application
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  // If it's an admin route, render without the normal app layout
  if (isAdminRoute) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen">
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

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
                  {showSOSButton && <SOSButton />}
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
