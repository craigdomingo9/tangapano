import { UseFormReturn } from 'react-hook-form'
import SelectField from '@/components/universal/Form/Elements/SelectField'

type Props = {
  form: UseFormReturn<any, any, any>,
}

const genders = [
    "any",
    "male",
    "female",
]

function GenderSelector({form}: Props) {
  return (
    <SelectField 
      form={form}
      defaultValue={genders[0]}
      fieldName="gender"
      label="Gender"
      selectionList={genders}
      description=""
      placeholder="Male" 
      labelClassName='text-white'
      selectClassName="w-34 min-h-12 rounded-sm bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  )
}

export default GenderSelector