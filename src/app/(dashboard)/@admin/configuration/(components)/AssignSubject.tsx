"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetSessionsQuery,
  useAssignSubjectToArmsMutation,
} from "@/redux/api"; // Updated import
import LoaderComponent from "@/components/local/LoaderComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface AssignSubjectFormData {
  subjectId: string;
  classes: { classId: string; arms: string[] }[];
}

interface Class {
  id: string;
  name: string;
  category: string; // junior or senior
  assignedArms: string[];
}

// interface ClassArm {
//   id: string;
//   name: string;
//   schoolId: string;
// }

interface Session {
  id: string;
  name: string;
  status: string;
  terms: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
  }[];
  classes: Class[];
}

interface AssignSubjectProps {
  subjectId: string;
  onSuccess: () => void;
}

const AssignSubjectForm: React.FC<AssignSubjectProps> = ({
  subjectId,
  onSuccess,
}) => {
  const userData = useSelector((state: RootState) => state.user.user);
  const { data: sessions = [], isLoading: isLoadingSessions } =
    useGetSessionsQuery({}, { skip: !userData?.schoolId });

  const currentSession = React.useMemo(() => {
    // const now = new Date(); // Current date: 01:47 PM WAT, May 28, 2025
    return sessions.data.find((session: Session) => session.status === "Active");
  }, [sessions]);

  const availableArms = React.useMemo(() => {
    return (
      currentSession?.classes
        .flatMap((cls: Class) => cls.assignedArms)
        .filter((armId: string, index: number, self: any) => self.indexOf(armId) === index) || []
    );
  }, [currentSession]);

  const [
    assignSubjectToArms,
    { isLoading: isSaving, isError, error, isSuccess },
  ] = useAssignSubjectToArmsMutation();

  const form = useForm<AssignSubjectFormData>({
    defaultValues: {
      subjectId,
      classes: [],
    },
  });

  const { control, handleSubmit, setValue, watch } = form;
  const { fields } = useFieldArray({
    control,
    name: "classes",
  });

  const armsValues = watch("classes");
  const [selectAll, setSelectAll] = React.useState(false);

  React.useEffect(() => {
    if (currentSession?.classes.length > 0) {
      const initialData = currentSession.classes.map((cls: Class) => ({
        classId: cls.id,
        arms: cls.assignedArms || [], // Use existing assigned arms
      }));
      setValue("classes", initialData);
    }
  }, [currentSession, setValue]);

  React.useEffect(() => {
    if (selectAll && currentSession?.classes.length > 0) {
      const allArms = availableArms;
      fields.forEach((field, index) => {
        setValue(`classes.${index}.arms`, allArms);
      });
    } else if (!selectAll) {
      fields.forEach((field, index) => {
        setValue(`classes.${index}.arms`, []);
      });
    }
  }, [selectAll, fields, setValue, availableArms, currentSession]);

  const onSubmit = async (data: AssignSubjectFormData) => {
    try {
      const payload = {
        subjectId: data.subjectId,
        sessionId: currentSession?.id,
        assignments: data.classes.map((cls) => ({
          classId: cls.classId,
          arms: cls.arms,
        })),
      };
      console.log("Payload to assign subject to arms:", payload, assignSubjectToArms);
      // await assignSubjectToArms(payload).unwrap();
    } catch (error) {
      console.error("Assign subject to arms error:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Subject assigned to arms successfully");
      onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, onSuccess]);

  if (isLoadingSessions) {
    return <LoaderComponent />;
  }

  if (!currentSession) {
    return <div>No active session found</div>;
  }

  return (
    <div className='space-y-4'>
      <div className=''>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='selectAll'
              checked={selectAll}
              onCheckedChange={(checked) => setSelectAll(checked as boolean)}
            />
            <label htmlFor='selectAll' className='text-sm font-medium'>
              Select All Arms
            </label>
          </div>
          {fields.map((field, index) => {
            const classData = currentSession.classes.find(
              (cls: Class) => cls.id === field.classId
            );
            const currentArms = armsValues[index]?.arms || [];

            return (
              <div key={field.id} className='pb-2'>
                <h3 className='text-sm font-medium bg-[#E1E8F8] p-2'>
                  {classData?.name}
                </h3>
                <div className='flex flex-wrap gap-4 bg-[#f5f5f5] p-2'>
                  {availableArms.map((armId: string) => {
                    const arm = currentSession.classes
                      .flatMap((cls: Class) => cls.assignedArms)
                      .find((id: string) => id === armId);
                    return (
                      <div key={armId} className='flex items-center space-x-2'>
                        <Checkbox
                          className={`${
                            currentArms.includes(armId)
                              ? "data-[state=checked]:text-green-700 data-[state=checked]:bg-white data-[state=checked]:border-green-700"
                              : ""
                          } h-4 w-4 border border-black`}
                          id={`classes.${index}.arms.${armId}`}
                          checked={currentArms.includes(armId)}
                          onCheckedChange={(checked) => {
                            const updatedArms = checked
                              ? [...currentArms, armId]
                              : currentArms.filter((a) => a !== armId);
                            setValue(`classes.${index}.arms`, updatedArms);
                          }}
                        />
                        <label
                          htmlFor={`classes.${index}.arms.${armId}`}
                          className='text-xs'
                        >
                          {arm || "Unknown Arm"}
                        </label>
                      </div>
                    );
                  })}
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
    </div>
  );
};

export default AssignSubjectForm;