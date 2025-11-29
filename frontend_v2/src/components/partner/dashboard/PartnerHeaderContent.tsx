"use client";
import { RouterLink } from "@/routing/RouterLink";
import { ChevronRight, LogOut, MessageCircle, Plus, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function PartnerHeaderContent({ user }: { user: User }) {
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // console.log(user);

  function handleLogout() {
    console.log("logout");
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <RouterLink to={{ page: "listings", mode: "create" }}>
        <button className="hidden sm:flex items-center gap-2 bg-lapis hover:bg-lapis-hover text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm shadow-lapis/20 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </RouterLink>
      <RouterLink to={{ page: "listings", mode: "create" }}>
        <button className="sm:hidden flex items-center justify-center w-10 h-10 bg-lapis text-white rounded-full shadow-md cursor-pointer">
          <Plus className="w-5 h-5" />
        </button>
      </RouterLink>

      <div className="relative" ref={profileMenuRef}>
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-sm font-bold ring-2 ring-white dark:ring-slate-800 shadow-sm">
            {user?.first_name[0]}
            {user?.last_name[0]}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none">
              {user?.first_name}
            </p>
            <p className="text-xxs text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wide">
              Landlord
            </p>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isProfileMenuOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>

        {isProfileMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 md:hidden">
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>

            <div className="py-1">
              <RouterLink to={{ page: "profile" }}>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-lapis flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" /> My Profile
                </button>
              </RouterLink>
              <RouterLink to={{ page: "support" }}>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Support
                </button>
              </RouterLink>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-crimson hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PartnerHeaderContent;
