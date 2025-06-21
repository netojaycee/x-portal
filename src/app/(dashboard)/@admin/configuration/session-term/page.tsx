"use client";
import { useGetSessionsQuery } from "@/redux/api";
import SessionTables from "./(components)/SessionsTable";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

// Example usage with RTK Query
const Sessions: React.FC = () => {
  const { data, isLoading } = useGetSessionsQuery({});
  console.log("Sessions data", data && data);
  const sessions = data?.data || [];
  return (
    <div className="space-y-4">
       <div className='flex items-center space-x-0 text-sm mb-3'>
              <span className='cursor-pointer flex items-center'>
                <ChevronLeft className='h-4 w-4 text-primary' />
                <Link href={"/configuration"} className='text-primary'>
                  Account Settings
                </Link>
              </span>
              <span>/</span>
              <p className='text-gray-500'>Sessions</p>
            </div>
      <SessionTables sessions={sessions} isLoading={isLoading} />
    </div>
  );
};

export default Sessions;
