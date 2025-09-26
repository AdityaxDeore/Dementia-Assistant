import { AccessibilityControls } from "@/components/accessibility-controls";
import { ThemeToggle } from "@/components/theme-toggle";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Palette, Eye } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6" data-testid="page-settings">
      <BackButton to="/dashboard" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience with accessibility options, themes, and preferences to make 
          Clarity work best for your needs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Theme Settings */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-sky-400/10 via-blue-400/10 to-cyan-400/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg shadow-md">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-800 font-bold">Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-400/10 via-purple-400/10 to-indigo-400/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg shadow-md">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-800 font-bold">General</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Privacy</p>
              <p className="text-sm text-muted-foreground">
                Your privacy is protected. All data is encrypted and anonymous options are available.
              </p>
            </div>
            <div>
              <p className="font-medium">Data</p>
              <p className="text-sm text-muted-foreground">
                Mood tracking and progress data is stored locally and securely.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accessibility Controls */}
      <AccessibilityControls />
    </div>
  );
}