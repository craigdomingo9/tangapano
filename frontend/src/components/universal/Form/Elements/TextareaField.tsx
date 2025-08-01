import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any, any, undefined>;
  defaultValue: any;
  fieldName: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

function TextareaField({
  form,
  defaultValue,
  fieldName,
  label,
  placeholder,
  description,
  disabled,
}: Props) {
  const [fieldValue, setFieldValue] = useState<string>("");

  useEffect(() => {
    if (!form) return;
    if (!defaultValue) return setFieldValue("");

    setFieldValue(defaultValue.toString());
    form.setValue(fieldName, defaultValue.toString());
  }, [defaultValue]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => (
        <FormItem>
          <FormLabel className="text-opacity font-semibold">{label}</FormLabel>
          <FormControl>
            <Textarea
              className="text-sm"
              placeholder={placeholder}
              value={fieldValue}
              onChange={(e) => {
                form.setValue(fieldName, e.target.value);
                setFieldValue(e.target.value);
              }}
              disabled={disabled}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs">{description}</FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

export default TextareaField;
