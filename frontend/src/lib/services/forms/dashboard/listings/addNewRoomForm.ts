import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


export const addNewRoomFormSchema = z.object({
  rent_per_month: z.string().transform(val => Number(val)),
  max_occupants: z.string().transform(val => Number(val)),
  gender_preference: z.enum(["any", "male", "female"]),
});


export const createAddNewRoomForm = () => useForm({ resolver: zodResolver(addNewRoomFormSchema) })

