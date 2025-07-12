import { UseFormReturn } from "react-hook-form"
import { Label } from "../ui/label"


type Props = {
  amenities: Amenity[],
  form: UseFormReturn<any, any, any>
}

function AmenitiesSelector({amenities, form}: Props) {
  return (
    <div className="space-y-2 my-5 grid grid-cols-2 place-items-center">
      {amenities?.map((amenity) => (
        <div key={amenity.id} className="flex items-center justify-between gap-2 text-white w-36 py-2">
          <Label htmlFor={`amenity-${amenity.name}`} className="text-sm">
            {amenity.name}
          </Label>
          <div className="relative inline-block">
            <input
              type="checkbox"
              value={amenity.name.toLowerCase().split(" ").join("_")}
              id={`amenity-${amenity.name}`}
              {...form.register("amenities")}
              className="ml-2 outline-none peer h-6 w-10 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            />
            <span className="pointer-events-none absolute left-3 peer-checked:left-7 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:bg-sky-500" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AmenitiesSelector