import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextResponse } from "next/server";

// Simple in-memory cache (consider Redis for production)
const tokenCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  // Check cache
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ token: token, data: cached.data });
  }

  const res = await axiosInstance.get("/users/auth/verify-token/", {
    headers: { Authorization: `Token ${token}` },
  });

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  const data = res.data;

  // Update cache
  tokenCache.set(token, { data, timestamp: Date.now() });

  return NextResponse.json({ token: token, data });
}
