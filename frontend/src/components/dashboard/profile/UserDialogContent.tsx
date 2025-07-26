import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/universal/Form/Elements/InputField";
import { createEditUserForm, editUserFormSchema } from "@/lib/services/forms/dashboard/profile/editUserForm"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import z, { set } from "zod";
import { useUserDialogState } from "./UserDialog";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";


function UserDialogContent() {
  const form = createEditUserForm();
  const { user } = useAuth();
  const { setEntities: setDialog } = useUserDialogState();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof editUserFormSchema>) => axios.patch("/api/user", data),
    onSuccess: () => {
      form.reset();
      toast.success("User was updated successfully.");
      queryClient.invalidateQueries({queryKey: ["user"]});
      setDialog(false);
    }
  })

  async function onSubmit(data: z.infer<typeof editUserFormSchema>) {
    await mutation.mutateAsync(data);
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-lg relative">
      <div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
              <div className="grid space-y-4 items-center place-items-center">
                <InputField 
                  form={form} 
                  fieldName="first_name" 
                  label="First Name" 
                  placeholder="John" 
                  defaultValue={user?.first_name}
                />
                <InputField 
                  form={form} 
                  fieldName="last_name" 
                  label="Last Name" 
                  placeholder="Mudzinga" 
                  defaultValue={user?.last_name}
                />
                <InputField 
                  form={form} 
                  fieldName="email" 
                  label="Email" 
                  placeholder="g7TQ5@example.com" 
                  defaultValue={user?.email}
                />
                <InputField 
                  form={form} 
                  fieldName="username" 
                  label="Username" 
                  placeholder="username" 
                  defaultValue={user?.username}
                />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <Button onClick={() => setDialog(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium">Cancel</Button>
                <Button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium">
                  {mutation.isPending ? (
                    <MoonLoader
                      color="white"
                      size={15}
                    />
                  ) : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UserDialogContent
