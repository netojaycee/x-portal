"use client";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useGetSessionsQuery } from "@/redux/api";

const AttendanceFormSchema = z.object({
  sessionId: z.string().min(1, { message: "Please select academic year" }),
  term: z.string().min(1, { message: "Please select term" }),
  classId: z.string().min(1, { message: "Please select class" }),
  classArmId: z.string().min(1, { message: "Please select class arm" }),
  date: z.date({
    required_error: "Please select a date",
  }),
});

type AttendanceFormValues = z.infer<typeof AttendanceFormSchema>;

// Define interfaces for session data structure
// interface Term {
//   id: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   status: string;
// }

// interface ClassData {
//   id: string;
//   name: string;
//   assignedArms: string[];
// }

// interface Session {
//   id: string;
//   name: string;
//   status: string;
//   terms: Term[];
//   classes: ClassData[];
// }

interface AttendanceFormProps {
  onClose: () => void;
}

export function AttendanceForm({ onClose }: AttendanceFormProps) {
  const router = useRouter();

  // State to track selected session and class
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Fetch sessions
  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});

  // Get the currently selected session object
  const selectedSession = useMemo(() => {
    return (
      sessionsData?.data?.find(
        (session: any) => session.id === selectedSessionId
      ) || null
    );
  }, [sessionsData, selectedSessionId]);

  // Get available terms for the selected session
  const availableTerms = useMemo(() => {
    return selectedSession?.terms || [];
  }, [selectedSession]);

  // Get available classes for the selected session
  const availableClasses = useMemo(() => {
    return selectedSession?.classes || [];
  }, [selectedSession]);

  // Get available arms for the selected class
  const availableArms = useMemo(() => {
    if (!selectedSession || !selectedClassId) return [];

    const selectedClass = selectedSession.classes.find(
      (cls: any) => cls.id === selectedClassId
    );
    if (!selectedClass || !selectedClass.assignedArms.length) return [];

    // Convert assigned arms strings to objects with id and name
    return selectedClass.assignedArms.map(
      (arm: { id: string; name: string }) => ({
        id: arm.id, // Using the arm id as id
        name: arm.name.charAt(0).toUpperCase() + arm.name.slice(1), // Capitalize first letter
      })
    );
  }, [selectedSession, selectedClassId]);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(AttendanceFormSchema),
    defaultValues: {
      sessionId: "",
      term: "",
      classId: "",
      classArmId: "",
      date: new Date(),
    },
  });

  // When session selection changes
  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    form.setValue("sessionId", sessionId);
    form.setValue("term", "");
    form.setValue("classId", "");
    form.setValue("classArmId", "");
    setSelectedClassId("");
  };

  // When class selection changes
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    form.setValue("classId", classId);
    form.setValue("classArmId", "");
  };

  const onSubmit = (values: AttendanceFormValues) => {
    // Navigate to attendance taking page with query params
    const queryParams = new URLSearchParams({
      sessionId: values.sessionId,
      term: values.term,
      classId: values.classId,
      classArmId: values.classArmId,
      date: values.date.toISOString(),
    });

    router.push(`/attendance/take?${queryParams.toString()}`);
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-2'>
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
                disabled={sessionsLoading}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select academic year' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sessionsLoading ? (
                    <SelectItem value='loading' disabled>
                      Loading sessions...
                    </SelectItem>
                  ) : sessionsData?.data?.length ? (
                    sessionsData.data.map((session: any) => (
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
          name='term'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedSessionId}
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
                  ) : availableTerms.length > 0 ? (
                    availableTerms.map((term: any) => (
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
                  disabled={!selectedSessionId}
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
                    ) : availableClasses.length > 0 ? (
                      availableClasses.map((cls: any) => (
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
                      availableArms.map((arm: any) => (
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

        {/* Date Field */}
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end pt-4 space-x-2'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit'>Take Attendance</Button>
        </div>
      </form>
    </Form>
  );
}
