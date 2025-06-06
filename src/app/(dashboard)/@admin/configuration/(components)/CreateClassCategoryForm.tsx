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
import { useCreateClassMutation, useUpdateClassMutation } from "@/redux/api";


// Define the form schema
const classCategorySchema = z.object({
  name: z.string().min(1, "Class name is required"),
  isActive: z.boolean().optional(),
});

type ClassCategoryFormData = z.infer<typeof classCategorySchema>;

interface ClassCategoryFormProps {
  classCategoryData?: ClassCategoryFormData & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

const CreateClassCategoryForm: React.FC<ClassCategoryFormProps> = ({
  classCategoryData,
  isEditMode = false,
  onSuccess,
}) => {
  const [
    createClass,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateClassMutation();
  const [
    updateClass,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateClassMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<ClassCategoryFormData>({
    resolver: zodResolver(classCategorySchema),
    defaultValues: {
      name: classCategoryData?.name || "",
      isActive: classCategoryData?.isActive || true, // Default to true for add mode
    },
  });

  // console.log("Class Data:", classCategoryData);

  const onSubmit = async (values: ClassCategoryFormData) => {
    try {
      const credentials = {
        ...values
      };
      console.log(credentials);
      if (isEditMode && classCategoryData?.id) {
        await updateClass({ id: classCategoryData.id, ...credentials }).unwrap();
      } else {
        await createClass(credentials).unwrap();
      }
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Create"} class category error:`, error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode ? "Class category updated successfully" : "Class category created successfully"
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
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter class name (Example: JSS1)'
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
                  {isEditMode ? "Updating Class Category" : "Creating Class Category"}
                </>
              ) : isEditMode ? (
                "Update Class Category"
              ) : (
                "Create Class Category"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateClassCategoryForm;
