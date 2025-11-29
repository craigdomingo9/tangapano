import { Metadata } from "next";
import { Home } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/partner/login/login-form";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Login - Partner Portal",
  description: "Sign in to manage your properties",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-lapis/20 selection:text-lapis transition-colors duration-300">
      {/* Background Decoration */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] bg-lapis/5 dark:bg-lapis/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] bg-airforce/5 dark:bg-airforce/10 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <ThemeToggle className="absolute top-0 right-0 p-3 rounded-full bg-card border border-border hover:text-primary shadow-lg transition-all z-50 focus:outline-none" />

        {/* Brand Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 mb-6 ring-1 ring-slate-100 dark:ring-slate-800">
            <Home className="w-10 h-10" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Partner Portal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm">
            Manage your properties with ease
          </p>
        </header>

        {/* Login Card */}
        <main className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8">
            <LoginForm />
          </div>

          {/* Footer Links */}
          <footer className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
              Don't have an account?{" "}
              <Link
                href="/partner/signup"
                prefetch={true}
                className="text-lapis dark:text-sky-400 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-lapis rounded"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Are you a student?{" "}
              <Link
                href="/student"
                prefetch={true}
                className="text-lapis dark:text-sky-400 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-lapis rounded"
              >
                Find Accommodation
              </Link>
            </p>
          </footer>
        </main>

        <div className="mt-8 text-center flex items-center justify-center gap-6 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            POWERED BY TANGAPANO
          </span>
        </div>
      </div>
    </div>
  );
}
