import { z } from "zod";

export const searchFormSchema = z
  .object({
    campus: z.string().min(1, "Campus is required"),
    neighborhood: z.string().min(1, "Neighborhood is required"),
    price_min: z.number().min(0).optional(),
    price_max: z.number().min(0).optional(),
    max_occupants: z.string().optional(),
    gender: z.enum(["male", "female"]),
    amenities: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.price_min && data.price_max && data.price_min > data.price_max) {
        return false;
      }
      return true;
    },
    {
      message: "Minimum price cannot be greater than maximum price",
      path: ["price_min"],
    }
  );
