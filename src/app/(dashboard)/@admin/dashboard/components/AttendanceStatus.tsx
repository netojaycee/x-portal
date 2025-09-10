"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface StatusIndicatorProps {
  color: string;
  label: string;
  count: number | string;
  percentage: number | string;
}

const StatusIndicator = ({
  color,
  label,
  count,
  percentage,
}: StatusIndicatorProps) => {
  return (
    <div className='flex items-center space-x-2 min-w-[110px]'>
      <span
        className='w-3 h-3 rounded-full border border-gray-200'
        style={{ backgroundColor: color }}
      ></span>
      <span className='text-xs md:text-sm text-gray-700 font-medium'>
        {label} <span className='font-bold'>{count}</span> <span className='text-gray-400'>({percentage}%)</span>
      </span>
    </div>
  );
};

interface AttendanceStatsProps {
  total: number | string;
  statuses: {
    label: string;
    count: number | string;
    percentage: number | string;
    color: string;
  }[];
  viewMoreUrl: string;
}

export default function AttendanceStats({
  total,
  statuses,
  viewMoreUrl,
}: AttendanceStatsProps) {
  return (
    <div className='bg-white rounded-lg shadow-md px-3 py-5'>
      <h3 className='text-sm text-gray-700 font-semibold mb-4'>
        Today&apos;s General Attendance Statistics
      </h3>
      <div className='flex flex-col  gap-4'>
        <div className='flex flex-col gap-2 '>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-3xl md:text-4xl font-extrabold text-blue-600'>{total}</span>
            <span className='text-sm md:text-base text-gray-600 font-medium'>Total Students</span>
          </div>
          <div className='flex flex-wrap gap-2 md:gap-4'>
            {statuses.map((status, index) => (
              <StatusIndicator key={index} {...status} />
            ))}
          </div>
        </div>
        <Button
          variant='secondary'
          className='bg-blue-500 text-white rounded-full px-4 py-2 shadow-md hover:bg-blue-600 transition-colors duration-200'
        >
          <a href={viewMoreUrl} className='block w-full h-full'>View More</a>
        </Button>
      </div>
    </div>
  );
}
