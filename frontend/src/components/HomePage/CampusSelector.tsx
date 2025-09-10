import { UseFormReturn } from "react-hook-form";
import SelectField from "./SelectField";
import { useEffect, useMemo, useState } from "react";

type Props = {
  form: UseFormReturn<any, any, any>;
  campuses: Campus[];
  labelClassName?: string;
  selectClassName?: string;
  defaultValue?: string;
  placeholder?: string;
  onSearchPage?: boolean;
};

type ListItem = {
  id: string;
  name: string;
};

function CampusSelector({
  form,
  campuses,
  selectClassName,
  placeholder = "",
  defaultValue = undefined,
  labelClassName = "text-white",
  onSearchPage,
}: Props) {
  const campusSelectionList: ListItem[] = useMemo(
    () =>
      campuses?.map((campus) => ({
        id: campus.id,
        name: campus.name,
      })) ?? [],
    [campuses]
  );

  const [defaultCampus, setDefaultCampus] = useState<ListItem | undefined>();

  useEffect(() => {
    if (onSearchPage && campusSelectionList.length > 0) {
      setDefaultCampus(campusSelectionList[0]);
    }
  }, [campuses]);

  const selectedValue = defaultValue ?? defaultCampus?.id.toString();

  const resolvedPlaceholder = placeholder || defaultCampus?.name || "";

  return (
    <SelectField
      form={form}
      fieldName="campus"
      label="Campus"
      labelClassName={labelClassName}
      selectionList={campusSelectionList}
      defaultValue={selectedValue}
      placeholder={resolvedPlaceholder}
      disabled={campuses?.length === 0}
      selectClassName={`${selectClassName} [&>*]:text-black [&>*]:font-semibold [&>*]:text-gray-700`}
    />
  );
}

export default CampusSelector;
