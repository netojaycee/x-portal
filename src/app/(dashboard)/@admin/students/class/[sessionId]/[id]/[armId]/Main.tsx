"use client";
import { useGetClassArmDetailsBySessionIdQuery } from "@/redux/api";
import React, { useEffect, useState } from "react";
import ClassHeaderCard from "@/app/(dashboard)/@admin/students/(components)/ClassHeaderCard";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentListTabContent } from "../../../(components)/StudentListTabContent";
import { SubjectListTabContent } from "../../../(components)/SubjectListTabContent";
import { ResultListTabContent } from "../../../(components)/ResultListTabContent";
import { AttendanceListTabContent } from "../../../(components)/AttendanceListTabContent";
import { TeacherListTabContent } from "../../../(components)/TeacherListTabContent";

// Types for the class arm details response
interface SessionData {
  id: string;
  name: string;
}

interface TermData {
  id: string;
  name: string;
}

interface ClassInfo {
  id: string;
  name: string;
  category: string;
}

interface ClassArmInfo {
  id: string;
  name: string;
}

interface ClassArmStats {
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface ClassArmDetailsResponse {
  statusCode: number;
  message: string;
  data: {
    session: SessionData;
    term: TermData;
    class: ClassInfo;
    classArm: ClassArmInfo;
    stats: ClassArmStats;
    subjects: Subject[];
  };
}

interface ClassDetailsProps {
  id: string;
  sessionId: string;
  armId: string;
}

export const Main: React.FC<ClassDetailsProps> = ({ sessionId, id, armId }) => {
  // Local storage tab tracking
  const TAB_KEY = `class-arm-tabs-${sessionId}-${id}-${armId}`;
  const tabOptions = ["students", "subject", "result", "attendance", "teacher"];
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(TAB_KEY);
      return tabOptions.includes(stored || "") ? stored! : tabOptions[0];
    }
    return tabOptions[0];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TAB_KEY, activeTab);
    }
  }, [activeTab, TAB_KEY]);

  const {
    data: classArmDetail,
    isLoading: classArmsLoading,
    error: classArmsError,
  } = useGetClassArmDetailsBySessionIdQuery(
    { sessionId, classId: id, classArmId: armId, termId: "" },
    { skip: !sessionId }
  ) as {
    data: ClassArmDetailsResponse | undefined;
    isLoading: boolean;
    error: any;
  };

  console.log("classArmDetail", classArmDetail);

  // Format term name by replacing underscores with spaces and capitalizing
  const formatTermName = (termName: string) => {
    return termName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Format class name as "First Term, 2023/2024 Session"
  const formatClassName = (termName: string, sessionName: string) => {
    const formattedTerm = formatTermName(termName);
    return `${formattedTerm}, ${sessionName} Session`;
  };

  // Loading state
  if (classArmsLoading) {
    return (
      <div className='py-10'>
        <LoaderComponent />
      </div>
    );
  }

  // Error state
  if (classArmsError) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load class details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // No data state
  if (!classArmDetail?.data) {
    return (
      <div className='bg-gray-50 rounded-lg p-8 text-center'>
        <h3 className='text-lg font-medium text-gray-600'>
          No Class Data Found
        </h3>
        <p className='text-gray-500 mt-2'>Unable to load class details.</p>
      </div>
    );
  }

  const { data } = classArmDetail;

  return (
    <div className='space-y-6'>
      {/* Class Header Card */}
      <ClassHeaderCard
        classCode={data.classArm.name.toUpperCase()}
        className={formatClassName(data.term.name, data.session.name)}
        totalStudents={data.stats.totalStudents}
        males={data.stats.maleStudents}
        females={data.stats.femaleStudents}
        // type='arm'
      />

      <div className=''>
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
          className=''
        >
          <div className='w-full relative'>
            <div className='border-b-2 absolute bottom-0 w-full'></div>

            <TabsList className={`bg-transparent shadow-none space-x-5  `}>
              <TabsTrigger
                className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='students'
              >
                Student list{" "}
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='subject'
              >
                Subject{" "}
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='result'
              >
                Result{" "}
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='attendance'
              >
                {" "}
                Attendance Report
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='teacher'
              >
                {" "}
                Class teacher{" "}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='students'>
            {/* Classes/Subjects Tab Content */}
            <StudentListTabContent
              sessionId={data.session.id}
              classId={data.class.id}
              classArmId={data.classArm.id}
              termId={data.term.id}
              subjects={data.subjects}
            />
          </TabsContent>
          <TabsContent value='subject'>
            {/* Subjects Tab Content */}
            <SubjectListTabContent
              sessionId={data.session.id}
              classId={data.class.id}
              classArmId={data.classArm.id}
              termId={data.term.id}
            />
          </TabsContent>
          <TabsContent value='result'>
            {/* Result Tab Content */}
            <ResultListTabContent
              sessionId={data.session.id}
              classId={data.class.id}
              classArmId={data.classArm.id}
              // termId={data.term.id}
            />
          </TabsContent>
          <TabsContent value='attendance'>
            {/* Attendance Tab Content */}
            <AttendanceListTabContent
              sessionId={data.session.id}
              classId={data.class.id}
              classArmId={data.classArm.id}
              termId={data.term.id}
            />
          </TabsContent>
          <TabsContent value='teacher'>
            {/* Teacher Tab Content */}
            <TeacherListTabContent
              classId={data.class.id}
              classArmId={data.classArm.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
