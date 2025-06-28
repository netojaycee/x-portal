"use client";

import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetSchoolConfigurationQuery } from "@/redux/api";

// Types for the new data structure
interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Grade {
  id: string;
  name: string;
  remark: string;
  scoreStartPoint: number;
  scoreEndPoint: number;
  teacherComment?: string;
  principalComment?: string;
}

interface StudentSubject {
  subject: Subject;
  totalScore: number;
  obtainableScore: number;
  position: number;
  grade?: Grade; // Only present in grades type
}

interface Student {
  id: string;
  studentRegNo: string;
  firstname: string;
  lastname: string;
  othername: string | null;
  age: number;
  gender: string;
  subjects: StudentSubject[];
  totalScore: number;
  averageScore: number;
  overallGrade: Grade;
  overallPosition: number;
}

interface SubjectStats {
  subject: Subject;
  highestScore?: number;
  lowestScore?: number;
  averageScore?: number;
  highestGrade?: Grade;
  lowestGrade?: Grade;
  averageGrade?: Grade;
  totalStudents: number;
  obtainableScore: number;
}

interface BroadsheetData {
  resultBatch: {
    id: string;
    title: string;
    resultScope: string;
    session: { id: string; name: string };
    termDefinition: { id: string; name: string; displayName?: string };
    class: { id: string; name: string };
    classArm: { id: string; name: string };
    resultType: { id: string; name: string };
  };
  type: "scores" | "grades";
  students: Student[];
  subjects: Subject[];
  subjectStats: SubjectStats[];
  classStats: {
    totalStudents: number;
    totalSubjects: number;
  };
  metadata: {
    generatedAt: string;
    responseType: string;
  };
}

interface ClassBroadsheetReportProps {
  data?: BroadsheetData;
}

const ClassBroadsheetReport: React.FC<ClassBroadsheetReportProps> = ({
  data,
}) => {
  // Fetch school configuration
  const { data: schoolConfigRaw } = useGetSchoolConfigurationQuery({});
  const schoolConfig = schoolConfigRaw?.school;

  // Use school config data
  const schoolInfo = {
    name: schoolConfig?.school?.name || "School Name",
    logo: schoolConfig?.logo?.imageUrl || "/default-logo.png",
    address: schoolConfig?.school?.address || "",
    email: schoolConfig?.school?.email || "",
    contact: schoolConfig?.school?.contact || "",
    color: schoolConfig?.color || "#E91E63",
  };

  if (!data) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>No Data Found</h2>
          <p>Broadsheet data is not available.</p>
        </div>
      </div>
    );
  }

  const { resultBatch, type, students, subjects, subjectStats } = data;

  // Format display name for term
  const termDisplay =
    resultBatch.termDefinition.displayName ||
    resultBatch.termDefinition.name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  // Format class display
  const classDisplay = `${resultBatch.class.name} ${resultBatch.classArm.name}`;

  const getGradeColor = (grade: string) => {
    switch (grade.charAt(0)) {
      case "A":
        return "text-green-600 font-bold";
      case "B":
        return "text-blue-600 font-bold";
      case "C":
        return "text-yellow-600 font-bold";
      case "D":
        return "text-orange-600 font-bold";
      case "F":
        return "text-red-600 font-bold";
      default:
        return "text-gray-600";
    }
  };

  // Get subject score or grade for a student
  const getSubjectValue = (student: Student, subjectId: string) => {
    const subjectData = student.subjects.find(
      (s) => s.subject.id === subjectId
    );
    if (!subjectData) return type === "grades" ? "-" : "0";

    if (type === "grades") {
      return subjectData.grade?.name || "-";
    } else {
      return subjectData.totalScore.toString();
    }
  };

  // Calculate statistics for display
  const getSubjectStatValue = (
    subjectId: string,
    statType: "highest" | "lowest" | "average"
  ) => {
    const stat = subjectStats.find((s) => s.subject.id === subjectId);
    if (!stat) return type === "grades" ? "-" : "0";

    if (type === "grades") {
      switch (statType) {
        case "highest":
          return stat.highestGrade?.name || "-";
        case "lowest":
          return stat.lowestGrade?.name || "-";
        case "average":
          return stat.averageGrade?.name || "-";
        default:
          return "-";
      }
    } else {
      switch (statType) {
        case "highest":
          return stat.highestScore?.toString() || "0";
        case "lowest":
          return stat.lowestScore?.toString() || "0";
        case "average":
          return stat.averageScore?.toFixed(2) || "0.00";
        default:
          return "0";
      }
    }
  };

  return (
    <div className='bg-white min-h-screen'>
      <div className='max-w-7xl mx-auto p-4 bg-white'>
        {/* School Header */}
        <div className='bg-white mb-4'>
          <div className='flex items-center justify-between'>
            {/* Left Logo */}
            <div className='flex-shrink-0'>
              <Image
                src={schoolInfo.logo}
                alt='School Logo'
                width={60}
                height={60}
                className='w-15 h-15 object-contain'
              />
            </div>

            {/* Center Content */}
            <div className='text-center flex-1 mx-6'>
              <h1
                className='text-xl md:text-2xl font-bold mb-1'
                style={{
                  color:
                    schoolInfo.color && !schoolInfo.color.includes("oklch")
                      ? schoolInfo.color
                      : "#E91E63",
                }}
              >
                {schoolInfo.name}
              </h1>
              <div className='text-gray-600 text-xs space-y-1'>
                <p>{schoolInfo.address}</p>
                <p>E-Mail: {schoolInfo.email}</p>
                <p>Tel: {schoolInfo.contact}</p>
              </div>
            </div>

            {/* Right Logo */}
            <div className='flex-shrink-0'>
              <Image
                src={schoolInfo.logo}
                alt='School Logo'
                width={60}
                height={60}
                className='w-15 h-15 object-contain'
              />
            </div>
          </div>
        </div>

        {/* Report Title */}
        <div className='text-center mb-4'>
          <h2 className='text-base font-bold text-gray-700'>
            {classDisplay} {termDisplay} {resultBatch.resultType.name}{" "}
            {type === "grades" ? "Grades" : "Scores"} Broadsheet{" "}
            {resultBatch.session.name}
          </h2>
        </div>

        {/* Main Broadsheet Table */}
        <div className='overflow-x-auto mb-6'>
          <Table className='border border-gray-300 text-xs'>
            <TableHeader>
              <TableRow className='bg-blue-100'>
                <TableHead className='border border-gray-300 font-bold text-black text-center p-1 min-w-[120px]'>
                  NAME
                </TableHead>
                <TableHead className='border border-gray-300 font-bold text-black text-center p-1 min-w-[40px]'>
                  AGE
                </TableHead>
                <TableHead className='border border-gray-300 font-bold text-black text-center p-1 min-w-[50px]'>
                  GENDER
                </TableHead>
                {subjects.map((subject) => (
                  <TableHead
                    key={subject.id}
                    className='border border-gray-300 font-bold text-black text-center p-1 min-w-[50px]'
                  >
                    {subject.code}
                  </TableHead>
                ))}
                <TableHead className='border border-gray-300 font-bold text-black text-center p-1 min-w-[50px]'>
                  TOTAL
                </TableHead>
                <TableHead className='border border-gray-300 font-bold text-black text-center p-1 min-w-[50px]'>
                  AVERAGE
                </TableHead>
                <TableHead className='border border-gray-300 font-bold text-black text-center p-1 min-w-[50px]'>
                  POSITION
                </TableHead>
                <TableHead className='border border-gray-300 font-bold text-black text-center p-1 min-w-[50px]'>
                  GRADE
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow
                  key={student.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className='border border-gray-300 p-1 font-medium text-left'>
                    {student.firstname} {student.lastname}
                  </TableCell>
                  <TableCell className='border border-gray-300 text-center p-1'>
                    {student.age}
                  </TableCell>
                  <TableCell className='border border-gray-300 text-center p-1 capitalize'>
                    {student.gender}
                  </TableCell>
                  {subjects.map((subject) => (
                    <TableCell
                      key={subject.id}
                      className='border border-gray-300 text-center p-1'
                    >
                      <span
                        className={
                          type === "grades"
                            ? getGradeColor(
                                getSubjectValue(student, subject.id)
                              )
                            : ""
                        }
                      >
                        {getSubjectValue(student, subject.id)}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className='border border-gray-300 text-center p-1 font-bold'>
                    {student.totalScore}
                  </TableCell>
                  <TableCell className='border border-gray-300 text-center p-1 font-bold'>
                    {student.averageScore?.toFixed(2)}
                  </TableCell>
                  <TableCell className='border border-gray-300 text-center p-1 font-bold'>
                    {student.overallPosition}
                  </TableCell>
                  <TableCell
                    className={`border border-gray-300 text-center p-1 ${getGradeColor(
                      student.overallGrade?.name || ""
                    )}`}
                  >
                    {student.overallGrade?.name || "-"}
                  </TableCell>
                </TableRow>
              ))}

              {/* Subject Statistics Rows */}
              <TableRow className='bg-yellow-100'>
                <TableCell
                  className='border border-gray-300 p-1 font-bold text-center'
                  colSpan={3}
                >
                  {type === "grades"
                    ? "SUBJECT AVERAGE GRADES"
                    : "SUBJECT AVERAGES"}
                </TableCell>
                {subjects.map((subject) => (
                  <TableCell
                    key={subject.id}
                    className='border border-gray-300 text-center p-1 font-bold'
                  >
                    <span
                      className={
                        type === "grades"
                          ? getGradeColor(
                              getSubjectStatValue(subject.id, "average")
                            )
                          : ""
                      }
                    >
                      {getSubjectStatValue(subject.id, "average")}
                    </span>
                  </TableCell>
                ))}
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
              </TableRow>

              {/* Lowest Score/Grade Row */}
              <TableRow className='bg-red-100'>
                <TableCell
                  className='border border-gray-300 p-1 font-bold text-center'
                  colSpan={3}
                >
                  {type === "grades" ? "LOWEST GRADES" : "LOWEST SCORES"}
                </TableCell>
                {subjects.map((subject) => (
                  <TableCell
                    key={subject.id}
                    className='border border-gray-300 text-center p-1 font-bold'
                  >
                    <span
                      className={
                        type === "grades"
                          ? getGradeColor(
                              getSubjectStatValue(subject.id, "lowest")
                            )
                          : ""
                      }
                    >
                      {getSubjectStatValue(subject.id, "lowest")}
                    </span>
                  </TableCell>
                ))}
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
              </TableRow>

              {/* Highest Score/Grade Row */}
              <TableRow className='bg-green-100'>
                <TableCell
                  className='border border-gray-300 p-1 font-bold text-center'
                  colSpan={3}
                >
                  {type === "grades" ? "HIGHEST GRADES" : "HIGHEST SCORES"}
                </TableCell>
                {subjects.map((subject) => (
                  <TableCell
                    key={subject.id}
                    className='border border-gray-300 text-center p-1 font-bold'
                  >
                    <span
                      className={
                        type === "grades"
                          ? getGradeColor(
                              getSubjectStatValue(subject.id, "highest")
                            )
                          : ""
                      }
                    >
                      {getSubjectStatValue(subject.id, "highest")}
                    </span>
                  </TableCell>
                ))}
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Key to Subject */}
        <div className='mt-6'>
          <h3 className='bg-blue-100 p-2 font-bold text-center border border-gray-300 text-sm'>
            KEY TO SUBJECT
          </h3>
          <div className='border border-gray-300 border-t-0'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0'>
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className={`flex justify-between p-2 border-b border-gray-300 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } ${
                    index >= subjects.length - (subjects.length % 4 || 4)
                      ? "border-b-0"
                      : ""
                  }`}
                >
                  <span className='font-medium text-xs'>{subject.code}</span>
                  <span className='text-xs'>{subject.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassBroadsheetReport;
