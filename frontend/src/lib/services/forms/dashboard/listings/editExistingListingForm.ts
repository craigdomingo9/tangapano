import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


export const editExistingListingFormSchema = z.object({
  title: z.string().optional(),
  campus: z.string().optional(),
  neighborhood: z.string().optional(),
  distance_from_campus: z.string().transform(val => Number(val)),
  is_available: z.boolean(),
});

export const createEditExistingListingForm = () => useForm({ resolver: zodResolver(editExistingListingFormSchema) })


