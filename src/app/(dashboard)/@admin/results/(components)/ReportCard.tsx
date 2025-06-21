// @ts-nocheck
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
import { Card, CardContent } from "@/components/ui/card";
import { useGetSchoolConfigurationQuery } from "@/redux/api";

// Types for the new data structure
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

// Mock hook - replace with actual RTK query when available
const useGetResultsQuery = (_params: any, options?: { skip?: boolean }) => {
  // Mock data structure for legacy mode
  const mockData = {
    student: {
      id: "1",
      name: "Adebayo Tolu",
      gender: "Male",
      age: 14,
      studentPhoto: "/student-photo.jpg",
      class: "Basic 4,Diamond",
      studentInClass: 43,
    },
    academic: {
      session: "2023/2024",
      term: "First Term",
      daysPresent: 43,
      daysAbsent: 0,
      obtainableScore: 430,
      obtainedScore: 300,
      grade: "B (Very Good)",
      highestAverage: 73.23,
      lowestAverage: 73.23,
      classAverage: 73.23,
      studentAverage: 73.23,
    },
    subjects: [
      {
        id: "1",
        name: "Agricultural Science",
        assessment: 5,
        classWork: 5,
        continuousAssessment: 7,
        total: 20,
        percentage: 98,
        grade: "A",
        comment: "Excellent",
      },
    ],
    behavioralAssessment: {
      punctuality: "Excellent",
      attentiveness: "Very Good",
      leadershipSkills: "Good",
      neatness: "Excellent",
    },
    gradeScale: [
      { grade: "F- Fail", range: "0.00-49.99" },
      { grade: "P- Pass", range: "50.00-59.99" },
      { grade: "G- Good", range: "60.00-74.99" },
      { grade: "B- Very Good", range: "75.00-84.99" },
      { grade: "A- Excellent", range: "85.00- 100.00" },
    ],
    comments: {
      principal: "",
      administrator: "",
    },
    nextTermBegins: "",
  };

  return {
    data: options?.skip ? null : mockData,
    isLoading: false,
    error: null,
  };
};

interface ReportCardProps {
  // New props for dynamic data
  studentData?: Student;
  resultBatchInfo?: ResultBatchData["resultBatch"];
  markingSchemeStructure?: ResultBatchData["markingSchemeStructure"];
  statistics?: ResultBatchData["statistics"];

  // Legacy props for backward compatibility
  studentId?: string;
  sessionId?: string;
  termId?: string;
  classId?: string;

  // School header props (optional - will fetch from API if not provided)
  schoolName?: string;
  leftLogoSrc?: string;
  address?: string;
  email?: string;
  phone?: string;
  schoolNameColor?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  studentData,
  resultBatchInfo,
  markingSchemeStructure,
  statistics,
  studentId,
  sessionId,
  termId,
  classId,
  schoolName,
  leftLogoSrc,
  address,
  email,
  phone,
  schoolNameColor = "#E91E63",
}) => {
  // Fetch school configuration
  const { data: schoolConfig } = useGetSchoolConfigurationQuery({});

  // Use school config data if available, otherwise use provided props
  const schoolInfo = {
    name: schoolName || schoolConfig?.schoolName || "DEEPER LIFE HIGH SCHOOL",
    logo: leftLogoSrc || schoolConfig?.logoUrl || "/school-logo.png",
    address:
      address ||
      schoolConfig?.address ||
      "KLM 10, Abeokuta-Ibadan Road, Odeda,Abeokuta, Ogun State",
    email: email || schoolConfig?.email || "info@deeperlifehighschool.org",
    phone: phone || schoolConfig?.phone || "08033319011,08035540255",
  };
  // For new data structure, use provided data; for legacy, fetch from API
  const isLegacyMode =
    !studentData && (studentId || sessionId || termId || classId);

  // API call for legacy mode - replace with actual RTK query
  const {
    data: resultData,
    isLoading,
    error,
  } = useGetResultsQuery(
    {
      studentId,
      sessionId,
      termId,
      classId,
    },
    { skip: !isLegacyMode }
  );

  // Use provided data or fallback to API data
  const student = studentData || resultData?.student;
  const academic = resultBatchInfo || resultData?.academic;
  const subjects = studentData?.subjects || resultData?.subjects || [];
  const behavioralAssessment = resultData?.behavioralAssessment || {
    punctuality: "Excellent",
    attentiveness: "Very Good",
    leadershipSkills: "Good",
    neatness: "Excellent",
  };
  const gradeScale = resultData?.gradeScale || [
    { grade: "F- Fail", range: "0.00-49.99" },
    { grade: "P- Pass", range: "50.00-59.99" },
    { grade: "G- Good", range: "60.00-74.99" },
    { grade: "B- Very Good", range: "75.00-84.99" },
    { grade: "A- Excellent", range: "85.00- 100.00" },
  ];
  const comments = resultData?.comments || {
    principal: "",
    administrator: "",
  };

  if (isLegacyMode && isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (isLegacyMode && error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>Error Loading Report Card</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!student && !studentData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>No Data Found</h2>
          <p>Report card data is not available.</p>
        </div>
      </div>
    );
  }

  // Build dynamic table headers from marking scheme structure
  const tableHeaders = markingSchemeStructure?.layout.headers || [
    { key: "assessment", label: "ASS", maxScore: 5 },
    { key: "classWork", label: "C.W", maxScore: 5 },
    { key: "continuousAssessment", label: "C.A.T", maxScore: 5 },
  ];

  // Calculate academic info for new data structure
  const academicInfo = academic || {
    session: resultBatchInfo?.session.name || "2023/2024",
    term: resultBatchInfo?.term.name || "First Term",
    daysPresent: 43, // Hardcoded as requested
    daysAbsent: 0, // Hardcoded as requested
    obtainableScore:
      tableHeaders.reduce((sum, header) => sum + header.maxScore, 0) *
      subjects.length,
    obtainedScore: studentData?.totalScore || 0,
    grade: studentData?.grade?.name || "B (Very Good)",
    highestAverage: statistics?.highestScore || 0,
    lowestAverage: statistics?.lowestScore || 0,
    classAverage: statistics?.averageScore || 0,
    studentAverage: studentData?.percentage || 0,
  };

  // Format class information
  const classInfo = resultBatchInfo
    ? `${resultBatchInfo.class.name}, ${resultBatchInfo.classArm.name}`
    : student?.class || "Basic 4, Diamond";

  const studentInfo = {
    name: studentData?.studentName || student?.name || "Student Name",
    gender: studentData?.gender || student?.gender || "Male",
    age: studentData?.age || student?.age || 14,
    studentPhoto:
      studentData?.studentPhoto ||
      student?.studentPhoto ||
      "/student-photo.jpg",
    class: classInfo,
    studentInClass: statistics?.totalStudents || student?.studentInClass || 43,
  };

  return (
    <div className='bg-white min-h-screen'>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
        }
      `}</style>

      <div className='max-w-4xl mx-auto p-6 bg-white'>
        {/* School Header */}
        <div className='bg-white mb-6'>
          <div className='flex items-center justify-between'>
            {/* Left Logo */}
            <div className='flex-shrink-0'>
              <Image
                src={schoolInfo.logo}
                alt='School Logo'
                width={80}
                height={80}
                className='w-20 h-20 object-contain'
              />
            </div>

            {/* Center Content */}
            <div className='text-center flex-1 mx-6'>
              <h1
                className='text-2xl md:text-3xl font-bold mb-2'
                style={{ color: schoolNameColor }}
              >
                {schoolInfo.name}
              </h1>
              <div className='text-gray-600 text-sm space-y-1'>
                <p>{schoolInfo.address}</p>
                <p>E-Mail: {schoolInfo.email}</p>
                <p>Tel: {schoolInfo.phone}</p>
              </div>
            </div>

            {/* Right - Student Photo */}
            <div className='flex-shrink-0'>
              <div className='w-20 h-24 bg-gray-200 rounded overflow-hidden'>
                <Image
                  src={studentInfo.studentPhoto || "/default-student.jpg"}
                  alt='Student Photo'
                  width={80}
                  height={96}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Card Title */}
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-700'>Report Card</h2>
        </div>

        {/* Student Information Card */}
        <Card className='mb-6 border border-gray-300'>
          <CardContent className='p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
              <div>
                <span className='font-semibold'>NAME:</span> {studentInfo.name}
              </div>
              <div>
                <span className='font-semibold'>SESSION:</span>{" "}
                {academicInfo.session.name}
              </div>
              <div>
                <span className='font-semibold'>TERM:</span> {academicInfo.term}
              </div>
              <div>
                <span className='font-semibold'>CLASS:</span>{" "}
                {studentInfo.class}
              </div>
              <div>
                <span className='font-semibold'>GENDER:</span>{" "}
                {studentInfo.gender}
              </div>
              <div>
                <span className='font-semibold'>AGE:</span> {studentInfo.age}
              </div>
              <div>
                <span className='font-semibold'>STUDENT IN CLASS:</span>{" "}
                {studentInfo.studentInClass}
              </div>
              <div>
                <span className='font-semibold'>OBTAINABLE SCORE:</span>{" "}
                {academicInfo.obtainableScore?.name}
              </div>
              <div>
                <span className='font-semibold'>DAYS PRESENT:</span>{" "}
                {academicInfo.daysPresent}
              </div>
              <div>
                <span className='font-semibold'>OBTAINED SCORE:</span>{" "}
                {academicInfo.obtainedScore}
              </div>
              <div>
                <span className='font-semibold'>GRADE:</span>{" "}
                {academicInfo.grade?.name}
              </div>
              <div>
                <span className='font-semibold'>DAYS ABSENT:</span>{" "}
                {academicInfo.daysAbsent}
              </div>
              <div>
                <span className='font-semibold'>HIGHEST AVERAGE:</span>{" "}
                {academicInfo.highestAverage}
              </div>
              <div>
                <span className='font-semibold'>LOWEST AVERAGE:</span>{" "}
                {academicInfo.lowestAverage}
              </div>
              <div>
                <span className='font-semibold'>CLASS AVERAGE:</span>{" "}
                {academicInfo.classAverage}
              </div>
              <div className='md:col-span-2 lg:col-span-1'>
                <span className='font-semibold'>STUDENT&apos;S AVERAGE:</span>{" "}
                {academicInfo.studentAverage}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Table */}
        <div className='mb-6'>
          <Table className='border border-gray-300'>
            <TableHeader>
              <TableRow className='bg-blue-100'>
                <TableHead className='border border-gray-300 font-bold text-black'>
                  SUBJECT/SCHEME
                </TableHead>
                {tableHeaders.map((header) => (
                  <TableHead
                    key={header.key}
                    className='border border-gray-300 font-bold text-black text-center'
                  >
                    {header.label}
                    <br />
                    <span className='text-xs'>( {header.maxScore}mrks )</span>
                  </TableHead>
                ))}
                <TableHead className='border border-gray-300 font-bold text-black text-center'>
                  TOTAL
                  <br />
                  <span className='text-xs'>
                    ( {tableHeaders.reduce((sum, h) => sum + h.maxScore, 0)}{" "}
                    mrks )
                  </span>
                </TableHead>
                <TableHead className='border border-gray-300 font-bold text-black text-center'>
                  C.A
                  <br />
                  <span className='text-xs'>( 100 % )</span>
                </TableHead>
                <TableHead className='border border-gray-300 font-bold text-black text-center'>
                  GRADE
                </TableHead>
                <TableHead className='border border-gray-300 font-bold text-black text-center'>
                  Comment
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject, index) => {
                // Map component scores to headers for new data structure
                const getScoreForHeader = (headerKey: string) => {
                  if (subject.componentScores) {
                    // New data structure - find score by matching header key with component
                    const headerIndex = tableHeaders.findIndex(
                      (h) => h.key === headerKey
                    );
                    return subject.componentScores[headerIndex]?.score || 0;
                  } else {
                    // Legacy data structure
                    return (subject as any)[headerKey] || 0;
                  }
                };

                return (
                  <TableRow
                    key={subject.subjectId || subject.id || index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className='border border-gray-300 font-medium'>
                      {subject.subjectName || subject.name}
                    </TableCell>
                    {tableHeaders.map((header) => (
                      <TableCell
                        key={header.key}
                        className='border border-gray-300 text-center'
                      >
                        {getScoreForHeader(header.key)}
                      </TableCell>
                    ))}
                    <TableCell className='border border-gray-300 text-center'>
                      {subject.totalScore || subject.total}
                    </TableCell>
                    <TableCell className='border border-gray-300 text-center'>
                      {subject.percentage}
                    </TableCell>
                    <TableCell className='border border-gray-300 text-center font-semibold'>
                      {subject.grade?.name}
                    </TableCell>
                    <TableCell className='border border-gray-300 text-center'>
                      {subject.comment}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Key to Grade */}
          <div>
            <h3 className='bg-blue-100 p-2 font-bold text-center border border-gray-300'>
              KEY TO GRADE
            </h3>
            <div className='border border-gray-300 border-t-0'>
              {gradeScale.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between p-2 border-b border-gray-200 last:border-b-0'
                >
                  <span className='font-medium'>{item.grade?.name}</span>
                  <span>{item.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Assessment */}
          <div>
            <Table className='border border-gray-300'>
              <TableHeader>
                <TableRow className='bg-blue-100'>
                  <TableHead className='border border-gray-300 font-bold text-black'></TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center'>
                    Excellent
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center'>
                    Very Good
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center'>
                    Good
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center'>
                    Fair
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center'>
                    Poor
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(behavioralAssessment).map(
                  ([key, value], index) => (
                    <TableRow
                      key={key}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className='border border-gray-300 font-medium capitalize'>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </TableCell>
                      <TableCell className='border border-gray-300 text-center'>
                        {value === "Excellent" ? "✓" : ""}
                      </TableCell>
                      <TableCell className='border border-gray-300 text-center'>
                        {value === "Very Good" ? "✓" : ""}
                      </TableCell>
                      <TableCell className='border border-gray-300 text-center'>
                        {value === "Good" ? "✓" : ""}
                      </TableCell>
                      <TableCell className='border border-gray-300 text-center'>
                        {value === "Fair" ? "✓" : ""}
                      </TableCell>
                      <TableCell className='border border-gray-300 text-center'>
                        {value === "Poor" ? "✓" : ""}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Comments and Signatures */}
        <div className='mt-8 space-y-4'>
          <div className='border-b border-gray-300 pb-2'>
            <span className='font-bold'>PRINCIPAL&apos;S COMMENT:</span>
            <div className='mt-2 min-h-[40px] border-b border-dotted border-gray-400'>
              {comments.principal}
            </div>
          </div>

          <div className='border-b border-gray-300 pb-2'>
            <span className='font-bold'>ADMISTRATOR&apos;S SIGNATURE:</span>
            <div className='mt-2 min-h-[40px] border-b border-dotted border-gray-400'>
              {comments.administrator}
            </div>
          </div>

          <div className='border-b border-gray-300 pb-2'>
            <span className='font-bold'>NEXT TERM BEEGINS ON:</span>
            <div className='mt-2 min-h-[40px] border-b border-dotted border-gray-400'>
              {resultData?.nextTermBegins}
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className='mt-8 text-center no-print'>
          <button
            onClick={() => window.print()}
            className='bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors'
          >
            Print Report Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

/**
 * API Migration Notes:
 *
 * To complete the integration with the actual result batch API:
 *
 * 1. Replace the mock `useGetResultsQuery` with the actual RTK query hook
 * 2. Update the API endpoint in redux/api.ts to match the result batch structure
 * 3. Ensure the backend returns data in the expected format:
 *    - resultBatch: { session, term, class, classArm, markingSchemeComponent, etc. }
 *    - markingSchemeStructure: { layout: { headers: [] } }
 *    - students: [{ studentId, studentName, subjects: [{ componentScores: [] }] }]
 *    - statistics: { totalStudents, highestScore, lowestScore, averageScore }
 *
 * 4. The component now supports both:
 *    - New data structure (via props: studentData, resultBatchInfo, etc.)
 *    - Legacy data structure (via API call with studentId, sessionId, etc.)
 *
 * 5. School configuration is automatically fetched from the API
 * 6. Dynamic table headers are built from markingSchemeStructure.layout.headers
 * 7. Attendance and behavioral assessments are hardcoded as requested
 */
