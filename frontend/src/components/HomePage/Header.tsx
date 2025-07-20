"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link"
import { useEffect } from "react";


function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // console.log(user, isAuthenticated);
  }, [user, isAuthenticated]);

  return (
    <div className="flex justify-center sticky z-50 top-0 p-4 h-24 text-white bg-[var(--primary-bg)]">
      <div className="flex items-center justify-between w-full max-w-3xl px-1">
        <div>
          <Link href={"/"} className="text-2xl font-bold">TangaPano</Link>
          <p className="text-sm font-light">Secure your accommodation now!</p>
        </div>
        <div>
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <button onClick={logout} className="underline underline-offset-2 cursor-pointer">Logout</button>
            </div>
          )}
          {!isAuthenticated && (
            <div>
              <Link href={"/login"} className="underline underline-offset-2">Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
