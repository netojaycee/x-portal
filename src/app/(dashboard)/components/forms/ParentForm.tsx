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
  useCreateParentMutation,
  useUpdateParentMutation,
  useGetSessionsQuery,
} from "@/redux/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Define the form schema
const parentSchema = z.object({
  firstname: z.string().min(1, "First name is required").max(100),
  lastname: z.string().min(1, "Last name is required").max(100),
  othername: z.string().optional(),
  email: z.string().email("Invalid email address"),
  contact: z.string().optional(),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  occupation: z.string().min(1, "Occupation is required").max(100),
  // schoolId: z.string().optional(),
  address: z.string().optional(),
  // sessionId: z.string().optional(),
  avatar: z.any().optional(),
});

type ParentFormData = z.infer<typeof parentSchema>;

interface ParentFormProps {
  parent?: ParentFormData & {
    id: string;
    currentSessionId?: string;
    imageUrl?: string;
  };
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function ParentForm({
  parent,
  isEditMode = false,
  onSuccess,
}: ParentFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    parent?.avatar || null
  );
  const [imageBase64, setImageBase64] = useState<string>("");
 
  const userData = useSelector((state: RootState) => state.user.user);


  // Get current session ID - either from student or from active session
  const { data: sessions } = useGetSessionsQuery(
    {},
    { skip: !userData?.schoolId }
  );

  console.log("Sessions data:", sessions);
  const currentSession = sessions?.data?.find((session: any) => session.status);
  const sessionId =
    userData?.currentSessionId ||
    parent?.currentSessionId ||
    (currentSession && currentSession.id);


  const [
    addParent,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
      // data: studentDataNew,
    },
  ] = useCreateParentMutation();

  const [
    updateParent,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateParentMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      firstname: parent?.firstname || "",
      lastname: parent?.lastname || "",
      othername: parent?.othername || "",
      email: parent?.email || "",
      contact: parent?.contact || "",
      gender: parent?.gender || undefined,
      // password: "",
      occupation: parent?.occupation || "",
      address: parent?.address || "",
      // sessionId:
      //   parent?.currentSessionId ||
      //   (currentSession && currentSession.id) ||
      //   undefined,
      avatar: undefined,
    },
  });

  const onSubmit = async (values: ParentFormData) => {
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
        // sessionId: sessionId,
      };

      console.log(parent, isEditMode, "hhh");

      console.log("Submitting parent data:", payload);
      if (isEditMode && parent?.id) {
        await updateParent({ id: parent.id, ...payload }).unwrap();
      } else {
        await addParent(payload).unwrap();
      }
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Add"} parent error:`, error);
    }
  };

  console.log(parent, "data");

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Parent updated successfully"
          : "Parent created successfully"
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

  if (isLoadingSessions) {
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
        
          <FormField
            control={form.control}
            name='occupation'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-gray-700'>Occupation</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., Teacher'
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
