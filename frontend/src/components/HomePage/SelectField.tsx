import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any, any, any>;
  fieldName: string;
  label: string;
  placeholder?: string;
  labelClassName?: string;
  defaultValue?: string;
  selectionList: {
    id: string;
    name: string;
    icon?: LucideIcon;
  }[];
  selectClassName?: string;
  disabled?: boolean;
};

function SelectField({
  form,
  fieldName,
  label,
  placeholder,
  labelClassName,
  selectionList = [],
  defaultValue,
  selectClassName,
  disabled = false,
}: Props) {
  useEffect(() => {
    if (form) {
      form.setValue(fieldName, defaultValue);
    }
  }, [fieldName, form, defaultValue]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn("font-semibold", labelClassName)}>
            {label}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "w-80 min-h-12 rounded-sm bg-white text-black border ",
                  selectClassName
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectionList.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name} {item.icon && <item.icon />}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectField;
