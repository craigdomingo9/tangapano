import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import IntegerInputWithButton from "@/components/universal/Form/Elements/IntegerInputWithButton";
import RadioGroupSelector from "@/components/universal/Form/Elements/RadioGroupSelector";
import { useRoomsDialogOperation, useSelectedRoom } from "@/lib/hooks/store";
import { gendersList } from "@/lib/lists";
import { SubmitHandler, UseFormReturn, useWatch } from "react-hook-form";
import { MoonLoader } from "react-spinners";

type Props = {
  form: UseFormReturn<any, any, any>;
  onSubmitFn: SubmitHandler<any>;
  editMode?: boolean;
  mutationIsPending?: boolean;
};

function RoomFormMask({
  form,
  onSubmitFn,
  editMode,
  mutationIsPending,
}: Props) {
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { entities: selectedRoom } = useSelectedRoom();
  const maxOccupants = useWatch({
    control: form.control,
    name: "max_occupants",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitFn, (errors) =>
          console.log(errors)
        )}
      >
        <div className="grid space-y-5 space-x-2">
          <IntegerInputWithButton
            form={form}
            fieldName="rent_per_month"
            label="Monthly Rent ($)"
            defaultValue={editMode ? Number(selectedRoom.rent_per_month) : 50}
            min={50}
            max={250}
            step={5}
            buttonColor="bg-emerald-500"
          />

          <RadioGroupSelector
            form={form}
            name="gender_preference"
            items={gendersList}
            label="Gender"
            defaultValue={
              editMode
                ? selectedRoom.gender_preference
                : gendersList.at(0)?.id || "mixed"
            }
          />

          <IntegerInputWithButton
            form={form}
            fieldName="max_occupants"
            label="Students Allowed In Room"
            defaultValue={editMode ? Number(selectedRoom.max_occupants) : 2}
            className="[&>button]:bg-amber-300"
            min={1}
            max={5}
            step={1}
          />
          <Separator className="my-4" />
          <IntegerInputWithButton
            form={form}
            fieldName="current_occupants"
            label="Students Currently In Room"
            defaultValue={editMode ? Number(selectedRoom.current_occupants) : 0}
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
            {mutationIsPending ? (
              <MoonLoader color="white" size={15} />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RoomFormMask;
