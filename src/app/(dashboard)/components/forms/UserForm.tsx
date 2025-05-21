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
import PhoneInput from "react-phone-input-2";
import { stripCountryCode } from "@/lib/utils";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetSubrolesQuery,
} from "@/redux/api";
import { User } from "@/lib/types";

// Define the form schema
const userSchema = z.object({
  firstname: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastname: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  contact: z
    .string()
    .min(14, "Contact must be 11 digits, please start with a 0")
    .max(14, "Contact must be 11 digits, please start with a 0"),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  subRoleId: z.string().min(1, "Role is required"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function UserForm({
  user,
  isEditMode = false,
  onSuccess,
}: UserFormProps) {
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

  const {
    data,
    isLoading: isLoadingSubroles,
    isError: isErrorSubroles,
    error: errorSubroles,
  } = useGetSubrolesQuery({});
  const subrolesData = data?.data || [];

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      contact: user?.phone || "",
      gender: user?.gender || undefined,
      subRoleId: user?.subRoleId || "",
    },
  });

  const onSubmit = async (values: UserFormData) => {
    try {
      const credentials = {
        ...values,
        phone: stripCountryCode(values.contact),
      };
      if (isEditMode && user?.id) {
        await updateUser({ id: user.id, input: credentials }).unwrap();
      } else {
        await addUser(credentials).unwrap();
      }
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Add"} user error:`, error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode ? "User updated successfully" : "User created successfully"
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

  useEffect(() => {
    if (isErrorSubroles && errorSubroles) {
      const errorMessage =
        "data" in errorSubroles &&
        typeof errorSubroles.data === "object" &&
        errorSubroles.data
          ? (errorSubroles.data as { error?: string })?.error
          : "Failed to load roles";
      toast.error(errorMessage);
    }
  }, [isErrorSubroles, errorSubroles]);

  return (
    <div className='w-full max-w-md'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* First Name and Last Name */}
          <div className='grid grid-cols-2 items-center gap-3'>
            <FormField
              control={form.control}
              name='firstname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Tolu'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
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
                <FormItem>
                  <FormLabel className='text-gray-700'>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Adebayo'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email and Contact */}
          <div className='grid grid-cols-2 items-center gap-3'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='e.g., user@example.com'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
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
                <FormItem>
                  <FormLabel className='text-gray-700'>Contact</FormLabel>
                  <FormControl>
                    <PhoneInput
                      inputProps={{
                        name: "contact",
                        required: true,
                        autoFocus: true,
                      }}
                      countryCodeEditable={false}
                      value={field.value}
                      onChange={field.onChange}
                      prefix='+'
                      country='ng'
                      onlyCountries={["ng"]}
                      inputStyle={{
                        width: "100%",
                        borderColor: "#D1D5DB", // border-gray-300
                        outline: "none",
                        boxShadow: "none",
                        height: "2.5rem", // h-10
                        borderRadius: "0.375rem", // rounded-md
                        paddingLeft: "2.5rem", // pl-10
                        paddingRight: "0.75rem", // pr-3
                        fontSize: "1rem", // text-base
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Gender and SubRole */}
          <div className='grid grid-cols-2 items-center gap-3'>
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary'>
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
            <FormField
              control={form.control}
              name='subRoleId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    // disabled={isLoadingSubroles}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary'>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {isLoadingSubroles ? (
                            <div className="p-3 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                <span className="ml-2 text-primary">Loading roles...</span>
                            </div>
                        ) : isErrorSubroles ? (
                            <div className="p-3 text-sm text-red-600 border border-red-500 rounded">
                                Failed to load roles
                            </div>
                        ) : (
                            subrolesData.map((subrole: any) => (
                                <SelectItem key={subrole.id} value={subrole.id}>
                                    {subrole.name}
                                </SelectItem>
                            ))
                        )}
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
