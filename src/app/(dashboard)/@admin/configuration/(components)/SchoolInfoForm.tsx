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
import { useUpdateSchoolInfoMutation } from "@/redux/api"; // Assume this is defined in your RTK setup

// Define the form schema
const schoolSchema = z.object({
  name: z.string().min(1, "School name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(1, "Address is required"),
  color: z.string().optional(),
  logo: z.any().optional(),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

const SchoolInfoForm: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [updateSchoolInfo, { isLoading, isSuccess, isError, error }] =
    useUpdateSchoolInfoMutation();

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      state: "",
      address: "",
      color: "#ff0000", // Default color (red)
      logo: null,
    },
  });

  const onSubmit = async (values: SchoolFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("address", values.address);
      if (values.color) formData.append("color", values.color);
      if (values.logo && values.logo[0])
        formData.append("logo", values.logo[0]);

      await updateSchoolInfo(formData).unwrap();
    } catch (error) {
      console.error("Update school info error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("School information updated successfully");
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
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("logo", e.target.files);
    }
  };

  const colors = [
    "#ffffff",
    "#ff0000",
    "#ff4500",
    "#32cd32",
    "#00ced1",
    "#1e90ff",
    "#ff69b4",
    "#ffff00",
    "#dda0dd",
    "#228b22",
    "#ff6347",
    "#f0e68c",
    "#4682b4",
    "#9acd32",
    "#ff1493",
    "#00ff7f",
    "#9932cc",
    "#696969",
    "#000000",
    "#8b008b",
  ];

  return (
    <div className='p-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-6'>
          {/* Left Section: Logo Upload and Color Picker */}
          <div className='space-y-6 w-1/3'>
            {/* Logo Upload */}
            <div className='border border-gray-200 rounded-lg p-4 flex flex-col items-center'>
              <div className='w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                {preview ? (
                  <img
                    src={preview}
                    alt='School logo preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-gray-500 text-sm text-center'>
                    School logo here
                  </span>
                )}
              </div>
              <Label htmlFor='logo-upload' className='mt-4'>
                <Button
                  asChild
                  variant='outline'
                  className='border-blue-500 text-blue-500 hover:bg-blue-50'
                >
                  <span>Upload Logo</span>
                </Button>
              </Label>
              <Input
                id='logo-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </div>

            {/* Color Picker */}
            <div className='border border-gray-200 rounded-lg p-4'>
              <FormField
                control={form.control}
                name='color'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Color</FormLabel>
                    <div className='flex items-center gap-2 mb-4'>
                      <Input
                        type='text'
                        placeholder='Enter color code'
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      />
                      <div
                        className='w-8 h-8 rounded'
                        style={{ backgroundColor: field.value || "#ff0000" }}
                      />
                    </div>
                    <div className='grid grid-cols-5 gap-2'>
                      {colors.map((color) => (
                        <button
                          key={color}
                          type='button'
                          className='w-8 h-8 rounded border border-gray-200'
                          style={{ backgroundColor: color }}
                          onClick={() => field.onChange(color)}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Section: School Details */}
          <div className='space-y-4 w-2/3'>
            {/* School Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>
                    School name <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter school name'
                      {...field}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
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
                    Email address <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter school email address'
                      {...field}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>
                    Country <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter country'
                      {...field}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name='state'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>
                    State <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter state'
                      {...field}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      placeholder='Enter address'
                      {...field}
                      className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className='flex justify-end'>
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SchoolInfoForm;
