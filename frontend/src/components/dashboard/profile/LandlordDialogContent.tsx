import { useAuth } from "@/app/context/AuthContext";
import { editLandlordFormSchema } from "@/lib/services/forms/dashboard/profile/editLandlordForm";
import { useLandlordDialogState } from "./LandlordDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import z from "zod";
import { Form } from "@/components/ui/form";
import InputField from "@/components/universal/Form/Elements/InputField";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function LandlordDialogContent() {
  const form = useForm({ resolver: zodResolver(editLandlordFormSchema) });
  const { user } = useAuth();
  const { setEntities: setDialog } = useLandlordDialogState();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof editLandlordFormSchema>) =>
      axios.patch("/api/users/profile", data),
    onSuccess: () => {
      form.reset();
      toast.success("Profile was updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setDialog(false);
    },
  });

  async function onSubmit(data: z.infer<typeof editLandlordFormSchema>) {
    await mutation.mutateAsync(data);
  }

  const landlordProfile = user?.landlord_profile;

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-lg relative">
      <div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) =>
                console.log(errors),
              )}
            >
              <div className="grid space-y-4 items-center place-items-center">
                <InputField
                  form={form}
                  fieldName="company_name"
                  label="Company Name"
                  placeholder="Fitzgerald Properties"
                  defaultValue={landlordProfile?.company_name}
                />
                <InputField
                  form={form}
                  fieldName="phone_number"
                  label="Phone Number"
                  placeholder="+263776808966"
                  defaultValue={landlordProfile?.phone_number}
                />
                <InputField
                  form={form}
                  fieldName="address"
                  label="Address"
                  placeholder="123 Main St, Anytown, Harare"
                  defaultValue={landlordProfile?.address}
                />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <Button
                  onClick={() => setDialog(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white font-medium"
                >
                  {mutation.isPending ? (
                    <MoonLoader color="white" size={15} />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LandlordDialogContent;
