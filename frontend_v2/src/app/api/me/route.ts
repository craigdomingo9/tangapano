import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

// This runs on the Next.js Node server
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    // 1. Call Django from the Next.js Server (Internal Network)
    // We manually attach the header here because we have access to the cookie value
    const { data } = await axios.get(
      `${
        process.env.INTERNAL_API_URL || "http://localhost/api"
      }/users/auth/verify-token/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    // Forward the error status from Django
    return NextResponse.json(
      { error: "Backend Error" },
      { status: error.response?.status || 500 }
    );
  }
}
