import { z } from "zod";

export const editExistingListingFormSchema = z.object({
  title: z.string().optional(),
  campus: z.string().optional(),
  neighborhood: z.string().optional(),
  distance_from_campus: z.string().transform((val) => Number(val)),
  is_active: z.boolean(),
});
