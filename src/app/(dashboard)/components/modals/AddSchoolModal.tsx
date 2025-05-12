import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SchoolForm from "../forms/SchoolForm";

interface AddSchoolModalProps {
  onCancel: () => void;
}

export function AddSchoolModal({ onCancel }: AddSchoolModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add School</DialogTitle>
          <DialogDescription>
            Enter details to create a new school.
          </DialogDescription>
        </DialogHeader>
        <SchoolForm onSuccess={onCancel} />
      </DialogContent>
    </Dialog>
  );
}
