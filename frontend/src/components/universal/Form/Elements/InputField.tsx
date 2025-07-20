import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export type InputFieldProps = {
  form: UseFormReturn<any, any, any>,
  defaultValue: any,
  fieldName: string,
  label: string,
  placeholder?: string,
  description?: string,
  type?: string,
  id?: string,
  disabled?: boolean,
  autoComplete?: string,
  reRenderState?: any,
  callbackfn?: (value: any) => void,
  inputClassName?: string,
  labelClassName?: string,
}

function InputField({ 
  form, 
  defaultValue, 
  fieldName, 
  label, 
  placeholder, 
  description, 
  type, 
  id, 
  disabled, 
  autoComplete,
  reRenderState,
  callbackfn,
  inputClassName,
  labelClassName,
  ...inputProps
  } : InputFieldProps)
  {

  const [fieldValue, setFieldValue] = useState<string>("");

  useEffect(() => {
    if (!form) return;
    if (!defaultValue) return setFieldValue("");

    setFieldValue(defaultValue.toString())
    form.setValue(fieldName, defaultValue.toString())
  }, [defaultValue, reRenderState])

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => (
        <FormItem>
          <FormLabel className={cn("text-opacity font-semibold", labelClassName)}>{label}</FormLabel>
          <FormControl>
            <Input 
              {...inputProps}
              type={type ? type : "text"}
              className={cn("text-sm", inputClassName)}
              placeholder={placeholder}
              value={fieldValue}
              name={fieldName}
              onChange={(e) => {
                const value = e.target.value;
                form.setValue(fieldName, value);
                setFieldValue(value);

                if (!callbackfn) return;
                callbackfn(value);
              }}
              autoComplete={autoComplete}
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

export default InputField;