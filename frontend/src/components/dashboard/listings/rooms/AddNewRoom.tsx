import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/universal/Form/Elements/InputField";
import { addNewRoomFormSchema } from "@/lib/services/forms/dashboard/listings/addNewRoomForm";
import { z } from "zod";
import { MoonLoader } from "react-spinners";
import SelectField from "@/components/HomePage/SelectField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRoomsDialogOperation,
  useRoomsDialogState,
  useSelectedListing,
} from "@/lib/hooks/store";
import { Mars, Shuffle, Venus } from "lucide-react";

type NewRoomData = z.infer<typeof addNewRoomFormSchema>;

type Props = {
  dismissDialogOnAction?: boolean;
};

const gendersList = [
  { id: "any", name: "Any" },
  { id: "male", name: "Male", icon: Mars },
  { id: "female", name: "Female", icon: Venus },
];

function AddNewRoom({ dismissDialogOnAction }: Props) {
  const form = useForm({ resolver: zodResolver(addNewRoomFormSchema) });
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setDialog } = useRoomsDialogState();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: NewRoomData) => {
      return axios.post(
        `/server/api/landlord-listings/${selectedListing?.id}/rooms`,
        data
      );
    },
    retry: 3,
    onSuccess: () => {
      toast.success("Room was created successfully.");
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      queryClient.invalidateQueries({
        queryKey: ["rooms", selectedListing?.id],
      });

      if (dismissDialogOnAction) {
        setDialog(false);
        return;
      }

      setOperation("list");
      form.reset();
    },
    onError: (err) => {
      console.error("Failed to add room:", err);
    },
  });

  async function onSubmit(data: NewRoomData) {
    await mutation.mutateAsync(data);
  }

  if (!selectedListing?.id) {
    console.error("No listing selected");
    return;
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
                defaultValue=""
              />
              <InputField
                form={form}
                fieldName="max_occupants"
                label="Max Students"
                defaultValue={1}
              />

              <SelectField
                form={form}
                fieldName="gender_preference"
                label="Gender"
                defaultValue={gendersList.at(0)?.id}
                selectionList={gendersList}
                placeholder={gendersList.at(0)?.name}
                selectClassName="w-full rounded-lg min-h-10"
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

export default AddNewRoom;
