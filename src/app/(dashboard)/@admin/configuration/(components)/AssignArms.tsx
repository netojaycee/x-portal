"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetClassesQuery, useAssignArmsMutation } from "@/redux/api"; // Assume these are defined in your RTK setup

interface AssignArmsFormData {
  classes: { classId: string; arms: string[] }[];
}

const AssignArms: React.FC = () => {
  const router = useRouter();
  const { data: classes = [], isLoading } = useGetClassesQuery(); // Simulated RTK Query
  const [assignArms, { isLoading: isSaving, isError, error, isSuccess }] =
    useAssignArmsMutation();

  const form = useForm<AssignArmsFormData>({
    defaultValues: {
      classes: [],
    },
  });

  const { control, handleSubmit } = form;
  const { fields } = useFieldArray({
    control,
    name: "classes",
  });

  // Simulate initial data from endpoint (replace with real API data)
  React.useEffect(() => {
    if (classes.length > 0) {
      const initialData = classes.map((cls) => ({
        classId: cls.id,
        arms: [],
      }));
      form.reset({ classes: initialData });
    }
  }, [classes, form]);

  const onSubmit = async (data: AssignArmsFormData) => {
    try {
      const payload = data.classes.map((cls) => ({
        classId: cls.classId,
        arms: cls.arms,
      }));
      await assignArms(payload).unwrap();
    } catch (error) {
      console.error("Assign arms error:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Arms assigned successfully");
      form.reset();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-4 p-6'>
      <div className='flex items-center justify-between mb-4'>
        <Button variant='ghost' onClick={() => router.back()}>
          <ChevronLeft className='mr-2 h-4 w-4' /> Back
        </Button>
      </div>
      <div className='space-y-3'>
        <h2 className='text-lg font-semibold'>Assign Arms</h2>
        <p className='text-sm text-gray-500'>
          Select Arms for class available for this session
        </p>
      </div>
      <Card className='p-4'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {fields.map((field, index) => (
            <div key={field.id} className='border-b border-gray-200 pb-2'>
              <h3 className='text-md font-medium mb-2'>
                {classes[index]?.name}
              </h3>
              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    {...form.register(`classes.${index}.arms`)}
                    value='No Arms'
                  />
                  <span className='text-sm'>No Arms</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    {...form.register(`classes.${index}.arms`)}
                    value='Gold'
                  />
                  <span className='text-sm'>Gold</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    {...form.register(`classes.${index}.arms`)}
                    value='Diamond'
                  />
                  <span className='text-sm'>Diamond</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    {...form.register(`classes.${index}.arms`)}
                    value='Silver'
                  />
                  <span className='text-sm'>Silver</span>
                </div>
              </div>
            </div>
          ))}
          <div className='flex justify-center gap-4 mt-6'>
            <Button
              type='submit'
              disabled={isSaving}
              className='bg-blue-500 text-white hover:bg-blue-600'
            >
              {isSaving ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin mr-2' />
                  Create Session
                </>
              ) : (
                "Create Session"
              )}
            </Button>
            <Button
              variant='outline'
              onClick={() => router.back()}
              className='border-blue-500 text-blue-500 hover:bg-blue-50'
            >
              Back
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AssignArms;
