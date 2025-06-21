"use client";

import React from "react";
import LoaderComponent from "@/components/local/LoaderComponent";
import ReportCard from "../../(components)/ReportCard";
import { useGetResultByIdQuery } from "@/redux/api";

interface ResultDetailsProps {
  id: string;
  title: string;
}

// Types for the result batch data structure
interface MarkingSchemeHeader {
  key: string;
  label: string;
  maxScore: number;
}

interface ComponentScore {
  componentId: string;
  score: number;
  maxScore: number;
}

interface Subject {
  subjectId: string;
  subjectName: string;
  componentScores: ComponentScore[];
  totalScore: number;
  percentage: number;
  grade: string;
  comment: string;
}

interface Student {
  studentId: string;
  studentName: string;
  gender: string;
  age: number;
  studentPhoto?: string;
  subjects: Subject[];
  totalScore: number;
  percentage: number;
  grade: string;
  position: number;
}

interface ResultBatchData {
  resultBatch: {
    id: string;
    session: { name: string };
    termDefinition: { name: string };
    class: { name: string };
    classArm: { name: string };
    markingSchemeComponent: { name: string };
    resultScope: string;
    status: string;
    createdAt: string;
  };
  markingSchemeStructure: {
    layout: {
      headers: MarkingSchemeHeader[];
    };
  };
  students: Student[];
  statistics: {
    totalStudents: number;
    highestScore: number;
    lowestScore: number;
    averageScore: number;
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
  const { resultBatch, markingSchemeStructure, students, statistics } =
    resultBatchData;

  return (
    <div className='space-y-4'>
      {/* Header Information */}
      <div className='bg-white p-6 rounded-lg shadow-sm border mb-6 no-print'>
        <h1 className='text-2xl font-bold mb-4'>
          Result Batch: {resultBatch.class.name} {resultBatch.classArm.name}
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
          <div>
            <span className='font-semibold'>Session:</span>{" "}
            {resultBatch.session.name}
          </div>
          <div>
            <span className='font-semibold'>Term:</span> {resultBatch.termDefinition.name}
          </div>
          <div>
            <span className='font-semibold'>Component:</span>{" "}
            {resultBatch?.markingSchemeComponent?.name}
          </div>
          <div>
            <span className='font-semibold'>Scope:</span>{" "}
            {resultBatch.resultScope}
          </div>
          <div>
            <span className='font-semibold'>Total Students:</span>{" "}
            {statistics?.totalStudents}
          </div>
          <div>
            <span className='font-semibold'>Class Average:</span>{" "}
            {statistics?.averageScore?.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Report Cards for Each Student */}
      {students.map((student, index) => (
        <div key={student.studentId} className={index > 0 ? "print-break" : ""}>
          <ReportCard
            studentData={student}
            resultBatchInfo={resultBatch}
            markingSchemeStructure={markingSchemeStructure}
            statistics={statistics}
          />
        </div>
      ))}

      {/* Print All Button */}
      <div className='mt-8 text-center no-print'>
        <button
          onClick={() => window.print()}
          className='bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors'
        >
          Print All Report Cards ({students.length} students)
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
};
