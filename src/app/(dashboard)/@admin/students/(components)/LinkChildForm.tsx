"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDebounce } from "use-debounce";
import { useGetStudentsQuery, useLinkParentStudentMutation } from "@/redux/api";
import { toast } from "sonner";

const relationshipOptions = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "brother", label: "Brother" },
  { value: "sister", label: "Sister" },
  { value: "guardian", label: "Guardian" },
  { value: "other", label: "Other (specify)" },
];

const linkChildSchema = z
  .object({
    studentId: z.string().min(1, "Student is required"),
    relationship: z.string().min(1, "Relationship is required"),
    otherRelationship: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.relationship === "other") {
        return (
          !!data.otherRelationship && data.otherRelationship.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Please specify the relationship",
      path: ["otherRelationship"],
    }
  );

type LinkChildFormData = z.infer<typeof linkChildSchema>;

interface LinkChildFormProps {
  parentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const LinkChildForm: React.FC<LinkChildFormProps> = ({
  parentId,
  onSuccess,
  onCancel,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm] = useDebounce(search, 400);
  const [showOther, setShowOther] = useState(false);

  const { data, isLoading: studentsLoading } = useGetStudentsQuery({
    q: debouncedSearchTerm,
  });

  const studentsData = data?.data?.students || [];

  const [linkParentStudent, { isLoading }] = useLinkParentStudentMutation();

  const form = useForm<LinkChildFormData>({
    resolver: zodResolver(linkChildSchema),
    defaultValues: {
      studentId: "",
      relationship: "",
      otherRelationship: "",
    },
  });

  const handleRelationshipChange = (value: string) => {
    form.setValue("relationship", value);
    setShowOther(value === "other");
    if (value !== "other") {
      form.setValue("otherRelationship", "");
    }
  };

  const onSubmit = async (values: LinkChildFormData) => {
    try {
      const relationshipToSend =
        values.relationship === "other"
          ? values.otherRelationship
          : values.relationship;

      const data = {
        parentId,
        studentId: values.studentId,
        relationship: relationshipToSend,
      };
      await linkParentStudent(data).unwrap();
      toast.success("Child linked successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to link child. Please try again."
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='studentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student</FormLabel>
              <Input
                placeholder='Search student by name or reg no...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='mb-2'
              />
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={studentsLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select student' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {studentsLoading ? (
                    <SelectItem value='loading' disabled>
                      Loading students...
                    </SelectItem>
                  ) : studentsData?.length ? (
                    studentsData.map((student: any) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student?.firstname} {student?.lastname}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='no-students' disabled>
                      No students found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='relationship'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <Select
                onValueChange={handleRelationshipChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select relationship' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {relationshipOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {showOther && (
          <FormField
            control={form.control}
            name='otherRelationship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Relationship</FormLabel>
                <FormControl>
                  <Input placeholder='Enter relationship' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className='flex justify-end gap-2 mt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? "Linking..." : "Link Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LinkChildForm;
