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
  useGetMarkingSchemeByClassQuery,
} from "@/redux/api";

const ViewAnalyticsFormSchema = z.object({
  sessionId: z.string().min(1, { message: "Please select academic session" }),
  termId: z.string().min(1, { message: "Please select term" }),
  classId: z.string().min(1, { message: "Please select class" }),
  classArmId: z.string().min(1, { message: "Please select class arm" }),
  markingSchemeComponentId: z.string().min(1, { message: "Please select marking scheme component" }),
});

type ViewAnalyticsFormValues = z.infer<typeof ViewAnalyticsFormSchema>;

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

interface Session {
  id: string;
  name: string;
  status: string;
  terms: Term[];
  classes: ClassData[];
}

interface MarkingSchemeComponent {
  id: string;
  name: string;
  type: string;
  score: number;
}

interface ViewAnalyticsFormProps {
  onClose?: () => void;
}

export function ViewAnalyticsForm({ onClose }: ViewAnalyticsFormProps) {
  const router = useRouter();

  // State to track selections
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedTermId, setSelectedTermId] = useState<string>("");

  const form = useForm<ViewAnalyticsFormValues>({
    resolver: zodResolver(ViewAnalyticsFormSchema),
    defaultValues: {
      sessionId: "",
      termId: "",
      classId: "",
      classArmId: "",
      markingSchemeComponentId: "",
    },
  });

  // Fetch sessions
  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});

  // Fetch terms
  const { data: termsData, isLoading: termsLoading } = useGetTermsQuery({});

  // Fetch classes for selected session
  const { data: classesData, isLoading: classesLoading } =
    useGetSessionClassesQuery(selectedSessionId, {
      skip: !selectedSessionId,
    });

  // Fetch marking schemes for selected class and term
  const { data: markingSchemesData, isLoading: markingSchemesLoading } =
    useGetMarkingSchemeByClassQuery(
      { classId: selectedClassId, termDefinitionId: selectedTermId },
      { skip: !selectedClassId || !selectedTermId }
    );

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
  const availableComponents = useMemo(() => {
    if (!markingSchemesData?.data?.components) return [];
    return markingSchemesData.data.components;
  }, [markingSchemesData]);

  // When session selection changes
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

  // When term selection changes
  const handleTermChange = (termId: string) => {
    setSelectedTermId(termId);
    form.setValue("termId", termId);
    form.setValue("markingSchemeComponentId", "");
  };

  // When class selection changes
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    form.setValue("classId", classId);
    form.setValue("classArmId", "");
    form.setValue("markingSchemeComponentId", "");
  };

  const onSubmit = (values: ViewAnalyticsFormValues) => {
    // Build query parameters
    const queryParams = new URLSearchParams({
      sessionId: values.sessionId,
      termId: values.termId,
      classId: values.classId,
      classArmId: values.classArmId,
      markingSchemeComponentId: values.markingSchemeComponentId,
    });

    // Navigate to analytics page
    router.push(`/results/analytics?${queryParams.toString()}`);
    onClose?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-2'>
        {/* Academic Session Field */}
        <FormField
          control={form.control}
          name='sessionId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Session</FormLabel>
              <Select
                onValueChange={handleSessionChange}
                value={field.value}
                disabled={sessionsLoading}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select academic session' />
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

        {/* Term Field */}
        <FormField
          control={form.control}
          name='termId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <Select
                onValueChange={handleTermChange}
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
                      Select academic session first
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
                  onValueChange={handleClassChange}
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

        {/* Marking Scheme Component Field */}
        <FormField
          control={form.control}
          name='markingSchemeComponentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marking Scheme Component</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedClassId || !selectedTermId || markingSchemesLoading}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select marking scheme component' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!selectedClassId || !selectedTermId ? (
                    <SelectItem value='select-class-term-first' disabled>
                      Select class and term first
                    </SelectItem>
                  ) : markingSchemesLoading ? (
                    <SelectItem value='loading' disabled>
                      Loading marking schemes...
                    </SelectItem>
                  ) : availableComponents.length > 0 ? (
                    availableComponents.map((component: MarkingSchemeComponent) => (
                      <SelectItem key={component.id} value={component.id}>
                        {component.name} ({component.type} - {component.score} marks)
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='no-components' disabled>
                      No marking scheme components available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end pt-4 space-x-2'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit'>
            View Analytics
          </Button>
        </div>
      </form>
    </Form>
  );
}
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
//   useGetSessionsQuery,
//   useGetTermsQuery,
//   useGetSessionClassesQuery,
//   useGetMarkingSchemeByClassQuery,
// } from "@/redux/api";

// const ViewAnalyticsFormSchema = z.object({
//   sessionId: z.string().min(1, { message: "Please select academic session" }),
//   termId: z.string().min(1, { message: "Please select term" }),
//   classId: z.string().min(1, { message: "Please select class" }),
//   classArmId: z.string().min(1, { message: "Please select class arm" }),
//   markingSchemeComponentId: z.string().min(1, { message: "Please select marking scheme component" }),
// });

// type ViewAnalyticsFormValues = z.infer<typeof ViewAnalyticsFormSchema>;

// // Define interfaces for data structure
// interface Term {
//   id: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   status: string;
// }

// interface ClassArm {
//   id: string;
//   name: string;
// }

// interface ClassData {
//   id: string;
//   name: string;
//   classArms: ClassArm[];
// }

// interface Session {
//   id: string;
//   name: string;
//   status: string;
//   terms: Term[];
//   classes: ClassData[];
// }

// interface MarkingSchemeComponent {
//   id: string;
//   name: string;
//   type: string;
//   score: number;
// }

// interface ViewAnalyticsFormProps {
//   onClose?: () => void;
// }

// export function ViewAnalyticsForm({ onClose }: ViewAnalyticsFormProps) {
//   const router = useRouter();

//   // State to track selections
//   const [selectedSessionId, setSelectedSessionId] = useState<string>("");
//   const [selectedClassId, setSelectedClassId] = useState<string>("");
//   const [selectedTermId, setSelectedTermId] = useState<string>("");

//   const form = useForm<ViewAnalyticsFormValues>({
//     resolver: zodResolver(ViewAnalyticsFormSchema),
//     defaultValues: {
//       sessionId: "",
//       termId: "",
//       classId: "",
//       classArmId: "",
//       markingSchemeComponentId: "",
//     },
//   });

//   // Fetch sessions
//   const { data: sessionsData, isLoading: sessionsLoading } =
//     useGetSessionsQuery({});

//   // Fetch terms
//   const { data: termsData, isLoading: termsLoading } = useGetTermsQuery({});

//   // Fetch classes for selected session
//   const { data: classesData, isLoading: classesLoading } =
//     useGetSessionClassesQuery(selectedSessionId, {
//       skip: !selectedSessionId,
//     });

//   // Fetch marking schemes for selected class and term
//   const { data: markingSchemesData, isLoading: markingSchemesLoading } =
//     useGetMarkingSchemeByClassQuery(
//       { classId: selectedClassId, termDefinitionId: selectedTermId },
//       { skip: !selectedClassId || !selectedTermId }
//     );

//   // Get available terms
//   const availableTerms = useMemo(() => {
//     return termsData?.data || [];
//   }, [termsData]);

//   // Get available classes
//   const availableClasses = useMemo(() => {
//     return classesData?.data?.classes || [];
//   }, [classesData]);

//   // Get available arms for the selected class
//   const availableArms = useMemo(() => {
//     if (!selectedClassId || !classesData?.data?.classes) return [];

//     const selectedClass = classesData.data.classes.find(
//       (cls: ClassData) => cls.id === selectedClassId
//     );
//     return selectedClass?.classArms || [];
//   }, [classesData, selectedClassId]);

//   // Get available marking scheme components
//   const availableComponents = useMemo(() => {
//     if (!markingSchemesData?.data?.components) return [];
//     return markingSchemesData.data.components;
//   }, [markingSchemesData]);

//   // When session selection changes
//   const handleSessionChange = (sessionId: string) => {
//     setSelectedSessionId(sessionId);
//     form.setValue("sessionId", sessionId);
//     form.setValue("termId", "");
//     form.setValue("classId", "");
//     form.setValue("classArmId", "");
//     form.setValue("markingSchemeComponentId", "");
//     setSelectedClassId("");
//     setSelectedTermId("");
//   };

//   // When term selection changes
//   const handleTermChange = (termId: string) => {
//     setSelectedTermId(termId);
//     form.setValue("termId", termId);
//     form.setValue("markingSchemeComponentId", "");
//   };

//   // When class selection changes
//   const handleClassChange = (classId: string) => {
//     setSelectedClassId(classId);
//     form.setValue("classId", classId);
//     form.setValue("classArmId", "");
//     form.setValue("markingSchemeComponentId", "");
//   };

//   const onSubmit = (values: ViewAnalyticsFormValues) => {
//     // Build query parameters
//     const queryParams = new URLSearchParams({
//       sessionId: values.sessionId,
//       termId: values.termId,
//       classId: values.classId,
//       classArmId: values.classArmId,
//       markingSchemeComponentId: values.markingSchemeComponentId,
//     });

//     // Navigate to analytics page
//     router.push(`/results/analytics?${queryParams.toString()}`);
//     onClose?.();
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-2'>
//         {/* Academic Session Field */}
//         <FormField
//           control={form.control}
//           name='sessionId'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Academic Session</FormLabel>
//               <Select
//                 onValueChange={handleSessionChange}
//                 value={field.value}
//                 disabled={sessionsLoading}
//               >
//                 <FormControl>
//                   <SelectTrigger className='w-full'>
//                     <SelectValue placeholder='Select academic session' />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {sessionsLoading ? (
//                     <SelectItem value='loading' disabled>
//                       Loading sessions...
//                     </SelectItem>
//                   ) : sessionsData?.data?.length ? (
//                     sessionsData.data.map((session: Session) => (
//                       <SelectItem key={session.id} value={session.id}>
//                         {session.name}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <SelectItem value='empty' disabled>
//                       No sessions available
//                     </SelectItem>
//                   )}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Term Field */}
//         <FormField
//           control={form.control}
//           name='termId'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Term</FormLabel>
//               <Select
//                 onValueChange={handleTermChange}
//                 value={field.value}
//                 disabled={!selectedSessionId || termsLoading}
//               >
//                 <FormControl>
//                   <SelectTrigger className='w-full'>
//                     <SelectValue placeholder='Select term' />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {!selectedSessionId ? (
//                     <SelectItem value='select-session-first' disabled>
//                       Select academic session first
//                     </SelectItem>
//                   ) : termsLoading ? (
//                     <SelectItem value='loading' disabled>
//                       Loading terms...
//                     </SelectItem>
//                   ) : availableTerms.length > 0 ? (
//                     availableTerms.map((term: Term) => (
//                       <SelectItem key={term.id} value={term.id}>
//                         {term.name}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <SelectItem value='no-terms' disabled>
//                       No terms available
//                     </SelectItem>
//                   )}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className='flex flex-col md:flex-row md:space-x-4 w-full space-y-4 md:space-y-0'>
//           {/* Class Field */}
//           <FormField
//             control={form.control}
//             name='classId'
//             render={({ field }) => (
//               <FormItem className='w-full'>
//                 <FormLabel>Class</FormLabel>
//                 <Select
//                   onValueChange={handleClassChange}
//                   value={field.value}
//                   disabled={!selectedSessionId || classesLoading}
//                 >
//                   <FormControl>
//                     <SelectTrigger className='w-full'>
//                       <SelectValue placeholder='Select class' />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {!selectedSessionId ? (
//                       <SelectItem value='select-session-first' disabled>
//                         Select academic session first
//                       </SelectItem>
//                     ) : classesLoading ? (
//                       <SelectItem value='loading' disabled>
//                         Loading classes...
//                       </SelectItem>
//                     ) : availableClasses.length > 0 ? (
//                       availableClasses.map((cls: ClassData) => (
//                         <SelectItem key={cls.id} value={cls.id}>
//                           {cls.name}
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <SelectItem value='empty' disabled>
//                         No classes available
//                       </SelectItem>
//                     )}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Class Arm Field */}
//           <FormField
//             control={form.control}
//             name='classArmId'
//             render={({ field }) => (
//               <FormItem className='w-full'>
//                 <FormLabel>Class Arm</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   value={field.value}
//                   disabled={!selectedClassId}
//                 >
//                   <FormControl>
//                     <SelectTrigger className='w-full'>
//                       <SelectValue placeholder='Select class arm' />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {!selectedClassId ? (
//                       <SelectItem value='select-class-first' disabled>
//                         Select a class first
//                       </SelectItem>
//                     ) : availableArms.length > 0 ? (
//                       availableArms.map((arm: ClassArm) => (
//                         <SelectItem key={arm.id} value={arm.id}>
//                           {arm.name}
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <SelectItem value='no-arms' disabled>
//                         No class arms available
//                       </SelectItem>
//                     )}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Marking Scheme Component Field */}
//         <FormField
//           control={form.control}
//           name='markingSchemeComponentId'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Marking Scheme Component</FormLabel>
//               <Select
//                 onValueChange={field.onChange}
//                 value={field.value}
//                 disabled={!selectedClassId || !selectedTermId || markingSchemesLoading}
//               >
//                 <FormControl>
//                   <SelectTrigger className='w-full'>
//                     <SelectValue placeholder='Select marking scheme component' />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {!selectedClassId || !selectedTermId ? (
//                     <SelectItem value='select-class-term-first' disabled>
//                       Select class and term first
//                     </SelectItem>
//                   ) : markingSchemesLoading ? (
//                     <SelectItem value='loading' disabled>
//                       Loading marking schemes...
//                     </SelectItem>
//                   ) : availableComponents.length > 0 ? (
//                     availableComponents.map((component: MarkingSchemeComponent) => (
//                       <SelectItem key={component.id} value={component.id}>
//                         {component.name} ({component.type} - {component.score} marks)
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <SelectItem value='no-components' disabled>
//                       No marking scheme components available
//                     </SelectItem>
//                   )}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className='flex justify-end pt-4 space-x-2'>
//           <Button type='button' variant='outline' onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type='submit'>
//             View Analytics
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
