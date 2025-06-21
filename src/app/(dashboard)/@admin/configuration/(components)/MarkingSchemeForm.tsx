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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateMarkingSchemeMutation,
  useUpdateMarkingSchemeMutation,
} from "@/redux/api";

// Form schema
const markingSchemeSchema = z.object({
  name: z.string().min(1, { message: "Format name is required" }),
  components: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Assessment name is required" }),
        score: z
          .string()
          .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Score must be a positive number",
          }),
        type: z.string().min(1, { message: "Assessment type is required" }),
      })
    )
    .min(1, { message: "At least one assessment is required" }),
});

type FormValues = z.infer<typeof markingSchemeSchema>;

interface MarkingSchemeFormProps {
  scheme?: any; // The scheme to edit, null for creating new
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MarkingSchemeForm({
  scheme,
  isOpen,
  onClose,
  onSuccess,
}: MarkingSchemeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(markingSchemeSchema),
    defaultValues: {
      name: scheme?.name || "",
      components: scheme?.components
        ? scheme.components.map((a: any) => ({
            name: a.name,
            score: a.score.toString(),
            type: a.type,
          }))
        : [{ name: "", score: "", type: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "components",
  });

  // Calculate total score
  const components = form.watch("components");
  const totalScore = components.reduce((sum, component) => {
    const score = parseInt(component.score) || 0;
    return sum + score;
  }, 0);

  // Check if total score is 100
  const isTotalValid = totalScore === 100;

  // API mutations
  const [createMarkingScheme] = useCreateMarkingSchemeMutation();
  const [updateMarkingScheme] = useUpdateMarkingSchemeMutation();

  // Handle submit
  const onSubmit = async (data: FormValues) => {
    if (!isTotalValid) {
      toast.error("Total score must equal 100%");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert scores to numbers
      const formattedData = {
        ...data,
        components: data.components.map((component) => ({
          ...component,
          score: parseInt(component.score),
        })),
      };

      if (scheme) {
        // Update existing marking scheme
        await updateMarkingScheme({
          id: scheme.id,
          ...formattedData,
        }).unwrap();
        toast.success("Marking scheme updated");
      } else {
        // Create new marking scheme
        // console.log(formattedData)
         await createMarkingScheme(formattedData).unwrap();
       
        toast.success("Marking scheme created");
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting marking scheme:", error);
      toast.error("Failed to save marking scheme");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new assessment
  const addAssessment = () => {
    append({ name: "", score: "", type: "" });
  };

  // Remove an assessment
  const removeAssessment = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("You must have at least one assessment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {scheme ? "Edit" : "Create new"} Marking Scheme
          </DialogTitle>
          <DialogDescription>
            Set a marking guide. Example: Total score 100, CA 20-20
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
                      placeholder='Enter format name e.g. New Marking Scheme'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assessments */}
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <h3 className='text-sm font-medium'>
                  Assessments{" "}
                  {!isTotalValid && (
                    <span className='text-red-500 ml-2'>
                      (Total: {totalScore}%, should be 100%)
                    </span>
                  )}
                </h3>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addAssessment}
                  className='h-8'
                >
                  <Plus className='h-4 w-4 mr-1' /> Add Assessment
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className='grid grid-cols-12 gap-4'>
                  {/* Assessment Name */}
                  <FormField
                    control={form.control}
                    name={`components.${index}.name`}
                    render={({ field }) => (
                      <FormItem className='col-span-5'>
                        <FormLabel>
                          Assessment name<span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter assessment name'
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
                      <FormItem className='col-span-3'>
                        <FormLabel>
                          Score<span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter score'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Assessment Type */}
                  <FormField
                    control={form.control}
                    name={`components.${index}.type`}
                    render={({ field }) => (
                      <FormItem className='col-span-3'>
                        <FormLabel>
                          Type<span className='text-red-500'>*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='CA'>CA</SelectItem>
                            <SelectItem value='EXAM'>EXAM</SelectItem>
                          </SelectContent>
                        </Select>
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
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting || !isTotalValid}>
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
