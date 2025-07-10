import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CheckBox from "./CheckBox";


function CheckBoxField({ 
  form, 
  defaultChecked, 
  fieldName,
  label, 
  description, 
  className
  } : {
    form: UseFormReturn<any, any, any>,
    defaultChecked: boolean,
    fieldName: string,
    label: string,
    description?: string,
    disabled?: boolean,
    className?: string
  }) 
  {

  const [fieldChecked, setFieldChecked] = useState<boolean>(defaultChecked);


  const setChecked = (newChecked: boolean) => {
    setFieldChecked(newChecked);
    form.setValue(fieldName, newChecked);
  }

  const onChange = () => {
    setChecked(!fieldChecked);
  }

  useEffect(() => {
    setChecked(defaultChecked);
  }, [])

  return (
    <FormField
      control={form.control}
      name="on_sale"
      render={() => (
        <FormItem>
          <FormControl>
            <CheckBox
              label={label}
              fieldName={fieldName} 
              state={fieldChecked}
              onChange={onChange} 
              className={className}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs">{description}</FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
  />
  )
}

export default CheckBoxField