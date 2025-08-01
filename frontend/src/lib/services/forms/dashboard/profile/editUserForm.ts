import { z } from "zod";

export const editUserFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email("Invalid email").optional(),
  username: z.string().min(1, "Username is required"),
});
