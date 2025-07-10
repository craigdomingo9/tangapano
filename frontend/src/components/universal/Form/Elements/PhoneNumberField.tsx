import { country_codes } from "@/lib/lists";
import InputField, { InputFieldProps } from "./InputField"
import SelectField from "./SelectField";


interface PhoneNumberFieldProps extends InputFieldProps {
  countryCode?: string;
}

function PhoneNumberField({ 
  countryCode = "263", 
  ...props 
}: PhoneNumberFieldProps) {
  return (
    <div className="relative mt-2 max-w-xs">
      <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
        <SelectField 
          {...props}
          selectClassName="border-none outline-none px-0 focus:ring-0 shadow-none"
          selectionList={country_codes.map(item => item.code)}
          fieldName="country_code"
          placeholder={countryCode}
          label=""
          defaultValue={countryCode}
        />
      </div>
      <InputField 
        {...props}
        type="tel"
        placeholder="719 867 907"
        inputClassName="pl-[5rem]"
      />
    </div>
  )
}

export default PhoneNumberField