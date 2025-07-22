import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";



export const addNewListingImageFormSchema = z.object({
  image: z.instanceof(File),
  caption: z.string().optional(),
})

export const createAddNewListingImageForm = () => {
  return useForm<z.infer<typeof addNewListingImageFormSchema>>({
    resolver: zodResolver(addNewListingImageFormSchema),
  })
}

