import { cn } from "@/lib/utils"



function CheckBox({
  state, 
  onChange,
  fieldName,
  label,
  className
}: {
  state: boolean,
  onChange: () => void,
  fieldName: string,
  label: string,
  className?: string,
}) {
  return (
    <label htmlFor={fieldName} className={cn("peer flex justify-between items-center py-1 text-opacity font-semibold text-sm", className)}>
      {label}
      <div className="relative inline-block">
        <input 
          id={fieldName}
          type="checkbox" 
          onChange={onChange}
          checked={state}
          className="ml-2 outline-none peer h-6 w-10 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          />
        <span className="pointer-events-none absolute left-3 peer-checked:left-7 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:bg-green-500" />
      </div>
    </label>
  )
}

export default CheckBox