"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, ArrowRight, ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  useCreateSessionMutation,
  useUpdateSessionMutation,
} from "@/redux/api";
import { Input } from "@/components/ui/input";

// Define the schema for a single term
const termSchema = z
  .object({
    name: z
      .string()
      .min(1, "Term name is required")
      .max(50, "Term name must be less than 50 characters"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .string()
      .min(1, "End date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Define the schema for the session with startYear and endYear
const sessionSchema = z
  .object({
    startYear: z
      .number()
      .int()
      .min(2000, "Start year must be at least 2000")
      .max(2100, "Start year must not exceed 2100"),
    endYear: z
      .number()
      .int()
      .min(2001, "End year must be at least 2001")
      .max(2101, "End year must not exceed 2101"),
    terms: z.array(termSchema).length(3, "Exactly three terms are required"),
  })
  .refine((data) => data.endYear - data.startYear === 1, {
    message: "End year must be exactly one year after start year",
    path: ["endYear"],
  })
  .refine((data) => data.endYear !== data.startYear, {
    message: "Start year and end year cannot be the same",
    path: ["endYear"],
  });

interface Term {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface Session {
  id?: string;
  name: string; // Backend format: "startYear/endYear"
  terms: Term[];
}

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  session?: Session; // For edit mode, expects "2024/2025" format
  isEditMode?: boolean;
  onSuccess: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  session,
  isEditMode = false,
  onSuccess,
}) => {
  
  const [
    createSession,
    {
      isLoading: isLoadingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useCreateSessionMutation();

  const [
    updateSession,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateSessionMutation();

  const isLoading = isEditMode ? isLoadingUpdate : isLoadingAdd;
  const isSuccess = isEditMode ? isSuccessUpdate : isSuccessAdd;
  const isError = isEditMode ? isErrorUpdate : isErrorAdd;
  const error = isEditMode ? errorUpdate : errorAdd;

  // Parse session name (e.g., "2024/2025") into startYear and endYear for edit mode
  const parseSessionName = (name: string) => {
    const [start, end] = name.split("/").map(Number);
    return { startYear: start, endYear: end };
  };

  // Format ISO date to YYYY-MM-DD for date picker
  const formatDateForInput = (dateStr: string | undefined) =>
    dateStr ? format(new Date(dateStr), "yyyy-MM-dd") : "";

  // Initialize default terms if not provided
  const defaultTerms: Term[] = [
    { name: "First Term", startDate: "", endDate: "" },
    { name: "Second Term", startDate: "", endDate: "" },
    { name: "Third Term", startDate: "", endDate: "" },
  ];

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      startYear: session?.name
        ? parseSessionName(session.name).startYear
        : undefined,
      endYear: session?.name
        ? parseSessionName(session.name).endYear
        : undefined,
      terms:
        session?.terms?.length === 3
          ? session.terms.map((term) => ({
              ...term,
              startDate: formatDateForInput(term.startDate),
              endDate: formatDateForInput(term.endDate),
            }))
          : defaultTerms,
    },
  });

  const onSubmit = async (values: SessionFormData) => {
    try {
      const credentials = {
        session: `${values.startYear}/${values.endYear}`,
        firstTermStartDate: values.terms[0].startDate,
        firstTermEndDate: values.terms[0].endDate,
        secondTermStartDate: values.terms[1].startDate,
        secondTermEndDate: values.terms[1].endDate,
        thirdTermStartDate: values.terms[2].startDate,
        thirdTermEndDate: values.terms[2].endDate,
      };
      if (isEditMode && session?.id) {
        await updateSession({
          id: session.id,
          ...credentials,
        }).unwrap();
      } else {
        await createSession(credentials).unwrap();
      }
    } catch (error) {
      console.error(
        `${isEditMode ? "Update" : "Create"} session error:`,
        error
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        isEditMode
          ? "Session updated successfully"
          : "Session created successfully"
      );
      form.reset();
      if (onSuccess) onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, form, onSuccess, isEditMode]);

  return (
    <div className='w-full max-w-3xl'>
      {/* <div className='mb-6'>
        <h2 className='text-lg font-semibold'>
          {isEditMode ? "Edit Session" : "Create Session"}
        </h2>
        <p className='text-sm text-gray-500'>
          {isEditMode
            ? "Update the session and term details below"
            : "Enter the details to create a new session with terms"}
        </p>
      </div> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Session Details */}
          <div className='space-y-4'>
            <h3 className='text-md font-medium text-gray-700'>
              Session Details
            </h3>
            <div className='flex items-center gap-5'>
              <FormField
                control={form.control}
                name='startYear'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-gray-700'>
                      Start Year <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='e.g., 2024'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endYear'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-gray-700'>
                      End Year <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='e.g., 2025'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Terms */}
          {["terms.0", "terms.1", "terms.2"].map((termPrefix, index) => (
            <div key={termPrefix} className='space-y-4 border-t pt-4'>
              <h3 className='text-md font-medium text-gray-700'>
                {index === 0
                  ? "First Term"
                  : index === 1
                  ? "Second Term"
                  : "Third Term"}
              </h3>
              <FormField
                control={form.control}
                name={`${termPrefix}.name` as any}
                render={({ field }) => (
                  <FormItem className='hidden'>
                    <FormLabel className='text-gray-700'>
                      Term Name <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`e.g., ${
                          index === 0
                            ? "First Term"
                            : index === 1
                            ? "Second Term"
                            : "Third Term"
                        }`}
                        {...field}
                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center w-full gap-5'>
                <FormField
                  control={form.control}
                  name={`${termPrefix}.startDate` as any}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='text-gray-700'>
                        Start Date <span className='text-red-500'>*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            {/* <Input
                              type='text'
                              placeholder='Select a date'
                              value={field.value || ""}
                              onChange={field.onChange}
                              className='border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full'
                              readOnly
                            /> */}
                            <Button
                              variant='outline'
                              id='date'
                              className='w-full h-10 justify-between font-normal border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            >
                              {field.value ? field.value : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className='w-auto overflow-hidden p-0'
                          align='start'
                        >
                          <Calendar
                            mode='single'
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                            }
                            disabled={(date) =>
                              date > new Date("2100-01-01") ||
                              date < new Date("2000-01-01")
                            }
                            initialFocus
                            className='rounded-md border shadow-sm'
                            // captionLayout='dropdown'
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${termPrefix}.endDate` as any}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='text-gray-700'>
                        End Date <span className='text-red-500'>*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            {/* <Input
                              type='text'
                              placeholder='Select a date'
                              value={field.value || ""}
                              onChange={field.onChange}
                              className='border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full'
                              readOnly
                            /> */}
                            <Button
                              variant='outline'
                              id='date'
                              className='w-full h-10 justify-between font-normal border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            >
                              {field.value ? field.value : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                            }
                            disabled={(date) =>
                              date > new Date("2100-01-01") ||
                              date < new Date("2000-01-01")
                            }
                            initialFocus
                            className='rounded-md border shadow-sm'
                            // captionLayout='dropdown'
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600'
          >
            {isLoading ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Please wait</span>
              </>
            ) : (
              <>
                <span>{isEditMode ? "UPDATE" : "CREATE"}</span>
                <ArrowRight className='h-5 w-5' />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SessionForm;
