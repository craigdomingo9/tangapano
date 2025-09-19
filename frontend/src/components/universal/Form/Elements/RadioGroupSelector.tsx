import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect } from "react";
import { useController, UseFormReturn } from "react-hook-form";

type RadioItem = {
  id: string;
  name: string;
  icon?: React.ComponentType;
};

type Props = {
  name: string; // Field name
  items: RadioItem[];
  form: UseFormReturn<any, any, undefined>;
  label: string;
  className?: string;
  defaultValue?: string; // Optional default value
};

function RadioGroupSelector({
  name,
  items,
  form,
  label,
  className,
  defaultValue,
}: Props) {
  const {
    field: { value, onChange },
  } = useController({
    control: form.control,
    name,
  });

  useEffect(() => {
    if (value === undefined && items.length > 0) {
      form.setValue(name, defaultValue || items[0].id);
      // console.log("Default value set to: ", defaultValue || items[0].id);
    }
  }, [defaultValue, items, value]);

  return (
    <div className={className}>
      <Label className="font-semibold mb-3 block">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <RadioGroupItem value={item.id} id={item.id} />
            <Label
              htmlFor={item.id}
              className="cursor-pointer flex items-center gap-2"
            >
              {item.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export default RadioGroupSelector;
