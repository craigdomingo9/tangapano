import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("[API] Store token route hit");
    const { token } = await req.json();
    console.log("Received token:", token);

    const response = NextResponse.json({
      message: "Token stored successfully",
    });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      expires: 1000 * 60 * 60 * 24 * 30, // 30 days
      domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
    });

    return response;
  } catch (error: unknown) {
    console.error("[API] Error storing token:", error);
    return NextResponse.json(
      { error: "Failed to store token" },
      { status: 500 }
    );
  }
}
