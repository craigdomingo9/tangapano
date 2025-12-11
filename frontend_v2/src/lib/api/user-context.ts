import "server-only"; // Security: Prevents client-side bundling
import { cache } from "react";
import { cookies } from "next/headers";
import { axiosInstance } from "@/lib/api/config";
import { USER_COOKIE_NAME } from "@/constants/auth";

// The Cached Fetcher
export const getUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;

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
    // console.error("Auth Error:", error);
    return null;
  }
});

export const getAdminUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("panel_auth_token")?.value;

  if (!token) return null;

  try {
    // Manually attach the header since we are on the server
    const adminParam = "?is_admin=true";
    const { data } = await axiosInstance.get<User>(
      "/users/auth/verify-token/" + adminParam,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    return data;
  } catch (error) {
    // console.error("Auth Error:", error);
    return null;
  }
});
