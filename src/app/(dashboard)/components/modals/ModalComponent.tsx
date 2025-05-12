import { ConfirmationModal } from "./ConfirmationModal";
import { EditSchoolModal } from "./EditSchoolModal";
import { EditSubscriptionModal } from "./EditSubscriptionModal";
import { AssignPermissionModal } from "./AssignPermissionModal";
import { EditStudentModal } from "./EditStudentModal";

interface ModalComponentProps {
  modalType: string | null;
  selectedRow: any;
  actionLabel: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onEditSchool: (data: any) => Promise<void>;
  onEditSubscription: (data: any) => Promise<void>;
  onEditStudent: (data: any) => Promise<void>;
  onAssignPermission: (permissions: string[]) => Promise<void>;
}

export function ModalComponent({
  modalType,
  selectedRow,
  actionLabel,
  onClose,
  onConfirm,
  onEditSchool,
  onEditSubscription,
  onAssignPermission,
  onEditStudent
}: ModalComponentProps) {
  if (!modalType) return null;

  switch (modalType) {
    case "confirmation":
      return (
        <ConfirmationModal
          title={`Confirm ${actionLabel}`}
          itemName={
            selectedRow?.name ||
            selectedRow?.school ||
            selectedRow?.package ||
            "--"
          }
          endpoint={`/${selectedRow?.name ? "schools" : "subscriptions"}/${
            selectedRow?.sn
          }`}
          onConfirm={onConfirm}
          onCancel={onClose}
        />
      );
    case "editSchool":
      return (
        <EditSchoolModal
          selectedRow={selectedRow}
          onSave={onEditSchool}
          onCancel={onClose}
        />
      );
    case "editStudent":
      return (
        <EditStudentModal
          selectedRow={selectedRow}
          onSave={onEditStudent}
          onCancel={onClose}
        />
      );
    case "editSubscription":
      return (
        <EditSubscriptionModal
          selectedRow={selectedRow}
          onSave={onEditSubscription}
          onCancel={onClose}
        />
      );
    case "assignPermission":
      return (
        <AssignPermissionModal
          selectedRow={selectedRow}
          onSave={onAssignPermission}
          onCancel={onClose}
        />
      );
    default:
      return null;
  }
}
