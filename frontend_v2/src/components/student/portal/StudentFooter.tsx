import { MessageCircleMore } from "lucide-react";
import React from "react";

function StudentFooter() {
  return (
    <div className="mt-12 flex flex-col items-center gap-8">
      <div className="text-center space-y-4">
        <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">
          Trusted by students from
        </p>
        <div className="flex flex-wrap justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
          <span className="font-bold text-slate-600 dark:text-slate-400 text-base">
            MSU
          </span>
          <span className="font-bold text-slate-600 dark:text-slate-400 text-base">
            UZ
          </span>
        </div>
      </div>

      <div className="w-full border-t border-slate-200/50 dark:border-slate-700/50"></div>

      <div className="flex justify-center pb-6">
        <button className="text-slate-500 dark:text-slate-400 hover:text-crimson dark:hover:text-red-400 font-semibold text-sm flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-crimson/5 dark:hover:bg-red-900/20 cursor-pointer">
          <MessageCircleMore className="w-4 h-4" />
          Need Help? Contact Support
        </button>
      </div>
    </div>
  );
}

export default StudentFooter;
