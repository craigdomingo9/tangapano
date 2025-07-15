import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const searchFormSchema = z.object({
  campus: z.string().min(1, "Campus is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  max_occupants: z.string().optional(),
  gender: z.enum(["male", "female", "any"]),
  amenities: z.array(z.string()).optional()
}).refine(data => {
  if (data.price_min && data.price_max && data.price_min > data.price_max) {
    return false;
  }
  return true;
}, {
  message: "Minimum price cannot be greater than maximum price",
  path: ["price_min"]
});

export const createSearchForm = () => {
  return useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
    price_min: undefined,
    price_max: undefined,
    max_occupants: undefined,
    gender: "any",
    amenities: []
  }
  })
}

