import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


export const editExistingListingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  campus: z.string().min(1, "Campus is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  distance_from_campus: z.string().transform(val => Number(val)),
  is_available: z.boolean(),
});

export const createEditExistingListingForm = () => useForm({ resolver: zodResolver(editExistingListingFormSchema) })


