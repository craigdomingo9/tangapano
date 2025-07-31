import { UseFormReturn } from 'react-hook-form'
import SelectField from '@/components/universal/Form/Elements/SelectField'

type Props = {
  form: UseFormReturn<any, any, any>,
  fieldName?: string,
  excludeAny?: boolean
}


function GenderSelector({form, fieldName = "gender", excludeAny = false}: Props) {
  const genders = [
    "any",
    "male",
    "female",
  ]
  if (excludeAny) {
    genders.shift();
  }

  return (
    <SelectField 
      form={form}
      defaultValue={genders[0]}
      fieldName={fieldName}
      label="Gender"
      selectionList={genders}
      description=""
      labelClassName='text-white'
      selectClassName="w-34 min-h-12 rounded-sm bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  )
}

export default GenderSelector