"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowRight, ToggleLeft, ToggleRight } from "lucide-react";
import {
  useDeleteClassArmsMutation,
  useDeleteClassMutation,
  useDeleteSchoolMutation,
  useDeleteSessionMutation,
  useToggleSchoolActiveMutation,
  useManageAdmissionMutation,
} from "@/redux/api";
import { ENUM_MODULES } from "@/lib/types/enums";

// Define the mutation config type
interface MutationConfig {
  mutation: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: any;
}

interface ConfirmationFormProps {
  data: any;
  type: ENUM_MODULES;
  onSuccess: () => void;
  status: "approve" | "reject" | "delete" | "confirmation"; // Updated status options
}

export default function ConfirmationForm({
  data,
  type,
  onSuccess,
  status,
}: ConfirmationFormProps) {
  const [
    toggleActive,
    {
      isLoading: isLoadingToggle,
      isSuccess: isSuccessToggle,
      isError: isErrorToggle,
      error: errorToggle,
    },
  ] = useToggleSchoolActiveMutation();

  const [
    deleteSchool,
    {
      isLoading: isLoadingDeleteSchool,
      isSuccess: isSuccessDeleteSchool,
      isError: isErrorDeleteSchool,
      error: errorDeleteSchool,
    },
  ] = useDeleteSchoolMutation();

  const [
    deleteSession,
    {
      isLoading: isLoadingDeleteSession,
      isSuccess: isSuccessDeleteSession,
      isError: isErrorDeleteSession,
      error: errorDeleteSession,
    },
  ] = useDeleteSessionMutation();

  const [
    deleteClass,
    {
      isLoading: isLoadingDeleteClass,
      isSuccess: isSuccessDeleteClass,
      isError: isErrorDeleteClass,
      error: errorDeleteClass,
    },
  ] = useDeleteClassMutation();

  const [
    deleteClassArm,
    {
      isLoading: isLoadingDeleteClassArm,
      isSuccess: isSuccessDeleteClassArm,
      isError: isErrorDeleteClassArm,
      error: errorDeleteClassArm,
    },
  ] = useDeleteClassArmsMutation();

  const [
    deleteSubject,
    {
      isLoading: isLoadingDeleteSubject,
      isSuccess: isSuccessDeleteSubject,
      isError: isErrorDeleteSubject,
      error: errorDeleteSubject,
    },
  ] = useDeleteClassArmsMutation();

  const [
    approveOrRejectAdmission,
    {
      isLoading: isLoadingAdmission,
      isSuccess: isSuccessAdmission,
      isError: isErrorAdmission,
      error: errorAdmission,
    },
  ] = useManageAdmissionMutation();

  // Map entity types to their delete mutations
  const deleteMutations: Partial<Record<ENUM_MODULES, MutationConfig>> = {
    [ENUM_MODULES.SCHOOL]: {
      mutation: deleteSchool,
      isLoading: isLoadingDeleteSchool,
      isSuccess: isSuccessDeleteSchool,
      isError: isErrorDeleteSchool,
      error: errorDeleteSchool,
    },
    [ENUM_MODULES.SESSION]: {
      mutation: deleteSession,
      isLoading: isLoadingDeleteSession,
      isSuccess: isSuccessDeleteSession,
      isError: isErrorDeleteSession,
      error: errorDeleteSession,
    },
    [ENUM_MODULES.CLASS]: {
      mutation: deleteClass,
      isLoading: isLoadingDeleteClass,
      isSuccess: isSuccessDeleteClass,
      isError: isErrorDeleteClass,
      error: errorDeleteClass,
    },
    [ENUM_MODULES.CLASS_ARM]: {
      mutation: deleteClassArm,
      isLoading: isLoadingDeleteClassArm,
      isSuccess: isSuccessDeleteClassArm,
      isError: isErrorDeleteClassArm,
      error: errorDeleteClassArm,
    },
    [ENUM_MODULES.SUBJECT]: {
      mutation: deleteSubject,
      isLoading: isLoadingDeleteSubject,
      isSuccess: isSuccessDeleteSubject,
      isError: isErrorDeleteSubject,
      error: errorDeleteSubject,
    },
  };

  // Map entity types to their toggle mutations
  const toggleMutations: Partial<Record<ENUM_MODULES, MutationConfig>> = {
    [ENUM_MODULES.SCHOOL]: {
      mutation: toggleActive,
      isLoading: isLoadingToggle,
      isSuccess: isSuccessToggle,
      isError: isErrorToggle,
      error: errorToggle,
    },
  };

  // Map entity types to their approve/reject mutations
  const admissionMutations: Partial<Record<ENUM_MODULES, MutationConfig>> = {
    [ENUM_MODULES.ADMISSION]: {
      mutation: approveOrRejectAdmission,
      isLoading: isLoadingAdmission,
      isSuccess: isSuccessAdmission,
      isError: isErrorAdmission,
      error: errorAdmission,
    },
  };

  // Determine which mutation to use based on status and type
  let mutationConfig: MutationConfig | null = null;
  if (status === "delete") {
    mutationConfig = deleteMutations[type] || null;
  } else if (status === "approve" || status === "reject") {
    mutationConfig = admissionMutations[type] || null;
  } else if (status === "confirmation") {
    mutationConfig = toggleMutations[type] || null;
  }

  const isLoading = mutationConfig?.isLoading || false;
  const isSuccess = mutationConfig?.isSuccess || false;
  const isError = mutationConfig?.isError || false;
  const error = mutationConfig?.error || null;

  const onSubmit = async () => {
    try {
      if (status === "delete") {
        if (deleteMutations[type]) {
          await deleteMutations[type].mutation(data.id).unwrap();
        } else {
          throw new Error(`Delete operation not supported for type: ${type}`);
        }
      } else if (status === "approve" || status === "reject") {
        if (admissionMutations[type]) {
          const admissionStatus =
            status === "approve" ? "approved" : "rejected";
          await admissionMutations[type]
            .mutation({
              id: data.id,
              status: admissionStatus,
            })
            .unwrap();
        } else {
          throw new Error(
            `Admission operation not supported for type: ${type}`
          );
        }
      } else if (status === "confirmation") {
        if (toggleMutations[type]) {
          await toggleMutations[type].mutation(data.id).unwrap();
        } else {
          throw new Error(
            `Confirmation operation not supported for type: ${type}`
          );
        }
      }
    } catch (error) {
      console.error(
        `${
          status === "delete"
            ? `Delete ${type}`
            : status === "approve"
            ? `Approve ${type}`
            : status === "reject"
            ? `Reject ${type}`
            : `Confirm ${type} toggle`
        } error:`,
        error
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        status === "delete"
          ? "Delete Successful"
          : status === "approve"
          ? "Admission Approved Successfully"
          : status === "reject"
          ? "Admission Rejected Successfully"
          : "Toggle Confirmed Successfully"
      );
      if (onSuccess) onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { error?: string })?.error
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, onSuccess, status]);

  return (
    <div className='flex w-1/3 justify-end gap-3 pr-2 py-4 ml-auto'>
      <Button className='w-full' variant='outline' onClick={onSuccess}>
        Cancel
      </Button>
      <Button
        type='submit'
        disabled={isLoading}
        onClick={() => onSubmit()}
        className={`w-full flex items-center justify-center gap-2 text-white ${
          status === "approve"
            ? "bg-green-600 hover:bg-green-700"
            : status === "reject"
            ? "bg-red-600 hover:bg-red-700"
            : status === "confirmation"
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-primary hover:bg-primary/90"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className='h-5 w-5 animate-spin' />
            <span>Please wait</span>
          </>
        ) : (
          <>
            <span>
              {status === "delete"
                ? "Delete"
                : status === "approve"
                ? "Approve"
                : status === "reject"
                ? "Reject"
                : "Confirm"}
            </span>
            {status === "confirmation" ? (
              data.isActive ? (
                <ToggleLeft className='h-5 w-5' />
              ) : (
                <ToggleRight className='h-5 w-5' />
              )
            ) : (
              <ArrowRight className='h-5 w-5' />
            )}
          </>
        )}
      </Button>
    </div>
  );
}
