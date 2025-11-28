"use client";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface DarkThemeToggleProps {
  isBusiness?: boolean;
  className?: string;
}

function DarkThemeToggle({
  isBusiness = false,
  className,
}: DarkThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();
  const isDark = theme === "dark";

  // useEffect only runs on the client, so this will only be true
  // after the initial HTML has been "hydrated"
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-5 h-5" />;
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full transition-colors hover:cursor-pointer",
        isBusiness
          ? "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          : "text-white/80 hover:bg-white/10",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export default DarkThemeToggle;
