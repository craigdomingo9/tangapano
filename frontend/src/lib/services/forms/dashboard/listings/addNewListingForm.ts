import { z } from "zod";

export const addNewListingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  campus: z.string().min(1, "Campus is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  distance_from_campus: z.string().transform((val) => Number(val)),
  apply_agent_fee: z.boolean().optional().default(true),
});
