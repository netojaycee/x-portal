"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useManageAdmissionMutation } from "@/redux/api";

// Define the form schema using Zod
const RejectionFormSchema = z.object({
  reason: z.string().min(5, "Rejection reason must be at least 5 characters"),
});

type RejectionFormValues = z.infer<typeof RejectionFormSchema>;

interface RejectionFormProps {
  admissionId: string;
  onSuccess: () => void;
}

export default function RejectionForm({
  admissionId,
  onSuccess,
}: RejectionFormProps) {
  const [rejectAdmission, { isLoading }] = useManageAdmissionMutation();

  // Initialize the form with React Hook Form
  const form = useForm<RejectionFormValues>({
    resolver: zodResolver(RejectionFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: RejectionFormValues) => {
    try {
      await rejectAdmission({
        id: admissionId,
        status: "rejected",
        rejectionReason: values.reason,
      }).unwrap();

      toast.success("Admission rejected successfully.");
      onSuccess();
    } catch (error) {
      console.error("Error rejecting admission:", error);
      toast.error("Failed to reject admission. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='reason'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rejection Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Please provide a reason for rejection'
                  className='min-h-[120px] resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={isLoading}
            variant='destructive'
            className='w-full'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              "Send Rejection"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
