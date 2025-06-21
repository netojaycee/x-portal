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

// Mock hook - replace with actual RTK query
const useGetClassBroadsheetQuery = () => {
  // Mock data structure
  const mockData = {
    class: {
      name: "Basic 7 Diamond",
      term: "First Term",
      examType: "Exam",
      session: "2023/2024",
      reportTitle: "Broadsheet Report",
    },
    subjects: [
      { code: "AGS", name: "Agricultural Science", maxScore: 50 },
      { code: "BIZ", name: "Business Studies", maxScore: 50 },
      { code: "CCA", name: "Civic Education", maxScore: 50 },
      { code: "CRS", name: "Christian Religion Studies", maxScore: 50 },
      { code: "ENG", name: "English Language", maxScore: 50 },
      { code: "FRE", name: "French Language", maxScore: 50 },
      { code: "HAU", name: "Hausa Language", maxScore: 50 },
      { code: "HIS", name: "History", maxScore: 50 },
      { code: "IGH", name: "Igbo Language", maxScore: 50 },
      { code: "MAT", name: "Mathematics", maxScore: 50 },
      { code: "SOS", name: "Social Studies", maxScore: 50 },
      { code: "YOR", name: "Yoruba Language", maxScore: 50 },
    ],
    students: [
      {
        id: "1",
        name: "Adebayo Tolu",
        scores: {
          AGS: 45,
          BIZ: 42,
          CCA: 48,
          CRS: 50,
          ENG: 46,
          FRE: 38,
          HAU: 35,
          HIS: 44,
          IGH: 49,
          MAT: 48,
          SOS: 47,
          YOR: 40,
        },
        total: 532,
        average: 44.33,
        position: 1,
        grade: "B",
      },
      {
        id: "2",
        name: "Adebayo Ben",
        scores: {
          AGS: 43,
          BIZ: 40,
          CCA: 46,
          CRS: 48,
          ENG: 44,
          FRE: 36,
          HAU: 33,
          HIS: 42,
          IGH: 47,
          MAT: 46,
          SOS: 45,
          YOR: 38,
        },
        total: 508,
        average: 42.33,
        position: 2,
        grade: "B",
      },
      {
        id: "3",
        name: "Adebayo Joy",
        scores: {
          AGS: 41,
          BIZ: 38,
          CCA: 44,
          CRS: 46,
          ENG: 42,
          FRE: 34,
          HAU: 31,
          HIS: 40,
          IGH: 45,
          MAT: 44,
          SOS: 43,
          YOR: 36,
        },
        total: 484,
        average: 40.33,
        position: 3,
        grade: "C",
      },
      {
        id: "4",
        name: "Adebayo Seun",
        scores: {
          AGS: 39,
          BIZ: 36,
          CCA: 42,
          CRS: 44,
          ENG: 40,
          FRE: 32,
          HAU: 29,
          HIS: 38,
          IGH: 43,
          MAT: 42,
          SOS: 41,
          YOR: 34,
        },
        total: 460,
        average: 38.33,
        position: 4,
        grade: "C",
      },
      {
        id: "5",
        name: "Adebayo Kemi",
        scores: {
          AGS: 37,
          BIZ: 34,
          CCA: 40,
          CRS: 42,
          ENG: 38,
          FRE: 30,
          HAU: 27,
          HIS: 36,
          IGH: 41,
          MAT: 40,
          SOS: 39,
          YOR: 32,
        },
        total: 436,
        average: 36.33,
        position: 5,
        grade: "C",
      },
      {
        id: "6",
        name: "Adebayo Tope",
        scores: {
          AGS: 35,
          BIZ: 32,
          CCA: 38,
          CRS: 40,
          ENG: 36,
          FRE: 28,
          HAU: 25,
          HIS: 34,
          IGH: 39,
          MAT: 38,
          SOS: 37,
          YOR: 30,
        },
        total: 412,
        average: 34.33,
        position: 6,
        grade: "D",
      },
      {
        id: "7",
        name: "Adebayo Bola",
        scores: {
          AGS: 33,
          BIZ: 30,
          CCA: 36,
          CRS: 38,
          ENG: 34,
          FRE: 26,
          HAU: 23,
          HIS: 32,
          IGH: 37,
          MAT: 36,
          SOS: 35,
          YOR: 28,
        },
        total: 388,
        average: 32.33,
        position: 7,
        grade: "D",
      },
      {
        id: "8",
        name: "Adebayo Wale",
        scores: {
          AGS: 31,
          BIZ: 28,
          CCA: 34,
          CRS: 36,
          ENG: 32,
          FRE: 24,
          HAU: 21,
          HIS: 30,
          IGH: 35,
          MAT: 34,
          SOS: 33,
          YOR: 26,
        },
        total: 364,
        average: 30.33,
        position: 8,
        grade: "D",
      },
      {
        id: "9",
        name: "Adebayo Nike",
        scores: {
          AGS: 29,
          BIZ: 26,
          CCA: 32,
          CRS: 34,
          ENG: 30,
          FRE: 22,
          HAU: 19,
          HIS: 28,
          IGH: 33,
          MAT: 32,
          SOS: 31,
          YOR: 24,
        },
        total: 340,
        average: 28.33,
        position: 9,
        grade: "F",
      },
      {
        id: "10",
        name: "Adebayo Dupe",
        scores: {
          AGS: 27,
          BIZ: 24,
          CCA: 30,
          CRS: 32,
          ENG: 28,
          FRE: 20,
          HAU: 17,
          HIS: 26,
          IGH: 31,
          MAT: 30,
          SOS: 29,
          YOR: 22,
        },
        total: 316,
        average: 26.33,
        position: 10,
        grade: "F",
      },
    ],
    statistics: {
      subjectAverages: {
        AGS: 36.0,
        BIZ: 33.0,
        CCA: 39.0,
        CRS: 41.0,
        ENG: 37.0,
        FRE: 29.0,
        HAU: 26.0,
        HIS: 35.0,
        IGH: 40.0,
        MAT: 39.0,
        SOS: 38.0,
        YOR: 31.0,
      },
      classAverage: 35.25,
      highestTotal: 532,
      lowestTotal: 316,
    },
    keyToSubject: [
      { code: "AGS", subject: "Agricultural Science" },
      { code: "BIZ", subject: "Business Studies" },
      { code: "CCA", subject: "Civic Education" },
      { code: "CRS", subject: "Christian Religion Studies" },
      { code: "ENG", subject: "English Language" },
      { code: "FRE", subject: "French Language" },
      { code: "HAU", subject: "Hausa Language" },
      { code: "HIS", subject: "History" },
      { code: "IGH", subject: "Igbo Language" },
      { code: "MAT", subject: "Mathematics" },
      { code: "SOS", subject: "Social Studies" },
      { code: "YOR", subject: "Yoruba Language" },
    ],
  };

  return {
    data: mockData,
    isLoading: false,
    error: null,
  };
};

interface ClassBroadsheetReportProps {
  classId?: string;
  sessionId?: string;
  termId?: string;
  examType?: string;
  // School header props
  schoolName?: string;
  leftLogoSrc?: string;
  rightLogoSrc?: string;
  address?: string;
  email?: string;
  phone?: string;
  schoolNameColor?: string;
}

const ClassBroadsheetReport: React.FC<ClassBroadsheetReportProps> = ({
  // classId,
  // sessionId,
  // termId,
  // examType,
  schoolName = "DEEPER LIFE HIGH SCHOOL",
  leftLogoSrc = "/school-logo.png",
  rightLogoSrc = "/school-logo.png",
  address = "KLM 10, Abeokuta-Ibadan Road, Odeda,Abeokuta, Ogun State",
  email = "info@deeperlifehighschool.org",
  phone = "08033319011,08035540255",
  schoolNameColor = "#E91E63",
}) => {
  // API call - replace with actual RTK query
  const {
    data: broadsheetData,
    isLoading,
    error,
  } = useGetClassBroadsheetQuery(
    // {
    // classId,
    // sessionId,
    // termId,
    // examType,
  // }
);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>Error Loading Broadsheet</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!broadsheetData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>No Data Found</h2>
          <p>Broadsheet data is not available.</p>
        </div>
      </div>
    );
  }

  const {
    class: classInfo,
    subjects,
    students,
    statistics,
    keyToSubject,
  } = broadsheetData;

  const getGradeColor = (grade: string) => {
    switch (grade) {
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
          body {
            font-size: 10px;
          }
          table {
            font-size: 8px;
          }
        }
      `}</style>

      <div className='max-w-7xl mx-auto p-4 bg-white'>
        {/* School Header */}
        <div className='bg-white mb-4'>
          <div className='flex items-center justify-between'>
            {/* Left Logo */}
            <div className='flex-shrink-0'>
              <Image
                src={leftLogoSrc}
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
                style={{ color: schoolNameColor }}
              >
                {schoolName}
              </h1>
              <div className='text-gray-600 text-xs space-y-1'>
                <p>{address}</p>
                <p>E-Mail: {email}</p>
                <p>Tel: {phone}</p>
              </div>
            </div>

            {/* Right Logo */}
            <div className='flex-shrink-0'>
              <Image
                src={rightLogoSrc}
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
            {classInfo.name} {classInfo.term} {classInfo.examType}{" "}
            {classInfo.reportTitle} {classInfo.session}
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
                {subjects.map((subject) => (
                  <TableHead
                    key={subject.code}
                    className='border border-gray-300 font-bold text-black text-center p-1 min-w-[40px]'
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
                    {student.name}
                  </TableCell>
                  {subjects.map((subject) => (
                    <TableCell
                      key={subject.code}
                      className='border border-gray-300 text-center p-1'
                    >
                      {student.scores[
                        subject.code as keyof typeof student.scores
                      ] || "-"}
                    </TableCell>
                  ))}
                  <TableCell className='border border-gray-300 text-center p-1 font-semibold'>
                    {student.total}
                  </TableCell>
                  <TableCell className='border border-gray-300 text-center p-1 font-semibold'>
                    {student.average.toFixed(2)}
                  </TableCell>
                  <TableCell className='border border-gray-300 text-center p-1 font-semibold'>
                    {student.position}
                  </TableCell>
                  <TableCell
                    className={`border border-gray-300 text-center p-1 ${getGradeColor(
                      student.grade
                    )}`}
                  >
                    {student.grade}
                  </TableCell>
                </TableRow>
              ))}

              {/* Subject Averages Row */}
              <TableRow className='bg-yellow-100'>
                <TableCell className='border border-gray-300 p-1 font-bold text-center'>
                  SUBJECT AVERAGES
                </TableCell>
                {subjects.map((subject) => (
                  <TableCell
                    key={subject.code}
                    className='border border-gray-300 text-center p-1 font-bold'
                  >
                    {statistics.subjectAverages[
                      subject.code as keyof typeof statistics.subjectAverages
                    ]?.toFixed(1) || "-"}
                  </TableCell>
                ))}
                <TableCell className='border border-gray-300 text-center p-1 font-bold'>
                  {statistics.highestTotal}
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1 font-bold'>
                  {statistics.classAverage.toFixed(2)}
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
                <TableCell className='border border-gray-300 text-center p-1'>
                  -
                </TableCell>
              </TableRow>

              {/* Lowest Score Row */}
              <TableRow className='bg-red-100'>
                <TableCell className='border border-gray-300 p-1 font-bold text-center'>
                  LOWEST SCORE
                </TableCell>
                {subjects.map((subject) => {
                  const lowestScore = Math.min(
                    ...students.map(
                      (s) =>
                        s.scores[subject.code as keyof typeof s.scores] || 0
                    )
                  );
                  return (
                    <TableCell
                      key={subject.code}
                      className='border border-gray-300 text-center p-1 font-bold'
                    >
                      {lowestScore}
                    </TableCell>
                  );
                })}
                <TableCell className='border border-gray-300 text-center p-1 font-bold'>
                  {statistics.lowestTotal}
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

              {/* Highest Score Row */}
              <TableRow className='bg-green-100'>
                <TableCell className='border border-gray-300 p-1 font-bold text-center'>
                  HIGHEST SCORE
                </TableCell>
                {subjects.map((subject) => {
                  const highestScore = Math.max(
                    ...students.map(
                      (s) =>
                        s.scores[subject.code as keyof typeof s.scores] || 0
                    )
                  );
                  return (
                    <TableCell
                      key={subject.code}
                      className='border border-gray-300 text-center p-1 font-bold'
                    >
                      {highestScore}
                    </TableCell>
                  );
                })}
                <TableCell className='border border-gray-300 text-center p-1 font-bold'>
                  {statistics.highestTotal}
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

              {/* Class Size Row */}
              <TableRow className='bg-blue-100'>
                <TableCell className='border border-gray-300 p-1 font-bold text-center'>
                  CLASS SIZE: {students.length}
                </TableCell>
                {subjects.map((subject) => (
                  <TableCell
                    key={subject.code}
                    className='border border-gray-300 text-center p-1'
                  >
                    -
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
              {keyToSubject.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between p-2 border-r border-b border-gray-200 text-xs'
                >
                  <span className='font-medium'>{item.code}</span>
                  <span className='ml-2'>{item.subject}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className='mt-8 text-center no-print'>
          <button
            onClick={() => window.print()}
            className='bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors'
          >
            Print Broadsheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassBroadsheetReport;
