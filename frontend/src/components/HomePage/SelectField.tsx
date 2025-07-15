import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any, any, any>,
  fieldName: string,
  label: string,
  placeholder?: string,
  labelClassName?: string,
  defaultValue?: string,
  selectionList: {
    id: string,
    name: string
  }[],
  selectClassName?: string,
  disabled?: boolean
}

function SelectField({
  form,
  fieldName,
  label,
  placeholder,
  labelClassName,
  selectionList = [],
  defaultValue,
  selectClassName,
  disabled = false
}: Props) {

  
  useEffect(() => {
    if (form && defaultValue !== undefined && form.getValues(fieldName) === undefined) {
      form.setValue(fieldName, defaultValue);
    }
  }, [fieldName, form, defaultValue]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn("font-semibold", labelClassName)}>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger className={cn( selectClassName, "w-80 min-h-12 rounded-sm bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500")}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {selectionList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default SelectField
