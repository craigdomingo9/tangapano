import { z } from "zod"


export const addNewRoomFormSchema = z.object({
  rent_per_month: z.string().transform(val => Number(val)),
  max_occupants: z.string().transform(val => Number(val)),
  gender_preference: z.enum(["any", "male", "female"]),
});



