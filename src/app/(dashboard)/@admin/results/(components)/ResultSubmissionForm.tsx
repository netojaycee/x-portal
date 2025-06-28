"use client";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetSessionsQuery,
  useGetTermsQuery,
  useGetSessionClassesQuery,
  useGetMarkingSchemeByClassQuery,
  useComputeResultMutation,
} from "@/redux/api";

const ResultSubmissionFormSchema = z.object({
  sessionId: z.string().min(1, { message: "Please select academic year" }),
  termId: z.string().min(1, { message: "Please select term" }),
  classId: z.string().min(1, { message: "Please select class" }),
  classArmId: z.string().min(1, { message: "Please select class arm" }),
  markingSchemeComponentId: z
    .string()
    .min(1, { message: "Please select marking scheme component" }),
});

type ResultSubmissionFormValues = z.infer<typeof ResultSubmissionFormSchema>;

// Define interfaces for data structure
interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface ClassArm {
  id: string;
  name: string;
}

interface ClassData {
  id: string;
  name: string;
  classArms: ClassArm[];
}

interface MarkingSchemeComponent {
  id: string;
  name: string;
  score: number;
  type: "CA" | "EXAM";
  subComponents: Array<{
    id: string;
    name: string;
    score: number;
  }>;
}

interface ResultSubmissionFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function ResultSubmissionForm({
  onClose,
  onSuccess,
}: ResultSubmissionFormProps) {
  // State to track selections
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedTermId, setSelectedTermId] = useState<string>("");

  const form = useForm<ResultSubmissionFormValues>({
    resolver: zodResolver(ResultSubmissionFormSchema),
    defaultValues: {
      sessionId: "",
      termId: "",
      classId: "",
      classArmId: "",
      markingSchemeComponentId: "",
    },
  });

  // API queries
  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});
  const { data: termsData, isLoading: termsLoading } = useGetTermsQuery({});
  const { data: classesData, isLoading: classesLoading } =
    useGetSessionClassesQuery(selectedSessionId, { skip: !selectedSessionId });
  const { data: markingSchemeData, isLoading: markingSchemesLoading } =
    useGetMarkingSchemeByClassQuery(
      { classId: selectedClassId, termDefinitionId: selectedTermId },
      { skip: !selectedClassId || !selectedTermId }
    );

  console.log(markingSchemeData);
  // Mutation
  const [computeResult, { isLoading: isComputing }] =
    useComputeResultMutation();

  // Get available sessions
  const availableSessions = useMemo(() => {
    return sessionsData?.data || [];
  }, [sessionsData]);

  // Get available terms
  const availableTerms = useMemo(() => {
    return termsData?.data || [];
  }, [termsData]);

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

  // Get available marking scheme components
  const availableMarkingSchemeComponents = useMemo(() => {
    return markingSchemeData?.data?.markingScheme?.components || [];
  }, [markingSchemeData]);

  // Handle session selection change
  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    form.setValue("sessionId", sessionId);
    form.setValue("termId", "");
    form.setValue("classId", "");
    form.setValue("classArmId", "");
    form.setValue("markingSchemeComponentId", "");
    setSelectedClassId("");
    setSelectedTermId("");
  };

  // Handle term selection change
  const handleTermChange = (termId: string) => {
    setSelectedTermId(termId);
    form.setValue("termId", termId);
    form.setValue("markingSchemeComponentId", "");
  };

  // Handle class selection change
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    form.setValue("classId", classId);
    form.setValue("classArmId", "");
    form.setValue("markingSchemeComponentId", "");
  };

  const onSubmit = async (values: ResultSubmissionFormValues) => {
    try {
      // Find the selected component to determine the result scope
      const selectedComponent = availableMarkingSchemeComponents.find(
        (component: MarkingSchemeComponent) =>
          component.id === values.markingSchemeComponentId
      );


      await computeResult({
        sessionId: values.sessionId,
        termId: values.termId,
        classId: values.classId,
        classArmId: values.classArmId,
        resultTypeId: values.markingSchemeComponentId,
        resultScope: selectedComponent?.type,
      }).unwrap();

      toast.success("Result computed successfully!");
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to compute result. Please try again."
      );
    }
  };

  return (
    <div className='space-y-4'>
      {/* <div className='space-y-2'>
        <h3 className='text-lg font-semibold flex items-center gap-2'>
          <Calculator className='h-5 w-5 text-primary' />
          Submit Result for Computation
        </h3>
        <p className='text-sm text-muted-foreground'>
          Select the academic session, term, class, class arm, and marking
          scheme to compute results.
        </p>
      </div> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Academic Session */}
          <FormField
            control={form.control}
            name='sessionId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Session</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={handleSessionChange}
                  disabled={sessionsLoading}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select academic session' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSessions.map((session: any) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Term */}
          <FormField
            control={form.control}
            name='termId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Term</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={handleTermChange}
                  disabled={termsLoading || !selectedSessionId}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select term' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTerms.map((term: Term) => (
                      <SelectItem key={term.id} value={term.id}>
                        {term.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Class */}
          <FormField
            control={form.control}
            name='classId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={handleClassChange}
                  disabled={classesLoading || !selectedSessionId}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select class' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableClasses.map((classItem: ClassData) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Class Arm */}
          <FormField
            control={form.control}
            name='classArmId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Arm</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedClassId || availableArms.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select class arm' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableArms.map((arm: ClassArm) => (
                      <SelectItem key={arm.id} value={arm.id}>
                        {arm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Marking Scheme Component */}
          <FormField
            control={form.control}
            name='markingSchemeComponentId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marking Scheme Component (Result Type)</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={
                    markingSchemesLoading || !selectedClassId || !selectedTermId
                  }
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select marking scheme component' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableMarkingSchemeComponents.map(
                      (component: MarkingSchemeComponent) => (
                        <SelectItem key={component.id} value={component.id}>
                          <div className='flex items-center justify-between w-full'>
                            <span>{component.name}</span>
                            <span className='text-xs text-muted-foreground ml-2'>
                              ({component.score} marks - {component.type})
                            </span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className='flex items-center justify-end space-x-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isComputing}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isComputing}>
              {isComputing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isComputing ? "Computing..." : "Compute Result"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
