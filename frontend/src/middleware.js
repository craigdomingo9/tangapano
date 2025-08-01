import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("Running middleware for:", request.nextUrl.pathname);
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
