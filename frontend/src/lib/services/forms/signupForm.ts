import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const signupFormSchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.email("Invalid email"),    
    company_name: z.string().optional(),
    phone_number: z.string().regex(/^(\+263|0)7[1-9][0-9]{7}$/, {
        message: 'Phone number must be in +2637XXXXXXXX or 07XXXXXXXX format',
    }).optional(),
    address: z.string().optional(),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    confirm_password: z.string().min(1, "Confirm password is required"),
}).refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
})


export const createSignupForm = () => {
    return useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            company_name: "",
            phone_number: "",
            address: "",
            username: "",
            password: "",
        }
    })
}

