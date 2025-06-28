"use client";

import React from "react";
import LoaderComponent from "@/components/local/LoaderComponent";
import ReportCard from "../../(components)/ReportCard";
import { useGetResultByIdQuery } from "@/redux/api";
import { Button } from "@/components/ui/button";

interface ResultDetailsProps {
  id: string;
  title: string;
}

// Types for the result batch data structure
interface MarkingSchemeHeader {
  key: string;
  label: string;
  maxScore: number | null;
  parentComponent: string | null;
}

interface ComponentScores {
  [componentId: string]: {
    total: number;
    maxScore: number;
    subComponents: {
      [subComponentId: string]: number;
    };
  };
}

interface Subject {
  subject: {
    id: string;
    name: string;
    code: string;
  };
  totalScore: number;
  obtainableScore: number;
  position: number;
  grade: any;
  comment: string;
  componentScores: ComponentScores;
  percentage: number;
}

interface SubjectData {
  id: string;
  name: string;
  code: string;
}

interface Student {
  id: string;
  studentRegNo: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    othername: string | null;
    username: string;
    gender: string;
    avatar: any;
  };
  dateOfBirth: string;
  age: number;
  subjects: Subject[];
  totalScore: number;
  averageScore: number;
  overallPosition: number;
  behavioralData: {
    [key: string]: string;
  };
  attendanceData: {
    total: number;
    present: number;
    absent: number;
    percentage: number;
  };
  comments: {
    classTeacher: string;
    principal: string;
  };
  totalObtainable: number;
  overallPercentage: number;
  overallGrade: any;
}

interface GradingSystem {
  id: string;
  name: string;
  grades: Grade[];
}

interface Grade {
  id: string;
  name: string;
  remark: string;
  scoreRange: {
    min: number;
    max: number;
    display: string;
  };
}

interface ResultBatchData {
  resultBatch: {
    id: string;
    session: { name: string };
    termDefinition: { name: string };
    class: { name: string };
    classArm: { name: string };
    markingSchemeComponent?: { name: string };
    resultScope: string;
    title: string;
    status?: string;
    createdAt: string;
  };
  markingSchemeStructure: {
    layout: {
      headers: MarkingSchemeHeader[];
    };
  };
  students: Student[];
  classStats: {
    totalStudents: number;
    totalSubjects?: number;
    totalObtainableScore?: number;
    totalObtainedScore?: number;
    classPercentage?: number;
    highestScore: number;
    highestPercentage?: number;
    lowestScore: number;
    lowestPercentage?: number;
    classAverage?: number;
    attendance?: {
      totalDays: number;
      totalPresent: number;
      totalAbsent: number;
      attendancePercentage: number;
    };
    subjectStats?: any[];
  };
  subjects: SubjectData[];
  gradingSystem?: GradingSystem;
  metadata?: {
    generatedAt: string;
    totalRecords: number;
    hasStudentTermRecords: boolean;
    gradingSystemId: any;
  };
}

export const Main: React.FC<ResultDetailsProps> = ({ id, title }) => {
  const { data, isLoading, error } = useGetResultByIdQuery(id);

  console.log(data && data, title);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>Error Loading Results</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>No Data Found</h2>
          <p>Result batch data is not available.</p>
        </div>
      </div>
    );
  }

  // Type assertion for the response data
  const resultBatchData = data as ResultBatchData;
  const {
    resultBatch,
    markingSchemeStructure,
    students,
    classStats,
    subjects,
    gradingSystem,
  } = resultBatchData;

  console.log(data, "result data");

  return (
    <div className='space-y-4'>
      {/* Header Information */}
      <div className='bg-[#fcfcfc] px-9 pt-16 pb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-3'>View Result</h1>
          <p className='text-gray-500 text-base'>
            Below are results for {resultBatch?.title}
            {students && students.length > 0 && (
              <span className='ml-2 text-sm font-medium text-[#5C6AC4]'>
                ({students.length} student{students.length !== 1 ? "s" : ""})
              </span>
            )}
          </p>
        </div>
        <Button>Print Result</Button>
      </div>

      {/* Report Cards for Each Student */}
      <div className='space-y-8 max-w-7xl mx-auto px-4'>
        {students.map((student, index) => (
          <div key={`${student.id}-${index}`}>
            <ReportCard
              studentData={student}
              resultBatchInfo={resultBatch}
              markingSchemeStructure={markingSchemeStructure}
              statistics={classStats}
              subjects={subjects}
              gradingSystem={gradingSystem}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
