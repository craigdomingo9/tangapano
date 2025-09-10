import { UseFormReturn, useWatch } from "react-hook-form";
import SelectField from "./SelectField";
import { useEffect, useState } from "react";
import { Mars, Shuffle, Venus } from "lucide-react";
import { gendersList } from "@/lib/lists";

type Props = {
  form: UseFormReturn<any, any, any>;
  fieldName?: string;
};

function GenderSelector({ form, fieldName = "gender" }: Props) {
  const defaultList = gendersList;

  return (
    <SelectField
      form={form}
      placeholder={defaultList.at(0)?.name}
      defaultValue={defaultList.at(0)?.id}
      fieldName={fieldName}
      label="Room Gender"
      selectionList={defaultList}
      selectClassName="w-34 [&>*]:text-black [&>*]:font-semibold [&>*]:text-gray-700"
    />
  );
}

export default GenderSelector;
