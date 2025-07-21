import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


export const addNewListingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  campus: z.string().min(1, "Campus is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  distance_from_campus: z.string().transform(val => Number(val)),
});


export const createAddNewListingForm = () => useForm({ resolver: zodResolver(addNewListingFormSchema) })

