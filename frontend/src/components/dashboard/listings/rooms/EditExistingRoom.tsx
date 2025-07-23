import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/universal/Form/Elements/InputField";
import { z } from "zod";
import { MoonLoader } from "react-spinners";
import SelectField from "@/components/HomePage/SelectField";
import CheckBoxField from "@/components/universal/Form/Elements/CheckBoxField";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRoomsDialogOperation, useSelectedRoom } from "./RoomsDialogContent";
import { useSelectedListing } from "../../CardButtons";
import { createEditExitingRoomForm, editExitingRoomFormSchema } from "@/lib/services/forms/dashboard/listings/editExisitingRoomForm";
import { toast } from "sonner";


function EditExistingRoom() {

  const form = createEditExitingRoomForm();
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { entities: selectedRoom } = useSelectedRoom();
  const { entities: selectedListing } = useSelectedListing();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof editExitingRoomFormSchema>) => axios.patch(`/api/landlord-listings/rooms/${selectedRoom?.id}`, data),
    onSuccess: () => {
      setOperation("list");
      queryClient.invalidateQueries({queryKey: ["landlord-listings"]});
      queryClient.invalidateQueries({queryKey: ["rooms", selectedListing?.id]});
      toast.success("Room was updated successfully.")
    },
  })

  async function onSubmit(data: z.infer<typeof editExitingRoomFormSchema>) {
    await mutation.mutateAsync(data);
  }

  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
            <div className="grid grid-cols-2 space-y-2 space-x-2">
              <InputField 
                form={form} 
                fieldName="rent_per_month" 
                label="Rent/month ($)" 
                defaultValue={selectedRoom.rent_per_month}
              />
              <InputField 
                form={form} 
                fieldName="max_occupants" 
                label="Max Students" 
                defaultValue={selectedRoom.max_occupants}
              />
              
              <SelectField 
                form={form}
                fieldName="gender_preference"
                label="Gender Preference"
                defaultValue={selectedRoom.gender_preference}
                selectionList={[
                  {id: "any", name: "Any"},
                  {id: "male", name: "Male"},
                  {id: "female", name: "Female"},
                ]}
                placeholder={capitalizeFirstLetter(selectedRoom.gender_preference)}
                selectClassName="w-full rounded-lg min-h-10"
              />
              <CheckBoxField 
                form={form}
                fieldName="is_available"
                label="Is Available?"
                defaultChecked={selectedRoom.is_available}
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button onClick={() => setOperation("list")} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium">Cancel</Button>
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
  )
}

export default EditExistingRoom
