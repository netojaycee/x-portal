"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SchoolForm from "../forms/SchoolForm";
import { ENUM_MODULES } from "@/lib/types/enums";
import SubscriptionForm from "../forms/SubscriptionForm";
import StudentForm from "../forms/StudentForm";
import ConfirmationForm from "../forms/ConfirmationForm";
import SubroleForm from "../forms/SubroleForm";
import UserForm from "../forms/UserForm";

interface CustomModalProps {
  type: ENUM_MODULES;
  isEditMode?: boolean;
  selectedRow?: any;
  open: boolean | undefined;
  onOpenChange: (value: boolean) => void;
  status?: "confirmation" | "delete";
}

export function CustomModal({
  selectedRow,
  type,
  isEditMode = false,
  open,
  onOpenChange,
  status,
}: CustomModalProps) {
  const handleClose = () => onOpenChange(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>
            {(() => {
              if (
                (type === ENUM_MODULES.SCHOOL ||
                  type === ENUM_MODULES.STUDENT ||
                  type === ENUM_MODULES.SUBSCRIPTION ||
                  type === ENUM_MODULES.USER ||
                  type === ENUM_MODULES.SUBROLE) &&
                status === "delete"
              ) {
                return "Delete Confirmation";
              }
              if (
                (type === ENUM_MODULES.SCHOOL ||
                  type === ENUM_MODULES.STUDENT ||
                  type === ENUM_MODULES.SUBSCRIPTION ||
                  type === ENUM_MODULES.USER ||
                  type === ENUM_MODULES.SUBROLE) &&
                status === "confirmation"
              ) {
                return "Status Confirmation";
              }
              if (type === ENUM_MODULES.SCHOOL && isEditMode) {
                return "Edit School";
              }
              if (type === ENUM_MODULES.SCHOOL && !isEditMode) {
                return "Add School";
              }
              if (type === ENUM_MODULES.STUDENT && isEditMode) {
                return "Edit Student";
              }
              if (type === ENUM_MODULES.STUDENT && !isEditMode) {
                return "Add Student";
              }
              if (type === ENUM_MODULES.SUBSCRIPTION && isEditMode) {
                return "Edit Subscription";
              }
              if (type === ENUM_MODULES.SUBSCRIPTION && !isEditMode) {
                return "Add Subscription";
              }
              if (type === ENUM_MODULES.SUBROLE && isEditMode) {
                return "Edit Role";
              }
              if (type === ENUM_MODULES.SUBROLE && !isEditMode) {
                return "Add Role";
              }
              if (type === ENUM_MODULES.USER && isEditMode) {
                return "Edit User";
              }
              if (type === ENUM_MODULES.USER && !isEditMode) {
                return "Add User";
              }
              return null;
            })()}
          </DialogTitle>
          <DialogDescription>
            {(() => {
              if (
                (type === ENUM_MODULES.SCHOOL ||
                  type === ENUM_MODULES.STUDENT ||
                  type === ENUM_MODULES.SUBSCRIPTION ||
                  type === ENUM_MODULES.USER ||
                  type === ENUM_MODULES.SUBROLE) &&
                status === "delete"
              ) {
                return `Are you sure you want to delete ${
                  selectedRow?.name || "--"
                }?`;
              }
              if (
                (type === ENUM_MODULES.SCHOOL ||
                  type === ENUM_MODULES.STUDENT ||
                  type === ENUM_MODULES.SUBSCRIPTION ||
                  type === ENUM_MODULES.USER ||
                  type === ENUM_MODULES.SUBROLE) &&
                status === "confirmation"
              ) {
                return `Are you sure you want to ${
                  selectedRow?.isActive
                    ? `deactivate ${selectedRow?.name || "--"}`
                    : `activate ${selectedRow?.name || "--"}`
                }?`;
              }
              if (type === ENUM_MODULES.SCHOOL && isEditMode) {
                return `Update details for ${selectedRow?.name || "--"}.`;
              }
              if (type === ENUM_MODULES.SCHOOL && !isEditMode) {
                return "Enter details to create a new school.";
              }
              if (type === ENUM_MODULES.STUDENT && isEditMode) {
                return `Update details for ${selectedRow?.fullname || "--"}.`;
              }
              if (type === ENUM_MODULES.STUDENT && !isEditMode) {
                return "Enter details to create a new student.";
              }
              if (type === ENUM_MODULES.SUBSCRIPTION && isEditMode) {
                return `Update details for ${selectedRow?.package || "--"}.`;
              }
              if (type === ENUM_MODULES.SUBSCRIPTION && !isEditMode) {
                return "Enter details to create a new subscription plan.";
              }
              if (type === ENUM_MODULES.SUBROLE && isEditMode) {
                return `Update details for ${selectedRow?.package || "--"}.`;
              }
              if (type === ENUM_MODULES.SUBROLE && !isEditMode) {
                return "Enter details to create a new subscription plan.";
              }
              if (type === ENUM_MODULES.USER && isEditMode) {
                return `Update details for ${selectedRow?.fullname || "--"}.`;
              }
              if (type === ENUM_MODULES.USER && !isEditMode) {
                return "Enter details to create a new user.";
              }
              return null;
            })()}
          </DialogDescription>
        </DialogHeader>
        {type === ENUM_MODULES.SCHOOL && !status && (
          <SchoolForm
            // school={
            //   selectedRow && typeof selectedRow.id === "string"
            //     ? (selectedRow as School & { id: string })
            //     : undefined
            // }
            school={selectedRow}
            isEditMode={isEditMode}
            onSuccess={handleClose}
          />
        )}

        {type === ENUM_MODULES.SUBSCRIPTION && !status && (
          <SubscriptionForm
            subscription={selectedRow}
            isEditMode={isEditMode}
            onSuccess={handleClose}
          />
        )}

        {type === ENUM_MODULES.STUDENT && !status && (
          <StudentForm
            student={selectedRow}
            isEditMode={isEditMode}
            onSuccess={handleClose}
          />
        )}

        {type === ENUM_MODULES.SUBROLE && !status && (
          <SubroleForm
            subrole={selectedRow}
            isEditMode={isEditMode}
            onSuccess={handleClose}
          />
        )}
        {type === ENUM_MODULES.USER && !status && (
          <UserForm
            user={selectedRow}
            isEditMode={isEditMode}
            onSuccess={handleClose}
          />
        )}

        {(type === ENUM_MODULES.SCHOOL ||
          type === ENUM_MODULES.STUDENT ||
          type === ENUM_MODULES.SUBSCRIPTION ||
          type === ENUM_MODULES.USER ||
          type === ENUM_MODULES.SUBROLE) &&
          (status === "confirmation" || status === "delete") && (
            <ConfirmationForm
              data={selectedRow}
              onSuccess={handleClose}
              status={status}
            />
          )}
      </DialogContent>
    </Dialog>
  );
}
