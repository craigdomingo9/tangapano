"use client";

import { RouterLink } from "@/routing/RouterLink";
import {
  ChevronRight,
  LogOut,
  MessageCircle,
  Plus,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function PartnerHeaderContent({ user }: { user: User }) {
  function handleLogout() {
    console.log("logout");
    // Add actual sign-out logic here
  }

  const initials = `${user?.first_name?.[0] || ""}${
    user?.last_name?.[0] || ""
  }`;

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <RouterLink to={{ page: "listings", mode: "create" }}>
        {/* Desktop View */}
        <Button className="hidden sm:flex gap-2 bg-lapis hover:bg-lapis-hover text-white shadow-sm shadow-lapis/20">
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </Button>

        {/* Mobile View - Icon Only */}
        <Button
          size="icon"
          className="sm:hidden bg-lapis hover:bg-lapis-hover text-white rounded-full shadow-md"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </RouterLink>

      {/* 2. Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-3 pl-1 pr-2 h-auto rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Avatar className="w-9 h-9 border-2 border-white dark:border-slate-800 shadow-sm">
              {/* Optional: <AvatarImage src={user.image} /> */}
              <AvatarFallback className="bg-linear-to-br from-slate-700 to-slate-900 text-white font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

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
                // isProfileMenuOpen ? "rotate-90" : "rotate-0"
                ""
              }`}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 rounded-xl space-y-2">
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex flex-col space-y-1">
              <p className="text-base font-semibold leading-none">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Using asChild allows the RouterLink to handle the navigation while maintaining menu semantics */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <RouterLink
              to={{ page: "profile" }}
              className="w-full flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>My Profile</span>
            </RouterLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer pt-0 pb-2">
            <RouterLink
              to={{ page: "support" }}
              className="w-full flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Support</span>
            </RouterLink>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-crimson focus:bg-red-50 cursor-pointer gap-2 font-medium py-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default PartnerHeaderContent;
