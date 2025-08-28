"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const rejectFormSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

type RejectFormValues = z.infer<typeof rejectFormSchema>;

interface RejectionFormProps {
  paymentId: string;
  onClose: () => void;
  onReject: (reason: string) => Promise<void>;
  isProcessing: boolean;
}

const RejectionForm: React.FC<RejectionFormProps> = ({
  onClose,
  onReject,
  isProcessing,
}) => {
  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (values: RejectFormValues) => {
    await onReject(values.reason);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 space-y-4'>
        <FormField
          control={form.control}
          name='reason'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder='Enter reason for rejection'
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end space-x-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isProcessing} variant='destructive'>
            {isProcessing ? "Processing..." : "Reject"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RejectionForm;
