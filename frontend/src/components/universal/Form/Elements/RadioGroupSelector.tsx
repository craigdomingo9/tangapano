import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect } from "react";

type Props = {
  form: any;
  fieldName: string;
  groupItems: { id: string; name: string; icon: React.ComponentType }[];
  label: string;
  defaultValue?: string;
  className?: string;
};

function RadioGroupSelector({
  form,
  fieldName,
  groupItems,
  label,
  defaultValue,
  className,
}: Props) {
  useEffect(() => {
    if (!defaultValue) return;
    if (!form) return;

    form.setValue(fieldName, defaultValue);
  }, [fieldName, form, defaultValue]);

  const handleValueChange = (value: string) => {
    form.setValue(fieldName, value);
  };

  return (
    <div>
      <Label className="font-semibold mb-2">{label}</Label>
      <RadioGroup defaultValue={defaultValue}>
        {groupItems?.map((item) => (
          <div className="flex items-center gap-3" key={item.id}>
            <RadioGroupItem
              onChange={() => handleValueChange(item.id)}
              value={item.id}
              id={item.id}
            />
            <Label htmlFor={item.id}>{item.name}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export default RadioGroupSelector;
