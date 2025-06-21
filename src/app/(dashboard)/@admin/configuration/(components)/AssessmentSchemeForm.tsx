"use client";
import React from "react";
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
import {
  Loader2,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useUpdateAssessmentSchemeMutation } from "@/redux/api";

// Form schema
const assessmentSchemeSchema = (maxScore?: number) =>
  z
    .object({
      components: z
        .array(
          z.object({
            name: z.string().min(1, { message: "Label is required" }),
            score: z
              .string()
              .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
                message: "Score must be a positive number",
              }),
          })
        )
        .min(1, { message: "At least one assessment is required" }),
    })
    .refine(
      (data) => {
        const totalScore = data.components.reduce(
          (sum, assessment) => sum + Number(assessment.score),
          0
        );
        return maxScore ? totalScore <= maxScore : true;
      },
      {
        message: `Total score cannot exceed ${maxScore || 20}`,
        path: ["components"],
      }
    );

type FormValues = z.infer<ReturnType<typeof assessmentSchemeSchema>>;

interface AssessmentSchemeFormProps {
  scheme?: any; // The scheme to edit, null for creating new
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssessmentSchemeForm({
  scheme,
  isOpen,
  onClose,
  onSuccess,
}: AssessmentSchemeFormProps) {
  console.log(scheme, " scheme data");
  // API mutations
  const [updateAssessmentScheme, { isLoading, isSuccess, isError, error }] =
    useUpdateAssessmentSchemeMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(
      assessmentSchemeSchema(scheme?.markingSchemeComponent?.score)
    ),
    defaultValues: {
      components:
        scheme?.components.length > 0
          ? scheme.components.map((a: any) => ({
              name: a.name,
              score: a.score.toString(),
            }))
          : [{ name: "", score: "" }],
    },
    mode: "onChange", // Enable real-time validation
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "components",
  });

  // Calculate total score
  const totalScore = form.watch("components").reduce((sum, assessment) => {
    const score = parseInt(assessment.score) || 0;
    return sum + score;
  }, 0);

  // Check if total score is valid
  const isTotalValid = totalScore === scheme?.markingSchemeComponent?.score;

  // Get score remaining
  const remainingScore = scheme?.markingSchemeComponent?.score - totalScore;

  const onSubmit = async (data: FormValues) => {
    try {
      const formattedData = {
        ...data,
        components: data.components.map((assessment) => ({
          ...assessment,
          score: parseInt(assessment.score),
        })),
      };

      const credentials = {
        id: scheme.id,
        ...formattedData,
      };
      // Update existing assessment scheme
      console.log("Updating assessment scheme:", credentials);
      await updateAssessmentScheme(credentials).unwrap();
    } catch (error: any) {
      console.error("Error submitting assessment scheme:", error);
      const errorMsg =
        error?.data?.message || "Failed to save assessment scheme";
      // setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Assessment scheme updated successfully");
      onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, onSuccess]);

  // Add a new assessment
  const addAssessment = () => {
    append({ name: "", score: "" });
  };

  // Remove an assessment
  const removeAssessment = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("You must have at least one assessment");
    }
  };

  // Close form with confirmation if there are changes
  const handleClose = () => {
    const isDirty = form.formState.isDirty;
    if (isDirty && !isLoading) {
      if (
        confirm(
          "You have unsaved changes. Are you sure you want to close this form?"
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            Update Assessment Scheme for {scheme?.markingSchemeComponent?.name}
          </DialogTitle>
          <DialogDescription>
            Set an assessment scheme. Define sub-components and their respective
            scores.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Score tracker */}
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <h3 className='text-sm font-medium'>Total Score</h3>
                <span
                  className={`text-sm font-medium ${
                    totalScore > scheme?.markingSchemeComponent?.score
                      ? "text-red-600"
                      : totalScore === scheme?.markingSchemeComponent?.score
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {totalScore}/{scheme?.markingSchemeComponent?.score}
                </span>
              </div>
              <Progress
                value={
                  (totalScore / scheme?.markingSchemeComponent?.score) * 100
                }
                className={`h-2 ${
                  totalScore > scheme?.markingSchemeComponent?.score
                    ? "[&>div]:bg-red-500"
                    : totalScore === scheme?.markingSchemeComponent?.score
                    ? "[&>div]:bg-green-500"
                    : totalScore >= scheme?.markingSchemeComponent?.score * 0.7
                    ? "[&>div]:bg-amber-500"
                    : "[&>div]:bg-blue-500"
                }`}
              />

              <div className='flex justify-between text-xs'>
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>

              {totalScore > 100 ? (
                <div className='text-xs text-red-600 flex items-center mt-1'>
                  <AlertTriangle className='h-3 w-3 mr-1' />
                  Total exceeds {scheme?.markingSchemeComponent?.score} by{" "}
                  {totalScore - scheme?.markingSchemeComponent?.score}
                </div>
              ) : totalScore === scheme?.markingSchemeComponent?.score ? (
                <div className='text-xs text-green-600 flex items-center mt-1'>
                  <CheckCircle className='h-3 w-3 mr-1' />
                  Perfect! Total is exactly{" "}
                  {scheme?.markingSchemeComponent?.score} marks.
                </div>
              ) : (
                <div className='text-xs text-blue-600 flex items-center mt-1'>
                  <Info className='h-3 w-3 mr-1' />
                  {remainingScore} marks remaining to allocate
                </div>
              )}
            </div>

            {/* Assessments */}
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <h3 className='text-sm font-medium'>
                  Sub-Assessments <span className='text-red-500'>*</span>
                </h3>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addAssessment}
                  className='h-8'
                >
                  <Plus className='h-4 w-4 mr-1' /> Add Sub-Assessment
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className='grid grid-cols-12 gap-4 p-3 rounded-md bg-gray-50'
                >
                  {/* Assessment Label */}
                  <FormField
                    control={form.control}
                    name={`components.${index}.name`}
                    render={({ field }) => (
                      <FormItem className='col-span-6'>
                        <FormLabel>Assessment Label</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter assessment name (e.g. Home work)'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Assessment Score */}
                  <FormField
                    control={form.control}
                    name={`components.${index}.score`}
                    render={({ field }) => (
                      <FormItem className='col-span-5'>
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter score (e.g. 5)'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Delete Button */}
                  <div className='col-span-1 flex items-end justify-center'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10'
                      onClick={() => removeAssessment(index)}
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!form.formState.isValid || isLoading || !isTotalValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin mr-2' />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
