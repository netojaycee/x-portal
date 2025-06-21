"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetClassesQuery,
  useGetClassArmsQuery,
  useAssignSubjectMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

interface AssignSubjectFormData {
  classes: { classId: string; classArmIds: string[] }[];
}

interface Class {
  id: string;
  name: string;
}

interface ClassArm {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  assignments: Array<{
    classId: string;
    className: string;
    classArms: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

interface AssignSubjectProps {
  subject: Subject;
  onSuccess: () => void;
}

const AssignSubjectForm: React.FC<AssignSubjectProps> = ({
  subject,
  onSuccess,
}) => {
  const { data: classes = [], isLoading: isLoadingClasses } =
    useGetClassesQuery({});
  const { data: classArms = [], isLoading: isLoadingArms } =
    useGetClassArmsQuery({});

  const [
    assignSubject,
    { isLoading: isSaving, isError, error, isSuccess },
  ] = useAssignSubjectMutation();

  const form = useForm<AssignSubjectFormData>({
    defaultValues: {
      classes: [],
    },
  });

  const { control, handleSubmit, setValue, watch } = form;
  const { fields } = useFieldArray({
    control,
    name: "classes",
  });

  const classArmValues = watch("classes");

  // Initialize form data with classes and pre-selected arms from subject assignments
  React.useEffect(() => {
    if (classes.length > 0) {
      const initialData = classes.map((cls: Class) => {
        // Find existing assignment for this class
        const existingAssignment = subject?.assignments?.find(
          (assignment) => assignment.classId === cls.id
        );

        return {
          classId: cls.id,
          classArmIds: existingAssignment?.classArms?.map((arm) => arm.id) || [],
        };
      });
      setValue("classes", initialData);
    }
  }, [classes, subject?.assignments, setValue]);

  const onSubmit = async (data: AssignSubjectFormData) => {
    try {
      // Filter out classes with no selected arms
      const assignments = data.classes.filter(
        (cls) => cls.classArmIds.length > 0
      );

      if (assignments.length === 0) {
        toast.error("Please select at least one class arm");
        return;
      }

      const payload = {
        subjectId: subject.id,
        assignments,
      };

      // console.log("Payload to assign subject:", payload);
      await assignSubject(payload).unwrap();
    } catch (error) {
      console.error("Assign subject error:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Subject assigned successfully");
      onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, onSuccess]);

  if (isLoadingClasses || isLoadingArms) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-2'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
        {fields.map((field, index) => {
          const classData = classes.find(
            (cls: Class) => cls.id === field.classId
          );
          const currentClassArmIds = classArmValues[index]?.classArmIds || [];

          return (
            <div key={field.id} className='pb-2'>
              <h3 className='text-sm font-medium bg-[#E1E8F8] p-2'>
                {classData?.name}
              </h3>
              <div className='flex flex-wrap gap-4 bg-[#f5f5f5] p-2'>
                {/* "No Arms" option */}
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    className={`${
                      currentClassArmIds.length === 0
                        ? "data-[state=checked]:text-green-700 data-[state=checked]:bg-white data-[state=checked]:border-green-700"
                        : ""
                    } h-4 w-4 border border-black`}
                    id={`classes.${index}.noArms`}
                    checked={currentClassArmIds.length === 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue(`classes.${index}.classArmIds`, []);
                      }
                    }}
                  />
                  <label
                    htmlFor={`classes.${index}.noArms`}
                    className='text-xs'
                  >
                    No Arms
                  </label>
                </div>

                {/* Class Arms */}
                {classArms.map((arm: ClassArm) => (
                  <div key={arm.id} className='flex items-center space-x-2'>
                    <Checkbox
                      className={`${
                        currentClassArmIds.includes(arm.id)
                          ? "data-[state=checked]:text-green-700 data-[state=checked]:bg-white data-[state=checked]:border-green-700"
                          : ""
                      } h-4 w-4 border border-black`}
                      id={`classes.${index}.classArmIds.${arm.id}`}
                      checked={currentClassArmIds.includes(arm.id)}
                      onCheckedChange={(checked) => {
                        const updatedArmIds = checked
                          ? [...currentClassArmIds, arm.id]
                          : currentClassArmIds.filter((id) => id !== arm.id);
                        setValue(`classes.${index}.classArmIds`, updatedArmIds);
                      }}
                    />
                    <label
                      htmlFor={`classes.${index}.classArmIds.${arm.id}`}
                      className='text-xs'
                    >
                      {arm.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className='flex justify-center gap-4 mt-6'>
          <Button
            type='submit'
            disabled={isSaving}
            className='bg-primary text-white hover:bg-blue-600'
          >
            {isSaving ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin mr-2' />
                Assign Subject
              </>
            ) : (
              "Assign Subject"
            )}
          </Button>
          <Button
            variant='outline'
            onClick={() => onSuccess()}
            disabled={isSaving}
            className='border-primary text-primary hover:bg-blue-50'
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssignSubjectForm;
