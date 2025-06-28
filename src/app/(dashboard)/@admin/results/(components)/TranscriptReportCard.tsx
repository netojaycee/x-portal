import { Card, CardContent } from "@/components/ui/card";
import { useGetSchoolConfigurationQuery } from "@/redux/api";
import Image from "next/image";

interface TranscriptData {
  student?: {
    id: string;
    studentRegNo: string;
    firstname: string;
    lastname: string;
    othername?: string;
    fullName?: string;
    dateOfBirth?: string;
    age?: number;
    gender?: string;
    nationality?: string;
    avatar?: string;
  };
  classCategory?: {
    id: string;
    name: string;
  };
  totalSubjects?: number;
  subjects?: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  transcriptData?: TranscriptSession[];
  metadata?: {
    generatedAt?: string;
    totalSessions?: number;
    totalClasses?: number;
    totalTermsProcessed?: number;
  };
}

interface TranscriptSession {
  session: {
    id: string;
    name: string;
  };
  classes: TranscriptClass[];
  sessionSummary?: {
    totalSubjects: number;
    totalObtained: number;
    totalObtainable: number;
    averagePercentage: number;
  };
}

interface TranscriptClass {
  class: {
    id: string;
    name: string;
  };
  classArm: {
    id: string;
    name: string;
  };
  terms: TranscriptTerm[];
  classSummary?: {
    totalSubjects: number;
    totalObtained: number;
    totalObtainable: number;
    averagePercentage: number;
  };
}

interface TranscriptTerm {
  termDefinition: {
    id: string;
    name: string;
    displayName?: string;
  };
  subjects: TranscriptSubject[];
  termSummary?: {
    totalObtained: number;
    totalObtainable: number;
    totalSubjects: number;
    averagePercentage: number;
  };
}

interface TranscriptSubject {
  subject: {
    id: string;
    name: string;
    code: string;
  };
  totalScore: number;
  obtainableScore: number;
  percentage: number;
  grade?: {
    id: string;
    name: string;
    remark: string;
  };
  assessments?: Array<{
    type: string;
    resultType: {
      id: string;
      name: string;
    };
    score: number;
    obtainable: number;
    percentage: number;
    grade?: {
      id: string;
      name: string;
      remark: string;
    };
  }>;
}

// interface GradeScale {
//   grade: string;
//   minScore: number;
//   maxScore: number;
//   remark: string;
// }

interface TranscriptReportCardProps {
  data?: TranscriptData;
}

export default function TranscriptReportCard({
  data,
}: TranscriptReportCardProps) {
  // Fetch school configuration first (hooks must be called at the top)
  const { data: schoolConfigRaw } = useGetSchoolConfigurationQuery({});
  const schoolConfig = schoolConfigRaw?.school;

  // Handle empty or no data case
  if (!data || !data.transcriptData || data.transcriptData.length === 0) {
    return (
      <div className='bg-[#f8f8fa] min-h-screen py-4 px-2 flex flex-col items-center'>
        <div className='bg-white rounded-lg w-[500px] mx-auto p-8 text-center shadow-sm border border-gray-200'>
          <div className='text-gray-500'>
            <h2 className='text-2xl font-bold mb-2'>No Transcript Found</h2>
            <p>
              No transcript data is available for this student in this category.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use school config data if available, otherwise use defaults
  const schoolInfo = {
    name: schoolConfig?.school?.name,
    logo: schoolConfig?.logo?.imageUrl,
    address: schoolConfig?.school?.address,
    email: schoolConfig?.school?.email,
    contact: schoolConfig?.school?.contact,
    color: schoolConfig?.color,
  };

  const { student, transcriptData } = data;
  console.log(data, "transcriptdatatata");

  // Extract student information
  const studentName =
    student?.firstname && student?.lastname
      ? `${student.firstname} ${student.lastname} ${
          student.othername || ""
        }`.trim()
      : student?.fullName || "Unknown Student";

  const studentGender = student?.gender || "Unknown";
  const studentRegNo = student?.studentRegNo || "N/A";
  const dateOfBirth = student?.dateOfBirth
    ? new Date(student.dateOfBirth)
        .toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .toUpperCase()
    : "N/A";
  const nationality = student?.nationality || "NIGERIAN";
  const studentPhoto = student?.avatar;

  // Get unique subjects across all transcript entries
  const allSubjects = new Set<string>();
  transcriptData?.forEach((session) => {
    session.classes?.forEach((classItem) => {
      classItem.terms?.forEach((term) => {
        term.subjects?.forEach((subject) => {
          if (subject?.subject?.code) {
            allSubjects.add(subject.subject.code);
          }
        });
      });
    });
  });
  const uniqueSubjects = Array.from(allSubjects).sort();

  // Flatten transcript data for table display
  const flattenedTranscriptData: Array<{
    session: string;
    class: string;
    classArm: string;
    term: string;
    subjects: Array<{
      code: string;
      name: string;
      score: number;
    }>;
    totalScore: number;
    averagePercentage: number;
  }> = [];

  transcriptData?.forEach((session) => {
    session.classes?.forEach((classItem) => {
      classItem.terms?.forEach((term) => {
        flattenedTranscriptData.push({
          session: session.session?.name || "N/A",
          class: classItem.class?.name || "N/A",
          classArm: classItem.classArm?.name || "N/A",
          term:
            term.termDefinition?.displayName ||
            term.termDefinition?.name ||
            "N/A",
          subjects:
            term.subjects?.map((s) => ({
              code: s.subject?.code || "",
              name: s.subject?.name || "",
              score: s.totalScore || 0,
            })) || [],
          totalScore: term.termSummary?.totalObtained || 0,
          averagePercentage: term.termSummary?.averagePercentage || 0,
        });
      });
    });
  });

  // School information

  const schoolLogo = schoolInfo?.logo || "/school-logo.png";

  // Default grading system
//   const defaultGrades: GradeScale[] = [
//     { grade: "A", minScore: 85, maxScore: 100, remark: "Excellent" },
//     { grade: "B", minScore: 75, maxScore: 84, remark: "Very Good" },
//     { grade: "C", minScore: 60, maxScore: 74, remark: "Good" },
//     { grade: "D", minScore: 50, maxScore: 59, remark: "Pass" },
//     { grade: "F", minScore: 0, maxScore: 49, remark: "Fail" },
//   ];

  // Generate subject key from unique subjects
  const subjectKey = uniqueSubjects.map((code) => {
    // Try to find the subject name from the transcript data or subjects array
    const subjectFromTranscript = transcriptData
      ?.flatMap((session) => session.classes || [])
      ?.flatMap((classItem) => classItem.terms || [])
      ?.flatMap((term) => term.subjects || [])
      ?.find((subject) => subject?.subject?.code === code);

    const subjectFromList = data.subjects?.find((s) => s.code === code);

    const subjectName =
      subjectFromTranscript?.subject?.name || subjectFromList?.name || code;

    return { code, subject: subjectName };
  });

  return (
    <div className='bg-[#f8f8fa] min-h-screen py-4 px-2 flex flex-col items-center'>
      {/* Header */}
      <div className='bg-white rounded-lg max-w-5xl mx-auto py-5 px-10 overflow-hidden shadow-sm border border-gray-200'>
        <div className='bg-white mb-6'>
                 <div className='flex items-center justify-between'>
                   {/* Left Logo */}
                   <div className='flex-shrink-0'>
                     <Image
                       src={schoolLogo || "/default-logo.png"}
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
                       {studentPhoto ? (
                         <Image
                           src={studentPhoto}
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
        {/* Title */}
        <div className='py-1 px-0'>
          <h3 className='text-center font-semibold text-[#888] text-lg pt-3 pb-1'>
            Student Transcript
          </h3>
        </div>

        {/* Student Info */}
        <Card className='mb-4 border border-gray-400 shadow-none'>
          <CardContent className='p-3'>
            <div className='text-xs grid grid-cols-3 gap-y-3 gap-x-2 text-gray-700'>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>NAME:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {studentName}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>ADMISSION NUMBER:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {studentRegNo}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>DATE OF BIRTH:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {dateOfBirth}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>GENDER:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {studentGender}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>NATIONALITY:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {nationality}
                </span>
              </div>
              <div className='flex gap-1 mb-0'>
                <span className='font-normal'>NUMBERS OF SUBJECTS:</span>
                <span className='font-semibold border-b border-gray-500 text-xs'>
                  {data.totalSubjects || uniqueSubjects.length}{" "}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Title */}
        <div className='text-center text-[#888] font-semibold text-[17px] py-1'>
          {data.classCategory?.name?.toUpperCase() || "STUDENT TRANSCRIPTS"}
        </div>

        {/* Table */}
        <div className='overflow-auto '>
          <table className='min-w-full text-[13px] border border-[#e6e6e6] rounded'>
            <thead>
              <tr className='bg-[#f4f7fa] text-[#888] font-bold'>
                <th className='py-2 px-2 border'>CLASS</th>
                <th className='py-2 px-2 border'>TERM</th>
                {uniqueSubjects.map((subjectCode) => (
                  <th key={subjectCode} className='py-2 px-2 border'>
                    {subjectCode}
                  </th>
                ))}
                <th className='py-2 px-2 border'>TOTAL</th>
                <th className='py-2 px-2 border'>AVERAGE</th>
              </tr>
            </thead>
            <tbody>
              {flattenedTranscriptData.map((entry, index) => (
                <tr
                  key={index}
                  className='text-center border-b border-[#e6e6e6]'
                >
                  <td className='p-1 border'>{`${entry.class} (${entry.session})`}</td>
                  <td className='p-1 border'>{entry.term}</td>
                  {uniqueSubjects.map((subjectCode) => {
                    const subject = entry.subjects?.find(
                      (s) => s?.code === subjectCode
                    );
                    return (
                      <td key={subjectCode} className='p-1 border'>
                        {subject
                          ? subject.score !== undefined
                            ? subject.score
                            : "-"
                          : "-"}
                      </td>
                    );
                  })}
                  <td className='p-1 border'>{entry.totalScore || 0}</td>
                  <td className='p-1 border'>
                    {entry.averagePercentage
                      ? entry.averagePercentage.toFixed(1)
                      : "0.0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key tables */}
        <div className='flex flex-row w-[40%] px-4 py-3 gap-4'>
          {/* <div className='flex-1'>
            <div className='bg-[#f4f7fa] px-2 py-1 font-bold text-[#6d799b] text-[13px] border-b border-[#e6e6e6]'>
              KEY TO GRADE
            </div>
            <div className='text-xs text-[#888] py-1 px-2'>
              {defaultGrades.map((grade, index) => (
                <div key={index}>
                  {grade.grade}- {grade.remark} <span className='float-right'>{grade.minScore}.00-{grade.maxScore}.00</span>
                </div>
              ))}
            </div>
          </div> */}
          <div className='flex-1'>
            <div className='bg-[#f4f7fa] px-2 py-1 font-bold text-[#6d799b] text-[13px] border-b border-[#e6e6e6]'>
              KEY TO SUBJECT
            </div>
            <div className='text-xs text-[#888] py-1 px-2 max-h-[120px] overflow-y-auto'>
              {subjectKey.map((item, index) => (
                <div key={index}>
                  {item.code}{" "}
                  <span className='float-right'>{item.subject}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments & Signature */}
        {/* <div className='flex flex-row w-full px-4 pb-4 gap-4'>
          <div className='flex-1 text-xs text-[#888]'>
            <div className='py-1'>
              <span className='font-semibold'>PRINCIPAL&apos;S COMMENT:</span>
            </div>
            <div className='py-1'>
              <span className='font-semibold'>
                ADMINISTRATOR&apos;S SIGNATURE:
              </span>
            </div>
            <div className='py-1'>
              <span className='font-semibold'>NEXT TERM BEGINS ON:</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
