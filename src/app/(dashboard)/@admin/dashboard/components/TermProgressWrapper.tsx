"use client";

import { useState, useEffect, useCallback } from "react";
import ProgressBar from "./ProgressBar";
import WeekInfo from "./WeekInfo";

// Interface for term data
interface TermData {
  title: string;
  currentDate: string;
  termStart: string;
  termEnd: string;
  currentWeek: number;
  remainingWeeks: number;
}

export default function TermProgressWrapper() {
  const [termData] = useState<TermData>({
    title: "Third Term, 2024/2025 Session",
    currentDate: "2025-05-10", // Updated to ISO 8601 format
    termStart: "2025-05-05", // Updated to ISO 8601 format
    termEnd: "2025-07-30", // Updated to ISO 8601 format
    currentWeek: 7,
    remainingWeeks: 4,
  });

  // Mock progress calculation (to be replaced with server data if needed)
  const calculateProgress = useCallback(() => {
    const start = new Date(termData.termStart).getTime();
    const end = new Date(termData.termEnd).getTime();
    const today = new Date(termData.currentDate).getTime();
    const totalDuration = end - start;
    const elapsed = today - start;
    const progress = (elapsed / totalDuration) * 100;

    // Clamp progress between 0 and 100
    return Math.min(Math.max(progress, 0), 100);
  }, [termData]);

  const [progress, setProgress] = useState(calculateProgress());

  useEffect(() => {
    setProgress(calculateProgress());
  }, [termData, calculateProgress]);

  return (
    <div className='w-full  px-3 py-5 bg-white rounded-lg shadow-md'>
      {/* Title */}
      <h2 className='text-lg font-semibold text-gray-700 mb-2'>
        {termData.title}
      </h2>

      {/* Current Date */}
      <p className='text-sm text-gray-500 mb-4'>
        Today, {" "}
        {new Date(termData.currentDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* Week Information */}
      <div className='flex items-center gap-2 mb-4'>
        <WeekInfo
          label='Current Week'
          value={`${termData.currentWeek}th week`}
        />
        <WeekInfo
          label='Remaining Week'
          value={`${termData.remainingWeeks} week`}
        />
      </div>

      {/* Term Dates and Progress Bar */}
      <div className='flex items-center gap-4'>
        <p className='text-sm text-gray-500'>
          Term start: {termData.termStart}
        </p>
        <ProgressBar progress={progress} />
        <p className='text-sm text-gray-500'>Term end: {termData.termEnd}</p>
      </div>
    </div>
  );
}
