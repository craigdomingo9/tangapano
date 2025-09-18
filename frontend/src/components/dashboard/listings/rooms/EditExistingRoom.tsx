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
import IntegerInputWithButton from "@/components/universal/Form/Elements/IntegerInputWithButton";
import RadioGroupSelector from "@/components/universal/Form/Elements/RadioGroupSelector";
import { Separator } from "@/components/ui/separator";

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

  const maxOccupants = useWatch({
    control: form.control,
    name: "max_occupants",
  });

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
              <IntegerInputWithButton
                form={form}
                fieldName="rent_per_month"
                label="Monthly Rent ($)"
                defaultValue={Number(selectedRoom.rent_per_month)}
                min={0}
                max={250}
                step={5}
              />

              <RadioGroupSelector
                form={form}
                fieldName="gender_preference"
                groupItems={gendersList}
                label="Gender"
                defaultValue={selectedRoom.gender_preference}
              />

              <IntegerInputWithButton
                form={form}
                fieldName="max_occupants"
                label="Max Students"
                defaultValue={Number(selectedRoom.max_occupants)}
                className="[&>button]:bg-amber-300"
                min={1}
                max={5}
                step={1}
              />
              <Separator className="my-4" />
              <IntegerInputWithButton
                form={form}
                fieldName="current_occupants"
                label="Current Occupants"
                defaultValue={Number(selectedRoom.current_occupants)}
                className="[&>button]:bg-amber-300"
                min={0}
                max={parseInt(maxOccupants) || 5}
                step={1}
              />
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
