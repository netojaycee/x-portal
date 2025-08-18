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
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import {
  useCreateSubscriptionPackageMutation,
  useUpdateSubscriptionPackageMutation,
} from "@/redux/api";

// Define the form schema
const subscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Package name is required")
    .max(100, "Package name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  amount: z
    .number()
    .min(0, "Amount must be positive")
    .max(1000000, "Amount cannot exceed 1,000,000"),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive integer")
    .max(120, "Duration cannot exceed 120 months"),
  studentLimit: z
    .number()
    .int()
    .positive("Student limit must be a positive integer")
    .max(10000, "Student limit cannot exceed 10,000"),
  features: z
    .object({
      cbt: z.boolean().default(false),
      feeManagement: z.boolean().default(false),
      bulkSMS: z.boolean().default(false),
      attendance: z.boolean().default(true),
      results: z.boolean().default(true),
      parentPortal: z.boolean().default(false),
      apiAccess: z.boolean().default(false),
    })
    .optional(),
});

interface SubscriptionPackage {
  id: string;
  name: string;
  description?: string;
  amount: number;
  duration: number;
  studentLimit: number;
  features?: {
    cbt?: boolean;
    feeManagement?: boolean;
    bulkSMS?: boolean;
    attendance?: boolean;
    results?: boolean;
    parentPortal?: boolean;
    apiAccess?: boolean;
  };
  isActive?: boolean;
}

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  subscription?: SubscriptionPackage; // For edit mode
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function SubscriptionForm({
  subscription,
  isEditMode = false,
  onSuccess,
}: SubscriptionFormProps) {
  const [
    createSubscriptionPackage,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateSubscriptionPackageMutation();

  const [
    updateSubscriptionPackage,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateSubscriptionPackageMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: subscription?.name || "",
      description: subscription?.description || "",
      amount: subscription?.amount || 0,
      duration: subscription?.duration || 1,
      studentLimit: subscription?.studentLimit || 50,
      features: subscription?.features || {
        cbt: false,
        feeManagement: false,
        bulkSMS: false,
        attendance: true,
        results: true,
        parentPortal: false,
        apiAccess: false,
      },
    },
  });

  const onSubmit = async (values: SubscriptionFormData) => {
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
        amount: values.amount,
        duration: values.duration,
        studentLimit: values.studentLimit,
        features: values.features || {
          cbt: false,
          feeManagement: false,
          bulkSMS: false,
          attendance: true,
          results: true,
          parentPortal: false,
          apiAccess: false,
        },
      };

      console.log("Payload:", payload);

      if (isEditMode && subscription?.id) {
        await updateSubscriptionPackage({
          id: subscription.id,
          data: payload,
        }).unwrap();
      } else {
        await createSubscriptionPackage(payload).unwrap();
      }
    } catch (error) {
      console.error(
        `${isEditMode ? "Update" : "Create"} subscription package error:`,
        error
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Subscription package updated successfully"
          : "Subscription package created successfully"
      );
      form.reset();
      if (onSuccess) onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message ||
            (error.data as { error?: string })?.error
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
          <FormField
            control={form.control}
            name='name'
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

          {/* Description Field */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-700'>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., Full-featured package for large schools'
                    {...field}
                    className='border-gray-300 focus:border-primary focus:ring-primary'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount and Duration Fields */}
          <div className='flex items-center w-full gap-5'>
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='text-gray-700'>Amount (₦)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='e.g., 35000'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='text-gray-700'>
                    Duration (Months)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='e.g., 12'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className='border-gray-300 focus:border-primary focus:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Student Limit Field */}
          <FormField
            control={form.control}
            name='studentLimit'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-700'>Student Limit</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='e.g., 1000'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className='border-gray-300 focus:border-primary focus:ring-primary'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Features Section */}
          <div className='space-y-3'>
            <FormLabel className='text-gray-700 text-base'>Features</FormLabel>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='features.cbt'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='rounded border-gray-300'
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>
                      Computer Based Tests (CBT)
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='features.feeManagement'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='rounded border-gray-300'
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>
                      Fee Management
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='features.bulkSMS'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='rounded border-gray-300'
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>
                      Bulk SMS
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='features.attendance'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='rounded border-gray-300'
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>
                      Attendance Management
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='features.results'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='rounded border-gray-300'
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>
                      Results Management
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='features.parentPortal'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='rounded border-gray-300'
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>
                      Parent Portal
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='features.apiAccess'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='rounded border-gray-300'
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>
                      API Access
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
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
