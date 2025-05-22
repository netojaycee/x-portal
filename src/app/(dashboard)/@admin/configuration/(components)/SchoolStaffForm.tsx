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
import { useUpdateSchoolStaffMutation } from "@/redux/api"; // Assume this is defined in your RTK setup

// Define the form schema
const schoolStaffSchema = z.object({
  schoolHeadName: z.string().min(1, "School head name is required"),
  schoolHeadContact: z
    .string()
    .min(1, "School head contact number is required"),
  schoolHeadSignature: z.any().optional(),
  principalName: z.string().min(1, "Principal name is required"),
  principalContact: z.string().min(1, "Principal contact number is required"),
  principalSignature: z.any().optional(),
  bursarName: z.string().min(1, "Bursar name is required"),
  bursarContact: z.string().min(1, "Bursar contact number is required"),
  bursarSignature: z.any().optional(),
});

type SchoolStaffFormData = z.infer<typeof schoolStaffSchema>;

const SchoolStaffForm: React.FC = () => {
  const [schoolHeadPreview, setSchoolHeadPreview] = useState<string | null>(
    null
  );
  const [principalPreview, setPrincipalPreview] = useState<string | null>(null);
  const [bursarPreview, setBursarPreview] = useState<string | null>(null);
  const [updateSchoolStaff, { isLoading, isSuccess, isError, error }] =
    useUpdateSchoolStaffMutation();

  const form = useForm<SchoolStaffFormData>({
    resolver: zodResolver(schoolStaffSchema),
    defaultValues: {
      schoolHeadName: "",
      schoolHeadContact: "",
      schoolHeadSignature: null,
      principalName: "",
      principalContact: "",
      principalSignature: null,
      bursarName: "",
      bursarContact: "",
      bursarSignature: null,
    },
  });

  const onSubmit = async (values: SchoolStaffFormData) => {
    try {
      const formData = new FormData();
      formData.append("schoolHeadName", values.schoolHeadName);
      formData.append("schoolHeadContact", values.schoolHeadContact);
      if (values.schoolHeadSignature && values.schoolHeadSignature[0]) {
        formData.append("schoolHeadSignature", values.schoolHeadSignature[0]);
      }
      formData.append("principalName", values.principalName);
      formData.append("principalContact", values.principalContact);
      if (values.principalSignature && values.principalSignature[0]) {
        formData.append("principalSignature", values.principalSignature[0]);
      }
      formData.append("bursarName", values.bursarName);
      formData.append("bursarContact", values.bursarContact);
      if (values.bursarSignature && values.bursarSignature[0]) {
        formData.append("bursarSignature", values.bursarSignature[0]);
      }

      await updateSchoolStaff(formData).unwrap();
    } catch (error) {
      console.error("Update school staff error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("School staff information updated successfully");
      form.reset();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: keyof SchoolStaffFormData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue(fieldName, e.target.files);
    }
  };

  return (
    <div className='p-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-6'>
          {/* Left Section: Form Inputs */}
          <div className='w-2/3 space-y-6'>
            {/* School Head Info */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>School Head Info</h3>
              <FormField
                control={form.control}
                name='schoolHeadName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Name <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter school head name'
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
                name='schoolHeadContact'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Contact Number <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter school head number'
                        {...field}
                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Principal Info */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Principal Info</h3>
              <FormField
                control={form.control}
                name='principalName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Name <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter school principal name'
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
                name='principalContact'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Contact Number <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter school principal number'
                        {...field}
                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bursar Info */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Bursar Info</h3>
              <FormField
                control={form.control}
                name='bursarName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Name <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter school bursar name'
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
                name='bursarContact'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Contact Number <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter school bursar number'
                        {...field}
                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Section: Signature Uploads */}
          <div className='w-1/3 space-y-6'>
            {/* School Head Signature */}
            <div className='border border-gray-200 rounded-lg p-4 flex flex-col items-center'>
              <h4 className='text-sm font-medium mb-2'>
                School Head Signature
              </h4>
              {schoolHeadPreview ? (
                <img
                  src={schoolHeadPreview}
                  alt='School head signature preview'
                  className='w-32 h-16 object-contain mb-2'
                />
              ) : (
                <div className='w-32 h-16 flex items-center justify-center text-gray-400 text-sm'>
                  Upload school head signature here
                </div>
              )}
              <Label htmlFor='schoolHeadSignature-upload'>
                <Button
                  asChild
                  variant='outline'
                  className='border-blue-500 text-blue-500 hover:bg-blue-50'
                >
                  <span>Upload a file or Drag and drop</span>
                </Button>
              </Label>
              <Input
                id='schoolHeadSignature-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) =>
                  handleFileChange(
                    e,
                    setSchoolHeadPreview,
                    "schoolHeadSignature"
                  )
                }
              />
            </div>

            {/* Principal Signature */}
            <div className='border border-gray-200 rounded-lg p-4 flex flex-col items-center'>
              <h4 className='text-sm font-medium mb-2'>
                School Principal Signature
              </h4>
              {principalPreview ? (
                <img
                  src={principalPreview}
                  alt='Principal signature preview'
                  className='w-32 h-16 object-contain mb-2'
                />
              ) : (
                <div className='w-32 h-16 flex items-center justify-center text-gray-400 text-sm'>
                  Upload school head signature here
                </div>
              )}
              <Label htmlFor='principalSignature-upload'>
                <Button
                  asChild
                  variant='outline'
                  className='border-blue-500 text-blue-500 hover:bg-blue-50'
                >
                  <span>Upload a file or Drag and drop</span>
                </Button>
              </Label>
              <Input
                id='principalSignature-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) =>
                  handleFileChange(e, setPrincipalPreview, "principalSignature")
                }
              />
            </div>

            {/* Bursar Signature */}
            <div className='border border-gray-200 rounded-lg p-4 flex flex-col items-center'>
              <h4 className='text-sm font-medium mb-2'>
                School Bursar Signature
              </h4>
              {bursarPreview ? (
                <img
                  src={bursarPreview}
                  alt='Bursar signature preview'
                  className='w-32 h-16 object-contain mb-2'
                />
              ) : (
                <div className='w-32 h-16 flex items-center justify-center text-gray-400 text-sm'>
                  Upload school head signature here
                </div>
              )}
              <Label htmlFor='bursarSignature-upload'>
                <Button
                  asChild
                  variant='outline'
                  className='border-blue-500 text-blue-500 hover:bg-blue-50'
                >
                  <span>Upload a file or Drag and drop</span>
                </Button>
              </Label>
              <Input
                id='bursarSignature-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) =>
                  handleFileChange(e, setBursarPreview, "bursarSignature")
                }
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-center'>
              <Button
                type='submit'
                disabled={isLoading}
                className='bg-blue-500 text-white hover:bg-blue-600'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin mr-2' />
                    Create
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SchoolStaffForm;
