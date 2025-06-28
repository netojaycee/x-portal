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
  maxScore: number | null;
  parentComponent: string | null;
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
  componentScores: {
    [componentId: string]: {
      total: number;
      maxScore: number;
      subComponents: {
        [subComponentId: string]: number;
      };
    };
  };
  percentage: number;
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

interface ResultBatchData {
  resultBatch: {
    id: string;
    session: { id?: string; name: string };
    termDefinition: { id?: string; name: string; displayName?: string };
    class: { id?: string; name: string };
    classArm: { id?: string; name: string };
    resultType?: { id: string; name: string };
    resultScope: string;
    title: string;
    isApproved?: boolean;
    status?: string;
    createdAt: string;
    markingSchemeComponent?: { name: string };
  };
  markingSchemeStructure: {
    layout: {
      headers: MarkingSchemeHeader[];
    };
  };
  students: Student[];
  subjects: any[];
  gradingSystem?: GradingSystem;
  classStats?: {
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
  statistics?: {
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
  statistics?: ResultBatchData["classStats"];
  subjects?: ResultBatchData["subjects"];
  gradingSystem?: GradingSystem;

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
  contact?: string;
  schoolNameColor?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  studentData,
  resultBatchInfo,
  markingSchemeStructure,
  statistics,
  gradingSystem,
  // subjects, // Not used currently as subjects come from studentData
  studentId,
  sessionId,
  termId,
  classId,
}) => {
  // Fetch school configuration
  const { data: schoolConfigRaw } = useGetSchoolConfigurationQuery({});
  const schoolConfig = schoolConfigRaw?.school;
  // console.log(schoolConfig, "config");

  // Use school config data if available, otherwise use provided props
  const schoolInfo = {
    name: schoolConfig?.school?.name,
    logo: schoolConfig?.logo?.imageUrl,
    address: schoolConfig?.school?.address,
    email: schoolConfig?.school?.email,
    contact: schoolConfig?.school?.contact,
    color: schoolConfig?.color,
  };
  // For new data structure, use provided data; for legacy, fetch from API
  const isLegacyMode =
    !studentData && (studentId || sessionId || termId || classId);

  console.log(studentData, "styudent");

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
  const subjects = studentData?.subjects || resultData?.subjects || [];
  const behavioralAssessment = studentData?.behavioralData
    ? {
        punctuality: studentData.behavioralData.punctuality || "",
        attentiveness: studentData.behavioralData.attentiveness || "",
        leadershipSkills: studentData.behavioralData.leadershipSkills || "",
        neatness: studentData.behavioralData.neatness || "",
      }
    : resultData?.behavioralAssessment || {
        punctuality: "Excellent",
        attentiveness: "Very Good",
        leadershipSkills: "Good",
        neatness: "Excellent",
      };
  const gradeScale = gradingSystem?.grades ||
    resultData?.gradeScale || [
      { grade: { name: "F- Fail" }, range: "0.00-49.99" },
      { grade: { name: "P- Pass" }, range: "50.00-59.99" },
      { grade: { name: "G- Good" }, range: "60.00-74.99" },
      { grade: { name: "B- Very Good" }, range: "75.00-84.99" },
      { grade: { name: "A- Excellent" }, range: "85.00- 100.00" },
    ];
  const comments = studentData?.comments ||
    resultData?.comments || {
      classTeacher: "",
      principal: "",
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
  const tableHeaders = markingSchemeStructure?.layout.headers || [];

  // Calculate academic info for new data structure
  const academicInfo = resultBatchInfo
    ? {
        session: resultBatchInfo.session?.name,
        term:
          resultBatchInfo.termDefinition?.displayName ||
          resultBatchInfo.termDefinition?.name
            ?.replace("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        daysPresent:
          studentData?.attendanceData?.present ||
          statistics?.attendance?.totalPresent ||
          43,
        daysAbsent:
          studentData?.attendanceData?.absent ||
          statistics?.attendance?.totalAbsent ||
          0,
        obtainableScore:
          studentData?.totalObtainable ||
          statistics?.totalObtainableScore ||
          tableHeaders
            .filter((h) => h.maxScore !== null)
            .reduce((sum, header) => sum + (header.maxScore || 0), 0) *
            subjects.length,
        obtainedScore:
          studentData?.totalScore || statistics?.totalObtainedScore || 0,
        grade: studentData?.overallGrade?.name || "B (Very Good)",
        highestAverage:
          statistics?.highestPercentage || statistics?.highestScore || 0,
        lowestAverage:
          statistics?.lowestPercentage || statistics?.lowestScore || 0,
        classAverage: statistics?.classAverage || 0,
        studentAverage:
          studentData?.overallPercentage || studentData?.averageScore || 0,
      }
    : {
        session: resultData?.academic?.session,
        term: resultData?.academic?.term,
        daysPresent: resultData?.academic?.daysPresent || 43,
        daysAbsent: resultData?.academic?.daysAbsent || 0,
        obtainableScore: resultData?.academic?.obtainableScore || 430,
        obtainedScore: resultData?.academic?.obtainedScore || 300,
        grade: resultData?.academic?.grade || "B (Very Good)",
        highestAverage: resultData?.academic?.highestAverage || 73.23,
        lowestAverage: resultData?.academic?.lowestAverage || 73.23,
        classAverage: resultData?.academic?.classAverage || 73.23,
        studentAverage: resultData?.academic?.studentAverage || 73.23,
      };

  // Format class information
  const classInfo = resultBatchInfo
    ? `${resultBatchInfo.class.name}, ${resultBatchInfo.classArm.name}`
    : student?.class || "Basic 4, Diamond";

  const studentInfo = {
    name: studentData
      ? `${studentData.user?.firstname || ""} ${
          studentData.user?.lastname || ""
        }`
      : student?.name || "",
    gender: studentData?.user?.gender || student?.gender,
    age: studentData?.age || student?.age,
    studentPhoto: studentData?.user?.avatar || student?.studentPhoto,
    class: classInfo,
    studentInClass: statistics?.totalStudents || student?.studentInClass || 43,
    regNo: studentData?.studentRegNo || student?.regNo,
  };

  return (
    <div className='bg-white shadow-lg rounded-lg max-w-4xl mx-auto'>
      <div className='w-full mx-auto p-10 bg-white '>
        {/* School Header */}
        <div className='bg-white mb-6'>
          <div className='flex items-center justify-between'>
            {/* Left Logo */}
            <div className='flex-shrink-0'>
              <Image
                src={schoolInfo.logo || "/default-logo.png"}
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
                style={{
                  color:
                    schoolInfo.color && !schoolInfo.color.includes("oklch")
                      ? schoolInfo.color
                      : "#000000",
                }}
              >
                {schoolInfo.name}
              </h1>
              <div className='text-gray-600 text-sm space-y-1'>
                <p>{schoolInfo.address}</p>
                <p>E-Mail: {schoolInfo.email}</p>
                <p>Tel: {schoolInfo.contact}</p>
              </div>
            </div>

            {/* Right - Student Photo */}
            <div className='flex-shrink-0'>
              <div className='w-20 h-24 bg-gray-200 rounded overflow-hidden'>
                {studentInfo.studentPhoto ? (
                  <Image
                    src={studentInfo.studentPhoto}
                    alt='Student Photo'
                    width={80}
                    height={96}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
                    No Photo
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Card Title */}
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-500'>Report Card</h2>
        </div>

        {/* Student Information Card */}
        <Card className='mb-4 border border-gray-400 shadow-none'>
          <CardContent className='p-3'>
            <div className='text-xs grid grid-cols-4 gap-y-1 gap-x-2 text-gray-700'>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>NAME:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {studentInfo?.name}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>SESSION:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.session}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>TERM:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.term}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>CLASS:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {studentInfo?.class}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>GENDER:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {studentInfo?.gender}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>AGE:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {studentInfo?.age}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>STUDENT IN CLASS:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {studentInfo?.studentInClass}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>OBTAINABLE SCORE:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.obtainableScore}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>DAYS PRESENT:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.daysPresent}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>DAYS ABSENT:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.daysAbsent}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>OBTAINED SCORE:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.obtainedScore}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>GRADE:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.grade}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>HIGHEST AVERAGE:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.highestAverage?.toFixed(2)}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>LOWEST AVERAGE:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.lowestAverage?.toFixed(2)}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>CLASS AVERAGE:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.classAverage?.toFixed(2)}
                </span>
              </div>
              <div className='md:col-span-2 lg:col-span-3 flex gap-1 mt-1'>
                <span className='font-normal'>STUDENT&apos;S AVERAGE:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {academicInfo?.studentAverage?.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Table */}
        <div className='mb-6 overflow-x-visible'>
          <Table className='border border-gray-300 w-full table-auto'>
            <TableHeader>
              <TableRow className='bg-blue-100'>
                <TableHead className='border border-gray-300 font-bold text-black min-w-[120px]'>
                  SUBJECT/SCHEME
                </TableHead>
                {tableHeaders.map((header) => {
                  // Determine if this column should show marks or text
                  const isNumericColumn =
                    header.maxScore !== null &&
                    header.key !== "grade" &&
                    header.key !== "comment";

                  return (
                    <TableHead
                      key={header.key}
                      className='border border-gray-300 font-bold text-black text-center px-2 min-w-[80px]'
                    >
                      <div className='text-xs leading-tight'>
                        {header.label}
                        {isNumericColumn && (
                          <>
                            <br />
                            <span className='text-xs'>
                              ( {header.maxScore}mrks )
                            </span>
                          </>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject, index) => {
                // Function to get score for each header
                const getScoreForHeader = (headerKey: string) => {
                  if (headerKey === "total") {
                    return subject.totalScore;
                  } else if (headerKey === "grade") {
                    return subject.grade?.name || "-";
                  } else if (headerKey === "comment") {
                    return subject.comment || "-";
                  } else if (subject.componentScores) {
                    // New data structure - extract score from componentScores
                    for (const [componentId, componentData] of Object.entries(
                      subject.componentScores
                    )) {
                      if (headerKey.startsWith(componentId)) {
                        // This is a subcomponent
                        const subComponentId = headerKey.split("_")[1];
                        if (
                          subComponentId &&
                          componentData.subComponents[subComponentId] !==
                            undefined
                        ) {
                          return componentData.subComponents[subComponentId];
                        } else if (
                          componentData.total !== undefined &&
                          componentData.maxScore !== undefined
                        ) {
                          // Return total score if no subcomponent found
                          return componentData.total;
                        }
                      }
                    }
                    return 0;
                  } else {
                    // Legacy data structure
                    return (subject as any)[headerKey] || 0;
                  }
                };

                return (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className='border border-gray-300 font-medium text-left px-2 py-1 text-sm'>
                      {subject?.subject?.name}
                    </TableCell>
                    {tableHeaders.map((header) => (
                      <TableCell
                        key={header.key}
                        className='border border-gray-300 text-center px-1 py-1 text-sm'
                      >
                        {getScoreForHeader(header.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Section */}
        <div className='grid grid-cols-[1fr_2fr] gap-4 mb-4'>
          {/* Key to Grade */}
          <div>
            <h3 className='bg-blue-100 p-1 font-bold border border-gray-300 text-sm'>
              KEY TO GRADE
            </h3>
            <div className='border border-gray-300 border-t-0'>
              {gradeScale.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between p-[3px] border-b border-gray-500 last:border-b-0'
                >
                  <span className='font-medium text-xs'>
                    {/* Handle both new grading system structure and legacy structure */}
                    {item.name
                      ? `${item.name} - ${item.remark}`
                      : item.grade?.name}
                  </span>
                  <span className='text-xs'>
                    {item.scoreRange?.display || item.range}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Assessment */}
          <div>
            <Table className='border border-gray-300 text-xs'>
              <TableHeader>
                <TableRow className='bg-blue-100'>
                  <TableHead className='border border-gray-300 font-bold text-black text-xs p-1'></TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center text-xs p-1'>
                    Excellent
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center text-xs p-1'>
                    Very Good
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center text-xs p-1'>
                    Good
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center text-xs p-1'>
                    Fair
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center text-xs p-1'>
                    Poor
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(behavioralAssessment).map(
                  ([key, value], index) => {
                    // Convert underscore format back to display format and capitalize
                    const displayKey = key.replace(/([A-Z])/g, " $1").trim();
                    const capitalizedKey =
                      displayKey.charAt(0).toUpperCase() + displayKey.slice(1);

                    // Convert API format (very_good) to display format (Very Good)
                    const displayValue = value
                      ? value
                          .replace(/_/g, " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : "";

                    return (
                      <TableRow
                        key={key}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <TableCell className='border border-gray-300 font-medium capitalize text-xs p-1'>
                          {capitalizedKey}
                        </TableCell>
                        <TableCell className='border border-gray-300 text-center text-xs p-1'>
                          {displayValue === "Excellent" ? "✓" : ""}
                        </TableCell>
                        <TableCell className='border border-gray-300 text-center text-xs p-1'>
                          {displayValue === "Very Good" ? "✓" : ""}
                        </TableCell>
                        <TableCell className='border border-gray-300 text-center text-xs p-1'>
                          {displayValue === "Good" ? "✓" : ""}
                        </TableCell>
                        <TableCell className='border border-gray-300 text-center text-xs p-1'>
                          {displayValue === "Fair" ? "✓" : ""}
                        </TableCell>
                        <TableCell className='border border-gray-300 text-center text-xs p-1'>
                          {displayValue === "Poor" ? "✓" : ""}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Comments and Signatures */}
        <div className='mt-4 space-y-1'>
          <div className='flex items-center pb-1'>
            <span className='font-bold mr-3 text-sm'>
              CLASS TEACHER&apos;S COMMENT:
            </span>
            <div className='flex-1 border-b border-gray-400 min-h-[25px] flex items-end pb-1 text-sm'>
              {comments.classTeacher}
            </div>
          </div>

          <div className='flex items-center pb-1'>
            <span className='font-bold mr-3 text-sm'>
              PRINCIPAL&apos;S COMMENT:
            </span>
            <div className='flex-1 border-b border-gray-400 min-h-[25px] flex items-end pb-1 text-sm'>
              {comments.principal}
            </div>
          </div>

          <div className='flex items-center pb-1'>
            <span className='font-bold mr-3 text-sm'>
              ADMINISTRATOR&apos;S SIGNATURE:
            </span>
            <div className='flex-1 border-b border-gray-400 min-h-[25px] flex items-end pb-1'>
              {schoolConfig?.schoolHeadSignature?.imageUrl && (
                <Image
                  src={schoolConfig.schoolHeadSignature.imageUrl}
                  alt="Administrator's Signature"
                  width={100}
                  height={30}
                  className='h-6 w-auto object-contain'
                />
              )}
            </div>
          </div>

          <div className='flex items-center pb-1'>
            <span className='font-bold mr-3 text-sm'>NEXT TERM BEGINS ON:</span>
            <div className='flex-1 border-b border-gray-400 min-h-[25px] flex items-end pb-1 text-sm'>
              {resultData?.nextTermBegins}
            </div>
          </div>
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
