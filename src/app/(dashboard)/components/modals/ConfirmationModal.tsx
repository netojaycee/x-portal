import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  title: string;
  itemName: string;
  endpoint: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ConfirmationModal({
  title,
  itemName,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to{" "}
            {title.toLowerCase().replace("confirm ", "")} for {itemName}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
