"use client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginFormSchema } from "@/lib/services/forms/loginForm";
import { Form } from "../ui/form";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../public/forms/InputField";
import PasswordField from "../public/forms/PasswordField";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof loginFormSchema>) =>
      axios.post("/server/api/auth/login", data),
    onSuccess() {
      toast.success("Logged in successfully");
      router.push("/dashboard/rooms");
    },
    onError() {
      toast.error("Invalid username or password");
    },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    await mutation.mutateAsync(data);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">
            Login to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <InputField
                    form={form}
                    fieldName="username"
                    title="Username"
                    placeholder="craigkd"
                  />
                </div>
                <div className="grid gap-3">
                  <PasswordField
                    form={form}
                    fieldName="password"
                    title="Password"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-12 text-sm"
                  >
                    {mutation.isPending ? (
                      <MoonLoader color="white" size={15} />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-sky-600 font-semibold hover:text-sky-700 hover:underline"
                >
                  Sign up
                </Link>
              </p>

              <p className="text-sm mt-2 text-center">
                <Link
                  href="/support"
                  className="text-gray-500 hover:text-gray-700 hover:underline"
                >
                  Get Support
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
