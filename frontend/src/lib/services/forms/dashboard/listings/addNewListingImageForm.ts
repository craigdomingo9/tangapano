import z from "zod";



export const addNewListingImageFormSchema = z.object({
  image: z.instanceof(File),
  caption: z.string().optional(),
})


