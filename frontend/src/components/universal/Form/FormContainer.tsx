import { cn } from "@/lib/utils";

export default function FormContainer(
  { 
    children, 
    HeaderTitle,
    className
  }: { 
    children: React.ReactNode,
    HeaderTitle?: string,
    className?: string
  }
) {
  return (
    <div className={cn("shadow rounded-lg p-2 sm:w-[400px] sm:m-auto", className)}>
      <div className="text-center text-xs font-semibold mb-4">
        {HeaderTitle && (
          <p>{HeaderTitle}</p>
        )}
      </div>
        {children}
    </div>
  );
}