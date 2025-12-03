import { Button } from "@/components/ui/button";

function ErrorState() {
  return (
    <div className="w-full min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center shadow-lg border border-slate-100 dark:border-slate-800 mb-12">
      <div className="size-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        Something went wrong
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 text-sm">
        We couldn't load the results. Please try again.
      </p>
      <Button
        onClick={() => window.location.reload()}
        className="bg-lapis hover:bg-lapis-hover text-white"
      >
        Try Again
      </Button>
    </div>
  );
}

export default ErrorState;
