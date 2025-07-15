import { UseFormReturn } from "react-hook-form"
import SelectField from "./SelectField"


type Props = {
    form: UseFormReturn<any, any, any>,
    campuses: Campus[]
}

function CampusSelector({form, campuses}: Props) {

  const campusSelectionList = campuses?.map((campus: Campus) => ({
    id: campus.id,
    name: campus.name
  }))


  return (
    <SelectField 
      form={form}
      fieldName="campus"
      label="Select your campus"
      labelClassName="text-white"
      placeholder={campusSelectionList ? campusSelectionList[0].name : "Select neighborhood"}
      selectionList={campusSelectionList}
      defaultValue={campusSelectionList ? campusSelectionList[0].id : undefined}
    />
  )
}

export default CampusSelector