import { string, object, email } from "zod";

export const signupFormSchema = object({
  first_name: string().optional(),
  last_name: string().optional(),
  email: email("Email is invalid"),
  company_name: string().min(1, "Company Name is required"),
  phone_number: string()
    .regex(/^(\+263|0)7[1-9][0-9]{7}$/, {
      message: "Phone number must be like +263719867908 or 0719867908.",
    })
    .optional(),
  address: string().optional(),
  username: string()
    .min(1, "Username is required")
    .transform((s) => s.replaceAll(/\s/g, "")),
  password: string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/^\S*$/, "Password cannot contain spaces."),
  confirm_password: string().min(
    8,
    "Confirm Password must be at least 8 characters long"
  ),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});
