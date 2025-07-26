import { z } from "zod"

export const editExitingRoomFormSchema = z.object({
  rent_per_month: z.string().transform(val => Number(val)),
  max_occupants: z.string().transform(val => Number(val)),
  gender_preference: z.enum(["any", "male", "female"]),
  is_available: z.boolean()
});


