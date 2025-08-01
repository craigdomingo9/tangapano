import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function DialogContainer({
  children,
  state,
  onChange,
  title,
  description,
}: {
  children: React.ReactNode;
  state: boolean;
  onChange: () => void;
  title: string;
  description?: string;
}) {
  return (
    <Dialog open={state} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-xs text-center">
          {description}
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default DialogContainer;
