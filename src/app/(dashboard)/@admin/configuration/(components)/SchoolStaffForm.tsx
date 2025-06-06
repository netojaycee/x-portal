"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUpdateSchoolStaffMutation } from "@/redux/api";
import Image from "next/image";

// Define the schema for a single staff member
const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact number is required"),
  signature: z.any().optional(),
});

// Define the full form schema dynamically based on staff roles
const staffRoles = ["schoolHead", "principal", "bursar"] as const;
type StaffRole = (typeof staffRoles)[number];

const schoolStaffSchema = z.object(
  staffRoles.reduce((acc, role) => {
    acc[role] = staffSchema;
    return acc;
  }, {} as Record<StaffRole, typeof staffSchema>)
);

type SchoolStaffFormData = z.infer<typeof schoolStaffSchema>;

// Data object for staff roles
const staffData: Record<
  StaffRole,
  { label: string; placeholderName: string; placeholderContact: string }
> = {
  schoolHead: {
    label: "School Head Info",
    placeholderName: "Enter school head name",
    placeholderContact: "Enter school head number",
  },
  principal: {
    label: "Principal Info",
    placeholderName: "Enter school principal name",
    placeholderContact: "Enter school principal number",
  },
  bursar: {
    label: "Bursar Info",
    placeholderName: "Enter school bursar name",
    placeholderContact: "Enter school bursar number",
  },
};

// Reusable component for each staff section
interface StaffInfoSectionProps {
  role: StaffRole;
  label: string;
  placeholderName: string;
  placeholderContact: string;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  form: any;
}

const StaffInfoSection: React.FC<StaffInfoSectionProps> = ({
  role,
  label,
  placeholderName,
  placeholderContact,
  preview,
  setPreview,
  form,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue(`${role}.signature`, e.target.files);
    }
  };

  return (
    <div className='flex gap-6 items-center border border-primary rounded-lg p-4'>
      {/* Left: Name and Contact Fields */}
      <div className='w-2/3 space-y-4'>
        <h3 className='text-lg font-semibold'>{label}</h3>
        <FormField
          control={form.control}
          name={`${role}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-gray-700'>
                Name <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={placeholderName}
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
          name={`${role}.contact`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-gray-700'>
                Contact Number <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={placeholderContact}
                  {...field}
                  className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Right: Signature Upload */}
      <div className='w-1/3'>
        <div className='border border-blue-500 rounded-lg p-4 flex flex-col'>
          {!preview && (
            <span className='text-left'>
              <p className='font-lato font-bold text-sm'>
                {label.split(" ")[0]} Signature
              </p>
              <p className='text-sm text-gray-500'>
                Upload {label.split(" ")[0].toLowerCase()} signature here
              </p>
            </span>
          )}
          <div className='flex flex-col items-center'>
            <div className='w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
              {preview ? (
                <Image
                  height={32}
                  width={32}
                  src={preview}
                  alt={`${label} signature preview`}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-blue-500 text-sm text-center'>
                  <Image
                    height={32}
                    width={32}
                    src={"/Upload.svg"}
                    alt={`${label} signature preview`}
                    className='w-full h-full object-cover'
                  />
                </span>
              )}
            </div>
            <Label htmlFor={`${role}Signature-upload`} className='mt-4'>
              <div className='flex items-center p-2 space-x-2 text-primary'>
                {/* <Image
                  height={16}
                  width={16}
                  src={"/image-upload.svg"}
                  alt='Upload icon'
                  className=''
                /> */}
                <span>Upload Signature</span>
              </div>
            </Label>
            <Input
              id={`${role}Signature-upload`}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SchoolStaffForm: React.FC = () => {
  const [previews, setPreviews] = useState<Record<StaffRole, string | null>>({
    schoolHead: null,
    principal: null,
    bursar: null,
  });

  const [updateSchoolStaff, { isLoading, isSuccess, isError, error }] =
    useUpdateSchoolStaffMutation();

  const form = useForm<SchoolStaffFormData>({
    resolver: zodResolver(schoolStaffSchema),
    defaultValues: {
      schoolHead: { name: "", contact: "", signature: null },
      principal: { name: "", contact: "", signature: null },
      bursar: { name: "", contact: "", signature: null },
    },
  });

  const onSubmit = async (values: SchoolStaffFormData) => {
    try {
      const formData = new FormData();
      staffRoles.forEach((role) => {
        formData.append(`${role}Name`, values[role].name);
        formData.append(`${role}Contact`, values[role].contact);
        if (values[role].signature && values[role].signature[0]) {
          formData.append(`${role}Signature`, values[role].signature[0]);
        }
      });

      await updateSchoolStaff(formData).unwrap();
    } catch (error) {
      console.error("Update school staff error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("School staff information updated successfully");
      form.reset();
      setPreviews({ schoolHead: null, principal: null, bursar: null });
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form]);

  return (
    <div className='p-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Map through staff roles */}
          {staffRoles.map((role) => (
            <StaffInfoSection
              key={role}
              role={role}
              label={staffData[role].label}
              placeholderName={staffData[role].placeholderName}
              placeholderContact={staffData[role].placeholderContact}
              preview={previews[role]}
              setPreview={(newPreview) =>
                setPreviews((prev) => ({ ...prev, [role]: newPreview }))
              }
              form={form}
            />
          ))}

          {/* Submit Button (Outside Flex) */}
          <div className='flex justify-center mt-6'>
            <Button
              type='submit'
              disabled={isLoading}
              className='bg-blue-500 text-white hover:bg-blue-600'
            >
              {isLoading ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin mr-2' />
                  Submit
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SchoolStaffForm;
