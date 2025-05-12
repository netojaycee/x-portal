import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubscriptionForm from "../forms/SubscriptionForm";

interface EditSubscriptionModalProps {
  selectedRow: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function EditSubscriptionModal({
  selectedRow,
  onCancel,
}: EditSubscriptionModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update details for {selectedRow?.package || "--"}.
          </DialogDescription>
        </DialogHeader>
        <SubscriptionForm
          subscription={{
            sn: selectedRow?.sn,
            package: selectedRow?.package || "",
            duration: parseInt(selectedRow?.duration) || 0,
            studentLimit: selectedRow?.studentLimit || "50",
            status: selectedRow?.subStatus || "Inactive",
          }}
          isEditMode={true}
          onSuccess={onCancel} // Close modal on success
        />
      </DialogContent>
    </Dialog>
  );
}
