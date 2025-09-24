import { z } from "zod";

export const signupFormSchema = z
  .object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.email("Email is invalid"),
    company_name: z.string().min(1, "Company Name is required"),
    phone_number: z
      .string()
      .regex(/^(\+263|0)7[1-9][0-9]{7}$/, {
        message: "Phone number must be like +263719867908 or 0719867908.",
      })
      .optional(),
    address: z.string().optional(),
    username: z
      .string()
      .min(1, "Username is required")
      .transform((s) => s.replaceAll(/\s/g, "")),
    password: z.string().min(1, "Password is required"),
    confirm_password: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
