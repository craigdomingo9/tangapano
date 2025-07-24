"use client";
import { z } from "zod"
import { createSignupForm, signupFormSchema } from "@/lib/services/forms/signupForm";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CheckCircle, User } from "lucide-react";
import { axiosInstance } from "@/lib/services/api/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMutation } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";


function SignUpForm() {

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, trigger, getValues, reset } = createSignupForm();

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['first_name', 'last_name', 'email', 'username', 'password', 'confirm_password']);
    }
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fix the errors in Step 1 before proceeding.')
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const mutation = useMutation({
    mutationFn: (data: any) => axiosInstance.post('/users/register/', data, { headers: { 'Content-Type': 'application/json' } }),
    onSuccess() {
      reset();
      toast.success("Signed up successfully")
      router.push('/login');
    },
    onError() {
      toast.error('Signup failed. Please try again.')
    },
  })

  const onSubmit = async(data: z.infer<typeof signupFormSchema>) => {
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
        address: data.address
      };
    }

    await mutation.mutateAsync(dataToSend)

  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl text-indigo-700">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6 text-gray-500">
          <div className={`flex flex-col items-center flex-1 ${currentStep >= 1 ? 'text-indigo-600 font-semibold' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
              {currentStep > 1 ? <CheckCircle size={18} /> : <User size={18} />}
            </div>
            <span className="text-sm mt-1">Account Info</span>
          </div>
          <div className="flex items-center justify-center flex-1">
            <div className={`h-0.5 w-full ${currentStep > 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
          </div>
          <div className={`flex flex-col items-center flex-1 ${currentStep >= 2 ? 'text-indigo-600 font-semibold' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
              {currentStep > 2 ? <CheckCircle size={18} /> : <Building2 size={18} />}
            </div>
            <span className="text-sm mt-1 text-center">Landlord Details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Step 1: Account Information</h3>
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  {...register("first_name")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John"
                />
                {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  {...register("last_name")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Doe"
                />
                {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="tinashedivi"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirm_password"
                  {...register("confirm_password")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                {errors.confirm_password && <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Next Step <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Step 2: Landlord Details (Optional)</h3>
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  id="company_name"
                  {...register("company_name")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Harare Student Homes Ltd."
                />
                {errors.company_name && <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>}
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phone_number"
                  {...register("phone_number")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., +263771234567 or 0771234567"
                />
                {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  id="address"
                  {...register("address")}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  placeholder="123 Main St, Harare"
                ></textarea>
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
              </div>
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <ArrowLeft size={20} className="mr-2" /> Back
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  {mutation.isPending ? (
                    <MoonLoader
                      color="white"
                      size={15}
                    />
                  ) : (
                    <>
                      Sign Up <CheckCircle size={20} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default SignUpForm
