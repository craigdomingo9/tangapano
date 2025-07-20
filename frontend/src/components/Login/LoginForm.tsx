"use client";
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createLoginForm, loginFormSchema } from "@/lib/services/forms/loginForm"
import { Form } from "../ui/form"
import InputField from "../universal/Form/Elements/InputField"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const form = createLoginForm();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    setIsLoggingIn(true);
    
    try {
      const _ = await axios.post('/api/login', data);
      
      toast.success("Logged in successfully")
      router.push('/dashboard/listings')
    } catch (error) {
      toast.error("Invalid username or password")
      
      setIsLoggingIn(false);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <InputField
                  form={form}
                  fieldName="username"
                  label="Username"
                  placeholder="craigkd"
                  defaultValue=""
                />
              </div>
              <div className="grid gap-3">
                <InputField
                  form={form}
                  fieldName="password"
                  label="Password"
                  type="password"
                  placeholder="**********"
                  defaultValue=""
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {isLoggingIn ? (
                    <MoonLoader
                      color="white"
                      size={15}
                    />
                  ) : 'Login'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
