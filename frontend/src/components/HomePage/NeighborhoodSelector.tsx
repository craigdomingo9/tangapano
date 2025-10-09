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
  filterHasListings?: boolean;
};

function NeighborhoodSelector({
  form,
  campuses,
  selectClassName,
  source,
  placeholder = "",
  defaultValue = " ",
  labelClassName = "text-white",
  filterHasListings,
}: Props) {
  const selectedCampusId = useWatch({
    control: form.control,
    name: "campus",
  });

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  // Placeholder can be a derived value based on props, no need for useState
  const resolvedPlaceholder = source === "searchPage" ? "All" : placeholder;

  useEffect(() => {
    if (!selectedCampusId) return;

    const campus = campuses?.find(
      (c) => String(c.id) === String(selectedCampusId)
    );
    const neighborhoods =
      campus?.neighborhoods?.filter((n) =>
        filterHasListings ? n.has_listings : n
      ) ?? [];
    setNeighborhoods(neighborhoods);

    // Only set default if no neighborhood is currently selected
    const currentNeighborhood = form.getValues("neighborhood");
    if (!currentNeighborhood && neighborhoods.length > 0) {
      form.setValue(
        "neighborhood",
        defaultValue || neighborhoods[0].id.toString()
      );
    }
  }, [selectedCampusId, campuses, form, defaultValue, filterHasListings]);

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
      label="Neighborhood"
      labelClassName={labelClassName}
      selectionList={neighborhoodsList}
      defaultValue={defaultValue}
      placeholder={resolvedPlaceholder}
      selectClassName={`${selectClassName} [&>*]:text-black [&>*]:font-semibold [&>*]:text-gray-700`}
    />
  );
}

export default NeighborhoodSelector;
