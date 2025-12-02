import { ArrowRight } from "lucide-react";
import Link from "next/link";

function OverviewFooter() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xsm sm:text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} TangaPano. Partner Dashboard.
        </p>
        <Link href="/portal" target="_blank" rel="noopener noreferrer">
          <button className="group flex items-center gap-2 text-xsm sm:text-sm font-semibold text-lapis dark:text-sky-400 hover:text-lapis-hover dark:hover:text-sky-300 transition-colors cursor-pointer">
            Go to main page
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </footer>
  );
}

export default OverviewFooter;
