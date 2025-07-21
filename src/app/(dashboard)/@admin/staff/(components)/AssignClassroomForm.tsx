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
  useAssignTeacherToClassArmMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

interface Assignment {
  classId: string;
  className: string;
  classArmId: string;
  classArmName: string;
}

interface AssignClassroomFormProps {
  staffId: string;
  assignments: Assignment[];
  onSuccess: () => void;
}

type FormData = {
  classes: { classId: string; classArmIds: string[] }[];
};

const AssignClassroomForm: React.FC<AssignClassroomFormProps> = ({
  staffId,
  assignments,
  onSuccess,
}) => {
  const { data: classes = [], isLoading: isLoadingClasses } =
    useGetClassesQuery({});
  const { data: classArms = [], isLoading: isLoadingArms } =
    useGetClassArmsQuery({});

    console.log(assignments, "Assignments from props");
  const [assignTeacher, { isLoading: isSaving, isError, error, isSuccess }] =
    useAssignTeacherToClassArmMutation();

  const form = useForm<FormData>({
    defaultValues: { classes: [] },
  });
  const { control, handleSubmit, setValue, watch } = form;
  const { fields } = useFieldArray({ control, name: "classes" });
  const classArmValues = watch("classes");

  // Initialize form data with classes and pre-selected arms from assignments
  React.useEffect(() => {
    if (classes.length > 0) {
      const initialData = classes.map((cls: any) => {
        // Find all assigned arms for this class
        const assignedArms = assignments
          .filter((a) => a.classId === cls.id)
          .map((a) => a.classArmId);
        return {
          classId: cls.id,
          classArmIds: assignedArms,
        };
      });
      setValue("classes", initialData);
    }
  }, [classes, assignments, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      // Only include classes with at least one arm selected
      const assignmentsToSend = data.classes
        .filter((cls) => cls.classArmIds.length > 0)
        .map((cls) => ({
          classId: cls.classId,
          classArmIds: cls.classArmIds,
        }));
      if (assignmentsToSend.length === 0) {
        toast.error("Please select at least one class arm");
        return;
      }
      const payload = {
        staffId,
        assignments: assignmentsToSend,
      };
      console.log(payload, "Payload to send to API");
        await assignTeacher(payload).unwrap();
    } catch (err) {
      console.error("Error assigning classroom:", err);
      toast.error("Failed to assign classroom. Please try again.");
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Classroom assignments updated successfully");
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
            (cls: any) => cls.id === field.classId
          );
          const currentClassArmIds = classArmValues[index]?.classArmIds || [];
          return (
            <div key={field.id} className='pb-2'>
              <h3 className='text-sm font-medium bg-[#E1E8F8] p-2'>
                {classData?.name}
              </h3>
              <div className='flex flex-wrap gap-4 bg-[#f5f5f5] p-2'>
                {/* No Arms option */}
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
                {classArms.map((arm: any) => (
                  <div key={arm.id} className='flex items-center space-x-2'>
                    <Checkbox
                      className={`${currentClassArmIds.includes(arm.id)
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
                Assign Classroom
              </>
            ) : (
              "Assign Classroom"
            )}
          </Button>
          <Button
            variant='outline'
            onClick={onSuccess}
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

export default AssignClassroomForm;
