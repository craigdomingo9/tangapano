import { Metadata } from "next";
import { Building, Home } from "lucide-react";
import Link from "next/link";
import { SignupForm } from "@/components/partner/signup/signup-form";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Sign Up - Partner Portal",
  description: "Create your partner account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decoration */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] bg-lapis/5 dark:bg-lapis/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] bg-airforce/5 dark:bg-airforce/10 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-md animate-in fade-in duration-500 relative sm:mt-16">
        <ThemeToggle className="absolute top-0 right-0 p-3 rounded-full bg-card border border-border text-text hover:text-primary shadow-lg transition-all z-50 focus:outline-none" />

        {/* Brand Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 mb-6 ring-1 ring-slate-100 dark:ring-slate-800">
            <Building className="w-10 h-10" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sign Up
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
            Create your partner account
          </p>
        </header>

        {/* Main Form Card */}
        <main className="bg-card border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden transition-colors duration-300">
          <div
            className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <SignupForm />

          {/* Footer Links */}
          <footer className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
              Already have an account?{" "}
              <Link
                href="/partner/login"
                prefetch={true}
                className="text-lapis dark:text-sky-400 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-lapis rounded"
              >
                Login
              </Link>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Are you a student?{" "}
              <Link
                href="/portal?page=home"
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
