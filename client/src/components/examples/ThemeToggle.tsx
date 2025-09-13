import { ThemeToggle } from '../theme-toggle';

export default function ThemeToggleExample() {
  return (
    <div className="p-8 space-y-4">
      <h3 className="font-medium text-lg">Theme Toggle</h3>
      <p className="text-muted-foreground">Switch between light and dark modes</p>
      <ThemeToggle />
    </div>
  );
}