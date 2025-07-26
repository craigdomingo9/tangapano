import { Button } from '../ui/button'

type Props = {
  children: React.ReactNode
}

function HeaderButton({
  children,
  ...props
}: React.ComponentProps<"button"> & Props) {
  return (
    <Button {...props}  className="rounded-xs shadow-md h-10 flex items-center gap-2 transition-all duration-200 transform hover:scale-105"> 
      {children}
    </Button>
  )
}

export default HeaderButton