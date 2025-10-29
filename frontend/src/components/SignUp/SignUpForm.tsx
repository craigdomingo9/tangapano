"use client";
import { z } from "zod";
import { signupFormSchema } from "@/lib/services/forms/signupForm";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  User,
} from "lucide-react";
import { axiosInstance } from "@/lib/services/api/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMutation } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import UserEmailFields, {
  useUserExists,
} from "../public/forms/UserEmailFields";
import PasswordField from "../public/forms/PasswordField";
import InputField from "../public/forms/InputField";

function SignUpForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      company_name: "",
    },
  });
  const { entities: userExists } = useUserExists();

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await form.trigger([
        "first_name",
        "last_name",
        "email",
        "username",
        "password",
        "confirm_password",
      ]);
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error("Please fix the errors in Step 1 before proceeding.");
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const mutation = useMutation({
    mutationFn: (data: any) =>
      axiosInstance.post("/users/register/", data, {
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess() {
      form.reset();
      toast.success("Signed up successfully");
      router.push("/login");
    },
    onError() {
      toast.error("Signup failed. Please try again.");
    },
  });

  const onSubmit = async (data: z.infer<typeof signupFormSchema>) => {
    const dataToSend: any = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      username: data.username,
      password: data.password,
    };

    // If landlord-specific fields are present, group them under landlord_profile
    if (data.company_name || data.phone_number || data.address) {
      dataToSend.landlord_profile = {
        company_name: data.company_name,
        phone_number: data.phone_number,
        address: data.address,
      };
    }

    await mutation.mutateAsync(dataToSend);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-lg">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6 text-gray-500">
          <div
            className={`flex flex-col items-center flex-1 ${
              currentStep >= 1 ? "text-indigo-600 font-semibold" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1
                  ? "border-indigo-600 bg-indigo-100"
                  : "border-gray-300"
              }`}
            >
              {currentStep > 1 ? <CheckCircle size={18} /> : <User size={18} />}
            </div>
            <span className="text-sm mt-1">Account Info</span>
          </div>
          <div className="flex items-center justify-center flex-1">
            <div
              className={`h-0.5 w-full ${
                currentStep > 1 ? "bg-indigo-600" : "bg-gray-300"
              }`}
            ></div>
          </div>
          <div
            className={`flex flex-col items-center flex-1 ${
              currentStep >= 2 ? "text-indigo-600 font-semibold" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2
                  ? "border-indigo-600 bg-indigo-100"
                  : "border-gray-300"
              }`}
            >
              {currentStep > 2 ? (
                <CheckCircle size={18} />
              ) : (
                <Building2 size={18} />
              )}
            </div>
            <span className="text-sm mt-1 text-center">Landlord Details</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Step 1: Account Information
              </h3>
              <div>
                <InputField
                  title="First Name"
                  fieldName="first_name"
                  form={form}
                  placeholder="Arnold"
                />
              </div>
              <div>
                <InputField
                  title="Last Name"
                  fieldName="last_name"
                  form={form}
                  placeholder="Mukwati"
                />
              </div>
              {/* User and Email Fields */}
              <UserEmailFields form={form} />

              <div>
                <PasswordField
                  title="Password"
                  fieldName="password"
                  form={form}
                />
              </div>
              <div>
                <PasswordField
                  title="Confirm Password"
                  fieldName="confirm_password"
                  form={form}
                />
              </div>
              <Button
                onClick={handleNext}
                disabled={userExists}
                className="w-full flex items-center h-12 justify-center py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              >
                Next Step <ArrowRight size={20} />
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Step 2: Landlord Details (Optional)
              </h3>
              <div>
                <InputField
                  title="Company Name"
                  fieldName="company_name"
                  form={form}
                  placeholder="e.g., John Doe Company"
                />
              </div>
              <div>
                <InputField
                  title="Phone Number"
                  fieldName="phone_number"
                  form={form}
                  placeholder="e.g., +263 123 456 789"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md resize-y"
                  placeholder="123 Main St, Harare"
                ></Textarea>
                {form.formState.errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between gap-4">
                <Button
                  onClick={handleBack}
                  className="flex-1 h-12 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white"
                >
                  <ArrowLeft size={20} /> Back
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 flex items-center h-12 justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white"
                >
                  {mutation.isPending ? (
                    <MoonLoader color="white" size={15} />
                  ) : (
                    <>
                      Sign Up <CheckCircle size={20} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default SignUpForm;
