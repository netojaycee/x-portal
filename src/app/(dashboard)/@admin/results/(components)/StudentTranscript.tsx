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
const useGetTranscriptQuery = () => {
  // Mock data structure
  const mockData = {
    student: {
      id: "1",
      name: "Adebayo Tolu",
      gender: "Male",
      admissionNumber: "2023/2024",
      dateOfBirth: "11-OCT-2011",
      nationality: "NIGERIAN",
      numberOfSubjects: 440,
      studentPhoto: "/student-photo.jpg",
    },
    transcript: {
      title: "JUNIOR SECONDARY SCHOOL TRANSCRIPTS",
      classes: [
        {
          className: "BASIC 7",
          term: "FIRST TERM",
          subjects: [
            {
              code: "AGS",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "BIZ",
              firstCA: 45,
              secondCA: 48,
              thirdCA: 52,
              exam: 55,
              total: 200,
              average: 100,
            },
            {
              code: "CCA",
              firstCA: 42,
              secondCA: 46,
              thirdCA: 49,
              exam: 53,
              total: 190,
              average: 95,
            },
            {
              code: "CRS",
              firstCA: 48,
              secondCA: 50,
              thirdCA: 52,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "ENG",
              firstCA: 45,
              secondCA: 47,
              thirdCA: 49,
              exam: 54,
              total: 195,
              average: 97.5,
            },
            {
              code: "FRE",
              firstCA: 40,
              secondCA: 42,
              thirdCA: 45,
              exam: 48,
              total: 175,
              average: 87.5,
            },
            {
              code: "HAU",
              firstCA: 38,
              secondCA: 40,
              thirdCA: 42,
              exam: 45,
              total: 165,
              average: 82.5,
            },
            {
              code: "HIS",
              firstCA: 44,
              secondCA: 46,
              thirdCA: 48,
              exam: 52,
              total: 190,
              average: 95,
            },
            {
              code: "IGH",
              firstCA: 46,
              secondCA: 48,
              thirdCA: 50,
              exam: 56,
              total: 200,
              average: 100,
            },
            {
              code: "MAT",
              firstCA: 48,
              secondCA: 50,
              thirdCA: 52,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "SOS",
              firstCA: 45,
              secondCA: 47,
              thirdCA: 49,
              exam: 54,
              total: 195,
              average: 97.5,
            },
            {
              code: "YOR",
              firstCA: 42,
              secondCA: 44,
              thirdCA: 46,
              exam: 48,
              total: 180,
              average: 90,
            },
          ],
        },
        {
          className: "BASIC 7",
          term: "SECOND TERM",
          subjects: [
            {
              code: "AGS",
              firstCA: 48,
              secondCA: 50,
              thirdCA: 52,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "BIZ",
              firstCA: 46,
              secondCA: 48,
              thirdCA: 50,
              exam: 56,
              total: 200,
              average: 100,
            },
            {
              code: "CCA",
              firstCA: 44,
              secondCA: 46,
              thirdCA: 48,
              exam: 52,
              total: 190,
              average: 95,
            },
            {
              code: "CRS",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "ENG",
              firstCA: 47,
              secondCA: 49,
              thirdCA: 51,
              exam: 53,
              total: 200,
              average: 100,
            },
            {
              code: "FRE",
              firstCA: 42,
              secondCA: 44,
              thirdCA: 46,
              exam: 48,
              total: 180,
              average: 90,
            },
            {
              code: "HAU",
              firstCA: 40,
              secondCA: 42,
              thirdCA: 44,
              exam: 46,
              total: 172,
              average: 86,
            },
            {
              code: "HIS",
              firstCA: 46,
              secondCA: 48,
              thirdCA: 50,
              exam: 52,
              total: 196,
              average: 98,
            },
            {
              code: "IGH",
              firstCA: 48,
              secondCA: 50,
              thirdCA: 52,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "MAT",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "SOS",
              firstCA: 47,
              secondCA: 49,
              thirdCA: 51,
              exam: 53,
              total: 200,
              average: 100,
            },
            {
              code: "YOR",
              firstCA: 44,
              secondCA: 46,
              thirdCA: 48,
              exam: 50,
              total: 188,
              average: 94,
            },
          ],
        },
        {
          className: "BASIC 7",
          term: "THIRD TERM",
          subjects: [
            {
              code: "AGS",
              firstCA: 49,
              secondCA: 51,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "BIZ",
              firstCA: 47,
              secondCA: 49,
              thirdCA: 52,
              exam: 52,
              total: 200,
              average: 100,
            },
            {
              code: "CCA",
              firstCA: 45,
              secondCA: 47,
              thirdCA: 49,
              exam: 54,
              total: 195,
              average: 97.5,
            },
            {
              code: "CRS",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "ENG",
              firstCA: 48,
              secondCA: 50,
              thirdCA: 52,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "FRE",
              firstCA: 43,
              secondCA: 45,
              thirdCA: 47,
              exam: 50,
              total: 185,
              average: 92.5,
            },
            {
              code: "HAU",
              firstCA: 41,
              secondCA: 43,
              thirdCA: 45,
              exam: 48,
              total: 177,
              average: 88.5,
            },
            {
              code: "HIS",
              firstCA: 47,
              secondCA: 49,
              thirdCA: 51,
              exam: 53,
              total: 200,
              average: 100,
            },
            {
              code: "IGH",
              firstCA: 49,
              secondCA: 51,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "MAT",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "SOS",
              firstCA: 48,
              secondCA: 50,
              thirdCA: 52,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "YOR",
              firstCA: 45,
              secondCA: 47,
              thirdCA: 49,
              exam: 52,
              total: 193,
              average: 96.5,
            },
          ],
        },
        // Additional classes for Basic 8 and Basic 9 can be added here
        {
          className: "BASIC 8",
          term: "FIRST TERM",
          subjects: [
            {
              code: "AGS",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "BIZ",
              firstCA: 48,
              secondCA: 50,
              thirdCA: 52,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "CCA",
              firstCA: 46,
              secondCA: 48,
              thirdCA: 50,
              exam: 56,
              total: 200,
              average: 100,
            },
            {
              code: "CRS",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "ENG",
              firstCA: 49,
              secondCA: 51,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "FRE",
              firstCA: 44,
              secondCA: 46,
              thirdCA: 48,
              exam: 52,
              total: 190,
              average: 95,
            },
            {
              code: "HAU",
              firstCA: 42,
              secondCA: 44,
              thirdCA: 46,
              exam: 50,
              total: 182,
              average: 91,
            },
            {
              code: "HIS",
              firstCA: 48,
              secondCA: 50,
              thirdCA: 52,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "IGH",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "MAT",
              firstCA: 50,
              secondCA: 50,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "SOS",
              firstCA: 49,
              secondCA: 51,
              thirdCA: 50,
              exam: 50,
              total: 200,
              average: 100,
            },
            {
              code: "YOR",
              firstCA: 46,
              secondCA: 48,
              thirdCA: 50,
              exam: 54,
              total: 198,
              average: 99,
            },
          ],
        },
      ],
    },
    keyToGrade: [
      { grade: "A- Excellent", range: "85.00- 100.00" },
      { grade: "B- Very Good", range: "75.00-84.99" },
      { grade: "C- Good", range: "60.00-74.99" },
      { grade: "D- Pass", range: "50.00-59.99" },
      { grade: "F- Fail", range: "0.00-49.99" },
    ],
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
      { code: "BST", subject: "Basic Science" },
      { code: "BSC", subject: "Basic Science" },
      { code: "CRS", subject: "Computer Science" },
      { code: "PHE", subject: "Physical Education" },
      { code: "CCA", subject: "Computer Science" },
      { code: "CRS", subject: "Computer Science" },
      { code: "CCA", subject: "Computer Science" },
      { code: "CRS", subject: "Computer Science" },
    ],
    comments: {
      principal: "",
      administrator: "",
    },
    nextTermBegins: "",
  };

  return {
    data: mockData,
    isLoading: false,
    error: null,
  };
};

interface StudentTranscriptProps {
  studentId?: string;
  // School header props
  schoolName?: string;
  leftLogoSrc?: string;
  rightLogoSrc?: string;
  address?: string;
  email?: string;
  phone?: string;
  schoolNameColor?: string;
}

const StudentTranscript: React.FC<StudentTranscriptProps> = ({
  // studentId,
  schoolName = "DEEPER LIFE HIGH SCHOOL",
  leftLogoSrc = "/school-logo.png",
  address = "KLM 10, Abeokuta-Ibadan Road, Odeda,Abeokuta, Ogun State",
  email = "info@deeperlifehighschool.org",
  phone = "08033319011,08035540255",
  schoolNameColor = "#E91E63",
}) => {
  // API call - replace with actual RTK query
  const {
    data: transcriptData,
    isLoading,
    error,
  } = useGetTranscriptQuery(
  //   {
  //   studentId,
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
          <h2 className='text-2xl font-bold mb-2'>Error Loading Transcript</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!transcriptData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>No Data Found</h2>
          <p>Transcript data is not available.</p>
        </div>
      </div>
    );
  }

  const { student, transcript, keyToGrade, keyToSubject, comments } =
    transcriptData;

  // const getGrade = (average: number) => {
  //   if (average >= 85) return "A";
  //   if (average >= 75) return "B";
  //   if (average >= 60) return "C";
  //   if (average >= 50) return "D";
  //   return "F";
  // };

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
            font-size: 12px;
          }
        }
      `}</style>

      <div className='max-w-6xl mx-auto p-6 bg-white'>
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

            {/* Right - Student Photo */}
            <div className='flex-shrink-0'>
              <div className='w-16 h-20 bg-gray-200 rounded overflow-hidden'>
                <Image
                  src={student.studentPhoto || "/default-student.jpg"}
                  alt='Student Photo'
                  width={64}
                  height={80}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Title */}
        <div className='text-center mb-4'>
          <h2 className='text-lg font-bold text-gray-700'>
            Student Transcript
          </h2>
        </div>

        {/* Student Information */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-4 border border-gray-300 p-2'>
          <div>
            <span className='font-semibold'>NAME:</span> {student.name}
          </div>
          <div>
            <span className='font-semibold'>ADMISSION NUMBER:</span>{" "}
            {student.admissionNumber}
          </div>
          <div>
            <span className='font-semibold'>DATE OF BIRTH:</span>{" "}
            {student.dateOfBirth}
          </div>
          <div>
            <span className='font-semibold'>GENDER:</span> {student.gender}
          </div>
          <div>
            <span className='font-semibold'>NATIONALITY:</span>{" "}
            {student.nationality}
          </div>
          <div>
            <span className='font-semibold'>NUMBER OF SUBJECTS:</span>{" "}
            {student.numberOfSubjects}
          </div>
        </div>

        {/* Transcript Title */}
        <div className='text-center mb-4'>
          <h3 className='text-base font-bold text-gray-700'>
            {transcript.title}
          </h3>
        </div>

        {/* Group classes by class name */}
        {Object.entries(
          transcript.classes.reduce((acc, classData) => {
            if (!acc[classData.className]) {
              acc[classData.className] = [];
            }
            acc[classData.className].push(classData);
            return acc;
          }, {} as Record<string, typeof transcript.classes>)
        ).map(([className, classTerms]) => (
          <div key={className} className='mb-6'>
            {/* Class Header */}
            <div className='bg-blue-100 border border-gray-300 p-2 font-bold text-center text-sm'>
              {className}
            </div>

            {/* Terms Table */}
            <Table className='border border-gray-300 text-xs'>
              <TableHeader>
                <TableRow className='bg-gray-50'>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    CLASS
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    TERM
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    AGS
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    BIZ
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    CCA
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    CRS
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    ENG
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    FRE
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    HAU
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    HIS
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    IGH
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    MAT
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    SOS
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    YOR
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    TOTAL
                  </TableHead>
                  <TableHead className='border border-gray-300 font-bold text-black text-center p-1'>
                    AVERAGE
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classTerms.map((termData, termIndex) => (
                  <TableRow
                    key={termIndex}
                    className={termIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className='border border-gray-300 text-center p-1 font-semibold'>
                      {termIndex === 0 ? className.replace("BASIC ", "") : ""}
                    </TableCell>
                    <TableCell className='border border-gray-300 text-center p-1 font-semibold'>
                      {termData.term}
                    </TableCell>
                    {/* Render subjects in order */}
                    {[
                      "AGS",
                      "BIZ",
                      "CCA",
                      "CRS",
                      "ENG",
                      "FRE",
                      "HAU",
                      "HIS",
                      "IGH",
                      "MAT",
                      "SOS",
                      "YOR",
                    ].map((subjectCode) => {
                      const subject = termData.subjects.find(
                        (s) => s.code === subjectCode
                      );
                      return (
                        <TableCell
                          key={subjectCode}
                          className='border border-gray-300 text-center p-1'
                        >
                          {subject ? subject.average : "-"}
                        </TableCell>
                      );
                    })}
                    <TableCell className='border border-gray-300 text-center p-1 font-semibold'>
                      {termData.subjects.reduce(
                        (sum, subj) => sum + subj.total,
                        0
                      )}
                    </TableCell>
                    <TableCell className='border border-gray-300 text-center p-1 font-semibold'>
                      {(
                        termData.subjects.reduce(
                          (sum, subj) => sum + subj.average,
                          0
                        ) / termData.subjects.length
                      ).toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}

        {/* Bottom Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
          {/* Key to Grade */}
          <div>
            <h3 className='bg-blue-100 p-2 font-bold text-center border border-gray-300 text-sm'>
              KEY TO GRADE
            </h3>
            <div className='border border-gray-300 border-t-0'>
              {keyToGrade.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between p-2 border-b border-gray-200 last:border-b-0 text-xs'
                >
                  <span className='font-medium'>{item.grade}</span>
                  <span>{item.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key to Subject */}
          <div>
            <h3 className='bg-blue-100 p-2 font-bold text-center border border-gray-300 text-sm'>
              KEY TO SUBJECT
            </h3>
            <div className='border border-gray-300 border-t-0 max-h-40 overflow-y-auto'>
              {keyToSubject.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between p-2 border-b border-gray-200 last:border-b-0 text-xs'
                >
                  <span className='font-medium'>{item.code}</span>
                  <span>{item.subject}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments and Signatures */}
        <div className='mt-8 space-y-4 text-sm'>
          <div className='border-b border-gray-300 pb-2'>
            <span className='font-bold'>PRINCIPAL&apos;S COMMENT:</span>
            <div className='mt-2 min-h-[30px] border-b border-dotted border-gray-400'>
              {comments.principal}
            </div>
          </div>

          <div className='border-b border-gray-300 pb-2'>
            <span className='font-bold'>ADMINISTRATOR&apos;S SIGNATURE:</span>
            <div className='mt-2 min-h-[30px] border-b border-dotted border-gray-400'>
              {comments.administrator}
            </div>
          </div>

          <div className='border-b border-gray-300 pb-2'>
            <span className='font-bold'>NEXT TERM BEGINS ON:</span>
            <div className='mt-2 min-h-[30px] border-b border-dotted border-gray-400'>
              {transcriptData.nextTermBegins}
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className='mt-8 text-center no-print'>
          <button
            onClick={() => window.print()}
            className='bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors'
          >
            Print Transcript
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTranscript;
