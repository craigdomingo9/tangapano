import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const editUserFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email("Invalid email").optional(),
  username: z.string().min(1, "Username is required"),
})

export const createEditUserForm = () => useForm<z.infer<typeof editUserFormSchema>>({resolver: zodResolver(editUserFormSchema)})
