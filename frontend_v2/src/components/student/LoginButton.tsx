"use client";
import { verifyToken } from "@/actions/partner/auth";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LoginButtonProps {}

function LoginButton({}: LoginButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      const user = await verifyToken();

      console.log(user);
      if (user.id) setIsLoggedIn(true);
    }

    checkLoginStatus();
  }, []);

  return (
    <Link
      href={isLoggedIn ? "/partner/dashboard" : "/partner/login"}
      prefetch={true}
      className="flex gap-2"
    >
      <button className="flex hover:cursor-pointer items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all">
        <Briefcase className="w-4 h-4" />
        <span className="hidden sm:inline">
          Partner {isLoggedIn ? "Dashboard" : "Login"}
        </span>
      </button>
    </Link>
  );
}

export default LoginButton;
