"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  RefreshCw,
  BookOpen,
  ChevronRight,
  // CheckCircle,
  // UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import LoaderComponent from "@/components/local/LoaderComponent";
import {
  useGetSessionClassStudentsQuery,
  useGetClassMarkingSchemeQuery,
  useGetStudentScoresQuery,
  useSubmitStudentScoresMutation,
  useGetClassSubjectsQuery,
} from "@/redux/api";
import {
  decodeScoreContext,
  generateSubjectCardTexts,
  type ScoreContext,
  type ClassScoreContext,
} from "@/lib/contextUtils";
import SubjectCard from "../(components)/SubjectCard";

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

  // Extract and decode context from URL parameters
  const contextParam = searchParams.get("context");
  let context: ScoreContext | ClassScoreContext | null = null;
  let sessionId = "";
  let termId = "";
  let classId = "";
  let classArmId = "";

  try {
    if (contextParam) {
      console.log("Context param received:", contextParam);
      context = decodeScoreContext(contextParam);
      console.log("Decoded context:", context);
      if (context) {
        sessionId = context.sessionId;
        termId = context.termId;
        classId = context.classId;
        classArmId = context.classArmId;
        console.log("Extracted IDs:", {
          sessionId,
          termId,
          classId,
          classArmId,
        });
      } else {
        console.error("Context decoded but is null/undefined");
        throw new Error("Failed to decode context");
      }
    } else {
      console.log("No context param found, using individual parameters");
      // Fallback to individual query parameters for backward compatibility
      sessionId = searchParams.get("sessionId") || "";
      termId = searchParams.get("termId") || "";
      classId = searchParams.get("classId") || "";
      classArmId = searchParams.get("classArmId") || "";
    }
  } catch (error) {
    console.error("Failed to decode context:", error);
    console.log("Falling back to individual query parameters");
    console.log(
      "Available search params:",
      Object.fromEntries(searchParams.entries())
    );
    // Fallback to individual query parameters
    sessionId = searchParams.get("sessionId") || "";
    termId = searchParams.get("termId") || "";
    classId = searchParams.get("classId") || "";
    classArmId = searchParams.get("classArmId") || "";
    console.log("Fallback IDs:", { sessionId, termId, classId, classArmId });
  }

  // State for student navigation and score management
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [scores, setScores] = useState<Record<string, Record<string, number>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submittedStudents, setSubmittedStudents] = useState<Set<string>>(
  //   new Set()
  // );
  const [behaviorScores, setBehaviorScores] = useState<
    Record<string, Record<string, string>>
  >({});
  const [attendanceScores, setAttendanceScores] = useState<
    Record<string, { present: number; absent: number }>
  >({});
  const [comments, setComments] = useState<
    Record<string, { teacher: string; principal: string }>
  >({});

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

  const [submitScores] = useSubmitStudentScoresMutation();

  // Extract data with memoization
  const students: Student[] = useMemo(
    () => studentsData?.data?.students || [],
    [studentsData?.data?.students]
  );

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;

    return students.filter((student) => {
      const fullName =
        `${student.student.firstname} ${student.student.lastname}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        student.student.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [students, searchTerm]);

  const currentStudent = useMemo(() => {
    return filteredStudents[currentStudentIndex];
  }, [filteredStudents, currentStudentIndex]);

  // Fetch existing scores for current student
  const { data: existingScoresData, refetch } = useGetStudentScoresQuery(
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

  // Populate existing additional data (behavioral, attendance, comments) when data loads
  useEffect(() => {
    if (existingScoresData?.data?.additionalData && currentStudent) {
      const additionalData = existingScoresData.data.additionalData.find(
        (data: any) => data.studentId === currentStudent.student.id
      );

      if (additionalData) {
        const studentId = currentStudent.student.id;

        // Helper function to convert underscore format back to display format
        const formatBehaviorValue = (value: string) => {
          return value
            ?.replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        };

        // Populate behavioral scores
        if (
          additionalData.punctuality ||
          additionalData.attentiveness ||
          additionalData.leadershipSkills ||
          additionalData.neatness
        ) {
          setBehaviorScores((prev) => ({
            ...prev,
            [studentId]: {
              Punctuality:
                formatBehaviorValue(additionalData.punctuality) || "",
              Attentiveness:
                formatBehaviorValue(additionalData.attentiveness) || "",
              "Leadership Skills":
                formatBehaviorValue(additionalData.leadershipSkills) || "",
              Neatness: formatBehaviorValue(additionalData.neatness) || "",
            },
          }));
        }

        // Populate attendance scores
        if (
          additionalData.attendancePresent !== undefined ||
          additionalData.attendanceAbsent !== undefined
        ) {
          setAttendanceScores((prev) => ({
            ...prev,
            [studentId]: {
              present: additionalData.attendancePresent || 0,
              absent: additionalData.attendanceAbsent || 0,
            },
          }));
        }

        // Populate comments
        if (
          additionalData.classTeacherComment ||
          additionalData.principalComment
        ) {
          setComments((prev) => ({
            ...prev,
            [studentId]: {
              teacher: additionalData.classTeacherComment || "",
              principal: additionalData.principalComment || "",
            },
          }));
        }
      }
    } else if (currentStudent) {
      // Reset additional data when changing student if no existing data
      const studentId = currentStudent.student.id;
      setBehaviorScores((prev) => ({ ...prev, [studentId]: {} }));
      setAttendanceScores((prev) => ({
        ...prev,
        [studentId]: { present: 0, absent: 0 },
      }));
      setComments((prev) => ({
        ...prev,
        [studentId]: { teacher: "", principal: "" },
      }));
    }
  }, [existingScoresData?.data?.additionalData, currentStudent]);

  // Reset student index when search term changes
  useEffect(() => {
    setCurrentStudentIndex(0);
  }, [searchTerm]);

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

  // Calculate total score for a specific component (parent) across all subjects
  const calculateComponentTotal = (
    subjectId: string,
    componentId: string
  ): number => {
    if (!markingScheme?.components || !scores[subjectId]) return 0;

    const component = markingScheme.components.find(
      (comp) => comp.id === componentId
    );
    if (!component) return 0;

    let total = 0;
    if (component.subComponents.length > 0) {
      component.subComponents.forEach((subComp) => {
        const key = `${component.id}_${subComp.id}`;
        total += scores[subjectId][key] || 0;
      });
    } else {
      total += scores[subjectId][component.id] || 0;
    }

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
      if (
        direction === "next" &&
        currentStudentIndex < filteredStudents.length - 1
      ) {
        setCurrentStudentIndex((prev) => prev + 1);
      } else if (direction === "prev" && currentStudentIndex > 0) {
        setCurrentStudentIndex((prev) => prev - 1);
      }
    }, 500); // Small delay to ensure loading state shows
  };

  // Navigate directly to a specific student
  const navigateToStudent = (studentId: string) => {
    const studentIndex = filteredStudents.findIndex(
      (s) => s.student.id === studentId
    );
    if (studentIndex !== -1 && studentIndex !== currentStudentIndex) {
      setIsChangingStudent(true);
      setCurrentStudentIndex(studentIndex);
      refetch();
    }
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
      // Prepare additional data for the current student (only once)
      const studentId = currentStudent.student.id;
      const additionalData = {
        studentId,
        // Behavioral ratings (convert to lowercase with underscores, only if they exist)
        ...(behaviorScores[studentId]?.["Punctuality"] && {
          punctuality: behaviorScores[studentId]["Punctuality"]
            .toLowerCase()
            .replace(/ /g, "_"),
        }),
        ...(behaviorScores[studentId]?.["Attentiveness"] && {
          attentiveness: behaviorScores[studentId]["Attentiveness"]
            .toLowerCase()
            .replace(/ /g, "_"),
        }),
        ...(behaviorScores[studentId]?.["Leadership Skills"] && {
          leadershipSkills: behaviorScores[studentId]["Leadership Skills"]
            .toLowerCase()
            .replace(/ /g, "_"),
        }),
        ...(behaviorScores[studentId]?.["Neatness"] && {
          neatness: behaviorScores[studentId]["Neatness"]
            .toLowerCase()
            .replace(/ /g, "_"),
        }),
        // Attendance data
        attendancePresent: attendanceScores[studentId]?.present || 0,
        attendanceAbsent: attendanceScores[studentId]?.absent || 0,
        attendanceTotal:
          (attendanceScores[studentId]?.present || 0) +
          (attendanceScores[studentId]?.absent || 0),
        // Comments (only if they exist)
        ...(comments[studentId]?.teacher && {
          classTeacherComment: comments[studentId].teacher,
        }),
        ...(comments[studentId]?.principal && {
          principalComment: comments[studentId].principal,
        }),
      };

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
          console.log("Submitting scores for subject:", {
            sessionId,
            classId,
            classArmId,
            termId,
            subjectId: subject.subject.id,
            scores: scoresArray,
            // Only include additionalData for the first subject to avoid duplication
            ...(subjects.indexOf(subject) === 0 && {
              additionalData: [additionalData],
            }),
          });

          console.log("Additional Data being submitted:", additionalData);
          await submitScores({
            sessionId,
            classId,
            classArmId,
            termId,
            subjectId: subject.subject.id,
            scores: scoresArray,
            // Only include additionalData for the first subject to avoid duplication
            ...(subjects.indexOf(subject) === 0 && {
              additionalData: [additionalData],
            }),
          }).unwrap();
        }
      }

      // Mark student as submitted
      // setSubmittedStudents((prev) =>
      //   new Set(prev).add(currentStudent.student.id)
      // );

      toast.success(
        `Scores submitted successfully for ${currentStudent.student.firstname} ${currentStudent.student.lastname}!`
      );

      // Auto-navigate to next student if not the last one
      if (currentStudentIndex < filteredStudents.length - 1) {
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
  // const progressPercentage =
  //   ((currentStudentIndex + 1) / filteredStudents.length) * 100;
  // const isStudentSubmitted = submittedStudents.has(
  //   currentStudent?.student?.id || ""
  // );

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
        </div>
      </div>
      {/* Subject/Class Information Card */}
      <SubjectCard
        type='class'
        {...(() => {
          if (context) {
            return generateSubjectCardTexts(context);
          }
          // Fallback for class scores
          return {
            topText: `${studentsData?.data?.class?.name || "Class"}, ${
              studentsData?.data?.classArm?.name || "Arm"
            }`,
            subject: "Class Scores",
            subText: `${studentsData?.data?.term?.name || "Term"}, ${
              studentsData?.data?.session?.name || "Session"
            } / Score entry for all subjects`,
          };
        })()}
      />

      {/* Student Search and Navigation */}
      <Card className='border-l-4 border-l-indigo-500'>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-4'>
            <div className='flex-1'>
              <Input
                placeholder='Search student by name or registration number...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='max-w-md'
              />
            </div>
            <div className='min-w-[200px]'>
              <Select
                value={currentStudent?.student?.id || ""}
                onValueChange={(value) => navigateToStudent(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Jump to student...' />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map((student) => (
                    <SelectItem
                      key={student.student.id}
                      value={student.student.id}
                    >
                      {student.student.firstname} {student.student.lastname} (
                      {student.student.regNo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress and Student Navigation */}
      {/* <Card className='border-l-4 border-l-blue-500'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
                  <span className='text-xl font-semibold text-gray-600'>
                    {currentStudent?.student?.firstname?.charAt(0)}
                    {currentStudent?.student?.lastname?.charAt(0)}
                  </span>
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
                Student {currentStudentIndex + 1} of {filteredStudents.length}
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
      </Card> */}

      {/* Score Entry Table */}
      <Card>
        <CardHeader className='flex justify-between items-center'>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            Score Entry - {currentStudent?.student?.firstname}{" "}
            {currentStudent?.student?.lastname}
          </CardTitle>
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
        </CardHeader>

        <CardContent>
          {isChangingStudent ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-center'>
                <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-2' />
                <p>Loading student scores...</p>
              </div>
            </div>
          ) : subjects.length === 0 ? (
            <p className='text-center text-gray-500 py-8'>
              No subjects assigned to this class.
            </p>
          ) : (
            <div className='space-y-6'>
              {/* Main Scores Table */}
              <div className='bg-white rounded-lg border overflow-hidden score-table'>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-[#E1E8F8] hover:bg-[#E1E8F8]'>
                        <TableHead className='font-semibold text-gray-700 min-w-[200px] border-r'>
                          {/* Assessment Components */}
                        </TableHead>
                        {subjects.map((subject) => (
                          <TableHead
                            key={subject.subject.id}
                            className='text-center font-semibold text-gray-700 min-w-[120px] border-r'
                          >
                            {subject.subject.name}
                            <div className='text-xs font-normal text-gray-600'>
                              ({subject.subject.code})
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {tableColumns.map((column) => (
                        <React.Fragment key={column.key}>
                          {/* Parent Component Row */}
                          {column.subColumns && column.subColumns.length > 0 ? (
                            <>
                              {/* Parent header row */}
                              <TableRow className='bg-gray-50 hover:bg-gray-50'>
                                <TableCell className='font-semibold text-gray-800 border-r'>
                                  {column.label}
                                </TableCell>
                                {subjects.map((subject) => (
                                  <TableCell
                                    key={subject.subject.id}
                                    className='text-center font-medium border-r'
                                  >
                                    {calculateComponentTotal(
                                      subject.subject.id,
                                      column.key
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>

                              {/* Sub-component rows */}
                              {column.subColumns.map((subCol) => (
                                <TableRow key={subCol.key}>
                                  <TableCell className='pl-8 text-gray-700 border-r'>
                                    {subCol.label} ({subCol.maxScore} marks)
                                  </TableCell>
                                  {subjects.map((subject) => (
                                    <TableCell
                                      key={subject.subject.id}
                                      className='p-2 border-r'
                                    >
                                      <Input
                                        type='number'
                                        min='0'
                                        max={subCol.maxScore}
                                        value={
                                          scores[subject.subject.id]?.[
                                            subCol.key
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleScoreChange(
                                            subject.subject.id,
                                            subCol.key,
                                            e.target.value
                                          )
                                        }
                                        className='w-full text-center h-9'
                                        placeholder='0'
                                      />
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </>
                          ) : (
                            /* Single Component Row */
                            <TableRow>
                              <TableCell className='font-medium text-gray-800 border-r'>
                                {column.label} ({column.maxScore} marks)
                              </TableCell>
                              {subjects.map((subject) => (
                                <TableCell
                                  key={subject.subject.id}
                                  className='p-2 border-r'
                                >
                                  <Input
                                    type='number'
                                    min='0'
                                    max={column.maxScore}
                                    value={
                                      scores[subject.subject.id]?.[
                                        column.key
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleScoreChange(
                                        subject.subject.id,
                                        column.key,
                                        e.target.value
                                      )
                                    }
                                    className='w-full text-center h-9'
                                    placeholder='0'
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}

                      {/* Total Row */}
                      <TableRow className='bg-blue-50 hover:bg-blue-50 font-semibold'>
                        <TableCell className='text-gray-800 border-r'>
                          TOTAL
                        </TableCell>
                        {subjects.map((subject) => (
                          <TableCell
                            key={subject.subject.id}
                            className='text-center text-lg border-r'
                          >
                            {calculateSubjectTotal(subject.subject.id)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Behavioral Assessment and Attendance Section - Side by Side */}
              <div
                className='grid grid-cols-1 lg:grid-cols-3 gap-6'
                style={{ maxWidth: "80%" }}
              >
                {/* Behavioral Assessment - Takes 2/3 of the width */}
                <div className='lg:col-span-2'>
                  <div className='bg-white rounded-lg border overflow-hidden score-table'>
                    <div className='overflow-x-auto'>
                      <Table>
                        <TableHeader>
                          <TableRow className='bg-[#E1E8F8]'>
                            <TableHead className='text-left font-semibold text-gray-700 border-r'>
                              {/* Criteria */}
                            </TableHead>
                            <TableHead className='text-center font-semibold text-gray-700 text-sm border-r'>
                              Excellent
                            </TableHead>
                            <TableHead className='text-center font-semibold text-gray-700 text-sm border-r'>
                              Very Good
                            </TableHead>
                            <TableHead className='text-center font-semibold text-gray-700 text-sm border-r'>
                              Good
                            </TableHead>
                            <TableHead className='text-center font-semibold text-gray-700 text-sm border-r'>
                              Fair
                            </TableHead>
                            <TableHead className='text-center font-semibold text-gray-700 text-sm'>
                              Poor
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            "Punctuality",
                            "Attentiveness",
                            "Leadership Skills",
                            "Neatness",
                          ].map((criteria) => (
                            <TableRow key={criteria}>
                              <TableCell className='font-medium border-r'>
                                {criteria}
                              </TableCell>
                              {[
                                "Excellent",
                                "Very Good",
                                "Good",
                                "Fair",
                                "Poor",
                              ].map((rating) => (
                                <TableCell
                                  key={rating}
                                  className='text-center border-r'
                                >
                                  <div className='flex justify-center'>
                                    <input
                                      type='radio'
                                      name={`${currentStudent?.student?.id}-${criteria}`}
                                      value={rating}
                                      checked={
                                        behaviorScores[
                                          currentStudent?.student?.id || ""
                                        ]?.[criteria] === rating
                                      }
                                      onChange={(e) => {
                                        const studentId =
                                          currentStudent?.student?.id || "";
                                        setBehaviorScores((prev) => ({
                                          ...prev,
                                          [studentId]: {
                                            ...prev[studentId],
                                            [criteria]: e.target.value,
                                          },
                                        }));
                                      }}
                                      className='w-4 h-4'
                                    />
                                  </div>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>

                {/* Attendance - Takes 1/3 of the width */}
                <div className='lg:col-span-1'>
                  <div className='bg-white rounded-lg border overflow-hidden score-table'>
                    <div className='bg-[#E1E8F8] p-3 border-b'>
                      <h3 className='font-semibold text-gray-700'>
                        Attendance
                      </h3>
                    </div>
                    <div className='overflow-x-auto'>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className='font-medium text-gray-700 border-r w-24'>
                              Present
                            </TableCell>
                            <TableCell className='p-2'>
                              <Input
                                type='number'
                                min='0'
                                value={
                                  attendanceScores[
                                    currentStudent?.student?.id || ""
                                  ]?.present || ""
                                }
                                onChange={(e) =>
                                  setAttendanceScores((prev) => ({
                                    ...prev,
                                    [currentStudent?.student?.id || ""]: {
                                      ...prev[
                                        currentStudent?.student?.id || ""
                                      ],
                                      present: parseInt(e.target.value) || 0,
                                      absent:
                                        prev[currentStudent?.student?.id || ""]
                                          ?.absent || 0,
                                    },
                                  }))
                                }
                                className='w-full text-center h-9'
                                placeholder='0'
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className='font-medium text-gray-700 border-r'>
                              Absent
                            </TableCell>
                            <TableCell className='p-2'>
                              <Input
                                type='number'
                                min='0'
                                value={
                                  attendanceScores[
                                    currentStudent?.student?.id || ""
                                  ]?.absent || ""
                                }
                                onChange={(e) =>
                                  setAttendanceScores((prev) => ({
                                    ...prev,
                                    [currentStudent?.student?.id || ""]: {
                                      ...prev[
                                        currentStudent?.student?.id || ""
                                      ],
                                      absent: parseInt(e.target.value) || 0,
                                      present:
                                        prev[currentStudent?.student?.id || ""]
                                          ?.present || 0,
                                    },
                                  }))
                                }
                                className='w-full text-center h-9'
                                placeholder='0'
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Class Teacher&apos;s Comment
                  </label>
                  <Textarea
                    placeholder='Enter class teacher comment...'
                    value={
                      comments[currentStudent?.student?.id || ""]?.teacher || ""
                    }
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [currentStudent?.student?.id || ""]: {
                          ...prev[currentStudent?.student?.id || ""],
                          teacher: e.target.value,
                          principal:
                            prev[currentStudent?.student?.id || ""]
                              ?.principal || "",
                        },
                      }))
                    }
                    className='min-h-[100px]'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Principal&apos;s Comment
                  </label>
                  <Textarea
                    placeholder='Enter principal comment...'
                    value={
                      comments[currentStudent?.student?.id || ""]?.principal ||
                      ""
                    }
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [currentStudent?.student?.id || ""]: {
                          ...prev[currentStudent?.student?.id || ""],
                          principal: e.target.value,
                          teacher:
                            prev[currentStudent?.student?.id || ""]?.teacher ||
                            "",
                        },
                      }))
                    }
                    className='min-h-[100px]'
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-end'>
            {/* <div className='flex items-center gap-4'>
              <div className='text-sm text-gray-600'>
                {submittedStudents.size} of {filteredStudents.length} students
                completed
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
            </div> */}

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
                {currentStudentIndex === filteredStudents.length - 1
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
