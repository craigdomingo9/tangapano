import { UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import SelectField from "./SelectField"; // Assuming this path is correct for your SelectField component

type Props = {
  form: UseFormReturn<any, any, any>;
  campuses: Campus[];
  labelClassName?: string;
  selectClassName?: string;
  defaultValue?: string;
  placeholder?: string;
  source?: string;
};

function NeighborhoodSelector({
  form,
  campuses,
  selectClassName,
  source,
  placeholder = "",
  defaultValue = " ",
  labelClassName = "text-white",
}: Props) {
  const selectedCampusId = useWatch({
    control: form.control,
    name: "campus",
  });

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  // Placeholder can be a derived value based on props, no need for useState
  const resolvedPlaceholder = source === "searchPage" ? "All" : placeholder;

  useEffect(() => {
    const campus = campuses?.find(
      (c) => String(c.id) === String(selectedCampusId)
    );
    //Filter neighborhoods based on has_listings
    const filtered = campus?.neighborhoods?.filter((n) => n.has_listings) ?? [];

    setNeighborhoods(filtered);

    // Use a single line to set the value. Use logical OR (||) for clarity.
    form.setValue(
      "neighborhood",
      filtered.length > 0 ? defaultValue || filtered[0].id.toString() : ""
    );

    // Cleanup function can be added if needed to reset state
    // return () => { ... }
  }, [selectedCampusId, campuses, form, defaultValue]);

  const neighborhoodsList = useMemo(() => {
    const baseList = neighborhoods.map((n) => ({
      id: n.id,
      name: n.name,
    }));

    // The 'All' option is now correctly added based on the 'source' prop.
    if (source === "searchPage") {
      return [{ id: " ", name: "All" }, ...baseList];
    }

    return baseList;
  }, [neighborhoods, source]);
  return (
    <SelectField
      form={form}
      fieldName="neighborhood"
      label="Select neighborhood"
      labelClassName={labelClassName}
      selectionList={neighborhoodsList}
      defaultValue={defaultValue}
      placeholder={resolvedPlaceholder}
      // disabled={neighborhoods.length === 0}
      selectClassName={`${selectClassName} [&>*]:text-black`}
    />
  );
}

export default NeighborhoodSelector;
