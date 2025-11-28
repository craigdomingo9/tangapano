import { z } from "zod";

// Phone number regex for international format
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Step 1 Schema - Account Information
export const step1Schema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),

    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      )
      .toLowerCase(),

    password: z.string().min(8, "Password must be at least 8 characters"),
    // .regex(/[0-9]/, "Password must contain at least one number")
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Step 2 Schema - Landlord Details
export const step2Schema = z.object({
  company_name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),

  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      phoneRegex,
      "Please enter a valid phone number (e.g., +263 789 456 123)"
    ),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .optional()
    .or(z.literal("")),
});

// Complete registration schema (combines both steps)
export const registrationSchema = step1Schema.merge(step2Schema);

// Type inference
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
