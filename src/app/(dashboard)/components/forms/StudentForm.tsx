"use client";

import { useEffect, useState } from "react";
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
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetClassClassArmsBySessionIdQuery,
  useGetSessionsQuery,
} from "@/redux/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Define the form schema
const studentSchema = z.object({
  firstname: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastname: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  classId: z.string().min(1, "Class is required"),
  classArmId: z.string().min(1, "Arm is required"),
  sessionId: z.string().optional(),
  // status: z.enum(["Active", "Inactive"], {
  //   required_error: "Status is required",
  // }),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: StudentFormData & {
    id: string;
    currentSessionId?: string;
  }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function StudentForm({
  student,
  isEditMode = false,
  onSuccess,
}: StudentFormProps) {
  const [availableArms, setAvailableArms] = useState<
    { id: string; name: string }[]
  >([]);
  const userData = useSelector((state: RootState) => state.user.user);
  console.log(userData)

  // Get current session ID - either from student or from active session
  const { data: sessions } = useGetSessionsQuery(
    {},
    { skip: !userData?.schoolId }
  );

  console.log("Sessions data:", sessions);
  const currentSession = sessions?.data?.find(
    (session: any) => session.status === "Active"
  );
  const sessionId =
    userData?.currentSessionId ||
    student?.currentSessionId ||
    (currentSession && currentSession.id);

  // Fetch classes and arms for the current session
  const { data: classData, isLoading: classDataLoading } =
    useGetClassClassArmsBySessionIdQuery(sessionId, {
      skip: !sessionId,
    });

  const [
    addUser,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateUserMutation();

  const [
    updateUser,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateUserMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  // Handle class change to update available arms
  const handleClassChange = (classId: string) => {
    // Find the selected class and update available arms
    const selectedClass = classData?.data?.classes?.find(
      (cls: any) => cls.id === classId
    );

    if (selectedClass) {
      setAvailableArms(selectedClass.classArms || []);
    } else {
      setAvailableArms([]);
    }
  };

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstname: student?.firstname || "",
      lastname: student?.lastname || "",
      gender: student?.gender || undefined,
      classId: student?.classId || "",
      classArmId: student?.classArmId || "",
      sessionId:
        student?.currentSessionId ||
        (currentSession && currentSession.id) ||
        undefined,
      // status: student?.status || undefined,
    },
  });

  // Update available arms when class selection changes
  useEffect(() => {
    // When editing, load the arms for the student's class
    if (student?.classId && classData?.data?.classes) {
      const studentClass = classData.data.classes.find(
        (cls: any) => cls.id === student.classId
      );
      if (studentClass) {
        setAvailableArms(studentClass.classArms || []);
      }
    }
  }, [student?.classId, classData]);

  const onSubmit = async (values: StudentFormData) => {
    try {
      // Add session ID to the form data
      const formData = {
        ...values,
        sessionId: sessionId,
        subRoleFlag: "student",
      };

      console.log(formData);
      if (isEditMode && student?.id) {
        await updateUser({ id: student.id, input: formData }).unwrap();
      } else {
        await addUser(formData).unwrap();
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
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form, onSuccess, isEditMode]);

  // Show loading state while fetching sessions
  const isLoadingSessions = !sessions && !userData?.schoolId;

  if (isLoadingSessions || classDataLoading) {
    return (
      <div className='w-full max-w-md p-4 flex flex-col items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary mb-4' />
        <p className='text-gray-700'>Loading data...</p>
      </div>
    );
  }

  // Show error if no session is available
  if (!sessionId && sessions?.data?.length > 0) {
    return (
      <div className='w-full max-w-md p-4 text-center'>
        <p className='text-red-500 mb-2'>No active session found.</p>
        <p className='text-gray-700'>
          Please set an active session in the Session & Term settings.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full max-w-md'>
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Full Name Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='firstname'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Tolu'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary/90'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastname'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Adebayo'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary/90'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender Field */}
          </div>
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
          {/* Class Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='classId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Class</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleClassChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={classDataLoading}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary/90'>
                        <SelectValue placeholder='Select class' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classDataLoading ? (
                        <SelectItem value='loading' disabled>
                          Loading classes...
                        </SelectItem>
                      ) : classData?.data?.classes?.length ? (
                        classData.data.classes.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value='empty' disabled>
                          No classes available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Arm Field */}
            <FormField
              control={form.control}
              name='classArmId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Class Arm</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.getValues("classId") || classDataLoading}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary/90'>
                        <SelectValue placeholder='Select arm' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!form.getValues("classId") ? (
                        <SelectItem value='select-class-first' disabled>
                          Select a class first
                        </SelectItem>
                      ) : availableArms.length > 0 ? (
                        availableArms.map((arm) => (
                          <SelectItem key={arm.id} value={arm.id}>
                            {arm.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value='no-arms' disabled>
                          No class arms available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status Field */}
          {/* <div className='flex items-center w-full gap-5'>
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
          </div> */}

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
