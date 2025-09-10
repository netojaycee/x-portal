"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
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
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useGetClassClassArmsBySessionIdQuery,
  useGetSessionsQuery,
  useGetAllParentsQuery,
} from "@/redux/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Define the form schema
const studentSchema = z.object({
  firstname: z.string().min(1, "First name is required").max(100),
  lastname: z.string().min(1, "Last name is required").max(100),
  othername: z.string().optional(),
  email: z.string().email("Invalid email address"),
  contact: z.string().optional(),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  // password: z.string().optional(),
  dateOfBirth: z.string().optional(),
  religion: z.string().optional(),
  nationality: z.string().optional(),
  stateOfOrigin: z.string().optional(),
  lga: z.string().optional(),
  parentId: z.string().optional(),
  classId: z.string().min(1, "Class is required"),
  classArmId: z.string().min(1, "Arm is required"),
  studentRegNo: z.string().optional(),
  // schoolId: z.string().optional(),
  address: z.string().optional(),
  sessionId: z.string().optional(),
  avatar: z.any().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: StudentFormData & {
    id: string;
    currentSessionId?: string;
    imageUrl?: string;
  };
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function StudentForm({
  student,
  isEditMode = false,
  onSuccess,
}: StudentFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    student?.avatar || null
  );
  const [imageBase64, setImageBase64] = useState<string>("");
  const [availableArms, setAvailableArms] = useState<
    { id: string; name: string }[]
  >([]);
  const userData = useSelector((state: RootState) => state.user.user);
  // Parent dropdown search state
  const [parentSearch, setParentSearch] = useState("");
  // Fetch all parents for dropdown
  const { data: parentsData, isLoading: isLoadingParents } =
    useGetAllParentsQuery({});

  console.log("Parents data:", parentsData);

  // Get current session ID - either from student or from active session
  const { data: sessions } = useGetSessionsQuery(
    {},
    { skip: !userData?.schoolId }
  );

  console.log("Sessions data:", sessions);
  const currentSession = sessions?.data?.find((session: any) => session.status);
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
    addStudent,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
      // data: studentDataNew,
    },
  ] = useCreateStudentMutation();

  const [
    updateStudent,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateStudentMutation();

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
      othername: student?.othername || "",
      email: student?.email || "",
      contact: student?.contact || "",
      gender: student?.gender || undefined,
      // password: "",
      dateOfBirth: student?.dateOfBirth
        ? student.dateOfBirth.split("T")[0]
        : "",
      religion: student?.religion || "",
      nationality: student?.nationality || "",
      stateOfOrigin: student?.stateOfOrigin || "",
      lga: student?.lga || "",
      parentId: student?.parentId || "",
      classId: student?.classId || "",
      classArmId: student?.classArmId || "",
      studentRegNo: student?.studentRegNo || "",
      // schoolId: userData?.schoolId || student?.schoolId || "",
      address: student?.address || "",
      sessionId:
        student?.currentSessionId ||
        (currentSession && currentSession.id) ||
        undefined,
      avatar: undefined,
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
      // Convert avatar file to base64 if present
      let avatarBase64Str = imageBase64;
      if (values.avatar && values.avatar instanceof File) {
        avatarBase64Str = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(values.avatar);
        });
      }
      const payload = {
        ...values,
        avatarBase64: avatarBase64Str,
        sessionId: sessionId,
        // subRoleFlag: "student",
      };

      console.log(student, isEditMode, "hhh");

      console.log("Submitting student data:", payload);
      if (isEditMode && student?.id) {
        await updateStudent({ id: student.id, ...payload }).unwrap();
      } else {
        await addStudent(payload).unwrap();
      }
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Add"} student error:`, error);
    }
  };

  console.log(student, "data");

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Student updated successfully"
          : "Student created successfully"
      );
      form.reset();
      if (onSuccess) onSuccess();
      // console.log("Student form reset", studentDataNew);
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
          encType='multipart/form-data'
        >
          {/* Name Fields */}
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
            <FormField
              control={form.control}
              name='othername'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Other Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Chinedu'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary/90'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Email, Contact, Password */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-gray-700'>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='e.g., student@email.com'
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
            name='contact'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-gray-700'>Contact</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., 08012345678'
                    {...field}
                    className='border-gray-300 focus:border-primary focus:ring-primary/90'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-gray-700'>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Set password (optional)'
                    {...field}
                    className='border-gray-300 focus:border-primary focus:ring-primary/90'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* Date of Birth, Religion, Nationality, State, LGA */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='dateOfBirth'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
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
              name='religion'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Religion</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Christianity'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary/90'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='nationality'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Nationality</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Nigerian'
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
              name='stateOfOrigin'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    State of Origin
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Lagos'
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
              name='lga'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>LGA</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Ikeja'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary/90'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Parent, Student Reg No, School, Address */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='parentId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    Parent (optional)
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "none"}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary/90'>
                        <SelectValue placeholder='Select parent (optional)' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Search input for parent dropdown */}
                      <div className='px-2 py-1'>
                        <Input
                          type='text'
                          placeholder='Search parent...'
                          value={parentSearch}
                          onChange={(e) => setParentSearch(e.target.value)}
                          className='border-gray-300 focus:border-primary focus:ring-primary/90 mb-2'
                        />
                      </div>
                      <SelectItem value='none'>None</SelectItem>
                      {isLoadingParents ? (
                        <SelectItem value='loading' disabled>
                          Loading parents...
                        </SelectItem>
                      ) : parentsData?.parents?.length ? (
                        parentsData.parents
                          .filter((parent: any) => {
                            const search = parentSearch.trim().toLowerCase();
                            if (!search) return true;
                            return (
                              parent?.firstname
                                ?.toLowerCase()
                                .includes(search) ||
                              parent?.lastname
                                ?.toLowerCase()
                                .includes(search) ||
                              parent?.email?.toLowerCase().includes(search)
                            );
                          })
                          .map((parent: any) => (
                            <SelectItem key={parent.id} value={parent.id}>
                              {parent?.firstname} {parent?.lastname}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value='no-parents' disabled>
                          No parents found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='studentRegNo'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    Student Reg No
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., STU12345'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary/90'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name='schoolId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>School ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='School ID'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary/90'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-gray-700'>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., 123 Main St, Lagos'
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
          {!isEditMode && (
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
          )}
          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name='avatar'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-gray-700'>Student Image</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                          setImageBase64(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setImagePreview(null);
                        setImageBase64("");
                      }
                    }}
                  />
                </FormControl>
                {imagePreview && (
                  <div className='mt-2'>
                    <Image
                      src={imagePreview}
                      alt='Student Preview'
                      width={80}
                      height={80}
                      className='rounded-md border'
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
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
