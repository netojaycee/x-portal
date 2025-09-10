"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Check, Clock, Loader2, Search, X } from "lucide-react";
import { format } from "date-fns";
import NoData from "@/app/(dashboard)/components/NoData";
import {
  useGetAttendanceStudentsQuery,
  useMarkAttendanceMutation,
} from "@/redux/api";
import { AttendanceStatus, AttendanceRecord } from "@/lib/types/attendance";
import { toast } from "sonner";

export default function TakeAttendance() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters
  const sessionId = searchParams.get("sessionId") || "";
  const term = searchParams.get("term") || ""; // Updated to use term ID
  const classId = searchParams.get("classId") || "";
  const classArmId = searchParams.get("classArmId") || "";
  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();

  // State for attendance records
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, AttendanceRecord>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Fetch students for attendance
  const {
    data: studentsData,
    isLoading,
    isError,
  } = useGetAttendanceStudentsQuery(
    {
      sessionId,
      term,
      classId,
      classArmId,
      date: dateParam || date.toISOString(),
    },
    { skip: !sessionId || !term || !classId || !classArmId || !date }
  );
  console.log("studentsData", studentsData);
  // Mark attendance mutation
  const [markAttendance, { isLoading: isSubmitting }] =
    useMarkAttendanceMutation();

  // Set default attendance status for all students (present)
  useEffect(() => {
    if (studentsData?.length) {
      const initialAttendance: Record<string, AttendanceRecord> = {};

      studentsData.forEach((student: any) => {
        if (student.attendanceRecords && student.attendanceRecords.length > 0) {
          initialAttendance[student.id] = {
            studentId: student.id,
            status: student.attendanceRecords[0].status,
          };
        } else {
          initialAttendance[student.id] = {
            studentId: student.id,
            status: AttendanceStatus.PRESENT,
          };
        }
      });

      setAttendanceRecords(initialAttendance);
    }
  }, [studentsData]);

  // Filter students based on search term
  const filteredStudents = studentsData
    ? studentsData.filter(
        (student: any) =>
          student.user.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.user.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.studentRegNo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle status change for a student
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  // Bulk update all students' status
  const markAllAs = (status: AttendanceStatus) => {
    if (!studentsData) return;

    const updatedRecords: Record<string, AttendanceRecord> = {};
    studentsData.forEach((student: any) => {
      updatedRecords[student.id] = {
        studentId: student.id,
        status,
      };
    });

    setAttendanceRecords(updatedRecords);
  };

  // Check if attendance already taken for any student
  const attendanceAlreadyTaken = studentsData?.some((student: any) => student.attendanceRecords && student.attendanceRecords.length > 0);

  // Submit attendance records
  const handleSubmit = async () => {
    if (attendanceAlreadyTaken) {
      toast.error("Attendance already taken for this class today.");
      return;
    }
    try {
      const studentsPayload = filteredStudents.map((student: any) => ({
        studentId: student.id,
        attendanceStatus: attendanceRecords[student.id]?.status || AttendanceStatus.PRESENT
      }));
      const payload = {
        sessionId,
        termId: term,
        classId,
        classArmId,
        date: dateParam || date.toISOString(),
        students: studentsPayload,
      };

      console.log("Submitting attendance:", payload);
      await markAttendance(payload).unwrap();

      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to mark attendance:", error);
    }
  };

  // Navigate back to the attendance form
  const goBack = () => {
    router.push("/attendance");
  };

  // After successful submission
  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    router.push("/attendance");
  };

  if (isError) {
    return (
      <div className="p-6">
        <Button onClick={goBack} className="mb-6" variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load students. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={goBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Attendance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Take Attendance - {format(date, "EEEE, MMMM do, yyyy")}
          </CardTitle>
          <CardDescription>
            Mark attendance for students in this class
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading students...</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-6">
                <div className="relative w-40 mr-2">
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute top-1/2 left-3 w-4 h-4 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => markAllAs(AttendanceStatus.PRESENT)}
                    className="border-green-500 text-green-600 text-xs"
                    disabled={attendanceAlreadyTaken}
                  >
                    <Check className="h-4 w-4 mr-2" /> Mark All Present
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => markAllAs(AttendanceStatus.LATE)}
                    className="border-amber-500 text-amber-600 text-xs"
                    disabled={attendanceAlreadyTaken}
                  >
                    <Clock className="h-4 w-4 mr-2" /> Mark All Late
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => markAllAs(AttendanceStatus.ABSENT)}
                    className="border-red-500 text-red-600 text-xs"
                    disabled={attendanceAlreadyTaken}
                  >
                    <X className="h-4 w-4 mr-2" /> Mark All Absent
                  </Button>
                </div>
              </div>

              {filteredStudents.length > 0 ? (
                <Table>
                  <TableHeader className="bg-[#E1E8F8]">
                    <TableRow>
                      <TableHead className="w-12 font-semibold text-gray-700">
                        S/N
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Student
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Registration No.
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Attendance Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student: any, index: number) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {student.user.lastname} {student.user.firstname}{" "}
                        </TableCell>
                        <TableCell>{student.studentRegNo}</TableCell>
                        <TableCell>
                          <RadioGroup
                            className="flex flex-row space-x-4"
                            value={attendanceRecords[student.id]?.status || AttendanceStatus.PRESENT}
                            onValueChange={(value: AttendanceStatus) => handleStatusChange(student.id, value)}
                            disabled={student.attendanceRecords && student.attendanceRecords.length > 0}
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value={AttendanceStatus.PRESENT}
                                id={`present-${student.id}`}
                                className="text-green-600 border-green-600 focus:ring-green-600"
                                disabled={student.attendanceRecords && student.attendanceRecords.length > 0}
                              />
                              <Label
                                htmlFor={`present-${student.id}`}
                                className="text-green-600"
                              >
                                Present
                              </Label>
                            </div>

                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value={AttendanceStatus.LATE}
                                id={`late-${student.id}`}
                                className="text-amber-500 border-amber-500 focus:ring-amber-500"
                                disabled={student.attendanceRecords && student.attendanceRecords.length > 0}
                              />
                              <Label
                                htmlFor={`late-${student.id}`}
                                className="text-amber-500"
                              >
                                Late
                              </Label>
                            </div>

                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value={AttendanceStatus.ABSENT}
                                id={`absent-${student.id}`}
                                className="text-red-600 border-red-600 focus:ring-red-600"
                                disabled={student.attendanceRecords && student.attendanceRecords.length > 0}
                              />
                              <Label
                                htmlFor={`absent-${student.id}`}
                                className="text-red-600"
                              >
                                Absent
                              </Label>
                            </div>
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8">
                  <NoData
                    text={
                      searchTerm
                        ? "No students match your search"
                        : "No students found in this class"
                    }
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || filteredStudents.length === 0}
            className="w-40"
          >
            {attendanceAlreadyTaken
              ? "Attendance Taken"
              : isSubmitting
              ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>)
              : "Save Attendance"}
          </Button>
        </CardFooter>
      </Card>

      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Attendance Saved</AlertDialogTitle>
            <AlertDialogDescription>
              The attendance records have been successfully saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessClose}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
