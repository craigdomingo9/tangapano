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
import RoomFormMask from "./RoomFormMask";

type NewRoomData = z.infer<typeof addNewRoomFormSchema>;

type Props = {
  dismissDialogOnAction?: boolean;
};

const gendersList = [
  { id: "mixed", name: "Mixed", icon: Shuffle },
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
        <RoomFormMask
          form={form}
          editMode={false}
          onSubmitFn={onSubmit}
          mutationIsPending={mutation.isPending}
        />
      </div>
    </div>
  );
}

export default AddNewRoom;
