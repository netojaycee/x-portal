import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudentForm from "../forms/StudentForm";

interface AddStudentModalProps {
  onCancel: () => void;
}

export function AddStudentModal({ onCancel }: AddStudentModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Enter details to create a new student.
          </DialogDescription>
        </DialogHeader>
        <StudentForm onSuccess={onCancel} />
      </DialogContent>
    </Dialog>
  );
}
