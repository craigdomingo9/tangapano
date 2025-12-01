export const renderReadOnlyField = (
  label: string,
  value: string,
  icon?: React.ReactNode
) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
      {label}:
    </p>
    <div className="flex text-sm items-center gap-2 font-semibold text-slate-900 dark:text-slate-200">
      {icon && (
        <div className="text-lapis dark:text-sky-400 opacity-80">{icon}</div>
      )}
      {value}
    </div>
  </div>
);
