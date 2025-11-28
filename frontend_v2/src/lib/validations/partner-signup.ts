import z from "zod";

export const RegisterSchema = z
  .object({
    // Step 1 Fields
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    // email: z.email("Invalid email address").optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),

    // Step 2 Fields
    company_name: z.string().optional(),
    phone_number: z
      .string()
      .min(3, "Phone Number must be at least 3 characters"),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Step 1 specific schema for partial validation
export const Step1Schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    // email: z.email("Invalid email address").optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
