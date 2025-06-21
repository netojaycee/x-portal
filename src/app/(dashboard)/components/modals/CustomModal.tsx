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
import SubscriptionAssignmentForm from "../forms/SubscriptionAssignmentForm";
import SessionForm from "../../@admin/configuration/(components)/SessionForm";
import AssignArmsForm from "../../@admin/configuration/(components)/AssignArms";
import CreateClassForm from "../../@admin/configuration/(components)/CreateClassForm";
import CreateClassArmArmForm from "../../@admin/configuration/(components)/CreateClassArmForm";
import SubjectForm from "../../@admin/configuration/(components)/SubjectForm";
import AssignSubjectForm from "../../@admin/configuration/(components)/AssignSubject";
import CreateClassCategoryForm from "../../@admin/configuration/(components)/CreateClassCategoryForm";
import {EnrollmentForm} from "../../@admin/admissions/(components)/EnrollmentForm";
import RejectionForm from "../../@admin/admissions/(components)/RejectionForm";
// import { ModalType } from "@/lib/types";

interface CustomModalProps {
  type: ENUM_MODULES;
  isEditMode?: boolean;
  selectedRow?: any;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  status?: any;
  children?: React.ReactNode;
  title?: string;
  description?: string;
}

export function CustomModal({
  selectedRow,
  type,
  isEditMode = false,
  open,
  onOpenChange,
  status,
  title,
  description,
  children,
}: CustomModalProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[500px] p-2'>
        <DialogHeader className='sticky top-0 p-1 border-b'>
          <DialogTitle>
            {(() => {
              if (
                Object.values(ENUM_MODULES).includes(type) &&
                status === "delete"
              ) {
                return "Delete Confirmation";
              }
              if (type === ENUM_MODULES.ADMISSION && status === "approve") {
                return "Student Enrollment";
              }
              if (type === ENUM_MODULES.ADMISSION && status === "reject") {
                return "Rejection Reason";
              }
              if (
                (Object.values(ENUM_MODULES).includes(type) &&
                  status === "confirmation")
                
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
              if (type === ENUM_MODULES.CLASS && isEditMode) {
                return "Edit Class";
              }
              if (type === ENUM_MODULES.CLASS && !isEditMode) {
                return "Add Class";
              }
              if (type === ENUM_MODULES.CLASS_CATEGORY && isEditMode) {
                return "Edit Class Category";
              }
              if (type === ENUM_MODULES.CLASS_CATEGORY && !isEditMode) {
                return "Add Class Category";
              }
              if (type === ENUM_MODULES.SESSION && isEditMode) {
                return "Edit Session";
              }
              if (type === ENUM_MODULES.SESSION && !isEditMode && !status) {
                return "Add Session";
              }
              if (type === ENUM_MODULES.CLASS_ARM && isEditMode) {
                return "Edit Class Arm";
              }
              if (type === ENUM_MODULES.CLASS_ARM && !isEditMode && !status) {
                return "Add Class Arm";
              }
              if (type === ENUM_MODULES.SUBJECT && isEditMode) {
                return "Edit Subject";
              }

              if (type === ENUM_MODULES.SUBJECT && !isEditMode && !status) {
                return "Add Subject";
              }
              if (type === ENUM_MODULES.SUBJECT && status === "custom") {
                return `Assign ${
                  selectedRow?.name || "--"
                } to classes and arms`;
              }
              if (type === ENUM_MODULES.ADMISSION && !isEditMode && !status) {
                return "Add Student";
              }
              if (type === ENUM_MODULES.ADMISSION && isEditMode) {
                return "Edit Student";
              }
              if (type === ENUM_MODULES.CLASS && status === "custom") {
                return `Assign arms for ${selectedRow?.name || "--"} session`;
              }
              if (title) {
                return title;
              }
              return null;
            })()}
          </DialogTitle>
          <DialogDescription>
            {(() => {
              if (
                Object.values(ENUM_MODULES).includes(type) &&
                status === "delete"
              ) {
                return `Are you sure you want to delete ${
                  selectedRow?.name || selectedRow?.title || "--"
                }?`;
              }
              if (type === ENUM_MODULES.SESSION && status === "custom") {
                return "Select Arms for classes available for this session";
              }
              if (type === ENUM_MODULES.SUBJECT && status === "custom") {
                return "Assign subject to classes";
              }
              if (
                Object.values(ENUM_MODULES).includes(type) &&
                status === "confirmation"
              ) {
                return `Are you sure you want to ${
                  selectedRow?.isActive
                    ? `deactivate ${
                        selectedRow?.name || selectedRow?.title || "--"
                      }`
                    : `activate ${
                        selectedRow?.name || selectedRow?.title || "--"
                      }`
                }?`;
              }
              if (
                (Object.values(ENUM_MODULES).includes(type) &&
                  status === "approve") ||
                status === "reject"
              ) {
                return `Are you sure you want to ${
                  status === "reject"
                    ? `reject the admission of ${
                        selectedRow?.firstname + " " + selectedRow?.lastname ||
                        "--"
                      }`
                    : `accept the admission of ${
                        selectedRow?.firstname + " " + selectedRow?.lastname ||
                        "--"
                      }`
                }?`;
              }
              if (type === ENUM_MODULES.SCHOOL && isEditMode) {
                return `Update details for ${selectedRow?.name || "--"}.`;
              }
              if (type === ENUM_MODULES.SCHOOL && !isEditMode) {
                return "Enter details to create a new school.";
              }
              if (type === ENUM_MODULES.STUDENT && isEditMode) {
                return `Update details for ${selectedRow?.firstname + " " + selectedRow?.lastname || "--"}.`;
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
              if (type === ENUM_MODULES.SESSION && isEditMode) {
                return `Update details for ${
                  selectedRow?.title || selectedRow?.name || "--"
                }.`;
              }
              if (type === ENUM_MODULES.SESSION && !isEditMode) {
                return "Enter details to create a new session.";
              }
              if (type === ENUM_MODULES.CLASS && isEditMode) {
                return `Update details for ${
                  selectedRow?.title || selectedRow?.name || "--"
                }.`;
              }
              if (type === ENUM_MODULES.CLASS && !isEditMode) {
                return "Enter details to create a new class.";
              }

              if (type === ENUM_MODULES.CLASS_CATEGORY && isEditMode) {
                return `Update details for ${
                  selectedRow?.title || selectedRow?.name || "--"
                }.`;
              }
              if (type === ENUM_MODULES.CLASS_CATEGORY && !isEditMode) {
                return "Enter details to create a new class category.";
              }
              if (type === ENUM_MODULES.CLASS_ARM && isEditMode) {
                return `Update details for ${
                  selectedRow?.title || selectedRow?.name || "--"
                }.`;
              }
              if (type === ENUM_MODULES.CLASS_ARM && !isEditMode) {
                return "Enter details to create a new class arm.";
              }
              if (type === ENUM_MODULES.SUBJECT && isEditMode) {
                return `Update details for ${
                  selectedRow?.title || selectedRow?.name || "--"
                }.`;
              }
              if (type === ENUM_MODULES.SUBJECT && !isEditMode) {
                return "Enter details to create a new subject.";
              }
              if (type === ENUM_MODULES.ADMISSION && status === "approve") {
                return `Assign class and class arm for ${
                  selectedRow?.firstname + " " + selectedRow?.lastname || "--"
                }.`;
              }
              if (type === ENUM_MODULES.ADMISSION && status === "reject") {
                return `Please provide a reason for rejecting ${
                  selectedRow?.firstname + " " + selectedRow?.lastname || "--"
                }'s application.`;
              }
              if (type === ENUM_MODULES.ADMISSION && isEditMode) {
                return `Update details for ${
                  selectedRow?.firstname + " " + selectedRow?.lastname || "--"
                }.`;
              }
              if (type === ENUM_MODULES.ADMISSION && !isEditMode) {
                return "Enter details to create a new student.";
              }
              if(description) {
                return description;
              }
              return null;
            })()}
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] overflow-y-auto p-2'>
          {type === ENUM_MODULES.SCHOOL && !status && (
            <SchoolForm
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

          {/* Add your SessionForm here if you have one */}
          {type === ENUM_MODULES.SESSION && !status && (
            <SessionForm
              session={selectedRow}
              isEditMode={isEditMode}
              onSuccess={handleClose}
            />
          )}

          {type === ENUM_MODULES.CLASS && !status && (
            <CreateClassForm
              classData={selectedRow}
              isEditMode={isEditMode}
              onSuccess={handleClose}
            />
          )}

          {type === ENUM_MODULES.CLASS_CATEGORY && !status && (
            <CreateClassCategoryForm
              classCategoryData={selectedRow}
              isEditMode={isEditMode}
              onSuccess={handleClose}
            />
          )}

          {type === ENUM_MODULES.CLASS_ARM && !status && (
            <CreateClassArmArmForm
              classArmData={selectedRow}
              isEditMode={isEditMode}
              onSuccess={handleClose}
            />
          )}

          {type === ENUM_MODULES.SUBJECT && !status && (
            <SubjectForm
              subject={selectedRow}
              isEditMode={isEditMode}
              onSuccess={handleClose}
            />
          )}

          {/* Special handling for admission approval/rejection */}
          {type === ENUM_MODULES.ADMISSION && status === "approve" && (
            <EnrollmentForm
              admission={selectedRow}
              onSuccess={handleClose}
            />
          )}

          {type === ENUM_MODULES.ADMISSION && status === "reject" && (
            <RejectionForm
              admissionId={selectedRow?.id}
              onSuccess={handleClose}
            />
          )}

          {/* Use ConfirmationForm for other modules and actions */}
          {Object.values(ENUM_MODULES).includes(type) &&
            (status === "confirmation" ||
              status === "delete") && (
              <ConfirmationForm
                data={selectedRow}
                onSuccess={handleClose}
                status={status}
                type={type}
              />
            )}

          {type === ENUM_MODULES.SUBSCRIPTION && status === "custom" && (
            <SubscriptionAssignmentForm
              subscriptionId={selectedRow?.id}
              onSuccess={handleClose}
            />
          )}
          {type === ENUM_MODULES.SESSION && status === "custom" && (
            <AssignArmsForm session={selectedRow} onSuccess={handleClose} />
          )}
          {type === ENUM_MODULES.SUBJECT && status === "custom" && (
            <AssignSubjectForm
              subject={selectedRow}
              onSuccess={handleClose}
            />
          )}

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
