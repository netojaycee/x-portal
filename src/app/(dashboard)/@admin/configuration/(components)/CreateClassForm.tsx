"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
import { useCreateClassMutation } from "@/redux/api"; // Assume this is defined in your RTK setup
import { useRouter } from "next/navigation";

// Define the form schema
const classSchema = z.object({
  category: z.string().min(1, "Class category is required"),
  name: z.string().min(1, "Class name is required"),
  arms: z.array(z.string()).optional(),
  status: z.boolean(),
});

type ClassFormData = z.infer<typeof classSchema>;

const CreateClassForm: React.FC = () => {
  const router = useRouter();
  const [createClass, { isLoading, isSuccess, isError, error }] =
    useCreateClassMutation();

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      category: "",
      name: "",
      arms: [],
      status: false,
    },
  });

  const onSubmit = async (values: ClassFormData) => {
    try {
      await createClass({
        category: values.category,
        name: values.name,
        arms: values.arms,
        status: values.status ? "active" : "deactivated",
      }).unwrap();
    } catch (error) {
      console.error("Create class error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Class created successfully");
      form.reset();
      router.back(); // Navigate back after success
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form, router]);

  return (
    <div className='w-full max-w-md p-6'>
      <div className='space-y-3 mb-6'>
        <h2 className='text-lg font-semibold'>Create a new class level</h2>
        <p className='text-sm text-gray-500'>
          Enter details for the class level below
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Class Category */}
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter category (Example: Junior secondary school)'
                    {...field}
                    className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Class Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter class name (Example: JSS1)'
                    {...field}
                    className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Arms */}
          <FormField
            control={form.control}
            name='arms'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Arms</FormLabel>
                <div className='flex flex-wrap gap-4'>
                  {["No Arms", "Gold", "Diamond", "Silver"].map((arm) => (
                    <div key={arm} className='flex items-center space-x-2'>
                      <Checkbox
                        id={arm}
                        checked={field.value?.includes(arm)}
                        onCheckedChange={(checked) => {
                          const newArms = checked
                            ? [...(field.value || []), arm]
                            : (field.value || []).filter((a) => a !== arm);
                          field.onChange(newArms);
                        }}
                      />
                      <label htmlFor={arm} className='text-sm'>
                        {arm}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem className='flex items-center justify-between'>
                <FormLabel>Status</FormLabel>
                <div className='flex items-center space-x-2'>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className='text-sm text-gray-500'>
                    {field.value ? "Activated" : "Deactivated"}
                  </span>
                </div>
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className='flex justify-center gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
              className='border-gray-300 text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='bg-blue-500 text-white hover:bg-blue-600'
            >
              {isLoading ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin mr-2' />
                  Create Class
                </>
              ) : (
                "Create Class"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateClassForm;
