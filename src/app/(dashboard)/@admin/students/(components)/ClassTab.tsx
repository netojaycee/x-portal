"use client";

import React, { useState } from "react";
import {
  useGetClassClassArmsBySessionIdQuery,
  useGetSessionsQuery,
} from "@/redux/api";
import ClassCard from "./ClassCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Session {
  id: string;
  name: string;
  status: string;
}

interface ClassArmStats {
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
}

interface ClassArm {
  id: string;
  name: string;
  stats: ClassArmStats;
}

interface ClassStats {
  totalClassArms: number;
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
}

interface ClassData {
  id: string;
  name: string;
  classArms: ClassArm[];
  stats: ClassStats;
}

interface ClassResponse {
  data: {
    sessionId: string;
    sessionName: string;
    classes: ClassData[];
    currentTermId: string;
    currentTermName: string;
  };
}

export default function ClassTab() {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");

  // Fetch all sessions to allow selecting one
  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});

  // Get active session by default
  React.useEffect(() => {
    if (sessionsData && sessionsData.data && !selectedSessionId) {
      const activeSession = sessionsData.data.find(
        (session: Session) => session.status === "active"
      );
      if (activeSession) {
        setSelectedSessionId(activeSession.id);
      } else if (sessionsData.data.length > 0) {
        setSelectedSessionId(sessionsData.data[0].id);
      }
    }
  }, [sessionsData, selectedSessionId]);

  // Fetch classes with stats for the selected session
  const {
    data: classesData,
    isLoading: classesLoading,
    error: classesError,
  } = useGetClassClassArmsBySessionIdQuery(
    { sessionId: selectedSessionId, stats: true },
    { skip: !selectedSessionId }
  ) as { data: ClassResponse | undefined; isLoading: boolean; error: any };

  console.log("Classes Data:", classesData);
  console.log("Classes Data Structure:", classesData?.data?.classes);

  const handleSessionChange = (value: string) => {
    setSelectedSessionId(value);
  };

  // Helper function to check if we have class data
  const hasClassData = () => {
    return (
      Array.isArray(classesData?.data?.classes) &&
      classesData?.data?.classes.length > 0
    );
  };

  // Safely get classes data for rendering
  const getClassesData = () => {
    if (!classesData || !classesData.data) return { classes: [] };
    return classesData.data;
  };

  return (
    <div className='space-y-4'>
      {/* Session Selector */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-700'>Class Overview</h2>
        <div className='w-64'>
          <Select
            value={selectedSessionId}
            onValueChange={handleSessionChange}
            disabled={sessionsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select academic session' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sessionsLoading ? (
                  <SelectItem value='loading' disabled>
                    Loading sessions...
                  </SelectItem>
                ) : sessionsData?.data?.length ? (
                  sessionsData.data.map((session: Session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}{" "}
                      {session.status === "active" ? "(Active)" : ""}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='empty' disabled>
                    No sessions available
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {classesLoading && (
        <div className='py-10'>
          <LoaderComponent />
        </div>
      )}

      {/* Error State */}
      {classesError && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load classes. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!classesLoading &&
        !classesError &&
        (!classesData?.data?.classes ||
          classesData.data.classes.length === 0) && (
          <div className='bg-gray-50 rounded-lg p-8 text-center'>
            <h3 className='text-lg font-medium text-gray-600'>
              No Classes Found
            </h3>
            <p className='text-gray-500 mt-2'>
              There are no classes available for the selected session.
            </p>
          </div>
        )}

      {/* Classes Grid */}
      {!classesLoading && hasClassData() && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {getClassesData().classes.map((classItem: ClassData) => {
            // Use the stats directly from the class object
            
            const classWithStats = {
              ...classItem,
              armsCount: classItem.stats.totalClassArms,
              totalStudents: classItem.stats.totalStudents,
              males: classItem.stats.maleStudents,
              females: classItem.stats.femaleStudents,
              sessionId: selectedSessionId,
            };

            // console.log("Class Item:", classWithStats);

            return <ClassCard type="class" key={classItem.id} classData={classWithStats} />;
          })}
        </div>
      )}
    </div>
  );
}
