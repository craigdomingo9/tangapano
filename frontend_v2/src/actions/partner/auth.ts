"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";
// Assuming you have an axios config, or you can use standard fetch
import { axiosInstance } from "@/lib/api/config";
import { z } from "zod";

// 1. Validation Schema
const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = {
  success?: boolean;
  errors?: {
    username?: string[];
    password?: string[];
    general?: any;
  };
};

export async function login(
  data: { username: string; password: string },
  domain?: string
) {
  // 1. Validate Input
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.message,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    // 2. Call your Backend API (Django/External)
    // We assume your backend returns { access: string, refresh: string }
    const response = await axiosInstance.post("/users/auth/login/", {
      username,
      password,
    });

    const { token } = response.data;

    // 3. Set Session Cookies
    // Security Note: HttpOnly prevents JavaScript from reading the token (XSS protection)
    const cookieStore = await cookies();

    // Auth Token
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 7 days
      domain: domain,
    });
  } catch (error) {
    // 4. Handle Errors
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.detail ||
        "Invalid credentials. Please try again.";

      return {
        success: false,
        errors: {
          general: errorMessage,
        },
      };
    }

    return {
      success: false,
      errors: {
        general: "Something went wrong. Please try again later.",
      },
    };
  }

  // 5. Redirect (Must be outside try/catch)
  // In Next.js Server Actions, redirect() throws an error internally to switch pages
  redirect("/partner/dashboard");
}
