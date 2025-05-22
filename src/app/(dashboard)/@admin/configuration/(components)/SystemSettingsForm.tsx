"use client";

import React, { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { useUpdateSystemSettingsMutation } from "@/redux/api"; // Assume this is defined in your RTK setup

// Define the form schema
const systemSettingsSchema = z.object({
  registrationNumStudent: z
    .string()
    .min(1, "Registration number for student is required"),
  registrationNumStaff: z
    .string()
    .min(1, "Registration number for staff is required"),
  schoolName: z.string().min(1, "School name is required"),
  schoolNameFontSize: z.string(),
  address: z.string().min(1, "Address is required"),
  addressFontSize: z.string(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  emailFontSize: z.string(),
  contactNumber: z.string().min(1, "Contact number is required"),
  contactFontSize: z.string(),
  loginBackground: z.any().optional(),
});

type SystemSettingsFormData = z.infer<typeof systemSettingsSchema>;

const SystemSettingsForm: React.FC = () => {
  const [previewData, setPreviewData] = useState<SystemSettingsFormData | null>(
    null
  );
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );
  const [updateSystemSettings, { isLoading, isSuccess, isError, error }] =
    useUpdateSystemSettingsMutation();

  const form = useForm<SystemSettingsFormData>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      registrationNumStudent: "",
      registrationNumStaff: "",
      schoolName: "",
      schoolNameFontSize: "24",
      address: "",
      addressFontSize: "18",
      email: "",
      emailFontSize: "16",
      contactNumber: "",
      contactFontSize: "12",
      loginBackground: null,
    },
  });

  const onSubmit = async (values: SystemSettingsFormData) => {
    try {
      const formData = new FormData();
      formData.append("registrationNumStudent", values.registrationNumStudent);
      formData.append("registrationNumStaff", values.registrationNumStaff);
      formData.append("schoolName", values.schoolName);
      formData.append("schoolNameFontSize", values.schoolNameFontSize);
      formData.append("address", values.address);
      formData.append("addressFontSize", values.addressFontSize);
      formData.append("email", values.email);
      formData.append("emailFontSize", values.emailFontSize);
      formData.append("contactNumber", values.contactNumber);
      formData.append("contactFontSize", values.contactFontSize);
      if (values.loginBackground && values.loginBackground[0]) {
        formData.append("loginBackground", values.loginBackground[0]);
      }

      await updateSystemSettings(formData).unwrap();
    } catch (error) {
      console.error("Update system settings error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("System settings updated successfully");
      form.reset();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("loginBackground", e.target.files);
    }
  };

  const handlePreview = () => {
    setPreviewData(form.getValues());
  };

  return (
    <div className='p-6 flex gap-6'>
      {/* Left Section: Form */}
      <div className='w-1/2 space-y-6'>
        {/* Registration Number for Student */}
        <FormField
          control={form.control}
          name='registrationNumStudent'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-gray-700'>
                Registration Num. for student{" "}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Sch. short name/Year/student no. (DLHS/Y/00001)'
                  {...field}
                  className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Registration Number for Staff */}
        <FormField
          control={form.control}
          name='registrationNumStaff'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-gray-700'>
                Registration Num. for Staff{" "}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Eg. (DLHS/Y/00001)'
                  {...field}
                  className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='border border-gray-200 rounded-lg p-4 space-y-4'>
              <p className='text-sm text-gray-500'>
                Set school mat with the font size using the range box setting to
                assign size with a Squid School Name*
              </p>
              <p className='text-sm text-gray-500'>
                School Name* <span className='text-red-500'>*</span>
              </p>
              <FormField
                control={form.control}
                name='schoolName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      School Name <span className='text-red-500'>*</span>
                    </FormLabel>
                    <div className='flex gap-2'>
                      <FormControl>
                        <Input
                          placeholder='Enter School name'
                          {...field}
                          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500 flex-1'
                        />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name='schoolNameFontSize'
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className='w-32'>
                              <SelectValue placeholder='Choose font size' />
                            </SelectTrigger>
                            <SelectContent>
                              {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Address <span className='text-red-500'>*</span>
                    </FormLabel>
                    <div className='flex gap-2'>
                      <FormControl>
                        <Input
                          placeholder='Enter address'
                          {...field}
                          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500 flex-1'
                        />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name='addressFontSize'
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className='w-32'>
                              <SelectValue placeholder='Choose font size' />
                            </SelectTrigger>
                            <SelectContent>
                              {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Address */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Email Address <span className='text-red-500'>*</span>
                    </FormLabel>
                    <div className='flex gap-2'>
                      <FormControl>
                        <Input
                          placeholder='Enter email address'
                          {...field}
                          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500 flex-1'
                        />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name='emailFontSize'
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className='w-32'>
                              <SelectValue placeholder='Choose font size' />
                            </SelectTrigger>
                            <SelectContent>
                              {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Number */}
              <FormField
                control={form.control}
                name='contactNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Contact number <span className='text-red-500'>*</span>
                    </FormLabel>
                    <div className='flex gap-2'>
                      <FormControl>
                        <Input
                          placeholder='Enter contact number'
                          {...field}
                          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500 flex-1'
                        />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name='contactFontSize'
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className='w-32'>
                              <SelectValue placeholder='Choose font size' />
                            </SelectTrigger>
                            <SelectContent>
                              {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Login Background Upload */}
            <FormField
              control={form.control}
              name='loginBackground'
              render={() => (
                <FormItem>
                  <FormLabel className='text-gray-700'>
                    Upload login background{" "}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview Button */}
            <div className='flex justify-center'>
              <Button
                type='button'
                onClick={handlePreview}
                className='border-blue-500 text-blue-500 hover:bg-blue-50'
              >
                Preview
              </Button>
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
                    Save Update
                  </>
                ) : (
                  "Save Update"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Right Section: Preview */}
      <div className='w-1/2 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center'>
        {previewData ? (
          <div className='space-y-4 text-center'>
            <p style={{ fontSize: `${previewData.schoolNameFontSize}px` }}>
              {previewData.schoolName || "School Name"}
            </p>
            <p style={{ fontSize: `${previewData.addressFontSize}px` }}>
              {previewData.address || "Address"}
            </p>
            <p style={{ fontSize: `${previewData.emailFontSize}px` }}>
              {previewData.email || "Email Address"}
            </p>
            <p style={{ fontSize: `${previewData.contactFontSize}px` }}>
              {previewData.contactNumber || "Contact Number"}
            </p>
            {backgroundPreview && (
              <div className='mt-4'>
                <img
                  src={backgroundPreview}
                  alt='Login background preview'
                  className='w-full h-40 object-cover rounded'
                />
              </div>
            )}
          </div>
        ) : (
          <div className='text-center text-gray-500'>
            <div className='w-32 h-32 mx-auto mb-4'>
              <svg
                className='w-full h-full'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
            </div>
            <p>Click preview on ANY section you need to view</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettingsForm;
