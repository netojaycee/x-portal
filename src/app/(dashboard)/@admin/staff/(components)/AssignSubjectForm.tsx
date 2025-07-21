"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAssignTeacherToSubjectMutation,
  useGetClassSubjectsQuery,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

interface Assignment {
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  classArmId: string;
  classArmName: string;
}

interface AssignSubjectFormProps {
  staffId: string;
  assignments: Assignment[];
  onSuccess: () => void;
}



const AssignSubjectForm: React.FC<AssignSubjectFormProps> = ({
  staffId,
  assignments,
  onSuccess,
}) => {
  const { data, isLoading: isLoadingSubjectsData } = useGetClassSubjectsQuery(
    {}
  );
  const subjectsData = React.useMemo(() => data?.data?.subjects || [], [data]);
  console.log(subjectsData, "subjectsdatadata");

  const [assignTeacher, { isLoading: isSaving, isError, error, isSuccess }] =
    useAssignTeacherToSubjectMutation();

  // Build a flat list of all subject/class/classArm combos for selection
  const [selected, setSelected] = React.useState<{
    [key: string]: boolean;
  }>({});

  // Build all possible combos for rendering
  const allCombos = React.useMemo(() => {
    const combos: Array<{
      subjectId: string;
      subjectName: string;
      classId: string;
      className: string;
      armId: string;
      armName: string;
    }> = [];
    for (const subject of subjectsData) {
      for (const cls of subject.assignments) {
        for (const arm of cls.classArms) {
          combos.push({
            subjectId: subject.id,
            subjectName: subject.name,
            classId: cls.classId,
            className: cls.className,
            armId: arm.id,
            armName: arm.name,
          });
        }
      }
    }
    return combos;
  }, [subjectsData]);

  // On data load, set selection from assignments prop
  React.useEffect(() => {
    if (!subjectsData.length) {
      setSelected({});
      return;
    }
    // Build a set of comboKeys from assignments prop
    const assignedKeys: { [key: string]: boolean } = {};
    for (const a of assignments) {
      const comboKey = `${a.subjectId}|${a.classId}|${a.classArmId}`;
      assignedKeys[comboKey] = true;
    }
    setSelected(assignedKeys);
  }, [subjectsData, assignments]);

  const handleToggle = (comboKey: string) => {
    setSelected((prev) => ({ ...prev, [comboKey]: !prev[comboKey] }));
  };

  const onSubmit = async () => {
    try {
      // Group selected combos by subject/class
      const assignmentsMap: {
        [subjectId: string]: {
          [classId: string]: string[];
        };
      } = {};
      for (const combo of allCombos) {
        const comboKey = `${combo.subjectId}|${combo.classId}|${combo.armId}`;
        if (selected[comboKey]) {
          if (!assignmentsMap[combo.subjectId])
            assignmentsMap[combo.subjectId] = {};
          if (!assignmentsMap[combo.subjectId][combo.classId])
            assignmentsMap[combo.subjectId][combo.classId] = [];
          assignmentsMap[combo.subjectId][combo.classId].push(combo.armId);
        }
      }
      // Build assignments array for API
      const assignmentsToSend = Object.entries(assignmentsMap).flatMap(
        ([subjectId, classObj]) =>
          Object.entries(classObj).map(([classId, classArmIds]) => ({
            subjectId,
            classId,
            classArmIds,
          }))
      );
      if (assignmentsToSend.length === 0) {
        toast.error("Please select at least one subject/class/arm");
        return;
      }
      const payload = {
        staffId,
        assignments: assignmentsToSend,
      };
      // console.log(payload, "Payload to send to API");
      await assignTeacher(payload).unwrap();
    } catch (err) {
      console.error("Error assigning subject:", err);
      toast.error("Failed to assign subject. Please try again.");
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Subject assignments updated successfully");
      onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, onSuccess]);

  if (isLoadingSubjectsData) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-2'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className='space-y-2'
      >
        {allCombos.length === 0 ? (
          <div className='text-center text-gray-500'>
            No subjects/classes/arms found.
          </div>
        ) : (
          <div className='space-y-4'>
            {Array.from(new Set(allCombos.map((c) => c.subjectId))).map(
              (subjectId) => {
                const subjectCombos = allCombos.filter(
                  (c) => c.subjectId === subjectId
                );
                return (
                  <div key={subjectId} className='pb-2 border-b mb-2'>
                    <h3 className='text-sm font-semibold bg-[#E1E8F8] p-2'>
                      {subjectCombos[0].subjectName}
                    </h3>
                    {Array.from(
                      new Set(subjectCombos.map((c) => c.classId))
                    ).map((classId) => {
                      const classCombos = subjectCombos.filter(
                        (c) => c.classId === classId
                      );
                      return (
                        <div key={classId} className='mb-2'>
                          <div className='font-medium text-xs mb-1'>
                            {classCombos[0].className}
                          </div>
                          <div className='flex flex-wrap gap-4 bg-[#f5f5f5] p-2'>
                            {classCombos.map((combo) => {
                              const comboKey = `${combo.subjectId}|${combo.classId}|${combo.armId}`;
                              return (
                                <div
                                  key={comboKey}
                                  className='flex items-center space-x-2'
                                >
                                  <Checkbox
                                    className='h-4 w-4 border border-black'
                                    id={comboKey}
                                    checked={!!selected[comboKey]}
                                    onCheckedChange={() =>
                                      handleToggle(comboKey)
                                    }
                                  />
                                  <label htmlFor={comboKey} className='text-xs'>
                                    {combo.armName}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            )}
          </div>
        )}
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

export default AssignSubjectForm;
