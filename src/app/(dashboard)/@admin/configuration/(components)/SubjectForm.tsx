"use client";

import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from "@/redux/api";

// Define the form schema
const subjectSchema = z.object({
  name: z
    .string()
    .min(1, "Subject name is required")
    .max(50, "Subject name must be less than 50 characters"),
  code: z
    .string()
    .min(1, "Subject code is required")
    .max(10, "Subject code must be less than 10 characters"),
  classCategory: z.string().min(1, "Class category is required"),
  status: z.enum(["Active", "Inactive"], {
    required_error: "Status is required",
  }),
});

interface Subject {
  name: string;
  code: string;
  classCategory: string;
  status: "Active" | "Inactive";
}

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  subject?: Subject & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  subject,
  isEditMode = false,
  onSuccess,
}) => {
  const [
    createSubject,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateSubjectMutation();

  const [
    updateSubject,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateSubjectMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: subject?.name || "",
      code: subject?.code || "",
      classCategory: subject?.classCategory || "",
      status: subject?.status || undefined,
    },
  });

  const onSubmit = async (values: SubjectFormData) => {
    try {
      const credentials = {
        ...values,
        name: values.name.trim(),
        code: values.code.trim().toUpperCase(),
      };
      if (isEditMode && subject?.id) {
        await updateSubject({
          id: subject.id,
          ...credentials,
        }).unwrap();
      } else {
        await createSubject(credentials).unwrap();
      }
    } catch (error) {
      console.error(
        `${isEditMode ? "Update" : "Create"} subject error:`,
        error
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Subject updated successfully"
          : "Subject created successfully"
      );
      form.reset();
      if (onSuccess) onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form, onSuccess, isEditMode]);

  return (
    <div className='w-full max-w-md p-6'>
      <div className='mb-6'>
        <h2 className='text-lg font-semibold'>
          {isEditMode ? "Edit Subject" : "Create Subject"}
        </h2>
        <p className='text-sm text-gray-500'>
          {isEditMode
            ? "Update the subject details below"
            : "Enter the details to create a new subject"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Subject Name and Code */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    Subject Name <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Mathematics'
                      {...field}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    Subject Code <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., MATH101'
                      {...field}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Class Category and Status */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='classCategory'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    Class Category <span className='text-red-500'>*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
                        <SelectValue placeholder='Select class category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Junior Secondary'>
                        Junior Secondary
                      </SelectItem>
                      <SelectItem value='Senior Secondary'>
                        Senior Secondary
                      </SelectItem>
                      <SelectItem value='Primary'>Primary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    Status <span className='text-red-500'>*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Active'>Active</SelectItem>
                      <SelectItem value='Inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600'
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
};

export default SubjectForm;
