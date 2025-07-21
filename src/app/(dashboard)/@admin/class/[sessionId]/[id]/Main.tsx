"use client";
import { useGetClassDetailsBySessionIdQuery } from "@/redux/api";
import React from "react";
import ClassHeaderCard from "@/app/(dashboard)/@admin/students/(components)/ClassHeaderCard";
import ClassCard from "@/app/(dashboard)/@admin/students/(components)/ClassCard";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Types for the class details response
interface SessionData {
  id: string;
  name: string;
}

interface ClassInfo {
  id: string;
  name: string;
  category: string;
}

interface ClassArmStats {
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  percentage: number;
}

interface ClassArm {
  id: string;
  name: string;
  stats: ClassArmStats;
}

interface CurrentTerm {
  id: string;
  name: string;
}

interface ClassStats {
  totalClassArms: number;
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
}

interface ClassDetailsResponse {
  statusCode: number;
  message: string;
  data: {
    session: SessionData;
    class: ClassInfo;
    classArms: ClassArm[];
    currentTerm: CurrentTerm;
    stats: ClassStats;
  };
}

interface ClassDetailsProps {
  id: string;
  sessionId: string;
}
export const Main: React.FC<ClassDetailsProps> = ({ sessionId, id }) => {
  const {
    data: classArmsData,
    isLoading: classArmsLoading,
    error: classArmsError,
  } = useGetClassDetailsBySessionIdQuery(
    { sessionId, classId: id },
    { skip: !sessionId }
  ) as {
    data: ClassDetailsResponse | undefined;
    isLoading: boolean;
    error: any;
  };

  console.log("classArmsData", classArmsData);

  // Generate class code from class name
  const generateClassCode = (name: string) => {
    if (name.length <= 5 && /^[a-z]+\d+$/i.test(name)) {
      return name.toUpperCase();
    }
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
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
  if (!classArmsData?.data) {
    return (
      <div className='bg-gray-50 rounded-lg p-8 text-center'>
        <h3 className='text-lg font-medium text-gray-600'>
          No Class Data Found
        </h3>
        <p className='text-gray-500 mt-2'>Unable to load class details.</p>
      </div>
    );
  }

  const { data } = classArmsData;

  return (
    <div className='space-y-6'>
      {/* Class Header Card */}
      <ClassHeaderCard
        classCode={generateClassCode(data.class.name)}
        className={data.class.category}
        totalStudents={data.stats.totalStudents}
        males={data.stats.maleStudents}
        females={data.stats.femaleStudents}
        // type='class'
      />

      {/* Class Arms Section */}
      <div>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>Class Arms</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {data.classArms.map((classArm) => {
            // Transform classArm data to match ClassCard props
            const classArmData = {
              id: classArm.id,
              name: classArm.name,
              class: data.class.name, // Use class name for arms
              classId: data.class.id, // Use class ID for arms
              armsCount: 0, // Not applicable for arms
              totalStudents: classArm.stats.totalStudents,
              males: classArm.stats.maleStudents,
              females: classArm.stats.femaleStudents,
              classArms: [], // Not applicable for arms
              sessionId: sessionId,
              percentage: classArm.stats.percentage || 0,
            };

            return (
              <ClassCard
                key={classArm.id}
                classData={classArmData}
                type='arm'
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
