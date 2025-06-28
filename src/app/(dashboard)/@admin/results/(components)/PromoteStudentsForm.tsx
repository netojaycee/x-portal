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
  useGetSessionClassesQuery,
} from "@/redux/api";

const PromoteStudentsFormSchema = z.object({
  sessionId: z.string().min(1, { message: "Please select academic session" }),
  classId: z.string().min(1, { message: "Please select class" }),
  classArmId: z.string().min(1, { message: "Please select class arm" }),
});

type PromoteStudentsFormValues = z.infer<typeof PromoteStudentsFormSchema>;

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

interface PromoteStudentsFormProps {
  onClose?: () => void;
}

export function PromoteStudentsForm({ onClose }: PromoteStudentsFormProps) {
  const router = useRouter();

  // State to track selections
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const form = useForm<PromoteStudentsFormValues>({
    resolver: zodResolver(PromoteStudentsFormSchema),
    defaultValues: {
      sessionId: "",
      classId: "",
      classArmId: "",
    },
  });

  // Fetch sessions
  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});

  // Fetch classes for selected session
  const { data: classesData, isLoading: classesLoading } =
    useGetSessionClassesQuery(selectedSessionId, {
      skip: !selectedSessionId,
    });

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
    form.setValue("sessionId", sessionId);
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

  const onSubmit = (values: PromoteStudentsFormValues) => {
    // Build query parameters
    const queryParams = new URLSearchParams({
      sessionId: values.sessionId,
      classId: values.classId,
      classArmId: values.classArmId,
    });

    // Navigate to promote students page
    router.push(`/results/promotion?${queryParams.toString()}`);
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

        <div className='flex justify-end pt-4 space-x-2'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit'>
            Promote Students
          </Button>
        </div>
      </form>
    </Form>
  );
}
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
//   useGetSessionsQuery,
//   useGetSessionClassesQuery,
// } from "@/redux/api";

// const PromoteStudentsFormSchema = z.object({
//   sessionId: z.string().min(1, { message: "Please select academic session" }),
//   classId: z.string().min(1, { message: "Please select class" }),
//   classArmId: z.string().min(1, { message: "Please select class arm" }),
// });

// type PromoteStudentsFormValues = z.infer<typeof PromoteStudentsFormSchema>;

// // Define interfaces for data structure
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
// }

// interface PromoteStudentsFormProps {
//   onClose?: () => void;
// }

// export function PromoteStudentsForm({ onClose }: PromoteStudentsFormProps) {
//   const router = useRouter();

//   // State to track selections
//   const [selectedSessionId, setSelectedSessionId] = useState<string>("");
//   const [selectedClassId, setSelectedClassId] = useState<string>("");

//   const form = useForm<PromoteStudentsFormValues>({
//     resolver: zodResolver(PromoteStudentsFormSchema),
//     defaultValues: {
//       sessionId: "",
//       classId: "",
//       classArmId: "",
//     },
//   });

//   // Fetch sessions
//   const { data: sessionsData, isLoading: sessionsLoading } =
//     useGetSessionsQuery({});

//   // Fetch classes for selected session
//   const { data: classesData, isLoading: classesLoading } =
//     useGetSessionClassesQuery(selectedSessionId, {
//       skip: !selectedSessionId,
//     });

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

//   // When session selection changes
//   const handleSessionChange = (sessionId: string) => {
//     setSelectedSessionId(sessionId);
//     form.setValue("sessionId", sessionId);
//     form.setValue("classId", "");
//     form.setValue("classArmId", "");
//     setSelectedClassId("");
//   };

//   // When class selection changes
//   const handleClassChange = (classId: string) => {
//     setSelectedClassId(classId);
//     form.setValue("classId", classId);
//     form.setValue("classArmId", "");
//   };

//   const onSubmit = (values: PromoteStudentsFormValues) => {
//     // Build query parameters
//     const queryParams = new URLSearchParams({
//       sessionId: values.sessionId,
//       classId: values.classId,
//       classArmId: values.classArmId,
//     });

//     // Navigate to promote students page
//     router.push(`/results/promote?${queryParams.toString()}`);
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

//         <div className='flex justify-end pt-4 space-x-2'>
//           <Button type='button' variant='outline' onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type='submit'>
//             Promote Students
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
