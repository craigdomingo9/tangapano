import { UseFormReturn, useWatch } from "react-hook-form"
import SelectField from "../universal/Form/Elements/SelectField"
import { useEffect, useState } from "react";


type Props = {
  form: UseFormReturn<any, any, any>,
  campuses: Campus[]
}

function NeighborhoodSelector({form, campuses}: Props) {
    const selectedCampus = useWatch({ control: form.control, name: "campus" });
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

    useEffect(() => {
      const campus = campuses.find((c) => c.name === selectedCampus);
        if (campus) {
          setNeighborhoods(campus.neighborhoods);
          // Reset neighborhood to default if it's no longer valid
          form.setValue("neighborhood", campus.neighborhoods[0]?.name || "");
        } else {
          setNeighborhoods([]);
          form.setValue("neighborhood", "");
        }
      // console.log("Selected Campus:", selectedCampus );
    }, [selectedCampus, campuses]);

  return (
    <SelectField
      form={form}
      defaultValue={neighborhoods[0]?.name || ""}
      fieldName="neighborhood"
      label="Select neighborhood"
      labelClassName="text-white"
      selectionList={neighborhoods.map((n: Neighborhood) => n.name) || []}
      placeholder="Select neighborhood"
      selectClassName="w-80 min-h-12 rounded-sm border bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  )
}

export default NeighborhoodSelector