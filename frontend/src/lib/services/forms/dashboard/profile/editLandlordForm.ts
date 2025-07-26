import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


export const editLandlordFormSchema = z.object({
  company_name: z.string().optional(),
  phone_number: z.string().regex(/^(\+263|0)7[1-9][0-9]{7}$/, {
    message: 'Phone number must be in +2637XXXXXXXX or 07XXXXXXXX format',
  }).optional(),
  address: z.string().optional(),
})

export const createEditLandlordForm = () => useForm({ resolver: zodResolver(editLandlordFormSchema) })
