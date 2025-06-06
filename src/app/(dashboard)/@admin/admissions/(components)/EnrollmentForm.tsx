"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetClassesQuery,
  useGetClassArmsQuery,
  useManageAdmissionMutation,
} from "@/redux/api";

// Define the form schema using Zod
const EnrollmentFormSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  classArmId: z.string().min(1, "Class Arm is required"),
});

type EnrollmentFormValues = z.infer<typeof EnrollmentFormSchema>;

interface EnrollmentFormProps {
  admissionId: string;
  onSuccess: () => void;
}

export default function EnrollmentForm({
  admissionId,
  onSuccess,
}: EnrollmentFormProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Fetch classes and class arms
  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery(
    {}
  );
  const { data: classArmsData, isLoading: classArmsLoading } =
    useGetClassArmsQuery({});

  // Filter class arms based on selected class
  const filteredClassArms = selectedClassId
    ? classArmsData?.filter((arm: any) => arm.classId === selectedClassId)
    : [];

  const [approveAdmission, { isLoading }] = useManageAdmissionMutation();

  // Initialize the form with React Hook Form
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(EnrollmentFormSchema),
    defaultValues: {
      classId: "",
      classArmId: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: EnrollmentFormValues) => {
    try {
      await approveAdmission({
        id: admissionId,
        status: "approved",
        classId: values.classId,
        classArmId: values.classArmId,
      }).unwrap();

      toast.success("Admission approved successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error approving admission:", error);
      toast.error("Failed to approve admission. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='classId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedClassId(value);
                  }}
                  defaultValue={field.value}
                  disabled={classesLoading}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select class' />
                  </SelectTrigger>
                  <SelectContent>
                    {classesData?.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='classArmId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Arm</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={classArmsLoading || !selectedClassId}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select class arm' />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClassArms?.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              "Confirm Enrollment"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
