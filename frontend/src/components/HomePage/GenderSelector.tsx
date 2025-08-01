import { UseFormReturn, useWatch } from "react-hook-form";
import SelectField from "./SelectField";
import { useEffect, useState } from "react";
import { Mars, Shuffle, Venus } from "lucide-react";
import { gendersList } from "@/lib/lists";

type Props = {
  form: UseFormReturn<any, any, any>;
  fieldName?: string;
  excludeAny?: boolean;
};


function GenderSelector({
  form,
  fieldName = "gender",
  excludeAny = false,
}: Props) {
  const studentsPerRoom = useWatch({
    control: form.control,
    name: "max_occupants",
  });

  const defaultList = gendersList;
  const [selectionList, setSelectionList] = useState(defaultList);

  useEffect(() => {
    if (studentsPerRoom == 1) {
      setSelectionList(selectionList.filter(option => option.id !== 'any'));
    } else {
      setSelectionList(defaultList);
    }
  }, [studentsPerRoom])
  


  return (
    <SelectField
      form={form}
      defaultValue={defaultList.at(0)?.id}
      fieldName={fieldName}
      label="Gender"
      selectionList={selectionList}
      selectClassName="w-34"
    />
  );
}

export default GenderSelector;
