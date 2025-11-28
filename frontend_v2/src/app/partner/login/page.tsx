"use client";
import { login } from "@/actions/partner/auth";
import { Button } from "@/components/ui/button";
import DarkThemeToggle from "@/components/ui/DarkThemeToggle";
import { Eye, EyeOff, Home, User, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

function page() {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("landlord_1");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    onLogin();
  };

  async function onLogin() {
    startTransition(async () => {
      const result = await login(
        { username, password },
        window.location.origin
      );

      if (result && !result.success) {
        // Handle validation or server errors
        setError((result.errors?.general as any) || "Login failed.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-lapis/20 selection:text-lapis transition-colors duration-300">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] bg-lapis/5 dark:bg-lapis/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] bg-airforce/5 dark:bg-airforce/10 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <DarkThemeToggle className="absolute top-0 right-0 p-3 rounded-full bg-card border border-border text-text hover:text-primary shadow-lg transition-all z-50 focus:outline-none" />
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 mb-6 ring-1 ring-slate-100 dark:ring-slate-800">
            <Home className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Partner Portal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm">
            Manage your properties with ease
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <X className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-lapis dark:group-focus-within:text-sky-400 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-lapis dark:focus:border-sky-500 focus:ring-4 focus:ring-lapis/10 dark:focus:ring-sky-500/10 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 mt-2"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-lapis dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-lapis dark:group-focus-within:text-sky-400 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-lapis dark:focus:border-sky-500 focus:ring-4 focus:ring-lapis/10 dark:focus:ring-sky-500/10 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 mt-1"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base dark:text-white/90 font-bold bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 shadow-lg shadow-lapis/20 dark:shadow-sky-500/20 transition-all mt-2 cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>

          <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xsm text-slate-500 dark:text-slate-400 font-medium mb-2">
              Don't have an account?{" "}
              <Link href={"/partner/signup"} prefetch={true}>
                <button className="text-lapis dark:text-sky-400 font-bold hover:underline focus:outline-none cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </p>
            <p className="text-xsm text-slate-500 dark:text-slate-400 font-medium">
              Are you a student?{" "}
              <Link href={"/student"} prefetch={true}>
                <button className="text-lapis dark:text-sky-400 font-bold hover:underline focus:outline-none cursor-pointer">
                  Find Accommodation
                </button>
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            POWERED BY TANGAPANO
          </span>
        </div>
      </div>
    </div>
  );
}

export default page;
