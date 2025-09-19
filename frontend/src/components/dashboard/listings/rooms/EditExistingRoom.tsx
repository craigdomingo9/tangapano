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
import RoomFormMask from "./RoomFormMask";

type Props = {
  dismissDialogOnAction?: boolean;
};

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

  async function onSubmit(data: z.infer<typeof editExitingRoomFormSchema>) {
    // console.log(data);
    await mutation.mutateAsync(data);
  }

  return (
    <div>
      <div>
        <RoomFormMask
          form={form}
          onSubmitFn={onSubmit}
          editMode
          mutationIsPending={mutation.isPending}
        />
      </div>
    </div>
  );
}

export default EditExistingRoom;
