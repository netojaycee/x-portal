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
  useCreateSessionMutation,
  useUpdateSessionMutation,
} from "@/redux/api";

// Define the form schema
const sessionSchema = z
  .object({
    name: z
      .string()
      .min(1, "Session name is required")
      .max(50, "Session name must be less than 50 characters"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .string()
      .min(1, "End date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
    status: z.enum(["Active", "Inactive"], {
      required_error: "Status is required",
    }),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

interface Session {
  name: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
}

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  session?: Session & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  session,
  isEditMode = false,
  onSuccess,
}) => {
  const [
    createSession,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateSessionMutation();

  const [
    updateSession,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateSessionMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: session?.name || "",
      startDate: session?.startDate || "",
      endDate: session?.endDate || "",
      status: session?.status || undefined,
    },
  });

  const onSubmit = async (values: SessionFormData) => {
    try {
      const credentials = {
        ...values,
        name: values.name.trim(),
      };
      if (isEditMode && session?.id) {
        await updateSession({
          id: session.id,
          ...credentials,
        }).unwrap();
      } else {
        await createSession(credentials).unwrap();
      }
    } catch (error) {
      console.error(
        `${isEditMode ? "Update" : "Create"} session error:`,
        error
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Session updated successfully"
          : "Session created successfully"
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
          {isEditMode ? "Edit Session" : "Create Session"}
        </h2>
        <p className='text-sm text-gray-500'>
          {isEditMode
            ? "Update the session details below"
            : "Enter the details to create a new session"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Session Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-700'>
                  Session Name <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., 2025/2026'
                    {...field}
                    className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date and End Date */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    Start Date <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='date'
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
              name='endDate'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>
                    End Date <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      {...field}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status */}
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
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

export default SessionForm;
