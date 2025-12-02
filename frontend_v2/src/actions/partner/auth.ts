"use server";

import { cookies } from "next/headers";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/api/config";
import { z } from "zod";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// --- Configuration ---

const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Map HTTP Status Codes to User-Friendly Messages
const LOGIN_ERRORS: Record<number, string> = {
  400: "Invalid request data. Please check your inputs.",
  401: "Incorrect username or password.", // Unauthorized
  403: "Access denied. Your account may be inactive or suspended.", // Forbidden
  404: "Account not found.", // Not Found (Optional: usually better to treat as 401 for security)
  429: "Too many login attempts. Please try again in a few minutes.",
  500: "Our servers are experiencing issues. Please try again later.",
  502: "Bad Gateway. Please try again later.",
  503: "Service unavailable. We are performing maintenance.",
};

const DEFAULT_ERROR = "An unexpected error occurred. Please try again.";

// --- Action ---

export async function login(
  data: { username: string; password: string },
  domain?: string
) {
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const response = await axiosInstance.post("/users/auth/login/", {
      username,
      password,
    });

    const { token } = response.data;
    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    redirect("/partner/dashboard");
  } catch (error) {
    // 1. Redirect Check (Critical)
    if (isRedirectError(error)) {
      throw error;
    }

    // 2. Axios Error Handling (Status Code Mapping)
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      // Look up the error message, fallback to backend detail, or default
      const friendlyMessage =
        (status && LOGIN_ERRORS[status]) || // 1. Check our map
        error.response?.data?.detail || // 2. Check backend specific message
        DEFAULT_ERROR; // 3. Fallback

      console.error(`Login Failed [${status}]:`, friendlyMessage);

      return {
        success: false,
        errors: {
          general: friendlyMessage,
        },
      };
    }

    // 3. Unknown System Errors
    console.error("Unhandled Login Error:", error);
    return {
      success: false,
      errors: {
        general: DEFAULT_ERROR,
      },
    };
  }
}

export async function verifyToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return;

  try {
    const response = await axiosInstance.get("/users/auth/verify-token/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Token Verification Error:", error);
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
