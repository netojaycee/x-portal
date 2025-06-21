"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateGradingSystemMutation,
  useUpdateGradingSystemMutation,
} from "@/redux/api";

// Form schema
const gradingSchemeSchema = z.object({
  name: z.string().min(1, { message: "Format name is required" }),
  grades: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Assessment name is required" }),
        scoreStartPoint: z
          .string()
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Score must be a non-negative number",
          }),
        scoreEndPoint: z
          .string()
          .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Score must be a positive number",
          }),
        remark: z.string().min(1, { message: "Remark is required" }),
        teacherComment: z
          .string()
          .min(1, { message: "Teacher's comment is required" }),
        principalComment: z
          .string()
          .min(1, { message: "Principal's comment is required" }),
      })
    )
    .min(1, { message: "At least one grade is required" })
    .refine(
      (grades) => {
        // Check for overlapping ranges
        const sortedGrades = [...grades].sort(
          (a, b) => Number(a.scoreStartPoint) - Number(b.scoreStartPoint)
        );

        for (let i = 0; i < sortedGrades.length - 1; i++) {
          const current = sortedGrades[i];
          const next = sortedGrades[i + 1];

          if (Number(current.scoreEndPoint) > Number(next.scoreStartPoint)) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Grade score ranges cannot overlap",
      }
    ),
});

type FormValues = z.infer<typeof gradingSchemeSchema>;

interface GradingSchemeFormProps {
  scheme?: any; // The scheme to edit, null for creating new
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GradingSchemeForm({
  scheme,
  isOpen,
  onClose,
  onSuccess,
}: GradingSchemeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API mutations
  const [createGradingSystem] = useCreateGradingSystemMutation();
  const [updateGradingSystem] = useUpdateGradingSystemMutation();
console.log(scheme, "grading data");
  const form = useForm<FormValues>({
    resolver: zodResolver(gradingSchemeSchema),
    defaultValues: {
      name: scheme?.name || "",
      grades: scheme?.grades
        ? scheme.grades.map((g: any) => ({
            name: g.name,
            scoreStartPoint: g.scoreStartPoint.toString(),
            scoreEndPoint: g.scoreEndPoint.toString(),
            remark: g.remark,
            teacherComment: g.teacherComment,
            principalComment: g.principalComment,
          }))
        : [
            {
              name: "F9",
              scoreStartPoint: "0",
              scoreEndPoint: "40",
              remark: "Poor",
              teacherComment: "Go Hard or Go Home",
              principalComment: "Very poor, Go hard or Go Home",
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "grades",
  });

  // Check for valid ranges in the UI
  const grades = form.watch("grades");
  const hasOverlappingRanges = () => {
    const sortedGrades = [...grades].sort(
      (a, b) => Number(a.scoreStartPoint) - Number(b.scoreStartPoint)
    );

    for (let i = 0; i < sortedGrades.length - 1; i++) {
      const current = sortedGrades[i];
      const next = sortedGrades[i + 1];

      if (Number(current.scoreEndPoint) > Number(next.scoreStartPoint)) {
        return true;
      }
    }
    return false;
  };

  const hasInvalidRanges = grades.some(
    (g) => Number(g.scoreEndPoint) <= Number(g.scoreStartPoint)
  );

  // Handle submit
  const onSubmit = async (data: FormValues) => {
    if (hasOverlappingRanges()) {
      toast.error("Grade score ranges cannot overlap");
      return;
    }

    if (hasInvalidRanges) {
      toast.error("End point must be greater than start point");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert scores to numbers
      const formattedData = {
        ...data,
        grades: data.grades.map((grade) => ({
          ...grade,
          scoreStartPoint: parseInt(grade.scoreStartPoint),
          scoreEndPoint: parseInt(grade.scoreEndPoint),
        })),
      };

      if (scheme) {
        // Update existing grading scheme
        await updateGradingSystem({
          id: scheme.id,
          ...formattedData,
        }).unwrap();
        toast.success("Grading system updated");
      } else {
        // Create new grading system
        // console.log(formattedData)
        await createGradingSystem(formattedData).unwrap();
        toast.success("Grading system created");
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting grading system:", error);
      toast.error("Failed to save grading system");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new grade
  const addGrade = () => {
    // Find the highest score range end
    const highestEnd = Math.max(
      ...grades.map((g) => Number(g.scoreEndPoint)),
      0
    );

    append({
      name: "",
      scoreStartPoint: highestEnd.toString(),
      scoreEndPoint: (highestEnd + 10).toString(),
      remark: "",
      teacherComment: "",
      principalComment: "",
    });
  };

  // Remove a grade
  const removeGrade = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("You must have at least one grade");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {scheme ? "Edit" : "Create new"} Grading Scheme
          </DialogTitle>
          <DialogDescription>
            Set a grading scheme with score ranges, remarks and comments.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Format Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Format Name<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter format name e.g. General Grade Format'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grade Information */}
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <h3 className='text-sm font-medium'>
                  Grade Information
                  {hasOverlappingRanges() && (
                    <span className='text-red-500 ml-2'>
                      (Warning: Overlapping score ranges)
                    </span>
                  )}
                  {hasInvalidRanges && (
                    <span className='text-red-500 ml-2'>
                      (Warning: End point must be greater than start point)
                    </span>
                  )}
                </h3>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addGrade}
                  className='h-8'
                >
                  <Plus className='h-4 w-4 mr-1' /> Add Grade
                </Button>
              </div>

              <p className='text-sm text-gray-500'>
                Fill the fields below to create a grade format
              </p>
            </div>

            {/* Grades */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className='border rounded-md p-4 space-y-4 relative'
              >
                {/* Delete Button - positioned at top right */}
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute top-2 right-2 h-8 w-8'
                  onClick={() => removeGrade(index)}
                >
                  <Trash2 className='h-4 w-4 text-red-500' />
                </Button>

                <div className='grid grid-cols-3 gap-4'>
                  {/* Assessment Name */}
                  <FormField
                    control={form.control}
                    name={`grades.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Assessment name<span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='E.g. F9, E8, A1' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Score Range Start */}
                  <FormField
                    control={form.control}
                    name={`grades.${index}.scoreStartPoint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Score Range start point
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='E.g. 0, 40, 60'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Score Range End */}
                  <FormField
                    control={form.control}
                    name={`grades.${index}.scoreEndPoint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Score Range end point
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='E.g. 39, 59, 100'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-3 gap-4'>
                  {/* Remark */}
                  <FormField
                    control={form.control}
                    name={`grades.${index}.remark`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Remark<span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='E.g. Poor, Good, Excellent'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Teacher's Comment */}
                  <FormField
                    control={form.control}
                    name={`grades.${index}.teacherComment`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher&apos;s Comment
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Teacher's comment for this grade"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Principal's Comment */}
                  <FormField
                    control={form.control}
                    name={`grades.${index}.principalComment`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Principal&apos;s Comment
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Principal's comment for this grade"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={
                  isSubmitting || hasOverlappingRanges() || hasInvalidRanges
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
