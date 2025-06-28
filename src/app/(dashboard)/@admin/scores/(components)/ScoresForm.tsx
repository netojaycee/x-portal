"use client";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import {
  useGetSessionsQuery,
  useGetTermsQuery,
  useGetSessionClassesQuery,
  useGetClassSubjectsQuery,
} from "@/redux/api";
import { encodeScoreContext, type ScoreContext } from "@/lib/contextUtils";

const ScoreFormSchema = z.object({
  scoreType: z.enum(["subject", "class"], {
    required_error: "Please select score type",
  }),
  sessionId: z.string().min(1, { message: "Please select academic year" }),
  termId: z.string().min(1, { message: "Please select term" }),
  classId: z.string().min(1, { message: "Please select class" }),
  classArmId: z.string().min(1, { message: "Please select class arm" }),
  subjectId: z.string().optional(),
});

type ScoreFormValues = z.infer<typeof ScoreFormSchema>;

// Define interfaces for session data structure
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
  assignedArms: ClassArm[];
}

// interface Subject {
//   id: string;
//   name: string;
//   code: string;
// }

interface Session {
  id: string;
  name: string;
  status: string;
  terms: Term[];
  classes: ClassData[];
}

interface ScoreFormProps {
  onClose?: () => void;
}

export function ScoreForm({ onClose }: ScoreFormProps) {
  const router = useRouter();

  // State to track selections
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedScoreType, setSelectedScoreType] = useState<string>("");

  const form = useForm<ScoreFormValues>({
    resolver: zodResolver(ScoreFormSchema),
    defaultValues: {
      scoreType: undefined,
      sessionId: "",
      termId: "",
      classId: "",
      classArmId: "",
      subjectId: "",
    },
  });

  // Fetch sessions
  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});

  // Fetch terms for selected session
  const { data: termsData, isLoading: termsLoading } = useGetTermsQuery({});

  // Fetch classes for selected session
  const { data: classesData, isLoading: classesLoading } =
    useGetSessionClassesQuery(selectedSessionId, {
      skip: !selectedSessionId,
    });

  console.log(classesData, "classes");

  // Fetch subjects for selected class and class arm
  const { data: subjectsData, isLoading: subjectsLoading } =
    useGetClassSubjectsQuery(
      {
        classId: selectedClassId,
        classArmId: form.watch("classArmId"),
      },
      {
        skip: !selectedClassId || !form.watch("classArmId"),
      }
    );

  console.log(subjectsData, "subjects");

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
    // console.log(selectedClass.classArms[0], "selectedClassId");
    return (
      selectedClass?.classArms.map((arm: ClassArm) => ({
        id: arm.id,
        name: arm.name,
      })) || []
    );
  }, [classesData, selectedClassId]);

  // Get available subjects
  const availableSubjects = useMemo(() => {
    return subjectsData?.data?.subjects || [];
  }, [subjectsData]);

  // When score type changes
  const handleScoreTypeChange = (scoreType: string) => {
    setSelectedScoreType(scoreType);
    form.setValue("scoreType", scoreType as "subject" | "class");
    // Reset other fields when score type changes
    form.setValue("sessionId", "");
    form.setValue("termId", "");
    form.setValue("classId", "");
    form.setValue("classArmId", "");
    form.setValue("subjectId", "");
    setSelectedSessionId("");
    setSelectedClassId("");
  };

  // When session selection changes
  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    form.setValue("sessionId", sessionId);
    form.setValue("termId", "");
    form.setValue("classId", "");
    form.setValue("classArmId", "");
    form.setValue("subjectId", "");
    setSelectedClassId("");
  };

  // When class selection changes
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    form.setValue("classId", classId);
    form.setValue("classArmId", "");
    form.setValue("subjectId", "");
  };

  const onSubmit = (values: ScoreFormValues) => {
    // Get selected items data for context
    const selectedSession = sessionsData?.data?.find(
      (s: Session) => s.id === values.sessionId
    );
    const selectedTerm = availableTerms.find(
      (t: Term) => t.id === values.termId
    );
    const selectedClass = availableClasses.find(
      (c: ClassData) => c.id === values.classId
    );
    const selectedClassArm = availableArms.find(
      (a: ClassArm) => a.id === values.classArmId
    );
    const selectedSubject = availableSubjects.find(
      (s: any) => s.subject.id === values.subjectId
    );

    // Build context object with both IDs and names
    const context: ScoreContext = {
      subjectId: values.subjectId || "",
      subjectName: selectedSubject?.subject.name || "",
      sessionId: values.sessionId,
      sessionName: selectedSession?.name || "",
      classArmId: values.classArmId,
      classArmName: selectedClassArm?.name || "",
      classId: values.classId,
      className: selectedClass?.name || "",
      termId: values.termId,
      termName: selectedTerm?.name || "",
    };

    // Encode context and build query parameters
    const encodedContext = encodeScoreContext(context);

    // Use individual parameters as fallback for backward compatibility
    const queryParams = new URLSearchParams({
      context: encodedContext,
      // Fallback parameters
      sessionId: values.sessionId,
      termId: values.termId,
      classId: values.classId,
      classArmId: values.classArmId,
      ...(values.scoreType === "subject" &&
        values.subjectId && {
          subjectId: values.subjectId,
        }),
    });

    // Navigate to score entry page
    const route =
      values.scoreType === "subject"
        ? "/scores/subject-scores"
        : "/scores/class-scores";

    router.push(`${route}?${queryParams.toString()}`);
    // onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-2'>
        {/* Score Type Field */}
        <FormField
          control={form.control}
          name='scoreType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score Type</FormLabel>
              <Select
                onValueChange={(value) => handleScoreTypeChange(value)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select score type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='subject'>Subject Scores</SelectItem>
                  <SelectItem value='class'>Class Scores</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Academic Year Field */}
        <FormField
          control={form.control}
          name='sessionId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              <Select
                onValueChange={(value) => handleSessionChange(value)}
                value={field.value}
                disabled={sessionsLoading || !selectedScoreType}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select academic year' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!selectedScoreType ? (
                    <SelectItem value='select-type-first' disabled>
                      Select score type first
                    </SelectItem>
                  ) : sessionsLoading ? (
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

        {/* Term Field */}
        <FormField
          control={form.control}
          name='termId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedSessionId || termsLoading}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select term' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!selectedSessionId ? (
                    <SelectItem value='select-session-first' disabled>
                      Select academic year first
                    </SelectItem>
                  ) : termsLoading ? (
                    <SelectItem value='loading' disabled>
                      Loading terms...
                    </SelectItem>
                  ) : availableTerms.length > 0 ? (
                    availableTerms.map((term: Term) => (
                      <SelectItem key={term.id} value={term.id}>
                        {term.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='no-terms' disabled>
                      No terms available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex flex-col md:flex-row md:space-x-4 w-full space-y-4 md:space-y-0'>
          {/* Class Field */}
          <FormField
            control={form.control}
            name='classId'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Class</FormLabel>
                <Select
                  onValueChange={(value) => handleClassChange(value)}
                  value={field.value}
                  disabled={!selectedSessionId || classesLoading}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select class' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!selectedSessionId ? (
                      <SelectItem value='select-session-first' disabled>
                        Select academic year first
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

          {/* Class Arm Field */}
          <FormField
            control={form.control}
            name='classArmId'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Class Arm</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedClassId}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select class arm' />
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

        {/* Subject Field - Only show for subject scores */}
        {selectedScoreType === "subject" && (
          <FormField
            control={form.control}
            name='subjectId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!form.watch("classArmId") || subjectsLoading}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select subject' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!form.watch("classArmId") ? (
                      <SelectItem value='select-classarm-first' disabled>
                        Select class arm first
                      </SelectItem>
                    ) : subjectsLoading ? (
                      <SelectItem value='loading' disabled>
                        Loading subjects...
                      </SelectItem>
                    ) : availableSubjects.length > 0 ? (
                      availableSubjects.map((subject: any) => (
                        <SelectItem
                          key={subject.subject.id}
                          value={subject.subject.id}
                        >
                          {subject.subject.name} ({subject.subject.code})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value='no-subjects' disabled>
                        No subjects available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className='flex justify-end pt-4 space-x-2'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit'>
            {selectedScoreType === "subject"
              ? "Enter Subject Scores"
              : "Enter Class Scores"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
