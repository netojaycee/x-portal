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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { useCreateSchoolMutation, useUpdateSchoolMutation } from "@/redux/api"; // Adjust path to your RTK Query API slice
import { School } from "@/lib/types/school";

// Define the form schema
const schoolSchema = z.object({
  name: z
    .string()
    .min(1, "School name is required")
    .max(100, "School name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  contact: z
    .string()
    .min(1, "Contact is required")
    .max(20, "Contact must be less than 20 characters"),
  address: z.string().optional(),

  // status: z.enum(["Active", "Inactive"], {
  //   required_error: "Status is required",
  // }),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  school?: School & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess?: () => void;
}

export default function SchoolForm({
  school,
  isEditMode = false,
  onSuccess,
}: SchoolFormProps) {
  const [
    addSchool,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateSchoolMutation();

  const [
    updateSchool,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateSchoolMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: school?.name || "",
      email: school?.email || "",
      contact: school?.contact || "",
      address: school?.address || "",
      // status: school?.status || undefined,
    },
  });

  const onSubmit = async (values: SchoolFormData) => {
    try {
      if (isEditMode && school?.id) {
        await updateSchool({ id: school.id, input: values }).unwrap();
      } else {
        await addSchool(values).unwrap();
      }
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Add"} school error:`, error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "School updated successfully"
          : "School created successfully"
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
    <div className='w-full max-w-md'>
      {/* Header */}
      {/* <div className='mb-6 text-center'>
        <h2 className='text-2xl md:text-3xl font-bold text-[#4A4A4A] font-lato'>
          {isEditMode ? "Edit School" : "Add School"}
        </h2>
        <p className='mt-1 text-sm text-gray-600'>
          {isEditMode
            ? "Update the school details below"
            : "Enter the details to create a new school"}
        </p>
      </div> */}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Name Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>School Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Springfield High'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='e.g., contact@school.com'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Contact Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='contact'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Contact</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., +1 234 567 8900'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            {/* <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value='Active'
                        className='bg-green-100 text-green-800 '
                      >
                        Active
                      </SelectItem>
                      <SelectItem
                        value='Inactive'
                        className='bg-red-100 text-red-800'
                      >
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    School Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., 456 Oak Ave'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
