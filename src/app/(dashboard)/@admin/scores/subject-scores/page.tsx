"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import LoaderComponent from "@/components/local/LoaderComponent";
import {
  useGetSessionClassStudentsQuery,
  useGetClassMarkingSchemeQuery,
  useGetStudentScoresQuery,
  useSubmitStudentScoresMutation,
} from "@/redux/api";

// Interface definitions for better type safety
interface Student {
  student: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    regNo: string;
  };
}

interface SubComponent {
  id: string;
  name: string;
  score: number;
}

interface MarkingComponent {
  id: string;
  name: string;
  score: number;
  type: "CA" | "EXAM";
  subComponents: SubComponent[];
}

interface MarkingScheme {
  id: string;
  name: string;
  components: MarkingComponent[];
}

interface StudentScore {
  studentId: string;
  componentId: string;
  subComponentId?: string;
  score: number;
}

export default function SubjectScoresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters from URL
  const sessionId = searchParams.get("sessionId") || "";
  const termId = searchParams.get("termId") || "";
  const classId = searchParams.get("classId") || "";
  const classArmId = searchParams.get("classArmId") || "";
  const subjectId = searchParams.get("subjectId") || "";

  // State for managing score inputs and calculations
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate required parameters
  const hasRequiredParams =
    sessionId && termId && classId && classArmId && subjectId;

  // API Queries
  // 1. Fetch students in the selected class arm
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetSessionClassStudentsQuery(
    { sessionId, classId, classArmId },
    { skip: !hasRequiredParams }
  );

  console.log(studentsData);

  // 2. Fetch marking scheme for the class and term
  const {
    data: markingSchemeData,
    isLoading: markingSchemeLoading,
    error: markingSchemeError,
  } = useGetClassMarkingSchemeQuery(
    { classId, termId },
    { skip: !hasRequiredParams }
  );

  console.log(markingSchemeData, "markingSchemeData", classId, termId);
  // 3. Fetch existing scores for students
  const { data: existingScoresData, isLoading: scoresLoading } =
    useGetStudentScoresQuery(
      { sessionId, classId, classArmId, termId, subjectId },
      { skip: !hasRequiredParams }
    );

    console.log(existingScoresData, "existingScoresSubjectPAge");

  // 4. Submit scores mutation
  const [submitScores] = useSubmitStudentScoresMutation();

  // Extract data from API responses with memoization to prevent unnecessary re-renders
  const students: Student[] = useMemo(
    () => studentsData?.data?.students || [],
    [studentsData?.data?.students]
  );
  const markingScheme: MarkingScheme = useMemo(
    () => markingSchemeData?.data?.markingScheme,
    [markingSchemeData?.data?.markingScheme]
  );
  const existingScores: StudentScore[] = useMemo(
    () => existingScoresData?.data?.scores || [],
    [existingScoresData?.data?.scores]
  );

  // Populate existing scores when data loads
  useEffect(() => {
    if (existingScores.length > 0) {
      const scoresMap: Record<string, Record<string, number>> = {};

      existingScores.forEach((score) => {
        if (!scoresMap[score.studentId]) {
          scoresMap[score.studentId] = {};
        }

        // Create a unique key for each score field
        const key = score.subComponentId
          ? `${score.componentId}_${score.subComponentId}`
          : score.componentId;

        scoresMap[score.studentId][key] = score.score;
      });

      setScores(scoresMap);
    }
  }, [existingScores]);

  // Calculate total score for each student
  const calculateStudentTotal = (studentId: string): number => {
    if (!markingScheme?.components || !scores[studentId]) return 0;

    let total = 0;
    markingScheme.components.forEach((component) => {
      if (component.subComponents.length > 0) {
        // For components with sub-components (like CA1), sum all sub-components
        component.subComponents.forEach((subComp) => {
          const key = `${component.id}_${subComp.id}`;
          total += scores[studentId][key] || 0;
        });
      } else {
        // For components without sub-components (like CA2, Exam)
        total += scores[studentId][component.id] || 0;
      }
    });

    return total;
  };

  // Handle score input changes
  const handleScoreChange = (studentId: string, key: string, value: string) => {
    const numValue = value === "" ? 0 : Math.max(0, parseFloat(value) || 0);

    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [key]: numValue,
      },
    }));
  };

  // Generate table columns based on marking scheme
  const generateTableColumns = () => {
    if (!markingScheme?.components) return [];

    const columns: Array<{
      key: string;
      label: string;
      subColumns?: Array<{ key: string; label: string; maxScore: number }>;
      maxScore?: number;
    }> = [];

    markingScheme.components.forEach((component) => {
      if (component.subComponents.length > 0) {
        // Component with sub-components (like CA1)
        columns.push({
          key: component.id,
          label: component.name.toUpperCase(),
          subColumns: component.subComponents.map((subComp) => ({
            key: `${component.id}_${subComp.id}`,
            label: subComp.name,
            maxScore: subComp.score,
          })),
        });
      } else {
        // Component without sub-components (like CA2, Exam)
        columns.push({
          key: component.id,
          label: component.name.toUpperCase(),
          maxScore: component.score,
        });
      }
    });

    return columns;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!markingScheme?.components) {
      toast.error("Marking scheme not loaded");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare scores data for submission
      const scoresArray: Array<{
        studentId: string;
        componentId: string;
        subComponentId?: string;
        parentComponentId?: string;
        score: number;
        maxScore: number;
        type: "CA" | "EXAM";
      }> = [];

      students.forEach((student) => {
        markingScheme.components.forEach((component) => {
          if (component.subComponents.length > 0) {
            // Handle components with sub-components
            component.subComponents.forEach((subComp) => {
              const key = `${component.id}_${subComp.id}`;
              const score = scores[student.student.id]?.[key] || 0;

              scoresArray.push({
                studentId: student.student.id,
                componentId: subComp.id,
                subComponentId: subComp.id,
                parentComponentId: component.id,
                score,
                maxScore: subComp.score,
                type: component.type,
              });
            });
          } else {
            // Handle components without sub-components
            const score = scores[student.student.id]?.[component.id] || 0;

            scoresArray.push({
              studentId: student.student.id,
              componentId: component.id,
              score,
              maxScore: component.score,
              type: component.type,
            });
          }
        });
      });

      console.log({
        sessionId,
        classId,
        classArmId,
        termId,
        subjectId,
        scores: scoresArray,
      });

      await submitScores({
        sessionId,
        classId,
        classArmId,
        termId,
        subjectId,
        scores: scoresArray,
      }).unwrap();

      toast.success("Scores submitted successfully!");
    } catch (error) {
      console.error("Error submitting scores:", error);
      toast.error("Failed to submit scores. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (studentsLoading || markingSchemeLoading || scoresLoading) {
    return <LoaderComponent />;
  }

  // Error states
  if (!hasRequiredParams) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card className=''>
          <CardContent>
            <p className='text-red-600'>
              Missing required parameters. Please go back and select all
              required fields.
            </p>
            <Button onClick={() => router.back()} className='mt-4'>
              <ChevronLeft className='h-4 w-4 mr-2' />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (studentsError || markingSchemeError) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card className=''>
          <CardContent>
            <p className='text-red-600'>
              Error loading data. Please try again.
            </p>
            <Button onClick={() => window.location.reload()} className='mt-4'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tableColumns = generateTableColumns();
  const totalMaxScore =
    markingScheme?.components.reduce((total, comp) => total + comp.score, 0) ||
    100;

  return (
    <div className='space-y-6 '>
      {/* Header with breadcrumb and actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Button onClick={() => router.back()} variant='ghost' size='sm'>
            <ChevronLeft className='h-4 w-4 mr-1' />
            Back to Scores
          </Button>
          <span className='text-gray-500'>/</span>
          <span className='font-medium'>Subject Scores</span>
        </div>

        <div className='flex space-x-2'>
          <Button
            onClick={() => window.location.reload()}
            variant='outline'
            size='sm'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='bg-blue-600 hover:bg-blue-700'
          >
            {isSubmitting ? (
              <>
                <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                Submitting...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                Submit Scores
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Score entry information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Subject Score Entry</span>
            <Badge variant='outline'>Total Students: {students.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
            <div>
              <span className='font-medium'>Session:</span>
              <p className='text-gray-600'>{sessionId}</p>
            </div>
            <div>
              <span className='font-medium'>Term:</span>
              <p className='text-gray-600'>{termId}</p>
            </div>
            <div>
              <span className='font-medium'>Class:</span>
              <p className='text-gray-600'>
                {classId}/{classArmId}
              </p>
            </div>
            <div>
              <span className='font-medium'>Subject:</span>
              <p className='text-gray-600'>{subjectId}</p>
            </div>
          </div>
          {markingScheme && (
            <div className='mt-4'>
              <span className='font-medium'>Marking Scheme:</span>
              <p className='text-gray-600'>{markingScheme.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scores table */}
      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              {/* Table header */}
              <thead>
                {/* Main header row */}
                <tr className='bg-gray-50'>
                  <th
                    rowSpan={2}
                    className='border border-gray-300 p-3 text-left font-medium min-w-[50px]'
                  >
                    SN
                  </th>
                  <th
                    rowSpan={2}
                    className='border border-gray-300 p-3 text-left font-medium min-w-[200px]'
                  >
                    NAME
                  </th>
                  {tableColumns.map((column) => (
                    <th
                      key={column.key}
                      colSpan={column.subColumns ? column.subColumns.length : 1}
                      className='border border-gray-300 p-3 text-center font-medium'
                    >
                      {column.label}
                    </th>
                  ))}
                  <th
                    rowSpan={2}
                    className='border border-gray-300 p-3 text-center font-medium min-w-[80px]'
                  >
                    Total
                  </th>
                </tr>

                {/* Sub-header row for components with sub-columns */}
                <tr className='bg-gray-100'>
                  {tableColumns.map((column) =>
                    column.subColumns ? (
                      column.subColumns.map((subCol) => (
                        <th
                          key={subCol.key}
                          className='border border-gray-300 p-2 text-center font-medium text-sm'
                        >
                          {subCol.label}
                        </th>
                      ))
                    ) : (
                      <th
                        key={column.key}
                        className='border border-gray-300 p-2 text-center font-medium text-sm'
                      >
                        {column.maxScore}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr key={student?.student.id} className='hover:bg-gray-50'>
                      {/* Serial number */}
                      <td className='border border-gray-300 p-3 text-center'>
                        {index + 1}
                      </td>

                      {/* Student name */}
                      <td className='border border-gray-300 p-3'>
                        <div>
                          <p className='font-medium'>
                            {student.student.firstname}{" "}
                            {student.student.lastname}
                          </p>
                          {/* <p className='text-sm text-gray-500'>
                          ID: {student.regNo}
                        </p> */}
                        </div>
                      </td>

                      {/* Score input fields */}
                      {tableColumns.map((column) =>
                        column.subColumns ? (
                          // Components with sub-components
                          column.subColumns.map((subCol) => (
                            <td
                              key={subCol.key}
                              className='border border-gray-300 p-2'
                            >
                              <Input
                                type='number'
                                min='0'
                                max={subCol.maxScore}
                                value={
                                  scores[student.student.id]?.[subCol.key] || ""
                                }
                                onChange={(e) =>
                                  handleScoreChange(
                                    student.student.id,
                                    subCol.key,
                                    e.target.value
                                  )
                                }
                                className='w-full text-center'
                                placeholder='0'
                              />
                            </td>
                          ))
                        ) : (
                          // Components without sub-components
                          <td
                            key={column.key}
                            className='border border-gray-300 p-2'
                          >
                            <Input
                              type='number'
                              min='0'
                              max={column.maxScore}
                              value={
                                scores[student.student.id]?.[column.key] || ""
                              }
                              onChange={(e) =>
                                handleScoreChange(
                                  student.student.id,
                                  column.key,
                                  e.target.value
                                )
                              }
                              className='w-full text-center'
                              placeholder='0'
                            />
                          </td>
                        )
                      )}

                      {/* Total score */}
                      <td className='border border-gray-300 p-3 text-center font-medium'>
                        {calculateStudentTotal(student.student.id).toFixed(1)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={tableColumns.length + 3}
                      className=' text-center text-gray-500'
                    >
                      No students found for this class arm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary footer */}
      <Card>
        <CardContent className='flex justify-between items-center'>
          <div className='text-sm text-gray-600'>
            <span className='font-medium'>Total Possible Score:</span>{" "}
            {totalMaxScore} marks
          </div>
          <div className='text-sm text-gray-600'>
            <span className='font-medium'>Students:</span> {students.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
