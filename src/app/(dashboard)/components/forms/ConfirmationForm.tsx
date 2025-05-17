"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import {
  useDeleteSchoolMutation,
  useToggleSchoolActiveMutation,
} from "@/redux/api"; // Adjust path to your RTK Query API slice

export default function ConfirmationForm({
  data,
  onSuccess,
  status,
}: {
  data: any;
  onSuccess: () => void;
  status: "confirmation" | "delete";
}) {
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
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteSchoolMutation();

  const isLoading = status === "delete" ? isLoadingDelete : isLoadingToggle;
  const isSuccess = status === "delete" ? isSuccessDelete : isSuccessToggle;
  const isError = status === "delete" ? isErrorDelete : isErrorToggle;
  const error = status === "delete" ? errorDelete : errorToggle;

  const onSubmit = async () => {
    try {
      if (status === "delete") {
        await deleteSchool(data.id).unwrap();
      } else if (status === "confirmation") {
        await toggleActive(data.id).unwrap();
      } else {
        console.log("nothing");
      }
    } catch (error) {
      console.error(
        `${
          status === "delete"
            ? "Delete school"
            : status === "confirmation"
            ? "status toggle"
            : null
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
          ? "Toggle successful"
          : null
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
        No
      </Button>
      <Button
        type='submit'
        disabled={isLoading}
        onClick={() => onSubmit()}
        className='w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90'
      >
        {isLoading ? (
          <>
            <Loader2 className='h-5 w-5 animate-spin' />
            <span>Please wait</span>
          </>
        ) : (
          <>
            <span>Yes</span>
            <ArrowRight className='h-5 w-5' />
          </>
        )}
      </Button>
    </div>
  );
}
