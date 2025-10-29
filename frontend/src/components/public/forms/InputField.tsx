import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

const InputField = ({
  title,
  form,
  fieldName,
  placeholder = "",
  type,
}: {
  title: string;
  form: UseFormReturn<any, any, any>;
  fieldName: string;
  placeholder?: string;
  type?: string;
}) => {
  const id = useId();

  return (
    <div className="w-full max-w-xs space-y-2 text-gray-700">
      <Label htmlFor={id}>{title}</Label>
      <Input
        id={id}
        type={type ?? "text"}
        {...form.register(fieldName)}
        placeholder={placeholder}
        className="peer text-sm"
      />
      {form.formState.errors?.[fieldName] && (
        <p className="text-destructive text-xs">
          {form.formState.errors?.[fieldName]?.message as any}
        </p>
      )}
    </div>
  );
};

export default InputField;
