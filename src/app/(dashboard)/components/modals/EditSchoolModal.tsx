import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SchoolForm from "../forms/SchoolForm";
import { School } from "@/lib/types/school";

interface EditSchoolModalProps {
  selectedRow: School;
  onSave: (data: School) => Promise<void>;
  onCancel: () => void;
}

export function EditSchoolModal({
  selectedRow,
  onCancel,
}: EditSchoolModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
          <DialogDescription>
            Update details for {selectedRow?.name || "--"}.
          </DialogDescription>
        </DialogHeader>
        <SchoolForm
          school={{
            id: selectedRow?.id,
            name: selectedRow?.name || "",
            email: selectedRow?.email || "",
            contact: selectedRow?.contact || "",
            isActive: selectedRow?.isActive || true,
          }}
          isEditMode={true}
          onSuccess={onCancel} // Close modal on success
        />
      </DialogContent>
    </Dialog>
  );
}
