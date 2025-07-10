import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils";



type Props = {
  open: boolean,
  setOpen: (val: boolean) => void,
  Content: JSX.Element,
  className?: string
}

function DrawerContainer({
  open,
  setOpen,
  Content,
  className
}: Props) {

  return (
    <Drawer open={open} onOpenChange={() => setOpen(!open)}>
      <DrawerContent>
        <div className={cn("mx-auto w-full max-w-lg", className)}>
          {Content}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerContainer