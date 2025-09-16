import { Moon, Sun, Eye, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "high-contrast" | "sepia" | "purple";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove("dark", "high-contrast", "sepia", "purple");
    
    // Apply the selected theme
    if (newTheme !== "light") {
      document.documentElement.classList.add(newTheme);
    }
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    console.log(`Theme switched to: ${newTheme}`);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case "high-contrast":
        return <Eye className="h-[1.2rem] w-[1.2rem]" />;
      case "sepia":
      case "purple":
        return <Palette className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-testid="button-theme-toggle"
          className="relative"
        >
          {getThemeIcon()}
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("high-contrast")}>
          <Eye className="mr-2 h-4 w-4" />
          <span>High Contrast</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("sepia")}>
          <Palette className="mr-2 h-4 w-4" />
          <span>Sepia</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("purple")}>
          <Palette className="mr-2 h-4 w-4" />
          <span>Purple</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}