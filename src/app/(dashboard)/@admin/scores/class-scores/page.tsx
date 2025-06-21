"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  RefreshCw,
  BookOpen,
  ChevronRight,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import LoaderComponent from "@/components/local/LoaderComponent";
import {
  useGetSessionClassStudentsQuery,
  useGetClassMarkingSchemeQuery,
  useGetStudentScoresQuery,
  useSubmitStudentScoresMutation,
  useGetClassSubjectsQuery,
} from "@/redux/api";
import Image from "next/image";

// Enhanced interface definitions
interface Student {
  student: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    regNo: string;
  };
}

interface Subject {
  subject: {
    id: string;
    name: string;
    code: string;
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
  id: string;
  studentId: string;
  subjectId: string;
  componentId: string;
  subComponentId?: string;
  score: number;
  maxScore: number;
}

export default function ClassScoresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChangingStudent, setIsChangingStudent] = useState(false);

  // Extract query parameters from URL
  const sessionId = searchParams.get("sessionId") || "";
  const termId = searchParams.get("termId") || "";
  const classId = searchParams.get("classId") || "";
  const classArmId = searchParams.get("classArmId") || "";

  // State for student navigation and score management
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStudents, setSubmittedStudents] = useState<Set<string>>(
    new Set()
  );

  // Validate required parameters
  const hasRequiredParams = sessionId && termId && classId && classArmId;

  // API Queries
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetSessionClassStudentsQuery(
    { sessionId, classId, classArmId },
    { skip: !hasRequiredParams }
  );

  const {
    data: subjectsData,
    isLoading: subjectsLoading,
    error: subjectsError,
  } = useGetClassSubjectsQuery(
    { classId, classArmId },
    { skip: !hasRequiredParams }
  );

  console.log(subjectsData, "subjectdata");
  const {
    data: markingSchemeData,
    isLoading: markingSchemeLoading,
    error: markingSchemeError,
  } = useGetClassMarkingSchemeQuery(
    { classId, termId },
    { skip: !hasRequiredParams }
  );

  const currentStudent = useMemo(() => {
    const students = studentsData?.data?.students || [];
    return students[currentStudentIndex];
  }, [studentsData?.data?.students, currentStudentIndex]);

  // Fetch existing scores for current student
  const {
    data: existingScoresData,
    isLoading: isLoadingScores,
    isFetching,
    refetch,
  } = useGetStudentScoresQuery(
    {
      sessionId,
      classId,
      classArmId,
      termId,
      // subjectId: "all",
      studentId: currentStudent?.student?.id,
    },
    { skip: !hasRequiredParams || !currentStudent }
  );
  console.log(existingScoresData, "existingscores");

  const [submitScores] = useSubmitStudentScoresMutation();

  // Extract data with memoization
  const students: Student[] = useMemo(
    () => studentsData?.data?.students || [],
    [studentsData?.data?.students]
  );

  const subjects: Subject[] = useMemo(
    () => subjectsData?.data?.subjects || [],
    [subjectsData?.data?.subjects]
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
    if (existingScores.length > 0 && currentStudent) {
      const scoresMap: Record<string, Record<string, number>> = {};

      existingScores.forEach((score: any) => {
        if (!scoresMap[score.subjectId]) {
          scoresMap[score.subjectId] = {};
        }

        const key = score.subComponentId
          ? `${score.componentId}_${score.subComponentId}`
          : score.componentId;

        scoresMap[score.subjectId][key] = score.score;
      });

      setScores(scoresMap);
      setIsChangingStudent(false);
    } else {
      // Reset scores when changing student

      setScores({});
      setIsChangingStudent(false);
    }
  }, [existingScores, currentStudent]);

  // Calculate total score for current student in a subject
  const calculateSubjectTotal = (subjectId: string): number => {
    if (!markingScheme?.components || !scores[subjectId]) return 0;

    let total = 0;
    markingScheme.components.forEach((component) => {
      if (component.subComponents.length > 0) {
        component.subComponents.forEach((subComp) => {
          const key = `${component.id}_${subComp.id}`;
          total += scores[subjectId][key] || 0;
        });
      } else {
        total += scores[subjectId][component.id] || 0;
      }
    });

    return total;
  };

  // Calculate overall total for current student
  const calculateOverallTotal = (): number => {
    let total = 0;
    subjects.forEach((subject) => {
      total += calculateSubjectTotal(subject.subject.id);
    });
    return total;
  };

  // Handle score input changes
  const handleScoreChange = (subjectId: string, key: string, value: string) => {
    const numValue = value === "" ? 0 : Math.max(0, parseFloat(value) || 0);

    setScores((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [key]: numValue,
      },
    }));
  };

  // Navigate to next/previous student
  // Improve the navigateStudent function
  const navigateStudent = (direction: "next" | "prev") => {
    setIsChangingStudent(true); // Set loading state first
    refetch();

    // Use setTimeout to ensure the loading state is applied before changing student
    setTimeout(() => {
      if (direction === "next" && currentStudentIndex < students.length - 1) {
        setCurrentStudentIndex((prev) => prev + 1);
      } else if (direction === "prev" && currentStudentIndex > 0) {
        setCurrentStudentIndex((prev) => prev - 1);
      }
    }, 500); // Small delay to ensure loading state shows
  };

  // useEffect(() => {
  //   // This will run when currentStudent changes
  //   if (currentStudent) {
  //     setIsChangingStudent(true);
  //   }
  // }, [currentStudent?.student?.id]);
  // Submit scores for current student
  const handleSubmitCurrentStudent = async () => {
    if (!markingScheme?.components || !currentStudent) {
      toast.error("Missing required data");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit scores for each subject
      for (const subject of subjects) {
        const scoresArray: Array<{
          studentId: string;
          componentId: string;
          subComponentId?: string;
          parentComponentId?: string;
          score: number;
          maxScore: number;
          type: "CA" | "EXAM";
        }> = [];

        markingScheme.components.forEach((component) => {
          if (component.subComponents.length > 0) {
            component.subComponents.forEach((subComp) => {
              const key = `${component.id}_${subComp.id}`;
              const score = scores[subject.subject.id]?.[key] || 0;

              scoresArray.push({
                studentId: currentStudent.student.id,
                componentId: subComp.id,
                subComponentId: subComp.id,
                parentComponentId: component.id,
                score,
                maxScore: subComp.score,
                type: component.type,
              });
            });
          } else {
            const score = scores[subject.subject.id]?.[component.id] || 0;

            scoresArray.push({
              studentId: currentStudent.student.id,
              componentId: component.id,
              score,
              maxScore: component.score,
              type: component.type,
            });
          }
        });

        if (scoresArray.length > 0) {
          console.log({
            sessionId,
            classId,
            classArmId,
            termId,
            subjectId: subject.subject.id,
            scores: scoresArray,
          });
          await submitScores({
            sessionId,
            classId,
            classArmId,
            termId,
            subjectId: subject.subject.id,
            scores: scoresArray,
          }).unwrap();
        }
      }

      // Mark student as submitted
      setSubmittedStudents((prev) =>
        new Set(prev).add(currentStudent.student.id)
      );

      toast.success(
        `Scores submitted successfully for ${currentStudent.student.firstname} ${currentStudent.student.lastname}!`
      );

      // Auto-navigate to next student if not the last one
      if (currentStudentIndex < students.length - 1) {
        setTimeout(() => {
          navigateStudent("next");
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
      toast.error("Failed to submit scores. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        columns.push({
          key: component.id,
          label: component.name.toUpperCase(),
          maxScore: component.score,
        });
      }
    });

    return columns;
  };

  // Loading state
  if (studentsLoading || subjectsLoading || markingSchemeLoading) {
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

  if (studentsError || subjectsError || markingSchemeError) {
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

  if (students.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card className=''>
          <CardContent>
            <p className='text-gray-600'>No students found for this class.</p>
            <Button onClick={() => router.back()} className='mt-4'>
              <ChevronLeft className='h-4 w-4 mr-2' />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tableColumns = generateTableColumns();
  const progressPercentage =
    ((currentStudentIndex + 1) / students.length) * 100;
  const isStudentSubmitted = submittedStudents.has(
    currentStudent?.student?.id || ""
  );

  console.log(currentStudent);

  return (
    <div className='space-y-6'>
      {/* Header with Navigation */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='flex items-center gap-2'
          >
            <ChevronLeft className='h-4 w-4' />
            Back to Scores
          </Button>
          <Separator orientation='vertical' className='h-6' />
          <div className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5 text-blue-600' />
            <h1 className='text-2xl font-bold text-gray-900'>
              Class Score Entry
            </h1>
          </div>
        </div>
      </div>

      {/* Progress and Student Navigation */}
      <Card className='border-l-4 border-l-blue-500'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='w-[60px] h-[60px] rounded-full overflow-hidden'>
                  <Image
                    src={currentStudent?.student?.avatar}
                    className='object-cover w-[60px] h-[60px]'
                    alt={currentStudent?.student?.firstname}
                    width={60}
                    height={60}
                  />
                </div>
                <span className='text-lg font-semibold'>
                  {currentStudent?.student?.firstname}{" "}
                  {currentStudent?.student?.lastname}
                </span>
                {isStudentSubmitted && (
                  <Badge
                    variant='secondary'
                    className='bg-green-100 text-green-800'
                  >
                    <CheckCircle className='h-3 w-3 mr-1' />
                    Submitted
                  </Badge>
                )}
              </div>
              <Badge variant='outline'>{currentStudent?.student?.regNo}</Badge>
            </div>

            <div className='flex items-center gap-3'>
              <span className='text-sm text-gray-600'>
                Student {currentStudentIndex + 1} of {students.length}
              </span>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => navigateStudent("prev")}
                  disabled={currentStudentIndex === 0}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => navigateStudent("next")}
                  disabled={currentStudentIndex === students.length - 1}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm text-gray-600'>
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className='h-2' />
          </div>
        </CardHeader>
      </Card>

      {/* Score Entry Table */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            Subject Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <p className='text-center text-gray-500 py-8'>
              No subjects assigned to this class.
            </p>
          ) : isChangingStudent || isFetching || isLoadingScores ? (
            <LoaderComponent />
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr>
                    <th className='border p-2 text-left bg-gray-50 font-semibold min-w-[150px]'>
                      Subject
                    </th>
                    {tableColumns.map((column) => (
                      <th
                        key={column.key}
                        className='border p-2 text-center bg-gray-50 font-semibold'
                        colSpan={
                          column.subColumns ? column.subColumns.length : 1
                        }
                      >
                        {column.label}
                        {column.maxScore && (
                          <div className='text-xs text-gray-500 font-normal'>
                            Max: {column.maxScore}
                          </div>
                        )}
                      </th>
                    ))}
                    <th className='border p-2 text-center bg-blue-50 font-semibold'>
                      Total
                    </th>
                  </tr>

                  {/* Sub-header for components with sub-components */}
                  {tableColumns.some((col) => col.subColumns) && (
                    <tr>
                      <th className='border p-2 bg-gray-50'></th>
                      {tableColumns.map((column) =>
                        column.subColumns ? (
                          column.subColumns.map((subCol) => (
                            <th
                              key={subCol.key}
                              className='border p-2 text-center bg-gray-50 text-sm'
                            >
                              {subCol.label}
                              <div className='text-xs text-gray-500 font-normal'>
                                Max: {subCol.maxScore}
                              </div>
                            </th>
                          ))
                        ) : (
                          <th
                            key={column.key}
                            className='border p-2 bg-gray-50'
                          ></th>
                        )
                      )}
                      <th className='border p-2 bg-blue-50'></th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.subject.id} className='hover:bg-gray-50'>
                      <td className='border p-2 font-medium'>
                        <div>
                          <div className='font-semibold'>
                            {subject.subject.name}
                          </div>
                          {/* <div className='text-sm text-gray-500'>
                            {subject.subject.code}
                          </div> */}
                        </div>
                      </td>

                      {tableColumns.map((column) =>
                        column.subColumns ? (
                          column.subColumns.map((subCol) => (
                            <td
                              key={`${subject.subject.id}_${subCol.key}`}
                              className='border p-1'
                            >
                              <Input
                                type='number'
                                min='0'
                                max={subCol.maxScore}
                                value={
                                  scores[subject.subject.id]?.[subCol.key] || ""
                                }
                                onChange={(e) =>
                                  handleScoreChange(
                                    subject.subject.id,
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
                          <td
                            key={`${subject.subject.id}_${column.key}`}
                            className='border p-1'
                          >
                            <Input
                              type='number'
                              min='0'
                              max={column.maxScore}
                              value={
                                scores[subject.subject.id]?.[column.key] || ""
                              }
                              onChange={(e) =>
                                handleScoreChange(
                                  subject.subject.id,
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

                      <td className='border p-2 text-center font-semibold bg-blue-50'>
                        {calculateSubjectTotal(subject.subject.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className='bg-gray-100'>
                    <td className='border p-2 font-bold text-right'>
                      Overall Total:
                    </td>
                    <td
                      className='border p-2 text-center font-bold text-lg'
                      colSpan={tableColumns.reduce(
                        (acc, col) =>
                          acc + (col.subColumns ? col.subColumns.length : 1),
                        0
                      )}
                    >
                      {calculateOverallTotal()}
                    </td>
                    <td className='border p-2 bg-blue-100'></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='text-sm text-gray-600'>
                {submittedStudents.size} of {students.length} students completed
              </div>
              {isStudentSubmitted && (
                <Badge
                  variant='secondary'
                  className='bg-green-100 text-green-800'
                >
                  <UserCheck className='h-3 w-3 mr-1' />
                  Already Submitted
                </Badge>
              )}
            </div>

            <div className='flex items-center gap-3'>
              {/* {currentStudentIndex < students.length - 1 && (
                <Button
                  variant='outline'
                  onClick={() => {
                    handleSubmitCurrentStudent();
                  }}
                  disabled={isSubmitting}
                  className='flex items-center gap-2'
                >
                  {isSubmitting ? (
                    <RefreshCw className='h-4 w-4 animate-spin' />
                  ) : (
                    <SkipForward className='h-4 w-4' />
                  )}
                  Save & Next
                </Button>
              )} */}

              <Button
                onClick={handleSubmitCurrentStudent}
                disabled={isSubmitting}
                className='flex items-center gap-2'
              >
                {isSubmitting ? (
                  <RefreshCw className='h-4 w-4 animate-spin' />
                ) : (
                  <Save className='h-4 w-4' />
                )}
                {currentStudentIndex === students.length - 1
                  ? "Save Final"
                  : "Save Scores"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
