// "use client";
// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { X, ChevronDown, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import {
//   useGetClassesQuery,
//   useGetClassArmsQuery,
//   useGetSessionsQuery,
//   useAssignClassesToMarkingSchemeMutation,
// } from "@/redux/api";
// import LoaderComponent from "@/components/local/LoaderComponent";

// interface AssignClassModalProps {
//   scheme?: any; // The scheme to edit
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface FormData {
//   terms: string[];
//   classes: {
//     classId: string;
//     className: string;
//     selectAllArms: boolean;
//     arms: {
//       armId: string;
//       armName: string;
//       selected: boolean;
//     }[];
//   }[];
// }

// export default function AssignClassModal({
//   scheme,
//   isOpen,
//   onClose,
//   onSuccess,
// }: AssignClassModalProps) {
//   const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
//   const [showTermsDropdown, setShowTermsDropdown] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch data
//   const { data: classesData = [], isLoading: isLoadingClasses } =
//     useGetClassesQuery({});
//   const { data: classArmsData = [], isLoading: isLoadingArms } =
//     useGetClassArmsQuery({});
//   const { data: sessionsData, isLoading: isLoadingSessions } =
//     useGetSessionsQuery({});

//   // Extract all terms from sessions
//   const allTerms = React.useMemo(() => {
//     if (!sessionsData?.data) return [];

//     const terms: { id: string; name: string }[] = [];
//     sessionsData.data.forEach((session) => {
//       if (session.terms) {
//         session.terms.forEach((term) => {
//           terms.push({
//             id: term.id,
//             name: term.name,
//           });
//         });
//       }
//     });

//     return terms;
//   }, [sessionsData]);

//   // Initialize form
//   const form = useForm<FormData>({
//     defaultValues: {
//       terms: scheme?.terms || [],
//       classes: [],
//     },
//   });

//   // Set up classes and arms
//   useEffect(() => {
//     if (!isLoadingClasses && !isLoadingArms && classesData && classArmsData) {
//       // Extract existing classes and arms from scheme
//       const existingClasses = scheme?.classes || [];

//       // Format classes with arms
//       const formattedClasses = classesData.map((cls: any) => {
//         // Find this class in the scheme
//         const existingClass = existingClasses.find(
//           (c: any) => c.name === cls.name
//         );

//         // Get arms for this class
//         const classArms = classArmsData.filter((arm: any) => true); // In a real scenario, filter by class association

//         // Format arms
//         const arms = classArms.map((arm: any) => {
//           const isSelected = existingClass?.arms?.includes(arm.name);
//           return {
//             armId: arm.id,
//             armName: arm.name,
//             selected: !!isSelected,
//           };
//         });

//         // Determine if all arms are selected
//         const allArmsSelected =
//           arms.length > 0 && arms.every((arm) => arm.selected);

//         return {
//           classId: cls.id,
//           className: cls.name,
//           selectAllArms: allArmsSelected,
//           arms,
//         };
//       });

//       // Set form values
//       form.setValue("classes", formattedClasses);

//       // Set selected terms
//       if (scheme?.terms) {
//         setSelectedTerms(scheme.terms);
//       }
//     }
//   }, [
//     isLoadingClasses,
//     isLoadingArms,
//     classesData,
//     classArmsData,
//     scheme,
//     form,
//   ]);

//   // API mutation
//   const [assignClassesToMarkingScheme] =
//     useAssignClassesToMarkingSchemeMutation();

//   // Handle form submission
//   const onSubmit = async (data: FormData) => {
//     if (selectedTerms.length === 0) {
//       toast.error("Please select at least one term");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // Prepare data for submission
//       const selectedClasses = data.classes.filter(
//         (cls) => cls.selectAllArms || cls.arms.some((arm) => arm.selected)
//       );

//       const payload = {
//         schemeId: scheme?.id,
//         terms: selectedTerms,
//         classes: selectedClasses.map((cls) => ({
//           classId: cls.classId,
//           className: cls.className,
//           allArms: cls.selectAllArms,
//           arms: cls.selectAllArms
//             ? []
//             : cls.arms
//                 .filter((arm) => arm.selected)
//                 .map((arm) => ({ id: arm.armId, name: arm.armName })),
//         })),
//       };

//       // Call the API
//       await assignClassesToMarkingScheme(payload).unwrap();

//       toast.success("Classes assigned successfully");
//       onSuccess();
//     } catch (error) {
//       console.error("Error assigning classes:", error);
//       toast.error("Failed to assign classes");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Toggle class selection (all arms)
//   const toggleClass = (index: number, checked: boolean) => {
//     const updatedClasses = [...form.getValues().classes];
//     updatedClasses[index].selectAllArms = checked;

//     // When selecting all arms, set all individual arms to selected
//     if (checked) {
//       updatedClasses[index].arms = updatedClasses[index].arms.map((arm) => ({
//         ...arm,
//         selected: true,
//       }));
//     }

//     form.setValue("classes", updatedClasses);
//   };

//   // Toggle arm selection
//   const toggleArm = (
//     classIndex: number,
//     armIndex: number,
//     checked: boolean
//   ) => {
//     const updatedClasses = [...form.getValues().classes];
//     updatedClasses[classIndex].arms[armIndex].selected = checked;

//     // Update the selectAllArms flag based on arm selections
//     const allArmsSelected = updatedClasses[classIndex].arms.every(
//       (arm) => arm.selected
//     );
//     updatedClasses[classIndex].selectAllArms = allArmsSelected;

//     form.setValue("classes", updatedClasses);
//   };

//   // Toggle term selection
//   const toggleTerm = (term: { id: string; name: string }) => {
//     setSelectedTerms((prevTerms) => {
//       if (prevTerms.includes(term.name)) {
//         return prevTerms.filter((t) => t !== term.name);
//       } else {
//         return [...prevTerms, term.name];
//       }
//     });
//   };

//   // Remove term
//   const removeTerm = (term: string) => {
//     setSelectedTerms((prevTerms) => prevTerms.filter((t) => t !== term));
//   };

//   if (isLoadingClasses || isLoadingArms || isLoadingSessions) {
//     return <LoaderComponent />;
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
//         <DialogHeader>
//           <DialogTitle>Assign Classes</DialogTitle>
//           <DialogDescription>
//             Select terms and classes to assign to this marking scheme
//           </DialogDescription>
//         </DialogHeader>

//         <div className='py-4 space-y-4'>
//           {/* Term Selection */}
//           <div className='space-y-2'>
//             <label className='text-sm font-medium'>Assign Terms</label>

//             {/* Selected Terms */}
//             <div className='flex flex-wrap gap-2 mb-2'>
//               {selectedTerms.map((term, index) => (
//                 <Badge key={index} variant='secondary' className='bg-blue-50'>
//                   {term}
//                   <button
//                     type='button'
//                     onClick={() => removeTerm(term)}
//                     className='ml-1 hover:text-red-500'
//                   >
//                     <X className='h-3 w-3' />
//                   </button>
//                 </Badge>
//               ))}
//             </div>

//             {/* Terms Dropdown */}
//             <div className='relative'>
//               <Button
//                 type='button'
//                 variant='outline'
//                 className='w-full justify-between'
//                 onClick={() => setShowTermsDropdown(!showTermsDropdown)}
//               >
//                 Select Terms
//                 <ChevronDown className='h-4 w-4 ml-2' />
//               </Button>

//               {showTermsDropdown && (
//                 <div className='absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
//                   {allTerms.length === 0 ? (
//                     <div className='p-2 text-sm text-gray-500'>
//                       No terms available
//                     </div>
//                   ) : (
//                     allTerms.map((term) => (
//                       <div
//                         key={term.id}
//                         className='flex items-center p-2 hover:bg-gray-100 cursor-pointer'
//                         onClick={() => toggleTerm(term)}
//                       >
//                         <Checkbox
//                           checked={selectedTerms.includes(term.name)}
//                           className='mr-2'
//                         />
//                         <span>{term.name}</span>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Class Selection */}
//           <div className='space-y-2'>
//             <label className='text-sm font-medium'>Assign Classes</label>

//             <div className='space-y-4 max-h-[300px] overflow-y-auto p-1'>
//               {form.getValues().classes.map((cls, classIndex) => (
//                 <div key={cls.classId} className='pb-2'>
//                   <div className='flex items-center space-x-2 bg-[#E1E8F8] p-2'>
//                     <Checkbox
//                       id={`class-${cls.classId}`}
//                       checked={cls.selectAllArms}
//                       onCheckedChange={(checked) =>
//                         toggleClass(classIndex, checked === true)
//                       }
//                       className={`${
//                         cls.selectAllArms
//                           ? "data-[state=checked]:text-green-700 data-[state=checked]:bg-white data-[state=checked]:border-green-700"
//                           : ""
//                       } h-4 w-4 border border-black`}
//                     />
//                     <label
//                       htmlFor={`class-${cls.classId}`}
//                       className='text-sm font-medium'
//                     >
//                       {cls.className}
//                     </label>
//                   </div>

//                   {/* Arms for this class */}
//                   {cls.arms.length > 0 && (
//                     <div className='flex flex-wrap gap-4 bg-[#f5f5f5] p-2 mt-1'>
//                       {cls.arms.map((arm, armIndex) => (
//                         <div
//                           key={arm.armId}
//                           className='flex items-center space-x-2'
//                         >
//                           <Checkbox
//                             id={`arm-${cls.classId}-${arm.armId}`}
//                             checked={arm.selected}
//                             onCheckedChange={(checked) =>
//                               toggleArm(classIndex, armIndex, checked === true)
//                             }
//                             className={`${
//                               arm.selected
//                                 ? "data-[state=checked]:text-green-700 data-[state=checked]:bg-white data-[state=checked]:border-green-700"
//                                 : ""
//                             } h-4 w-4 border border-black`}
//                           />
//                           <label
//                             htmlFor={`arm-${cls.classId}-${arm.armId}`}
//                             className='text-xs'
//                           >
//                             {arm.armName}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   {cls.arms.length === 0 && (
//                     <div className='text-xs text-gray-500 p-2 bg-[#f5f5f5] mt-1'>
//                       No arms available for this class
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button type='button' variant='outline' onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             onClick={() => onSubmit(form.getValues())}
//             disabled={isSubmitting || selectedTerms.length === 0}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                 Saving...
//               </>
//             ) : (
//               "Save"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


