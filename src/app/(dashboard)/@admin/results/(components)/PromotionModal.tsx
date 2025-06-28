"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useGetSessionsQuery,
  useGetSessionClassesQuery,
  usePromoteStudentsMutation,
} from "@/redux/api";
import { toast } from "sonner";

const PromotionModalSchema = z.object({
  newSessionId: z
    .string()
    .min(1, { message: "Please select new academic session" }),
  newClassId: z.string().min(1, { message: "Please select new class" }),
  newClassArmId: z.string().min(1, { message: "Please select new class arm" }),
});

type PromotionModalValues = z.infer<typeof PromotionModalSchema>;

// Define interfaces for data structure
interface ClassArm {
  id: string;
  name: string;
}

interface ClassData {
  id: string;
  name: string;
  classArms: ClassArm[];
}

interface Session {
  id: string;
  name: string;
  status: string;
}

interface Student {
  id: string;
  promoted: boolean;
}

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSessionId: string;
  currentClassId: string;
  currentClassArmId: string;
  graduated: boolean;
  students: Student[];
  onSuccess?: () => void;
}

export function PromotionModal({
  isOpen,
  onClose,
  currentSessionId,
  currentClassId,
  currentClassArmId,
  graduated,
  students,
  onSuccess,
}: PromotionModalProps) {
  // State to track selections
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const form = useForm<PromotionModalValues>({
    resolver: zodResolver(PromotionModalSchema),
    defaultValues: {
      newSessionId: "",
      newClassId: "",
      newClassArmId: "",
    },
  });

  // RTK Queries
  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});

  const { data: classesData, isLoading: classesLoading } =
    useGetSessionClassesQuery(selectedSessionId, {
      skip: !selectedSessionId,
    });

  // RTK Mutation
  const [promoteStudents, { isLoading: isPromoting }] =
    usePromoteStudentsMutation();

  // Get available classes
  const availableClasses = useMemo(() => {
    return classesData?.data?.classes || [];
  }, [classesData]);

  // Get available arms for the selected class
  const availableArms = useMemo(() => {
    if (!selectedClassId || !classesData?.data?.classes) return [];

    const selectedClass = classesData.data.classes.find(
      (cls: ClassData) => cls.id === selectedClassId
    );
    return selectedClass?.classArms || [];
  }, [classesData, selectedClassId]);

  // When session selection changes
  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    form.setValue("newSessionId", sessionId);
    form.setValue("newClassId", "");
    form.setValue("newClassArmId", "");
    setSelectedClassId("");
  };

  // When class selection changes
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    form.setValue("newClassId", classId);
    form.setValue("newClassArmId", "");
  };

  const onSubmit = async (values: PromotionModalValues) => {
    try {
      const promotionData = {
        studentPromotions: students.map((student) => ({
          studentId: student.id,
          promoteAction: student.promoted,
        })),
        newSessionId: values.newSessionId,
        newClassId: values.newClassId,
        newClassArmId: values.newClassArmId,
        currentSessionId,
        currentClassId,
        currentClassArmId,
        graduatingClass: graduated,
      };

      await promoteStudents(promotionData).unwrap();

      toast.success("Students promoted successfully!");
      onSuccess?.(); // Call the success callback if provided
      onClose();

      // Reset form
      form.reset();
      setSelectedSessionId("");
      setSelectedClassId("");
    } catch (error: any) {
      console.error("Error promoting students:", error);
      toast.error(
        error?.data?.message || "Failed to promote students. Please try again."
      );
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setSelectedSessionId("");
    setSelectedClassId("");
  };

  // Count students to be promoted
  const studentsToPromote = students.filter((s) => s.promoted).length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Promote Students</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Summary Information */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h4 className='font-medium text-sm mb-2'>Promotion Summary</h4>
            <div className='text-sm text-gray-600 space-y-1'>
              <div>Total Students: {students.length}</div>
              <div>Students to Promote: {studentsToPromote}</div>
              <div className='flex items-center gap-2'>
                <span>Graduating Class:</span>
                <Switch checked={graduated} disabled className='scale-75' />
                <span>{graduated ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Current Class Information */}
              <div className='bg-blue-50 p-4 rounded-lg'>
                <h4 className='font-medium text-sm mb-2 text-blue-800'>
                  Current Class Information
                </h4>
                <div className='text-sm text-blue-600 space-y-1'>
                  <div>Session ID: {currentSessionId}</div>
                  <div>Class ID: {currentClassId}</div>
                  <div>Class Arm ID: {currentClassArmId}</div>
                </div>
              </div>

              <div className='border-t pt-4'>
                <h4 className='font-medium text-sm mb-4'>
                  Select New Class Information
                </h4>

                {/* New Academic Session Field */}
                <FormField
                  control={form.control}
                  name='newSessionId'
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>New Academic Session</FormLabel>
                      <Select
                        onValueChange={handleSessionChange}
                        value={field.value}
                        disabled={sessionsLoading}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select new academic session' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sessionsLoading ? (
                            <SelectItem value='loading' disabled>
                              Loading sessions...
                            </SelectItem>
                          ) : sessionsData?.data?.length ? (
                            sessionsData.data.map((session: Session) => (
                              <SelectItem key={session.id} value={session.id}>
                                {session.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value='empty' disabled>
                              No sessions available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Class Field */}
                <FormField
                  control={form.control}
                  name='newClassId'
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>New Class</FormLabel>
                      <Select
                        onValueChange={handleClassChange}
                        value={field.value}
                        disabled={!selectedSessionId || classesLoading}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select new class' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!selectedSessionId ? (
                            <SelectItem value='select-session-first' disabled>
                              Select academic session first
                            </SelectItem>
                          ) : classesLoading ? (
                            <SelectItem value='loading' disabled>
                              Loading classes...
                            </SelectItem>
                          ) : availableClasses.length > 0 ? (
                            availableClasses.map((cls: ClassData) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value='empty' disabled>
                              No classes available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Class Arm Field */}
                <FormField
                  control={form.control}
                  name='newClassArmId'
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>New Class Arm</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedClassId}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select new class arm' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!selectedClassId ? (
                            <SelectItem value='select-class-first' disabled>
                              Select a class first
                            </SelectItem>
                          ) : availableArms.length > 0 ? (
                            availableArms.map((arm: ClassArm) => (
                              <SelectItem key={arm.id} value={arm.id}>
                                {arm.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value='no-arms' disabled>
                              No class arms available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end space-x-2 pt-4'>
                <Button type='button' variant='outline' onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isPromoting || studentsToPromote === 0}
                  className='bg-[#5C6AC4] hover:bg-[#5C6AC4]/90'
                >
                  {isPromoting
                    ? "Promoting..."
                    : `Promote ${studentsToPromote} Students`}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
