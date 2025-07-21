import { UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import SelectField from "./SelectField"; // Assuming this path is correct for your SelectField component


type Props = {
  form: UseFormReturn<any, any, any>;
  campuses: Campus[];
  labelClassName?: string,
  selectClassName?: string
};

function NeighborhoodSelector({ form, campuses, selectClassName, labelClassName = "text-white" }: Props) {
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
        form.setValue("neighborhood", campus.neighborhoods[0].id);
      } else {
        // If no neighborhoods for the selected campus, clear the neighborhood field.
        form.setValue("neighborhood", "");
      }
    } else {
      // If no campus is selected or found, clear the neighborhoods list and the form field.
      setNeighborhoods([]);
      form.setValue("neighborhood", "");
    }
  }, [selectedCampusId, campuses, form]); // 'form' is included as a dependency because form.setValue is used.

  return (
    <SelectField
      form={form}
      fieldName="neighborhood"
      label="Select neighborhood"
      labelClassName={labelClassName}
      // Map the neighborhoods to the {id: string, name: string} format expected by SelectField.
      // Ensure it's always an array, even if 'neighborhoods' is empty.
      selectionList={neighborhoods.map((n: Neighborhood) => ({ id: n.id, name: n.name }))}
      placeholder="Select a neighborhood" // Added a placeholder for better UX
      disabled={neighborhoods.length === 0} // Disable the selector if no neighborhoods are available
      selectClassName={selectClassName}
    />
  );
}

export default NeighborhoodSelector;
