import { AccessibilityControls } from "@/components/accessibility-controls";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Palette, Eye } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6" data-testid="page-settings">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience with accessibility options, themes, and preferences to make 
          Clarity work best for your needs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Appearance
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              General
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