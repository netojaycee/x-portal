"use client";

import React from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useGetClassCategoriesQuery,
} from "@/redux/api";

const ViewTranscriptFormSchema = z.object({
  studentIdentifier: z.string().min(1, { message: "Please enter student name or registration number" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
});

type ViewTranscriptFormValues = z.infer<typeof ViewTranscriptFormSchema>;

// Define interfaces for data structure
interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ViewTranscriptFormProps {
  onClose?: () => void;
}

export function ViewTranscriptForm({ onClose }: ViewTranscriptFormProps) {
  const router = useRouter();

  const form = useForm<ViewTranscriptFormValues>({
    resolver: zodResolver(ViewTranscriptFormSchema),
    defaultValues: {
      studentIdentifier: "",
      categoryId: "",
    },
  });

  // Fetch class categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetClassCategoriesQuery({});

  const onSubmit = (values: ViewTranscriptFormValues) => {
    // Build query parameters
    const queryParams = new URLSearchParams({
      name: values.studentIdentifier,
      categoryId: values.categoryId,
    });

    // Navigate to transcript page
    router.push(`/results/transcript?${queryParams.toString()}`);
    onClose?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-2'>
        {/* Student Name/Registration Number Field */}
        <FormField
          control={form.control}
          name='studentIdentifier'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Name or Registration Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Enter student name or registration number'
                  className='w-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={categoriesLoading}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value='loading' disabled>
                      Loading categories...
                    </SelectItem>
                  ) : categoriesData?.data?.length ? (
                    categoriesData.data.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                        {category.description && (
                          <span className='text-sm text-gray-500 ml-2'>
                            - {category.description}
                          </span>
                        )}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='empty' disabled>
                      No categories available
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
            View Transcript
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
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   useGetClassCategoriesQuery,
// } from "@/redux/api";

// const ViewTranscriptFormSchema = z.object({
//   studentIdentifier: z.string().min(1, { message: "Please enter student name or registration number" }),
//   categoryId: z.string().min(1, { message: "Please select a category" }),
// });

// type ViewTranscriptFormValues = z.infer<typeof ViewTranscriptFormSchema>;

// // Define interfaces for data structure
// interface Category {
//   id: string;
//   name: string;
//   description?: string;
// }

// interface ViewTranscriptFormProps {
//   onClose?: () => void;
// }

// export function ViewTranscriptForm({ onClose }: ViewTranscriptFormProps) {
//   const router = useRouter();

//   const form = useForm<ViewTranscriptFormValues>({
//     resolver: zodResolver(ViewTranscriptFormSchema),
//     defaultValues: {
//       studentIdentifier: "",
//       categoryId: "",
//     },
//   });

//   // Fetch class categories
//   const { data: categoriesData, isLoading: categoriesLoading } =
//     useGetClassCategoriesQuery({});

//   const onSubmit = (values: ViewTranscriptFormValues) => {
//     // Build query parameters
//     const queryParams = new URLSearchParams({
//       name: values.studentIdentifier,
//       categoryId: values.categoryId,
//     });

//     // Navigate to transcript page
//     router.push(`/results/transcript?${queryParams.toString()}`);
//     onClose?.();
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-2'>
//         {/* Student Name/Registration Number Field */}
//         <FormField
//           control={form.control}
//           name='studentIdentifier'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Student Name or Registration Number</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   placeholder='Enter student name or registration number'
//                   className='w-full'
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Category Field */}
//         <FormField
//           control={form.control}
//           name='categoryId'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Category</FormLabel>
//               <Select
//                 onValueChange={field.onChange}
//                 value={field.value}
//                 disabled={categoriesLoading}
//               >
//                 <FormControl>
//                   <SelectTrigger className='w-full'>
//                     <SelectValue placeholder='Select category' />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {categoriesLoading ? (
//                     <SelectItem value='loading' disabled>
//                       Loading categories...
//                     </SelectItem>
//                   ) : categoriesData?.data?.length ? (
//                     categoriesData.data.map((category: Category) => (
//                       <SelectItem key={category.id} value={category.id}>
//                         {category.name}
//                         {category.description && (
//                           <span className='text-sm text-gray-500 ml-2'>
//                             - {category.description}
//                           </span>
//                         )}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <SelectItem value='empty' disabled>
//                       No categories available
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
//             View Transcript
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
