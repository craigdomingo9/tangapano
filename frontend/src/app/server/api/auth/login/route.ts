import { axiosInstance } from "@/lib/services/api/config";
import { AxiosError } from "axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


// Helper function to extract domain from host
function getDomainFromHost(host: string): string | undefined {
  const domain = host.split(':')[0];
  
  if (domain === 'localhost' || domain.startsWith('127.0.0.')) {
    return undefined;
  }
  
  return domain;
}

export async function POST(req: NextRequest) {
  try {
    console.log("[API] Login route hit");
    const { username, password } = await req.json();
    console.log("Received credentials:", username);

    console.log("Attempting login request to Django backend...");
    const res = await axiosInstance.post(
      "/users/auth/login/",
      JSON.stringify({ username, password })
    );
    console.log("Received response from backend:", res.status);

    if (res.status >= 400) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { token } = await res.data;

    const response = NextResponse.json({ message: "Login successful" });

    // Set cookie with proper domain
    const host = req.headers.get('host') || '';
    const domain = getDomainFromHost(host);

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      // TODO: fix secure attribute
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      domain: domain // || process.env.NEXT_PUBLIC_DOMAIN,
    })

    return response;
  } catch (error: unknown) {
    if (!(error instanceof AxiosError)) return;
    const message = error?.response?.data?.error || "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
