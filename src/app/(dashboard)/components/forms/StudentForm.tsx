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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { useAddStudentMutation, useUpdateStudentMutation } from "@/redux/api";

// Mock RTK Query hooks (replace with actual hooks from your API slice)
const useGetClassesQuery = () => ({
  data: ["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"],
  isLoading: false,
  error: null,
});

const useGetArmsQuery = () => ({
  data: ["Gold", "Silver", "Blue", "Red"],
  isLoading: false,
  error: null,
});

// Define the form schema
const studentSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required",
  }),
  class: z.string().min(1, "Class is required"),
  arm: z.string().min(1, "Arm is required"),
  status: z.enum(["Active", "Inactive"], {
    required_error: "Status is required",
  }),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: StudentFormData & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function StudentForm({
  student,
  isEditMode = false,
  onSuccess,
}: StudentFormProps) {
  const [
    addStudent,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useAddStudentMutation();

  const [
    updateStudent,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateStudentMutation();


  // console.log(addStudent, updateStudent)
  const { data: classes, isLoading: isLoadingClasses } = useGetClassesQuery();
  const { data: arms, isLoading: isLoadingArms } = useGetArmsQuery();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: student?.fullName || "",
      gender: student?.gender || undefined,
      class: student?.class || "",
      arm: student?.arm || "",
      status: student?.status || undefined,
    },
  });

  const onSubmit = async (values: StudentFormData) => {
    try {
      console.log(values)
      if (isEditMode && student?.id) {
        await updateStudent({ id: student.id, ...values }).unwrap();
      } else {
        await addStudent(values).unwrap();
      }
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Add"} student error:`, error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Student updated successfully"
          : "Student created successfully"
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
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Full Name Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Tolu Adebayo'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary/90'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender Field */}
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary/90'>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Class Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='class'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingClasses}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary/90'>
                        <SelectValue placeholder='Select class' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes?.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Arm Field */}
            <FormField
              control={form.control}
              name='arm'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Arm</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingArms}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary/90'>
                        <SelectValue placeholder='Select arm' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {arms?.map((armName) => (
                        <SelectItem key={armName} value={armName}>
                          {armName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
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
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary/90'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value='Active'
                        className='bg-green-100 text-green-800'
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
