import { UseFormReturn, useWatch } from "react-hook-form";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

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
    let nextValue =
      mode === "increment"
        ? Number(roomCapacity) + 1
        : Number(roomCapacity) - 1;

    if (nextValue > 5) {
      nextValue = 5;
      toast.error("Students per room cannot be greater than 5");
    } else if (nextValue < 1) {
      nextValue = 1;
      toast.error("Students per room cannot be less than 1");
    }

    form.setValue(fieldName, nextValue.toString());
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
