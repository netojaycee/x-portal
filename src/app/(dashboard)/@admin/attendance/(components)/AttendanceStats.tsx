import React from "react";
import { Button } from "@/components/ui/button";

interface AttendanceStatsProps {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  notTakenCount: number;
  onMarkAttendance: () => void;
}

export function AttendanceStats({
  totalStudents = 400,
  presentCount = 250,
  absentCount = 0,
  lateCount = 0,
  notTakenCount = 0,
  onMarkAttendance,
}: AttendanceStatsProps) {
  // Calculate percentages
  const presentPercentage =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
  const absentPercentage =
    totalStudents > 0 ? Math.round((absentCount / totalStudents) * 100) : 0;
  const latePercentage =
    totalStudents > 0 ? Math.round((lateCount / totalStudents) * 100) : 0;
  const notTakenPercentage =
    totalStudents > 0 ? Math.round((notTakenCount / totalStudents) * 100) : 0;

  return (
    <div className='bg-blue-50 p-6 rounded-lg'>
      <h2 className='text-gray-700 font-medium mb-4'>
        General Attendance Statistics
      </h2>

      <div className='flex flex-wrap items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div>
            <h3 className='text-5xl font-bold text-blue-700'>
              {totalStudents}
            </h3>
            <p className='text-gray-500'>Total Students</p>
          </div>

          <div className='flex flex-wrap gap-4 ml-8'>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-green-500 rounded-full mr-2'></div>
              <span className='text-sm'>Present {presentCount}</span>
              <span className='text-xs text-gray-500 ml-1'>
                {presentPercentage}%
              </span>
            </div>

            <div className='flex items-center'>
              <div className='w-3 h-3 bg-red-500 rounded-full mr-2'></div>
              <span className='text-sm'>Absent {absentCount}</span>
              <span className='text-xs text-gray-500 ml-1'>
                {absentPercentage}%
              </span>
            </div>

            <div className='flex items-center'>
              <div className='w-3 h-3 bg-yellow-500 rounded-full mr-2'></div>
              <span className='text-sm'>Late {lateCount}</span>
              <span className='text-xs text-gray-500 ml-1'>
                {latePercentage}%
              </span>
            </div>

            <div className='flex items-center'>
              <div className='w-3 h-3 bg-gray-400 rounded-full mr-2'></div>
              <span className='text-sm'>Not Taken {notTakenCount}</span>
              <span className='text-xs text-gray-500 ml-1'>
                {notTakenPercentage}%
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={onMarkAttendance}
          className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md'
        >
          Mark Attendance
        </Button>
      </div>

      <div className='flex gap-4 mt-4'>
        <button className='text-blue-600 text-sm'>View Attendance</button>
        <button className='text-blue-600 text-sm'>
          View Class Attendance Report
        </button>
      </div>
    </div>
  );
}
