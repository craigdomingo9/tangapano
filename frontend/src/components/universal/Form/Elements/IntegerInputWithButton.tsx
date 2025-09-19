import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

type Props = {
  form: UseFormReturn<any, any, any>;
  fieldName: string;
  label: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  buttonColor?: string;
};

function IntegerInputWithButton({
  form,
  fieldName,
  label,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  className = "",
  buttonColor = "bg-[var(--lapis-lazuli)]",
  ...inputProps
}: Props) {
  const formValue = useWatch({
    control: form.control,
    name: fieldName,
  });

  const handleValueChange = (mode: "increment" | "decrement") => {
    const currentValue =
      formValue !== undefined ? parseInt(formValue, 10) : defaultValue;
    let newValue;

    if (mode === "increment") {
      newValue = Math.min(currentValue + step, max);
    } else {
      newValue = Math.max(currentValue - step, min);
    }
    form.setValue(fieldName, newValue.toString());
  };

  useEffect(() => {
    if (!form) return;
    if (formValue !== undefined) return;
    if (defaultValue === undefined) return;

    form.setValue(fieldName, defaultValue.toString());
  }, [defaultValue, fieldName, form]);

  return (
    <div className={`w-full ${className}`} {...inputProps}>
      <Label htmlFor={fieldName}>{label}</Label>
      <div className="flex justify-between items-center space-2 mt-2">
        <Button
          className={cn(
            "h-12 text-white rounded-r-none cursor-pointer",
            buttonColor
          )}
          type="button"
          onClick={() => handleValueChange("decrement")}
          disabled={
            formValue !== undefined ? formValue <= min : defaultValue <= min
          }
        >
          <Minus />
        </Button>
        <div
          id={fieldName}
          className="h-12 flex-1 bg-white border border-gray-300 font-semibold text-gray-600 w-12 rounded-none flex justify-center items-center select-none"
        >
          {formValue !== undefined ? formValue : defaultValue}
        </div>
        <Button
          className={cn(
            "h-12 text-white rounded-l-none cursor-pointer",
            buttonColor
          )}
          type="button"
          onClick={() => handleValueChange("increment")}
          disabled={formValue >= max}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}

export default IntegerInputWithButton;
