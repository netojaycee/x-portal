"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetClassesQuery,
  useAssignArmsMutation,
  useGetClassArmsQuery,
  // useGetSessionClassStudentsQuery,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

interface AssignArmsFormData {
  classes: { classId: string; arms: string[] }[];
}

interface Class {
  id: string;
  name: string;
}

interface Session {
  id: string;
  name: string;
  classes: {
    id: string;
    name: string;
    assignedArms: { id: string; name: string }[];
  }[];
  schoolId: string;
}

interface AssignArmsProps {
  session: Session;
  onSuccess: () => void;
}

const AssignArmsForm: React.FC<AssignArmsProps> = ({ session, onSuccess }) => {
  const { data: classes = [], isLoading: isLoadingClasses } =
    useGetClassesQuery({});
  const { data: availableArms = [], isLoading: isLoadingArms } =
    useGetClassArmsQuery({});
  const [assignArms, { isLoading: isSaving, isError, error, isSuccess }] =
    useAssignArmsMutation();

  const form = useForm<AssignArmsFormData>({
    defaultValues: {
      classes: [],
    },
  });

  const { control, handleSubmit, setValue, watch } = form;
  const { fields } = useFieldArray({
    control,
    name: "classes",
  });

  // Watch the arms field for each class to force re-render
  const armsValues = watch("classes");

  // Set initial form data with classes and pre-selected arms from session
  React.useEffect(() => {
    if (classes.length > 0 && session.classes) {
      const initialData = classes.map((cls: Class) => {
        const sessionClass = session.classes.find((sc) => sc.id === cls.id);
        console.log(session.classes, classes, sessionClass, "FF");

        return {
          classId: cls.id,
          // Map assignedArms objects to their IDs
          arms: sessionClass?.assignedArms.map((arm) => arm.id) || [],
        };

      });
      setValue("classes", initialData);
    }
  }, [classes, session, setValue]);

  const onSubmit = async (data: AssignArmsFormData) => {
    try {
      const payload = {
        sessionId: session.id,
        assignments: data.classes
          .filter((cls) => cls.arms.length > 0)
          .map((cls) => ({
            classId: cls.classId,
            classArmIds: cls.arms,
          })),
      };
      // console.log("Payload to assign arms:", payload);
      await assignArms(payload).unwrap();
    } catch (error) {
      console.error("Assign arms error:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Arms assigned successfully");
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
    <div className='space-y-4'>
      <div className=''>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          {fields.map((field, index) => {
            const classData = classes.find(
              (cls: Class) => cls.id === field.classId
            );
            const currentArms = armsValues[index]?.arms || [];

            return (
              <div key={field.id} className='pb-2'>
                <h3 className='text-sm font-medium bg-[#E1E8F8]'>
                  {classData?.name}
                </h3>
                <div className='flex flex-wrap gap-4 bg-[#f5f5f5] p-1'>
                  {/* "No Arms" option */}
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      className={`${
                        currentArms.length === 0
                          ? "data-[state=checked]:text-green-700 data-[state=checked]:bg-white data-[state=checked]:border-green-700"
                          : ""
                      } h-4 w-4 border border-black`}
                      id={`classes.${index}.arms.noArms`}
                      checked={currentArms.length === 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue(`classes.${index}.arms`, []);
                        }
                      }}
                    />
                    <label
                      htmlFor={`classes.${index}.arms.noArms`}
                      className='text-xs'
                    >
                      No Arms
                    </label>
                  </div>
                  {/* Other arms */}
                  {availableArms.map((arm: { id: string; name: string }) => (
                    <div key={arm.id} className='flex items-center space-x-2'>
                      <Checkbox
                        className={`${
                          currentArms.includes(arm.id)
                            ? "data-[state=checked]:text-green-700 data-[state=checked]:bg-white data-[state=checked]:border-green-700"
                            : ""
                        } h-4 w-4 border border-black`}
                        id={`classes.${index}.arms.${arm.id}`}
                        checked={currentArms.includes(arm.id)}
                        onCheckedChange={(checked) => {
                          const updatedArms = checked
                            ? [...currentArms, arm.id]
                            : currentArms.filter((a) => a !== arm.id);
                          setValue(`classes.${index}.arms`, updatedArms);
                        }}
                      />
                      <label
                        htmlFor={`classes.${index}.arms.${arm.id}`}
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
                  Assign Arms
                </>
              ) : (
                "Assign Arms"
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
    </div>
  );
};

export default AssignArmsForm;
