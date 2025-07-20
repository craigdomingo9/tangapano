
type Props = {
  children: React.ReactNode,
  HeaderTitle?: string,
}

function MainContentArea({
  children,
  HeaderTitle
}: Props) {
  return (
    <>
      <div className="flex flex-col flex-1 gap-2 shadow-xl rounded-lg border-t border-slate-200">
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
  )
}

export default MainContentArea