
"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetClassesQuery,
  useAssignGradingSystemMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

interface AssignGradingSystemModalProps {
  scheme?: {
    id: string;
    name: string;
    classAssignments?: Array<{
      id: string;
      gradingSchemeId: string;
      classId: string;
      class: {
        id: string;
        name: string;
      };
    }>;
  }; // The grading scheme object
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignGradingSystemModal({
  scheme,
  isOpen,
  onClose,
  onSuccess,
}: AssignGradingSystemModalProps) {
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  const { data: classesData = [], isLoading: isLoadingClasses } =
    useGetClassesQuery({});

  // API mutation
  const [assignGradingScheme] = useAssignGradingSystemMutation();

  // Initialize selected classes from the scheme prop
  useEffect(() => {
    if (scheme?.classAssignments) {
      const existingClassIds = scheme.classAssignments.map(
        (assignment) => assignment.classId
      );
      setSelectedClassIds(existingClassIds);
    }
  }, [scheme?.classAssignments]);

  // Toggle class selection
  const toggleClass = (classId: string) => {
    setSelectedClassIds((prevClassIds) => {
      if (prevClassIds.includes(classId)) {
        return prevClassIds.filter((id) => id !== classId);
      } else {
        return [...prevClassIds, classId];
      }
    });
  };

  // Remove class
  const removeClass = (classId: string) => {
    setSelectedClassIds((prevClassIds) =>
      prevClassIds.filter((id) => id !== classId)
    );
  };

  // Select all classes
  const selectAllClasses = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedClassIds(classesData.map((cls: any) => cls.id));
    } else {
      setSelectedClassIds([]);
    }
  };

  // Handle form submission
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        gradingSystemId: scheme?.id,
        classIds: selectedClassIds,
      };

    //   console.log("Payload:", payload);
      await assignGradingScheme(payload).unwrap();

      toast.success("Classes assigned successfully");
      onSuccess();
    } catch (error) {
      console.error("Error assigning classes:", error);
      toast.error("Failed to assign classes");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected classes for display
  const selectedClasses = classesData.filter((cls: any) =>
    selectedClassIds.includes(cls.id)
  );

  // Check if all classes are selected
  const areAllClassesSelected = selectedClassIds.length === classesData.length;

  if (isLoadingClasses) {
    return <LoaderComponent />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Assign Classes to Grading Scheme</DialogTitle>
          <DialogDescription>
            Select which classes should use this grading scheme: {scheme?.name}
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-6'>
          {/* Select All Toggle */}
          <div className='flex items-center space-x-2 border-b pb-4'>
            <Checkbox
              checked={areAllClassesSelected}
              onCheckedChange={(checked) => selectAllClasses(checked === true)}
              className='h-4 w-4 border border-gray-400'
            />
            <span className='text-sm font-medium'>Select All Classes</span>
            <span className='text-xs text-gray-500'>
              ({selectedClassIds.length} of {classesData.length} selected)
            </span>
          </div>

          {/* Selected Classes Display */}
          {selectedClasses.length > 0 && (
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Selected Classes</label>
              <div className='flex flex-wrap gap-2'>
                {selectedClasses.map((cls: any) => (
                  <Badge
                    key={cls.id}
                    variant='secondary'
                    className='bg-blue-50 text-blue-700'
                  >
                    {cls.name}
                    <button
                      type='button'
                      onClick={() => removeClass(cls.id)}
                      className='ml-1 hover:text-red-500'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Classes Selection Grid */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>Available Classes</label>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-1'>
              {classesData.map((cls: any) => (
                <div
                  key={cls.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedClassIds.includes(cls.id)
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  onClick={() => toggleClass(cls.id)}
                >
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      checked={selectedClassIds.includes(cls.id)}
                      className={`${
                        selectedClassIds.includes(cls.id)
                          ? "data-[state=checked]:text-blue-700 data-[state=checked]:bg-white data-[state=checked]:border-blue-700"
                          : ""
                      } h-4 w-4 border border-gray-400`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        selectedClassIds.includes(cls.id)
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {cls.name}
                    </span>
                  </div>
                  {cls.description && (
                    <p className='text-xs text-gray-500 mt-1'>
                      {cls.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {classesData.length === 0 && (
              <div className='text-center py-8 text-gray-500'>
                <p>No classes available</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              "Save Assignments"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}