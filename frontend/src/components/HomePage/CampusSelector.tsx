import { UseFormReturn } from "react-hook-form"
import SelectField from "../universal/Form/Elements/SelectField"


type Props = {
    form: UseFormReturn<any, any, any>,
    campuses: string[]
}

function CampusSelector({form, campuses}: Props) {
  return (
    <SelectField 
      form={form}
      defaultValue={campuses[0]}
      fieldName="campus"
      label="Select your campus"
      labelClassName="text-white"
      selectionList={campuses}
      placeholder="Select your campus" 
      selectClassName="w-80 min-h-12 rounded-sm bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  )
}

export default CampusSelector