import { useState } from "react";
import { Eye, Type, Contrast, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AccessibilityControls() {
  const [fontSize, setFontSize] = useState([100]);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
    document.documentElement.style.fontSize = `${value[0]}%`;
    console.log(`Font size changed to: ${value[0]}%`);
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    setHighContrast(enabled);
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    console.log(`High contrast mode: ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleScreenReaderToggle = (enabled: boolean) => {
    setScreenReaderMode(enabled);
    console.log(`Screen reader mode: ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleReducedMotionToggle = (enabled: boolean) => {
    setReducedMotion(enabled);
    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    console.log(`Reduced motion: ${enabled ? 'enabled' : 'disabled'}`);
  };

  const resetSettings = () => {
    setFontSize([100]);
    setHighContrast(false);
    setScreenReaderMode(false);
    setReducedMotion(false);
    
    document.documentElement.style.fontSize = '100%';
    document.documentElement.classList.remove('high-contrast', 'reduce-motion');
    
    console.log('Accessibility settings reset to defaults');
  };

  return (
    <Card data-testid="accessibility-controls">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Accessibility Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Size */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <Label className="font-medium">Font Size</Label>
            <span className="text-sm text-muted-foreground">
              {fontSize[0]}%
            </span>
          </div>
          <Slider
            value={fontSize}
            onValueChange={handleFontSizeChange}
            min={75}
            max={150}
            step={5}
            className="w-full"
            data-testid="slider-font-size"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Small</span>
            <span>Normal</span>
            <span>Large</span>
          </div>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Contrast className="w-4 h-4" />
            <div>
              <Label className="font-medium">High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enhanced color contrast for better visibility
              </p>
            </div>
          </div>
          <Switch
            checked={highContrast}
            onCheckedChange={handleHighContrastToggle}
            data-testid="switch-high-contrast"
          />
        </div>

        {/* Screen Reader Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <div>
              <Label className="font-medium">Screen Reader Optimized</Label>
              <p className="text-sm text-muted-foreground">
                Enhanced navigation for screen readers
              </p>
            </div>
          </div>
          <Switch
            checked={screenReaderMode}
            onCheckedChange={handleScreenReaderToggle}
            data-testid="switch-screen-reader"
          />
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <div>
              <Label className="font-medium">Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
          </div>
          <Switch
            checked={reducedMotion}
            onCheckedChange={handleReducedMotionToggle}
            data-testid="switch-reduced-motion"
          />
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full"
            data-testid="button-reset-accessibility"
          >
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}