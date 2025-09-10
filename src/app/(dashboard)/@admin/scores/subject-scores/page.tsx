"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Save, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import LoaderComponent from "@/components/local/LoaderComponent";
import {
  useGetStudentsQuery,
  useGetClassMarkingSchemeQuery,
  useGetStudentScoresQuery,
  useSubmitStudentScoresMutation,
} from "@/redux/api";
import SubjectCard from "../(components)/SubjectCard";
import {
  decodeScoreContext,
  generateSubjectCardTexts,
} from "@/lib/contextUtils";

// Interface definitions for better type safety
interface Student {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  studentRegNo: string;
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

  // Extract and decode context from URL parameters
  const contextParam = searchParams.get("context");
  let context: any = null;
  let sessionId = "";
  let termId = "";
  let classId = "";
  let classArmId = "";
  let subjectId = "";

  try {
    if (contextParam) {
      context = decodeScoreContext(contextParam);
      if (context) {
        sessionId = context.sessionId;
        termId = context.termId;
        classId = context.classId;
        classArmId = context.classArmId;
        subjectId = context.subjectId || "";
      } else {
        throw new Error("Failed to decode context");
      }
    } else {
      // Fallback to individual query parameters for backward compatibility
      sessionId = searchParams.get("sessionId") || "";
      termId = searchParams.get("termId") || "";
      classId = searchParams.get("classId") || "";
      classArmId = searchParams.get("classArmId") || "";
      subjectId = searchParams.get("subjectId") || "";
    }
  } catch (error) {
    console.error("Failed to decode context:", error);
    // Fallback to individual query parameters
    sessionId = searchParams.get("sessionId") || "";
    termId = searchParams.get("termId") || "";
    classId = searchParams.get("classId") || "";
    classArmId = searchParams.get("classArmId") || "";
    subjectId = searchParams.get("subjectId") || "";
  }

  console.log(sessionId, termId, classId, classArmId, subjectId, "details");

  // State for managing score inputs and calculations
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Validate required parameters
  const hasRequiredParams =
    sessionId && termId && classId && classArmId && subjectId;

  // API Queries
  // 1. Fetch students in the selected class arm
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetStudentsQuery(
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

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;

    return students.filter((student) => {
      const fullName =
        `${student?.firstname} ${student?.lastname}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        student?.studentRegNo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [students, searchTerm]);

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
              const score = scores[student?.id]?.[key] || 0;

              scoresArray.push({
                studentId: student?.id,
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
            const score = scores[student?.id]?.[component.id] || 0;

            scoresArray.push({
              studentId: student?.id,
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="">
          <CardContent>
            <p className="text-red-600">
              Missing required parameters. Please go back and select all
              required fields.
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (studentsError || markingSchemeError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="">
          <CardContent>
            <p className="text-red-600">
              Error loading data. Please try again.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
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
    <div className="space-y-6 ">
      {/* Header with breadcrumb and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.back()} variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Scores
          </Button>
          <span className="text-gray-500">/</span>
          <span className="font-medium">Subject Scores</span>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <SubjectCard
        {...(() => {
          if (context) {
            return generateSubjectCardTexts(context);
          }
          // Fallback to existing hardcoded values
          return {
            topText: `${studentsData?.data?.class?.name || "Class"}, ${
              studentsData?.data?.classArm?.name || "Arm"
            }`,
            subject: "Subject",
            subText: `${studentsData?.data?.term?.name || "Term"}, ${
              studentsData?.data?.session?.name || "Session"
            } / Subject scores input`,
          };
        })()}
      />

      {/* Search Input */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative w-64">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-2xl"
          />
          <Search className="absolute top-1/2 left-3 w-5 h-5 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Scores table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#E1E8F8]">
            {/* Main header row */}
            <TableRow>
              <TableHead
                rowSpan={2}
                className="border border-gray-300 font-semibold text-gray-700 min-w-[50px] text-center p-3"
              >
                SN
              </TableHead>
              <TableHead
                rowSpan={2}
                className="border border-gray-300 font-semibold text-gray-700 min-w-[200px] p-3"
              >
                NAME
              </TableHead>
              {tableColumns.map((column) => (
                <TableHead
                  key={column.key}
                  colSpan={column.subColumns ? column.subColumns.length : 1}
                  className="border border-gray-300 font-semibold text-gray-700 text-center p-3"
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead
                rowSpan={2}
                className="border border-gray-300 font-semibold text-gray-700 text-center min-w-[80px] p-3"
              >
                Total
              </TableHead>
            </TableRow>

            {/* Sub-header row for components with sub-columns */}
            <TableRow className="bg-gray-100">
              {tableColumns.map((column) =>
                column.subColumns ? (
                  column.subColumns.map((subCol) => (
                    <TableHead
                      key={subCol.key}
                      className="border border-gray-300 font-semibold text-gray-700 text-center text-sm p-2"
                    >
                      {subCol.label}
                    </TableHead>
                  ))
                ) : (
                  <TableHead
                    key={column.key}
                    className="border border-gray-300 font-semibold text-gray-700 text-center text-sm p-2"
                  >
                    {column.maxScore}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow
                  key={student?.id}
                  className="hover:bg-gray-50"
                >
                  {/* Serial number */}
                  <TableCell className="border border-gray-300 text-center p-3">
                    {students.findIndex(
                      (s) => s?.id === student?.id
                    ) + 1}
                  </TableCell>

                  {/* Student name */}
                  <TableCell className="border border-gray-300 p-3">
                    <div>
                      <p className="font-medium">
                        {student?.firstname} {student?.lastname}
                      </p>
                    </div>
                  </TableCell>

                  {/* Score input fields */}
                  {tableColumns.map((column) =>
                    column.subColumns ? (
                      // Components with sub-components
                      column.subColumns.map((subCol) => (
                        <TableCell
                          key={subCol.key}
                          className="border border-gray-300 p-2"
                        >
                          <Input
                            type="number"
                            min="0"
                            max={subCol.maxScore}
                            value={
                              scores[student?.id]?.[subCol.key] || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(
                                student?.id,
                                subCol.key,
                                e.target.value
                              )
                            }
                            className="w-full text-center"
                            placeholder="0"
                          />
                        </TableCell>
                      ))
                    ) : (
                      // Components without sub-components
                      <TableCell
                        key={column.key}
                        className="border border-gray-300 p-2"
                      >
                        <Input
                          type="number"
                          min="0"
                          max={column.maxScore}
                          value={
                            scores[student?.id]?.[column.key] || ""
                          }
                          onChange={(e) =>
                            handleScoreChange(
                              student?.id,
                              column.key,
                              e.target.value
                            )
                          }
                          className="w-full text-center"
                          placeholder="0"
                        />
                      </TableCell>
                    )
                  )}

                  {/* Total score */}
                  <TableCell className="border border-gray-300 text-center font-medium p-3">
                    {calculateStudentTotal(student?.id).toFixed(1)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length + 3}
                  className="border border-gray-300 text-center text-gray-500 py-8"
                >
                  {searchTerm
                    ? "No students found matching your search."
                    : "No students found for this class arm."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary footer */}
      <Card>
        <CardContent className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Total Possible Score:</span>{" "}
            {totalMaxScore} marks
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Students:</span>{" "}
            {searchTerm
              ? `${filteredStudents.length} filtered`
              : students.length}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Scores
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
