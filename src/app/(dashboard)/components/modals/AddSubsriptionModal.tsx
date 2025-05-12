import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubscriptionForm from "../forms/SubscriptionForm";

interface AddSubscriptionModalProps {
  onCancel: () => void;
}

export function AddSubscriptionModal({ onCancel }: AddSubscriptionModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
          <DialogDescription>
            Enter details to create a new subscription plan.
          </DialogDescription>
        </DialogHeader>
        <SubscriptionForm onSuccess={onCancel} />
      </DialogContent>
    </Dialog>
  );
}
