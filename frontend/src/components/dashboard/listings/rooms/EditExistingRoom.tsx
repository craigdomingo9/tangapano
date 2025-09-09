import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/universal/Form/Elements/InputField";
import { z } from "zod";
import { MoonLoader } from "react-spinners";
import SelectField from "@/components/HomePage/SelectField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { editExitingRoomFormSchema } from "@/lib/services/forms/dashboard/listings/editExisitingRoomForm";
import { toast } from "sonner";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRoomsDialogOperation,
  useRoomsDialogState,
  useSelectedListing,
  useSelectedRoom,
} from "@/lib/hooks/store";
import { Mars, MinusIcon, PlusIcon, Shuffle, Venus } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  dismissDialogOnAction?: boolean;
};

const gendersList = [
  { id: "mixed", name: "Mixed", icon: Shuffle },
  { id: "male", name: "Male", icon: Mars },
  { id: "female", name: "Female", icon: Venus },
];

function EditExistingRoom({ dismissDialogOnAction }: Props) {
  const form = useForm({ resolver: zodResolver(editExitingRoomFormSchema) });
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { entities: selectedRoom } = useSelectedRoom();
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setDialog } = useRoomsDialogState();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof editExitingRoomFormSchema>) =>
      axios.patch(
        `/server/api/landlord-listings/rooms/${selectedRoom?.id}`,
        data
      ),
    onSuccess: () => {
      toast.success("Room was updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      queryClient.invalidateQueries({
        queryKey: ["rooms", selectedListing?.id],
      });

      if (dismissDialogOnAction) {
        setDialog(false);
        return;
      }

      setOperation("list");
    },
  });

  const currentOccupants = useWatch({
    control: form.control,
    name: "current_occupants",
  });
  const maxOccupants = useWatch({
    control: form.control,
    name: "max_occupants",
  });

  const handleIncrement = () => {
    const current = Number(currentOccupants);
    if (current < Number(maxOccupants)) {
      form.setValue("current_occupants", (current + 1).toString());
    }
  };

  const handleDecrement = () => {
    const current = Number(currentOccupants);
    if (current > 0) {
      form.setValue("current_occupants", (current - 1).toString());
    }
  };

  async function onSubmit(data: z.infer<typeof editExitingRoomFormSchema>) {
    await mutation.mutateAsync(data);
  }

  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
          >
            <div className="grid space-y-5 space-x-2">
              <InputField
                form={form}
                fieldName="rent_per_month"
                label="Monthly Rent ($)"
                defaultValue={selectedRoom.rent_per_month}
              />
              <SelectField
                form={form}
                fieldName="gender_preference"
                label="Gender"
                defaultValue={selectedRoom.gender_preference}
                selectionList={gendersList}
                placeholder={
                  gendersList
                    .filter(
                      (option) => option.id == selectedRoom.gender_preference
                    )
                    .at(0)?.name
                }
                selectClassName="w-full rounded-lg min-h-10 [&>*]:text-black"
              />
              <InputField
                form={form}
                fieldName="max_occupants"
                label="Max Students"
                defaultValue={selectedRoom.max_occupants}
              />
              <div>
                <label
                  htmlFor="current_occupants"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Occupants
                </label>
                <div className="flex items-center justify-between space-x-4">
                  <Button
                    type="button"
                    className="flex-shrink-0 w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors hover:bg-gray-300"
                    onClick={handleDecrement}
                  >
                    <MinusIcon className="w-6 h-6" />
                  </Button>
                  <Input
                    id="current_occupants"
                    {...form.register("current_occupants")}
                    className="text-center"
                    defaultValue={selectedRoom.current_occupants}
                  />
                  <Button
                    type="button"
                    className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors hover:bg-blue-700"
                    onClick={handleIncrement}
                  >
                    <PlusIcon className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button
                onClick={() => setOperation("list")}
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
  );
}

export default EditExistingRoom;
