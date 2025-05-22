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
import {
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "@/redux/api";

// Define the form schema
const subscriptionSchema = z.object({
  package: z
    .string()
    .min(1, "Package name is required")
    .max(100, "Package name must be less than 100 characters"),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive integer")
    .max(120, "Duration cannot exceed 120 months"),
  studentLimit: z.enum(["50", "100", "200", "Unlimited"], {
    required_error: "Student limit is required",
  }),
  // status: z.enum(["Active", "Inactive"], {
  //   required_error: "Status is required",
  // }),
});

interface Subscription {
  name: string;
  duration: number;
  studentLimit: number;
}

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  subscription?: Subscription & { id: string }; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function SubscriptionForm({
  subscription,
  isEditMode = false,
  onSuccess,
}: SubscriptionFormProps) {
  const [
    createSubscription,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateSubscriptionMutation();

  const [
    updateSubscription,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateSubscriptionMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      package: subscription?.name || "",
      duration: subscription?.duration || 0,
      studentLimit:
        Number(subscription?.studentLimit) === 100000
          ? "Unlimited"
          : subscription?.studentLimit === 50
          ? "50"
          : subscription?.studentLimit === 100
          ? "100"
          : subscription?.studentLimit === 200
          ? "200"
          : undefined,
      // status: subscription?.status || undefined,
    },
  });

  const onSubmit = async (values: SubscriptionFormData) => {
    try {
      const { package: packageName, studentLimit, ...rest } = values;
      const credentials = {
        ...rest,
        studentLimit:
          studentLimit === "Unlimited" ? 100000 : Number(studentLimit),
        name: packageName.trim().toLowerCase(),
      };
      console.log(credentials);
      if (isEditMode && subscription?.id) {
        await updateSubscription({
          id: subscription.id,
          ...credentials,
        }).unwrap();
      } else {
        await createSubscription(credentials).unwrap();
      }
    } catch (error) {
      console.error(
        `${isEditMode ? "Update" : "Add"} subscription error:`,
        error
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Subscription updated successfully"
          : "Subscription created successfully"
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
    <div className='w-full max-w-md '>
      {/* Header */}
      {/* <div className='mb-6 text-center'>
        <h2 className='text-2xl md:text-3xl font-bold text-[#4A4A4A] font-lato'>
          {isEditMode ? "Edit Subscription" : "Add Subscription"}
        </h2>
        <p className='mt-1 text-sm text-gray-600'>
          {isEditMode
            ? "Update the subscription details below"
            : "Enter the details to create a new subscription"}
        </p>
      </div> */}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Package Name Field */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='package'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Package Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Premium Plan'
                      {...field}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration Field */}
            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>
                    Duration (Months)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='e.g., 12'
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>{" "}
          <div className='flex items-center w-full gap-5'>
            {/* Student Limit Field */}
            <FormField
              control={form.control}
              name='studentLimit'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-700'>Student Limit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger className='border-gray-300 focus:border-primary focus:ring-primary'>
                        <SelectValue placeholder='Select student limit' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='50'>50</SelectItem>
                      <SelectItem value='100'>100</SelectItem>
                      <SelectItem value='200'>200</SelectItem>
                      <SelectItem value='Unlimited'>Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
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
            /> */}
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
