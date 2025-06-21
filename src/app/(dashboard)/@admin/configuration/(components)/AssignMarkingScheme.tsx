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
  useGetTermsQuery,
  useAssignMarkingSchemeMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

interface AssignMarkingSchemeModalProps {
  scheme?: {
    id: string;
    name: string;
    classAssignments: Array<{
      id: string;
      markingSchemeId: string;
      classId: string;
      termDefinitionId: string;
      class: {
        id: string;
        name: string;
      };
      termDefinition: {
        id: string;
        name: string;
      };
    }>;
  }; // The scheme object with class assignments
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ClassTermAssignment {
  classId: string;
  className: string;
  assignedTermIds: string[];
}

export default function AssignMarkingSchemeModal({
  scheme,
  isOpen,
  onClose,
  onSuccess,
}: AssignMarkingSchemeModalProps) {
  const [localClassAssignments, setLocalClassAssignments] = useState<
    ClassTermAssignment[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  const { data: classesData = [], isLoading: isLoadingClasses } =
    useGetClassesQuery({});
  const { data: terms, isLoading: isLoadingTerms } = useGetTermsQuery({});

  const termsData = terms?.data || [];

  // API mutation
  const [assignMarkingScheme] = useAssignMarkingSchemeMutation();

  // Initialize class assignments from the scheme prop
  useEffect(() => {
    if (!isLoadingClasses && classesData.length > 0) {
      const initialAssignments = classesData.map((cls: any) => {
        // Find existing assignments for this class from scheme.classAssignments
        const existingAssignments =
          scheme?.classAssignments?.filter(
            (assignment) => assignment.classId === cls.id
          ) || [];

        const assignedTermIds = existingAssignments.map(
          (assignment) => assignment.termDefinitionId
        );

        return {
          classId: cls.id,
          className: cls.name,
          assignedTermIds,
        };
      });

      setLocalClassAssignments(initialAssignments);
    }
  }, [isLoadingClasses, classesData, scheme?.classAssignments]);

  // Toggle term for a specific class
  const toggleTermForClass = (classId: string, termId: string) => {
    setLocalClassAssignments((prevAssignments) =>
      prevAssignments.map((assignment) => {
        if (assignment.classId === classId) {
          const isCurrentlyAssigned =
            assignment.assignedTermIds.includes(termId);
          return {
            ...assignment,
            assignedTermIds: isCurrentlyAssigned
              ? assignment.assignedTermIds.filter((id) => id !== termId)
              : [...assignment.assignedTermIds, termId],
          };
        }
        return assignment;
      })
    );
  };

  // Select all terms for a class
  const selectAllTermsForClass = (classId: string, selectAll: boolean) => {
    setLocalClassAssignments((prevAssignments) =>
      prevAssignments.map((assignment) => {
        if (assignment.classId === classId) {
          return {
            ...assignment,
            assignedTermIds: selectAll
              ? termsData.map((term: any) => term.id)
              : [],
          };
        }
        return assignment;
      })
    );
  };

  // Remove a specific term from a class
  const removeTermFromClass = (classId: string, termId: string) => {
    setLocalClassAssignments((prevAssignments) =>
      prevAssignments.map((assignment) => {
        if (assignment.classId === classId) {
          return {
            ...assignment,
            assignedTermIds: assignment.assignedTermIds.filter(
              (id) => id !== termId
            ),
          };
        }
        return assignment;
      })
    );
  };

  // Handle form submission
  const onSubmit = async () => {
    // Generate assignments array from class assignments
    const assignments: Array<{ classId: string; termDefinitionId: string }> =
      [];

    localClassAssignments.forEach((classAssignment) => {
      classAssignment.assignedTermIds.forEach((termId) => {
        assignments.push({
          classId: classAssignment.classId,
          termDefinitionId: termId,
        });
      });
    });

    if (assignments.length === 0) {
      toast.error("Please assign at least one class to a term");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        schemeId: scheme?.id,
        assignments,
      };

      console.log("Payload:", payload);
      await assignMarkingScheme(payload).unwrap();

      toast.success("Classes and terms assigned successfully");
      onSuccess();
    } catch (error) {
      console.error("Error assigning classes:", error);
      toast.error("Failed to assign classes and terms");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get term name by ID
  const getTermNameById = (termId: string) => {
    const term = termsData.find((t: any) => t.id === termId);
    return term?.name || termId;
  };

  // Check if all terms are selected for a class
  const areAllTermsSelected = (classId: string) => {
    const assignment = localClassAssignments.find((a) => a.classId === classId);
    return assignment && assignment.assignedTermIds.length === termsData.length;
  };

  if (isLoadingClasses || isLoadingTerms) {
    return <LoaderComponent />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Assign Classes to Terms</DialogTitle>
          <DialogDescription>
            Select which terms each class should be assigned to for this marking
            scheme: {scheme?.name}
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-6'>
          {/* Classes and Terms Assignment */}
          <div className='space-y-4'>
            {localClassAssignments.map((classAssignment) => (
              <div
                key={classAssignment.classId}
                className='border rounded-lg p-4'
              >
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='font-medium text-lg'>
                    {classAssignment.className}
                  </h3>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      checked={areAllTermsSelected(classAssignment.classId)}
                      onCheckedChange={(checked) =>
                        selectAllTermsForClass(
                          classAssignment.classId,
                          checked === true
                        )
                      }
                      className='h-4 w-4 border border-gray-400'
                    />
                    <span className='text-sm text-gray-600'>
                      Select All Terms
                    </span>
                  </div>
                </div>

                {/* Assigned Terms Display */}
                {classAssignment.assignedTermIds.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-3'>
                    {classAssignment.assignedTermIds.map((termId) => (
                      <Badge
                        key={termId}
                        variant='secondary'
                        className='bg-blue-50 text-blue-700'
                      >
                        {getTermNameById(termId)}
                        <button
                          type='button'
                          onClick={() =>
                            removeTermFromClass(classAssignment.classId, termId)
                          }
                          className='ml-1 hover:text-red-500'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Terms Selection Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                  {termsData.map((term: any) => (
                    <div
                      key={term.id}
                      className={`border rounded-md p-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        classAssignment.assignedTermIds.includes(term.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() =>
                        toggleTermForClass(classAssignment.classId, term.id)
                      }
                    >
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          checked={classAssignment.assignedTermIds.includes(
                            term.id
                          )}
                          className={`${
                            classAssignment.assignedTermIds.includes(term.id)
                              ? "data-[state=checked]:text-blue-700 data-[state=checked]:bg-white data-[state=checked]:border-blue-700"
                              : ""
                          } h-3 w-3 border border-gray-400`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            classAssignment.assignedTermIds.includes(term.id)
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {term.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {termsData.length === 0 && (
                  <div className='text-center py-4 text-gray-500'>
                    <p className='text-sm'>No terms available</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {localClassAssignments.length === 0 && (
            <div className='text-center py-8 text-gray-500'>
              <p>No classes available</p>
            </div>
          )}
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
