import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  HeaderTitle?: string;
  className?: string;
};

function MainContentArea({
  children,
  HeaderTitle,
  className,
  ...props
}: React.ComponentProps<"div"> & Props) {
  return (
    <>
      <div
        className={cn(
          "flex flex-col flex-1 gap-2 shadow-xl rounded-lg border-t border-slate-200",
          className
        )}
        {...props}
      >
        {HeaderTitle && (
          <div className="py-2 pl-1">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">
              {HeaderTitle}
            </h4>
          </div>
        )}
        {children}
      </div>
    </>
  );
}

export default MainContentArea;
