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
    <div className='flex items-center space-x-2'>
      <span
        className='w-3 h-3 rounded-full'
        style={{ backgroundColor: color }}
      ></span>
      <span className='text-sm text-gray-600'>
        {label} {count} <span className='text-gray-500'>({percentage}%)</span>
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
      <h3 className='text-sm text-gray-600 mb-2'>
        Today&apos;s General Attendance Statistics
      </h3>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline space-x-4'>
          <span className='text-2xl font-bold text-blue-600'>{total}</span>
          <span className='text-sm text-gray-600'>Total Students</span>
          {statuses.map((status, index) => (
            <StatusIndicator key={index} {...status} />
          ))}
        </div>
        <Button
          variant='secondary'
          className='bg-blue-500 text-white rounded-full px-4 py-2'
        >
          <a href={viewMoreUrl}>View More</a>
        </Button>
      </div>
    </div>
  );
}
