import { axiosInstance } from "@/lib/services/api/config";
import { AxiosError } from "axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      expires: 1000 * 60 * 60 * 24 * 30, // 30 days
      domain: process.env.NEXT_PUBLIC_DOMAIN || "tangapano.co.zw",
    })

    return response;
  } catch (error: unknown) {
    if (!(error instanceof AxiosError)) return;
    const message = error?.response?.data?.error || "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
