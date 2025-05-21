"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import {
  useCreateSubroleMutation,
  useUpdateSubroleMutation,
} from "@/redux/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Define the form schema
const subroleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(15, "Role must be less than 15 characters"),
  description: z.string().optional(),
});

type subroleFormData = z.infer<typeof subroleSchema>;

interface SubroleFormProps {
  subrole?: subroleFormData & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function SubroleForm({
  subrole,
  isEditMode = false,
  onSuccess,
}: SubroleFormProps) {
  const userData = useSelector((state: RootState) => state.user.user);

  const [
    createSubrole,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateSubroleMutation();

  const [
    updateSubrole,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateSubroleMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<subroleFormData>({
    resolver: zodResolver(subroleSchema),
    defaultValues: {
      name: subrole?.name || "",
      description: subrole?.description || "",
    },
  });

  const onSubmit = async (values: subroleFormData) => {
    try {
      const credentials = {
        ...values,
        schoolId: userData?.schoolId,
      };
      if (isEditMode && subrole?.id) {
        await updateSubrole({ id: subrole.id, input: credentials }).unwrap();
      } else {
        await createSubrole(credentials).unwrap();
      }
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Add"} role error:`, error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode ? "Role updated successfully" : "Role created successfully"
      );
      form.reset();
      if (onSuccess) onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { error?: string })?.error
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form, onSuccess, isEditMode]);

  return (
    <div className='w-full max-w-md '>
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Package Name Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Driver'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>{" "}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-700'>
                  Description
                  {/* <p className="text-xs italic">(optional)</p> */}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., School driver'
                    {...field}
                    className='border-gray-300 focus:border-primary focus:ring-primary'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90'
          >
            {isLoading ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Please wait</span>
              </>
            ) : (
              <>
                <span>{isEditMode ? "UPDATE" : "CREATE"}</span>
                <ArrowRight className='h-5 w-5' />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
