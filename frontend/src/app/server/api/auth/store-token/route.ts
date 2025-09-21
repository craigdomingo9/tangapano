import { NextRequest, NextResponse } from "next/server";

// Helper function to extract domain from host
function getDomainFromHost(host: string): string | undefined {
  const domain = host.split(":")[0];

  if (domain === "localhost" || domain.startsWith("127.0.0.")) {
    return undefined;
  }

  return domain;
}

export async function POST(req: NextRequest) {
  try {
    console.log("[API] Store token route hit");
    const { token } = await req.json();
    console.log("Received token:", token);

    const response = NextResponse.json({
      message: "Token stored successfully",
    });

    // Set cookie with proper domain
    const host = req.headers.get("host") || "";
    const domain = getDomainFromHost(host);

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      // TODO: fix secure attribute
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      domain: domain,
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
