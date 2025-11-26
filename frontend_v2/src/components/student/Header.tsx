"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  sticky?: boolean;
  className?: string;
  variant: "student" | "business";
  containerClassName?: string;
  children: React.ReactNode;
  logoLinkRoute?: string;
}

function Header({
  sticky,
  className,
  containerClassName,
  variant = "student",
  logoLinkRoute = "/student",
  children,
}: HeaderProps) {
  const router = useRouter();
  const isBusiness = variant === "business";
  const { setTheme, theme } = useTheme();
  const isDark = theme === "dark";

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header
      className={cn(
        "w-full z-40 transition-all duration-300 bg-crimson",
        sticky && "sticky top-0",
        isBusiness
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-slate-900/60"
          : "bg-transparent",
        className
      )}
    >
      <div
        className={cn(
          "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between",
          containerClassName
        )}
      >
        {/* Logo Section */}
        <div
          className={cn(
            "flex items-center gap-4 select-none transition-all hover:opacity-90 active:scale-95"
          )}
        >
          {isBusiness ? (
            <div className="flex items-center gap-3 group">
              <div className="flex flex-col justify-center">
                <span className="text-slate-900 dark:text-white font-bold text-lg sm:text-xl leading-none tracking-tight font-sans">
                  TangaPano
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-lapis dark:bg-sky-400 animate-pulse"></span>
                  <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    Partner Portal
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-3 group hover:cursor-pointer"
              onClick={() => router.push(logoLinkRoute)}
            >
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-none drop-shadow-md">
                  TangaPano
                </span>
                <span className="text-white/80 text-xs font-bold tracking-wide mt-0.5 uppercase opacity-90">
                  Student Housing
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full transition-colors hover:cursor-pointer",
              isBusiness
                ? "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                : "text-white/80 hover:bg-white/10"
            )}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          {children}
        </div>
      </div>
    </header>
  );
}

export default Header;
