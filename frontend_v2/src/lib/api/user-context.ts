import "server-only"; // Security: Prevents client-side bundling
import { cache } from "react";
import { cookies } from "next/headers";
import { axiosInstance } from "@/lib/api/config";

// The Cached Fetcher
export const getUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    // Manually attach the header since we are on the server
    const { data } = await axiosInstance.get<User>(
      "/users/auth/verify-token/",
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    return data;
  } catch (error) {
    console.error("Auth Error:", error);
    return null;
  }
});
