import { UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import SelectField from "./SelectField";
import { find, filter, map, get, isEmpty, isEqual } from "lodash-es";

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
  const resolvedPlaceholder = source === "searchPage" ? "All" : placeholder;

  useEffect(() => {
    if (!selectedCampusId) return;

    const campus = find(campuses, (c) =>
      isEqual(String(c.id), String(selectedCampusId))
    );

    let filteredNeighborhoods = get(campus, "neighborhoods", []);

    if (filterHasListings) {
      filteredNeighborhoods = filter(filteredNeighborhoods, "has_listings");
    }

    setNeighborhoods(filteredNeighborhoods);

    // Only set default if no neighborhood is currently selected
    const currentNeighborhood = form.getValues("neighborhood");
    if (isEmpty(currentNeighborhood) && !isEmpty(filteredNeighborhoods)) {
      const defaultNeighborhoodId = get(
        filteredNeighborhoods,
        "[0].id.toString()",
        defaultValue
      );
      form.setValue("neighborhood", defaultNeighborhoodId);
    }
  }, [selectedCampusId, campuses, form, defaultValue, filterHasListings]);

  const neighborhoodsList = useMemo(() => {
    const baseList = map(neighborhoods, (n) => ({
      id: get(n, "id", ""),
      name: get(n, "name", ""),
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
