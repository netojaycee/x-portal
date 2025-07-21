"use client";
import React, { useState } from "react";
import {
  useGetClassArmTeachersQuery,
  useGetTeachersQuery,
  useAssignTeacherToClassArmMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import StaffCard from "./StaffCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog as ConfirmDialog,
  DialogContent as ConfirmDialogContent,
  DialogHeader as ConfirmDialogHeader,
  DialogTitle as ConfirmDialogTitle,
} from "@/components/ui/dialog";

const assignSchema = z.object({
  staffId: z.string().min(1, "Please select a teacher"),
});

type AssignFormValues = z.infer<typeof assignSchema>;

export const TeacherListTabContent = ({
  classId,
  classArmId,
}: {
  classId: string;
  classArmId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [assignTeacher, { isLoading: isAssigning }] =
    useAssignTeacherToClassArmMutation();
  const [removingTeacherId, setRemovingTeacherId] = useState<string | null>(
    null
  );

  const { data: teachersData, isLoading: teachersLoading } =
    useGetClassArmTeachersQuery(
      { classId, classArmId },
      { skip: !classId || !classArmId }
    );

  const { data: allTeachersData, isLoading: allTeachersLoading } =
    useGetTeachersQuery({}, { skip: !isModalOpen });

  console.log(teachersData, "fff");
  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: { staffId: "" },
  });

  const onSubmit = async (values: AssignFormValues) => {
    try {
      const assignmentsToSend = [
        {
          classId,
          classArmIds: [classArmId],
        },
      ];
      const payload = {
        staffId: values.staffId,
        assignments: assignmentsToSend,
      };
      console.log(payload, "Payload to send to API");
      await assignTeacher(payload).unwrap();
      toast.success("Teacher assigned successfully!");
      setIsModalOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign teacher.");
    }
  };

  const handleRemoveTeacher = (teacherId: string) => {
    setRemovingTeacherId(teacherId);
    setShowRemoveModal(true);
  };

  const confirmRemoveTeacher = async () => {
    if (!removingTeacherId) return;
    try {
      const assignmentsToSend = [
        {
          classId,
          classArmIds: [classArmId],
        },
      ];
      const payload = {
        staffId: removingTeacherId,
        assignments: assignmentsToSend,
        remove: true,
      };
      await assignTeacher(payload).unwrap();
      toast.success("Teacher removed successfully!");
      setShowRemoveModal(false);
      setRemovingTeacherId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove teacher.");
    }
  };

  if (teachersLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className='p-4 relative'>
      {/* Assign Teacher Button */}
      <div className='flex justify-end mb-4'>
        <Button size='sm' onClick={() => setIsModalOpen(true)}>
          Assign Teacher
        </Button>
      </div>

      {/* Staff Cards */}
      <div className='grid  gap-4'>
        {teachersData?.staff ? (
          <StaffCard
            key={teachersData.staff.id}
            name={`${teachersData.staff.user.firstname} ${teachersData.staff.user.lastname}`}
            email={teachersData.staff.user.email}
            gender={teachersData.staff.user.gender}
            role={teachersData.staff.user.role}
            phone={teachersData.staff.user.contact}
            status={teachersData.staff.user.isActive ? "active" : "inactive"}
            avatarUrl={teachersData.staff.user.avatar}
            onMenuClick={() => handleRemoveTeacher(teachersData.staff.id)}
          />
        ) : (
          <div className='text-gray-500'>No class teacher assigned.</div>
        )}
      </div>

      {/* Assign Teacher Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Assign Teacher to Class Arm</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block mb-2 text-sm font-medium'>
                Select Teacher
              </label>
              <Select
                value={form.watch("staffId")}
                onValueChange={(val) => form.setValue("staffId", val)}
                disabled={allTeachersLoading}
              >
                <SelectTrigger className='w-1/2'>
                  <SelectValue placeholder='-- Select --' />
                </SelectTrigger>
                <SelectContent>
                  {allTeachersData?.data?.data.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstname} {teacher.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.staffId && (
                <p className='text-red-500 text-xs mt-1'>
                  {form.formState.errors.staffId.message}
                </p>
              )}
            </div>
            <Button
              type='submit'
              disabled={!form.watch("staffId") || isAssigning}
              className='w-full flex items-center justify-center'
            >
              {isAssigning ? (
                <Loader2 className='animate-spin mr-2 h-4 w-4' />
              ) : null}
              {isAssigning ? "Assigning..." : "Assign Teacher"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove Teacher Confirmation Modal */}
      <ConfirmDialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
        <ConfirmDialogContent className='max-w-md'>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Remove Teacher</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div className='mb-4'>
            <p>
              Are you sure you want to remove this teacher from this class arm?
            </p>
          </div>
          <div className='flex gap-2 justify-end'>
            <Button variant='outline' onClick={() => setShowRemoveModal(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={confirmRemoveTeacher}
              disabled={isAssigning}
            >
              {isAssigning ? (
                <Loader2 className='animate-spin mr-2 h-4 w-4' />
              ) : null}
              {isAssigning ? "Removing..." : "Yes, Remove"}
            </Button>
          </div>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  );
};
