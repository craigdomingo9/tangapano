"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/api/config";
import { PartnerSignupDataStore } from "@/lib/stores/partnerSignupDataStore";
import { registrationSchema } from "@/lib/validations/partner-signup";

export async function signup(rawData: PartnerSignupDataStore, domain?: string) {
  // 1. Validate Input
  const validatedFields = registrationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.message,
    };
  }

  const {
    username,
    email,
    password,
    first_name,
    last_name,
    address,
    company_name,
    phone_number,
  } = validatedFields.data;

  try {
    // 2. REGISTER User (Call Django Backend)
    await axiosInstance.post("/users/register/", {
      username,
      email,
      password,
      first_name,
      last_name,
      address,
      company_name,
      phone_number,
    });

    // ---------------------------------------------------------
    // 3. AUTO-LOGIN
    // ---------------------------------------------------------
    const loginResponse = await axiosInstance.post("/users/auth/login/", {
      username,
      password,
    });

    const { token } = loginResponse.data;

    // 4. Set Cookies (Identical to Login Action)
    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      domain: domain,
    });
  } catch (error) {
    // 5. Error Handling
    if (error instanceof AxiosError) {
      // Django often returns field-specific errors (e.g., { username: ["Taken"] })
      // We return these directly to be mapped to the UI
      return {
        success: false,
        errors: error.response?.data || { general: "Registration failed." },
      };
    }
    return {
      success: false,
      errors: { general: "An unexpected error occurred." },
    };
  }

  // 6. Redirect to Onboarding or Dashboard
  redirect("/partner/dashboard");
}
