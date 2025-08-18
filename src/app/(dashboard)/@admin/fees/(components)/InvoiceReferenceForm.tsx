"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const InvoiceReferenceSchema = z.object({
  reference: z.string().min(1, "Invoice reference is required"),
});

type InvoiceReferenceValues = z.infer<typeof InvoiceReferenceSchema>;

interface InvoiceReferenceFormProps {
  onClose: () => void;
}

export default function InvoiceReferenceForm({
  onClose,
}: InvoiceReferenceFormProps) {
  const router = useRouter();

  const form = useForm<InvoiceReferenceValues>({
    resolver: zodResolver(InvoiceReferenceSchema),
    defaultValues: {
      reference: "",
    },
  });

  const onSubmit = async (values: InvoiceReferenceValues) => {
    try {
      // Navigate to the discount page with the reference as a URL parameter
      router.push(`/fees/discount/${encodeURIComponent(values.reference)}`);
      onClose();
      toast.success("Navigating to invoice details...");
    } catch {
      toast.error("Failed to navigate. Please try again.");
    }
  };

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='reference'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Reference Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Enter invoice reference number'
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end space-x-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='px-6'
            >
              Cancel
            </Button>
            <Button type='submit' className='px-6'>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
