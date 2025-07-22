import { UseFormReturn } from "react-hook-form"
import SelectField from "./SelectField"


type Props = {
  form: UseFormReturn<any, any, any>,
  campuses: Campus[],
  labelClassName?: string,
  selectClassName?: string,
  defaultValue?: string,
  placeholder?: string
}

function CampusSelector({form, campuses, selectClassName, placeholder = "", defaultValue = undefined, labelClassName = "text-white"}: Props) {

  const campusSelectionList = campuses?.map((campus: Campus) => ({
    id: campus.id,
    name: campus.name
  }))


  return (
    <SelectField 
      form={form}
      fieldName="campus"
      label="Select campus"
      labelClassName={labelClassName}
      selectionList={campusSelectionList}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={campuses?.length === 0}
      selectClassName={selectClassName}
    />
  )
}

export default CampusSelector