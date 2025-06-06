"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useCreateClassArmsMutation,
  useUpdateClassArmsMutation,
} from "@/redux/api";

// Define the form schema
const classArmSchema = z.object({
  name: z.string().min(1, "Class Arm name is required"),
  isActive: z.boolean().optional(),
});

type ClassArmFormData = z.infer<typeof classArmSchema>;

interface ClassArmFormProps {
  classArmData?: ClassArmFormData & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

const CreateClassArmArmForm: React.FC<ClassArmFormProps> = ({
  classArmData,
  isEditMode = false,
  onSuccess,
}) => {
  const [
    createClassArm,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateClassArmsMutation();
  const [
    updateClassArm,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateClassArmsMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<ClassArmFormData>({
    resolver: zodResolver(classArmSchema),
    defaultValues: {
      name: classArmData?.name || "",
      isActive: classArmData?.isActive || true, // Default to true for add mode
    },
  });

  // console.log("Class Data:", classArmData);

  const onSubmit = async (values: ClassArmFormData) => {
    try {
      const credentials = {
        ...values,
      };
      console.log(credentials);
      if (isEditMode && classArmData?.id) {
        await updateClassArm({ id: classArmData.id, ...credentials }).unwrap();
      } else {
        await createClassArm(credentials).unwrap();
      }
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Create"} class error:`, error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Class Arm updated successfully"
          : "Class Arm created successfully"
      );
      form.reset();
      onSuccess();
      // else router.back(); // Navigate back if no onSuccess callback
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form, onSuccess, isEditMode]);

  return (
    <div className='w-full max-w-md'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Class Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Arm Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter class name (Example: Gold)'
                    {...field}
                    className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status (only in edit mode) */}
          {isEditMode && (
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between'>
                  <FormLabel>Status</FormLabel>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span className='text-sm text-gray-500'>
                      {field.value ? "Activated" : "Deactivated"}
                    </span>
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Buttons */}
          <div className='flex justify-center gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onSuccess}
              className='border-gray-300 text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='bg-blue-500 text-white hover:bg-blue-600'
            >
              {isLoading ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin mr-2' />
                  {isEditMode ? "Updating Class Arm" : "Creating Class Arm"}
                </>
              ) : isEditMode ? (
                "Update Class Arm"
              ) : (
                "Create Class Arm"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateClassArmArmForm;
