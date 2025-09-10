import { UseFormReturn, useWatch } from "react-hook-form";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

function StudentsPerRoomField({
  form,
  fieldName,
  ...props
}: React.ComponentProps<"div"> & {
  form: UseFormReturn<any, any, any>;
  fieldName: string;
}) {
  const roomCapacity = useWatch({
    control: form.control,
    name: fieldName,
  });

  const setRoomCapacity = (mode: "increment" | "decrement") => {
    const value =
      mode === "increment"
        ? // increment logic: not greater than 5
          roomCapacity === "5"
          ? "5"
          : Number(roomCapacity) + 1
        : // decrement logic: no negative values
        roomCapacity === "1"
        ? "1"
        : Number(roomCapacity) - 1;
    form.setValue(fieldName, value.toString());
  };

  return (
    <div {...props} className="shadow-lg">
      <Label>Students per Room</Label>
      <div className="flex justify-center items-center [&>*]:mt-2 space--2">
        <Button
          className="h-12 rounded-r-none cursor-pointer active:opacity-85"
          type="button"
          onClick={() => setRoomCapacity("decrement")}
        >
          <Minus />
        </Button>
        <div className="h-12 bg-white font-semibold text-gray-600 w-12 rounded-none flex justify-center items-center select-none">
          {roomCapacity}
        </div>
        <Button
          className="h-12 rounded-l-none cursor-pointer active:opacity-85"
          type="button"
          onClick={() => setRoomCapacity("increment")}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}

export default StudentsPerRoomField;
