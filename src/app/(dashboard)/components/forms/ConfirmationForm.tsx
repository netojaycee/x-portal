"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowRight, ToggleLeft, ToggleRight } from "lucide-react";
import {
  useDeleteClassArmsMutation,
  useDeleteClassMutation,
  useDeleteClassCategoryMutation,
  useDeleteSchoolMutation,
  useDeleteSessionMutation,
  useToggleSchoolActiveMutation,
  useDeleteSubjectMutation,
  useDeleteMarkingSchemeMutation,
  useDeleteGradingSystemMutation,
  useApproveResultMutation,
  useDeleteInvoiceMutation,
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
  status: "delete" | "confirmation"; // Updated status options
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
  // mutation for approve result
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
    deleteInvoice,
    {
      isLoading: isLoadingDeleteInvoice,
      isSuccess: isSuccessDeleteInvoice,
      isError: isErrorDeleteInvoice,
      error: errorDeleteInvoice,
    },
  ] = useDeleteInvoiceMutation();

  const [
    approveResult,
    {
      isLoading: isLoadingApproveResult,
      isSuccess: isSuccessApproveResult,
      isError: isErrorApproveResult,
      error: errorApproveResult,
    },
  ] = useApproveResultMutation();

  const [
    deleteMarkingScheme,
    {
      isLoading: isLoadingDeleteMarkingScheme,
      isSuccess: isSuccessDeleteMarkingScheme,
      isError: isErrorDeleteMarkingScheme,
      error: errorDeleteMarkingScheme,
    },
  ] = useDeleteMarkingSchemeMutation();

  const [
    deleteGradingSystem,
    {
      isLoading: isLoadingDeleteGradingSystem,
      isSuccess: isSuccessDeleteGradingSystem,
      isError: isErrorDeleteGradingSystem,
      error: errorDeleteGradingSystem,
    },
  ] = useDeleteGradingSystemMutation();

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
    deleteClassCategory,
    {
      isLoading: isLoadingDeleteClassCategory,
      isSuccess: isSuccessDeleteClassCategory,
      isError: isErrorDeleteClassCategory,
      error: errorDeleteClassCategory,
    },
  ] = useDeleteClassCategoryMutation();

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
  ] = useDeleteSubjectMutation();

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
    [ENUM_MODULES.CLASS_CATEGORY]: {
      mutation: deleteClassCategory,
      isLoading: isLoadingDeleteClassCategory,
      isSuccess: isSuccessDeleteClassCategory,
      isError: isErrorDeleteClassCategory,
      error: errorDeleteClassCategory,
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
    [ENUM_MODULES.MARKING_SCHEME]: {
      mutation: deleteMarkingScheme,
      isLoading: isLoadingDeleteMarkingScheme,
      isSuccess: isSuccessDeleteMarkingScheme,
      isError: isErrorDeleteMarkingScheme,
      error: errorDeleteMarkingScheme,
    },
    [ENUM_MODULES.GRADING_SYSTEM]: {
      mutation: deleteGradingSystem,
      isLoading: isLoadingDeleteGradingSystem,
      isSuccess: isSuccessDeleteGradingSystem,
      isError: isErrorDeleteGradingSystem,
      error: errorDeleteGradingSystem,
    },
    [ENUM_MODULES.INVOICE]: {
      mutation: deleteInvoice,
      isLoading: isLoadingDeleteInvoice,
      isSuccess: isSuccessDeleteInvoice,
      isError: isErrorDeleteInvoice,
      error: errorDeleteInvoice,
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
    [ENUM_MODULES.RESULT]: {
      mutation: approveResult,
      isLoading: isLoadingApproveResult,
      isSuccess: isSuccessApproveResult,
      isError: isErrorApproveResult,
      error: errorApproveResult,
    },
  };

  // Determine which mutation to use based on status and type
  let mutationConfig: MutationConfig | null = null;
  if (status === "delete") {
    mutationConfig = deleteMutations[type] || null;
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
          status === "delete" ? `Delete ${type}` : `Confirm ${type} toggle`
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
          : status === "confirmation"
          ? "Toggle Confirmed Successfully"
          : "Operation Successful"
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
          status === "confirmation"
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
            <span>{status === "delete" ? "Delete" : "Confirm"}</span>
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
