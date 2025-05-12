import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudentForm from "../forms/StudentForm";

interface EditStudentModalProps {
  selectedRow: any;
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

export function EditStudentModal({
  selectedRow,
  onCancel,
}: EditStudentModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update details for {selectedRow?.fullName || "--"}.
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          student={{
            sn: selectedRow?.sn,
            fullName: selectedRow?.fullName || "",
            gender: selectedRow?.gender || undefined,
            class: selectedRow?.class || "",
            arm: selectedRow?.arm || "",
            status: selectedRow?.status || "Inactive",
          }}
          isEditMode={true}
          onSuccess={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
