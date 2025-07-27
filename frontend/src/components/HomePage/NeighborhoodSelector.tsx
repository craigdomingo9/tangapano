import { UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import SelectField from "./SelectField"; // Assuming this path is correct for your SelectField component


type Props = {
  form: UseFormReturn<any, any, any>;
  campuses: Campus[];
  labelClassName?: string,
  selectClassName?: string,
  defaultValue?: string,
  placeholder?: string,
  source?: string,
};

function NeighborhoodSelector({ form, campuses, selectClassName, source, placeholder = "", defaultValue = " ", labelClassName = "text-white" }: Props) {
  const selectedCampusId = useWatch({ control: form.control, name: "campus" });
  
  // State to hold the neighborhoods relevant to the currently selected campus
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  useEffect(() => {
    // Find the selected campus object from the 'campuses' array
    // We use String(selectedCampusId) to ensure type consistency for comparison
    const campus = campuses?.find((c) => c.id.toString() === String(selectedCampusId));


    if (campus) {
      // If a campus is found, update the neighborhoods state with its neighborhoods.
      // Ensure 'campus.neighborhoods' is treated as an array, even if it's null/undefined or empty.
      setNeighborhoods(campus.neighborhoods || []);
      
      // Set the default neighborhood for the form based on the selected campus.
      // If the campus has neighborhoods, default to the first one. Otherwise, clear the field.
      if (campus.neighborhoods && campus.neighborhoods.length > 0) {
        form.setValue("neighborhood", defaultValue || campus.neighborhoods[0].id.toString());
      } else {
        // If no neighborhoods for the selected campus, clear the neighborhood field.
        form.setValue("neighborhood", "");
      }
    } else {
      // If no campus is selected or found, clear the neighborhoods list and the form field.
      setNeighborhoods([]);
      form.setValue("neighborhood", "");
    }
  }, [selectedCampusId, campuses, form, defaultValue]);

  const allNeighborhoods = neighborhoods.map((n: Neighborhood) => ({ id: n.id, name: n.name }));
  let neighborhoodsList = [...allNeighborhoods];
  if (source === "searchPage") neighborhoodsList = [{id: " ", name: "All"}, ...neighborhoodsList];

  return (
    <SelectField
      form={form}
      fieldName="neighborhood"
      label="Select neighborhood"
      labelClassName={labelClassName}
      selectionList={neighborhoodsList}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={neighborhoods?.length === 0}
      selectClassName={selectClassName}
    />
  );
}

export default NeighborhoodSelector;
