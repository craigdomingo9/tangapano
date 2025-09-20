import { z } from "zod";

export const editExistingListingFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  campus: z.string().min(1, "Campus is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  distance_from_campus: z.string().transform((val) => Number(val)),
  apply_agent_fee: z.boolean(),
});
