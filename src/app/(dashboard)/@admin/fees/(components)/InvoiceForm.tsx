// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { MultiSelect } from "@/components/ui/multiselect";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import {
//   useGetSessionsQuery,
//   useGetTermsQuery,
//   useGetSessionClassesQuery,
//   useGetStudentsQuery,
//   useCreateInvoiceMutation,
// } from "@/redux/api";

// const InvoiceFormSchema = z.object({
//   invoiceType: z.enum(["single", "mass"]),
//   sessionId: z.string().min(1, "Session is required"),
//   termId: z.string().min(1, "Term is required"),
//   title: z.string().min(1, "Title is required"),
//   description: z.string().optional(),
//   amount: z.number().min(1, "Amount is required"),
//   // For mass
//   classIds: z.array(z.string()).optional(),
//   // For single
//   classId: z.string().optional(),
//   classArmId: z.string().optional(),
//   studentId: z.string().optional(),
// });

// type InvoiceFormValues = z.infer<typeof InvoiceFormSchema>;

// interface InvoiceFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
//   initialData?: Partial<InvoiceFormValues>;
// }

// export default function InvoiceForm({
//   onClose,
//   onSuccess,
//   initialData,
// }: InvoiceFormProps) {
//   const [invoiceType, setInvoiceType] = useState<"single" | "mass">(
//     initialData?.invoiceType || "single"
//   );
//   const [selectedSessionId, setSelectedSessionId] = useState<string>("");
//   const [selectedClassId, setSelectedClassId] = useState<string>("");
//   const [selectedClassArmId, setSelectedClassArmId] = useState<string>("");
//   // eslint-disable-next-line
//   const [selectedTermId, setSelectedTermId] = useState<string>("");

//   const form = useForm<InvoiceFormValues>({
//     resolver: zodResolver(InvoiceFormSchema),
//     defaultValues: {
//       invoiceType: initialData?.invoiceType || "single",
//       sessionId: initialData?.sessionId || "",
//       termId: initialData?.termId || "",
//       title: initialData?.title || "",
//       description: initialData?.description || "",
//       amount: initialData?.amount || 0,
//       classIds: initialData?.classIds || [],
//       classId: initialData?.classId || "",
//       classArmId: initialData?.classArmId || "",
//       studentId: initialData?.studentId || "",
//     },
//   });

//   // Fetch sessions
//   const { data: sessionsData, isLoading: sessionsLoading } =
//     useGetSessionsQuery({});
//   const availableSessions = useMemo(
//     () => sessionsData?.data || [],
//     [sessionsData]
//   );
//   // Find active or latest session
//   const activeSession =
//     availableSessions.find((s: any) => s.status) || availableSessions[0];

//   // Fetch terms
//   const { data: termsData, isLoading: termsLoading } = useGetTermsQuery({});
//   const availableTerms = useMemo(() => termsData?.data || [], [termsData]);
//   const activeTerm =
//     availableTerms.find((t: any) => t.status) || availableTerms[0];

//   // Fetch classes for selected session
//   const { data: classesData, isLoading: classesLoading, isFetching: isClassesFetching } =
//     useGetSessionClassesQuery(selectedSessionId, { skip: !selectedSessionId });
//   const availableClasses = useMemo(
//     () => classesData?.data?.classes || [],
//     [classesData]
//   );

//   // Fetch arms for selected class
//   const availableArms = useMemo(() => {
//     if (!selectedClassId || !classesData?.data?.classes) return [];
//     const selectedClass = classesData.data.classes.find(
//       (cls: any) => cls.id === selectedClassId
//     );
//     return selectedClass?.classArms || [];
//   }, [classesData, selectedClassId]);

//   // Fetch students for selected session, class, arm
//   const { data: studentsData, isLoading: studentsLoading, isFetching: isStudentsFetching } =
//     useGetStudentsQuery(
//       {
//         sessionId: selectedSessionId,
//         classId: selectedClassId,
//         classArmId: selectedClassArmId,
//         limit: 1000,
//       },
//       { skip: !(selectedSessionId && selectedClassId && selectedClassArmId) }
//     );
//   const availableStudents = useMemo(
//     () => studentsData?.data?.students || [],
//     [studentsData]
//   );

//   // Invoice mutation
//   const [createInvoice, { isLoading: isSaving }] = useCreateInvoiceMutation();

//   // Set default session/term on mount
//   useEffect(() => {
//     if (!form.getValues("sessionId") && activeSession) {
//       form.setValue("sessionId", activeSession.id);
//       setSelectedSessionId(activeSession.id);
//     }
//     if (!form.getValues("termId") && activeTerm) {
//       form.setValue("termId", activeTerm.id);
//       setSelectedTermId(activeTerm.id);
//     }
//   }, [activeSession, activeTerm, form]);

//   // Handlers
//   const handleSessionChange = (sessionId: string) => {
//     setSelectedSessionId(sessionId);
//     form.setValue("sessionId", sessionId);
//     // Reset class, class arm, student
//     form.setValue("classId", "");
//     setSelectedClassId("");
//     form.setValue("classArmId", "");
//     setSelectedClassArmId("");
//     form.setValue("studentId", "");
//     form.setValue("classIds", []);
//   };

//   const handleTermChange = (termId: string) => {
//     setSelectedTermId(termId);
//     form.setValue("termId", termId);
//   };

//   const handleClassChange = (classId: string) => {
//     setSelectedClassId(classId);
//     form.setValue("classId", classId);
//     // Reset class arm and student
//     form.setValue("classArmId", "");
//     setSelectedClassArmId("");
//     form.setValue("studentId", "");
//   };

//   const handleClassArmChange = (classArmId: string) => {
//     setSelectedClassArmId(classArmId);
//     form.setValue("classArmId", classArmId);
//     // Reset student
//     form.setValue("studentId", "");
//   };

//   // Submit
//   const onSubmit = async (values: InvoiceFormValues) => {
//     try {
//       const payload: any = {
//         type: values.invoiceType,
//         amount: Number(values.amount),
//         title: values.title,
//         description: values.description,
//         termId: values.termId,
//         sessionId: values.sessionId,
//       };
//       if (values.invoiceType === "mass") {
//         payload.classIds = values.classIds;
//       } else {
//         payload.studentId = values.studentId;
//         payload.classId = values.classId;
//         payload.classArmId = values.classArmId;
//       }
//       await createInvoice(payload).unwrap();
//       toast.success("Invoice created successfully!");
//       onSuccess?.();
//       onClose();
//     } catch (error: any) {
//       toast.error(
//         error?.data?.message || "Failed to create invoice. Please try again."
//       );
//     }
//   };

//   return (
//     <div className='space-y-4'>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
//           {/* Invoice Type */}
//           <div className=''>
//             <FormField
//               control={form.control}
//               name='invoiceType'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Invoice Type</FormLabel>
//                   <Select
//                     value={field.value}
//                     onValueChange={(val) => {
//                       field.onChange(val as "single" | "mass");
//                       setInvoiceType(val as "single" | "mass");
//                     }}
//                   >
//                     <FormControl>
//                       <SelectTrigger className='w-full'>
//                         <SelectValue placeholder='Select invoice type' />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value='single'>Single</SelectItem>
//                       <SelectItem value='mass'>Mass</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           {/* Session */}
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <FormField
//               control={form.control}
//               name='sessionId'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className='flex items-center gap-1'>
//                     Session
//                     {sessionsLoading && (
//                       <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
//                     )}
//                   </FormLabel>
//                   <Select
//                     value={field.value}
//                     onValueChange={handleSessionChange}
//                     disabled={sessionsLoading}
//                   >
//                     <FormControl>
//                       <SelectTrigger className='w-full'>
//                         <SelectValue placeholder='Select session' />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {availableSessions.map((session: any) => (
//                         <SelectItem key={session.id} value={session.id}>
//                           {session.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Term */}
//             <FormField
//               control={form.control}
//               name='termId'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className='flex items-center gap-1'>
//                     Term
//                     {termsLoading && (
//                       <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
//                     )}
//                   </FormLabel>
//                   <Select
//                     value={field.value}
//                     onValueChange={handleTermChange}
//                     disabled={termsLoading}
//                   >
//                     <FormControl>
//                       <SelectTrigger className='w-full'>
//                         <SelectValue placeholder='Select term' />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {availableTerms.map((term: any) => (
//                         <SelectItem key={term.id} value={term.id}>
//                           {term.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           {/* Title */}
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <FormField
//               control={form.control}
//               name='title'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Invoice Title</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder='Enter invoice title' />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Description */}
//             <FormField
//               control={form.control}
//               name='description'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder='Enter description (optional)'
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           {/* Amount */}

//           <FormField
//             control={form.control}
//             name='amount'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Amount</FormLabel>
//                 <FormControl>
//                   <Input
//                   type='number'
//                   {...field}
//                   value={field.value === undefined || field.value === null ? "" : field.value}
//                   onChange={e => {
//                     const val = e.target.value;
//                     field.onChange(val === "" ? undefined : Number(val));
//                   }}
//                   placeholder='Enter amount'
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* Mass: Class Multi-select */}
//           {invoiceType === "mass" && (
//             <FormField
//               control={form.control}
//               name='classIds'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className='flex items-center gap-1'>
//                     Classes
//                     {classesLoading ||
//                       (isClassesFetching && (
//                         <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
//                       ))}
//                   </FormLabel>
//                   <MultiSelect
//                     selected={field.value || []}
//                     onChange={field.onChange}
//                     options={availableClasses.map((cls: any) => ({
//                       label: cls.name,
//                       value: cls.id,
//                     }))}
//                     placeholder='Select classes'
//                     disabled={classesLoading || isClassesFetching}
//                   />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           )}
//           {/* Single: Class, Arm, Student */}
//           {invoiceType === "single" && (
//             <>
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                 <FormField
//                   control={form.control}
//                   name='classId'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className='flex items-center gap-1'>
//                         Class
//                         {classesLoading && (
//                           <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
//                         )}
//                       </FormLabel>
//                       <Select
//                         value={field.value}
//                         onValueChange={(val) => {
//                           handleClassChange(val);
//                           field.onChange(val);
//                         }}
//                         disabled={classesLoading}
//                       >
//                         <FormControl>
//                           <SelectTrigger className='w-full'>
//                             <SelectValue placeholder='Select class' />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {availableClasses.map((cls: any) => (
//                             <SelectItem key={cls.id} value={cls.id}>
//                               {cls.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='classArmId'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className='flex items-center gap-1'>
//                         Class Arm
//                         {classesLoading && (
//                           <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
//                         )}
//                       </FormLabel>
//                       <Select
//                         value={field.value}
//                         onValueChange={(val) => {
//                           handleClassArmChange(val);
//                           field.onChange(val);
//                         }}
//                         disabled={
//                           !selectedClassId || availableArms.length === 0
//                         }
//                       >
//                         <FormControl>
//                           <SelectTrigger className='w-full'>
//                             <SelectValue placeholder='Select class arm' />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {availableArms.map((arm: any) => (
//                             <SelectItem key={arm.id} value={arm.id}>
//                               {arm.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className='mt-4'>
//                 <FormField
//                   control={form.control}
//                   name='studentId'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className='flex items-center gap-1'>
//                         Student
//                         {studentsLoading ||
//                           (isStudentsFetching && (
//                             <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
//                           ))}
//                       </FormLabel>
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                         disabled={studentsLoading || isStudentsFetching}
//                       >
//                         <FormControl>
//                           <SelectTrigger className='w-full'>
//                             <SelectValue placeholder='Select student' />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {availableStudents.map((student: any) => (
//                             <SelectItem key={student.id} value={student.id}>
//                               {student.fullname ||
//                                 `${student.firstname} ${student.lastname}`}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </>
//           )}
//           <div className='flex justify-end gap-2'>
//             <Button
//               type='button'
//               variant='outline'
//               onClick={onClose}
//               disabled={isSaving}
//             >
//               Cancel
//             </Button>
//             <Button type='submit' disabled={isSaving}>
//               {isSaving && <Loader2 className='h-4 w-4 animate-spin mr-2' />}
//               {isSaving
//                 ? "Saving..."
//                 : initialData
//                 ? "Update Invoice"
//                 : "Create Invoice"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multiselect";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useGetSessionsQuery,
  useGetTermsQuery,
  useGetSessionClassesQuery,
  useGetStudentsQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from "@/redux/api";

const InvoiceFormSchema = z.object({
  invoiceType: z.enum(["single", "mass"]),
  sessionId: z.string().min(1, "Session is required"),
  termId: z.string().min(1, "Term is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  amount: z.number().min(1, "Amount is required"),
  // For mass
  classIds: z.array(z.string()).optional(),
  // For single
  classId: z.string().optional(),
  classArmId: z.string().optional(),
  studentId: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof InvoiceFormSchema>;

interface InvoiceFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<InvoiceFormValues & { id?: string }>;
  isEditMode?: boolean;
}

export default function InvoiceForm({
  onClose,
  onSuccess,
  initialData,
  isEditMode = false,
}: InvoiceFormProps) {
  const [invoiceType, setInvoiceType] = useState<"single" | "mass">(
    initialData?.invoiceType || "single"
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialData?.sessionId || ""
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(
    initialData?.classId || ""
  );
  const [selectedClassArmId, setSelectedClassArmId] = useState<string>(
    initialData?.classArmId || ""
  );
  // eslint-disable-next-line
  const [selectedTermId, setSelectedTermId] = useState<string>(
    initialData?.termId || ""
  );

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceFormSchema),
    defaultValues: {
      invoiceType: initialData?.invoiceType || "single",
      sessionId: initialData?.sessionId || "",
      termId: initialData?.termId || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      classIds: initialData?.classIds || [],
      classId: initialData?.classId || "",
      classArmId: initialData?.classArmId || "",
      studentId: initialData?.studentId || "",
    },
  });

  // Fetch sessions
  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});
  const availableSessions = useMemo(
    () => sessionsData?.data || [],
    [sessionsData]
  );
  // Find active or latest session
  const activeSession =
    availableSessions.find((s: any) => s.status) || availableSessions[0];

  // Fetch terms
  const { data: termsData, isLoading: termsLoading } = useGetTermsQuery({});
  const availableTerms = useMemo(() => termsData?.data || [], [termsData]);
  const activeTerm =
    availableTerms.find((t: any) => t.status) || availableTerms[0];

  // Fetch classes for selected session
  const {
    data: classesData,
    isLoading: classesLoading,
    isFetching: isClassesFetching,
  } = useGetSessionClassesQuery(selectedSessionId, {
    skip: !selectedSessionId,
  });
  const availableClasses = useMemo(
    () => classesData?.data?.classes || [],
    [classesData]
  );

  // Fetch arms for selected class
  const availableArms = useMemo(() => {
    if (!selectedClassId || !classesData?.data?.classes) return [];
    const selectedClass = classesData.data.classes.find(
      (cls: any) => cls.id === selectedClassId
    );
    return selectedClass?.classArms || [];
  }, [classesData, selectedClassId]);

  // Fetch students for selected session, class, arm
  const {
    data: studentsData,
    isLoading: studentsLoading,
    isFetching: isStudentsFetching,
  } = useGetStudentsQuery(
    {
      sessionId: selectedSessionId,
      classId: selectedClassId,
      classArmId: selectedClassArmId,
      limit: 1000,
    },
    { skip: !(selectedSessionId && selectedClassId && selectedClassArmId) }
  );
  const availableStudents = useMemo(
    () => studentsData?.data?.students || [],
    [studentsData]
  );

  // Invoice mutations
  const [createInvoice, { isLoading: isSavingAdd }] =
    useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isSavingUpdate }] =
    useUpdateInvoiceMutation();

  const isSaving = isEditMode ? isSavingUpdate : isSavingAdd;

  // Set default session/term on mount
  useEffect(() => {
    if (!form.getValues("sessionId") && activeSession) {
      form.setValue("sessionId", activeSession.id);
      setSelectedSessionId(activeSession.id);
    }
    if (!form.getValues("termId") && activeTerm) {
      form.setValue("termId", activeTerm.id);
      setSelectedTermId(activeTerm.id);
    }
  }, [activeSession, activeTerm, form]);

  // Handlers
  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    form.setValue("sessionId", sessionId);
    // Reset class, class arm, student
    form.setValue("classId", "");
    setSelectedClassId("");
    form.setValue("classArmId", "");
    setSelectedClassArmId("");
    form.setValue("studentId", "");
    form.setValue("classIds", []);
  };

  const handleTermChange = (termId: string) => {
    setSelectedTermId(termId);
    form.setValue("termId", termId);
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    form.setValue("classId", classId);
    // Reset class arm and student
    form.setValue("classArmId", "");
    setSelectedClassArmId("");
    form.setValue("studentId", "");
  };

  const handleClassArmChange = (classArmId: string) => {
    setSelectedClassArmId(classArmId);
    form.setValue("classArmId", classArmId);
    // Reset student
    form.setValue("studentId", "");
  };

  // Submit
  const onSubmit = async (values: InvoiceFormValues) => {
    try {
      const payload: any = {
        type: values.invoiceType,
        amount: Number(values.amount),
        title: values.title,
        description: values.description,
        termId: values.termId,
        sessionId: values.sessionId,
      };
      if (values.invoiceType === "mass") {
        payload.classIds = values.classIds;
      } else {
        payload.studentId = values.studentId;
        payload.classId = values.classId;
        payload.classArmId = values.classArmId;
      }
      if (isEditMode && initialData?.id) {
        await updateInvoice({ id: initialData.id, ...payload }).unwrap();
        toast.success("Invoice updated successfully!");
      } else {
        await createInvoice(payload).unwrap();
        toast.success("Invoice created successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } invoice. Please try again.`
      );
    }
  };

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Invoice Type */}
          <div className=''>
            <FormField
              control={form.control}
              name='invoiceType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val as "single" | "mass");
                      setInvoiceType(val as "single" | "mass");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select invoice type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='single'>Single</SelectItem>
                      <SelectItem value='mass'>Mass</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Session */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='sessionId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-1'>
                    Session
                    {sessionsLoading && (
                      <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
                    )}
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleSessionChange}
                    disabled={sessionsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select session' />
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
                  <FormLabel className='flex items-center gap-1'>
                    Term
                    {termsLoading && (
                      <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
                    )}
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleTermChange}
                    disabled={termsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select term' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTerms.map((term: any) => (
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
          </div>

          {/* Title */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter invoice title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter description (optional)'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Amount */}

          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : field.value
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : Number(val));
                    }}
                    placeholder='Enter amount'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mass: Class Multi-select */}
          {invoiceType === "mass" && (
            <FormField
              control={form.control}
              name='classIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-1'>
                    Classes
                    {classesLoading ||
                      (isClassesFetching && (
                        <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
                      ))}
                  </FormLabel>
                  <MultiSelect
                    selected={field.value || []}
                    onChange={field.onChange}
                    options={availableClasses.map((cls: any) => ({
                      label: cls.name,
                      value: cls.id,
                    }))}
                    placeholder='Select classes'
                    disabled={classesLoading || isClassesFetching}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Single: Class, Arm, Student */}
          {invoiceType === "single" && (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='classId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        Class
                        {classesLoading && (
                          <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
                        )}
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          handleClassChange(val);
                          field.onChange(val);
                        }}
                        disabled={classesLoading}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select class' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableClasses.map((cls: any) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='classArmId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        Class Arm
                        {classesLoading && (
                          <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
                        )}
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          handleClassArmChange(val);
                          field.onChange(val);
                        }}
                        disabled={
                          !selectedClassId || availableArms.length === 0
                        }
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select class arm' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableArms.map((arm: any) => (
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
              </div>
              <div className='mt-4'>
                <FormField
                  control={form.control}
                  name='studentId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        Student
                        {studentsLoading ||
                          (isStudentsFetching && (
                            <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
                          ))}
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={studentsLoading || isStudentsFetching}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select student' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableStudents.map((student: any) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.fullname ||
                                `${student.firstname} ${student.lastname}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSaving}>
              {isSaving && <Loader2 className='h-4 w-4 animate-spin mr-2' />}
              {isSaving
                ? "Saving..."
                : isEditMode
                ? "Update Invoice"
                : "Create Invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}