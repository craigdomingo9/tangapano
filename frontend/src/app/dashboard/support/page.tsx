"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

const feedbackSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(500, "Message must not exceed 500 characters"),
});

function page() {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof feedbackSchema>) => {
      console.log(data);

      return new Promise((resolve) => setTimeout(resolve, 2000));
    },

    onSuccess() {
      toast.success("Feedback submitted successfully");
    },
    onError() {
      toast.error("Failed to submit feedback");
    },
  });

  async function onSubmit(data: z.infer<typeof feedbackSchema>) {
    await mutation.mutateAsync(data);
  }

  return (
    <div className="flex justify-center p-8 bg-background min-h-screen font-sans">
      <div className="w-full max-w-2xl">
        <Card className="flex flex-col space-y-6">
          <CardHeader>
            <CardTitle>Support & Feedback</CardTitle>
            <CardDescription>
              We're here to help! Fill out the form below or contact us
              directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="[&>*]:text-sm text-sm">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <Textarea
                        id="message"
                        className="text-sm"
                        placeholder="Please type your message here..."
                        {...field}
                        rows={10}
                      />
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-white"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <MoonLoader color="white" size={15} />
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <div>
            Or for immediate support, contact us at{" "}
            <div className="text-blue-500 hover:underline">
              +263 781 901 939 on Whatsapp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
