import { z } from "zod";

export const editExitingRoomFormSchema = z
  .object({
    rent_per_month: z.string().transform((val) => Number(val)),
    max_occupants: z.string().transform((val) => Number(val)),
    current_occupants: z.string().transform((val) => Number(val)),
    gender_preference: z.enum(["any", "mixed", "male", "female"]),
  })
  .refine((data) => data.current_occupants <= data.max_occupants, {
    message:
      "Current Occupants cannot be greater than Students Allowed In Room",
    path: ["current_occupants"],
  });
