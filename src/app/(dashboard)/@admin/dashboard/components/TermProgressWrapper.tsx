"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import ProgressBar from "./ProgressBar";
import WeekInfo from "./WeekInfo";
import { useGetSchoolByIdQuery, useGetSessionsQuery } from "@/redux/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ENUM_ROLE } from "@/lib/types/enums";


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
  const { data, isLoading } = useGetSessionsQuery({});
  const userData = useSelector((state: RootState) => state.user.user);

  const { data: school, isLoading: isFetchingSchool } = useGetSchoolByIdQuery(
    userData?.schoolId || "",
    {
      skip: !userData?.schoolId || userData?.view_as !== ENUM_ROLE.ADMIN,
    }
  );
  console.log(school);
  const sessions = useMemo(() => data?.data || [], [data]);

  // Function to find the active term and session
  const getActiveTermData = useCallback((): TermData => {
    const currentDate = new Date();

    // Find active session
    const activeSession = sessions.find((session: any) => session.status);
    
    if (activeSession) {
      // Find active term in the active session
      const activeTerm = activeSession.terms?.find((term: any) => term.status);
      
      if (activeTerm) {
        // Calculate weeks
        const termStart = new Date(activeTerm.startDate);
        const termEnd = new Date(activeTerm.endDate);
        const today = currentDate;

        const totalDays = (termEnd.getTime() - termStart.getTime()) / (1000 * 60 * 60 * 24);
        const elapsedDays = (today.getTime() - termStart.getTime()) / (1000 * 60 * 60 * 24);
        const totalWeeks = Math.ceil(totalDays / 7);
        const currentWeek = Math.ceil(elapsedDays / 7);
        const remainingWeeks = totalWeeks - currentWeek;

        return {
          title: `${activeTerm.name}, ${activeSession.name} Session`,
          currentDate: currentDate.toISOString().split("T")[0],
          termStart: termStart.toISOString().split("T")[0],
          termEnd: termEnd.toISOString().split("T")[0],
          currentWeek,
          remainingWeeks: remainingWeeks > 0 ? remainingWeeks : 0,
        };
      }
    }

    // Fallback if no active term is found
    return {
      title: "No Active Term",
      currentDate: currentDate.toISOString().split("T")[0],
      termStart: currentDate.toISOString().split("T")[0],
      termEnd: currentDate.toISOString().split("T")[0],
      currentWeek: 0,
      remainingWeeks: 0,
    };
  }, [sessions]);

  const [termData, setTermData] = useState<TermData>(getActiveTermData());

  // Update termData when sessions data changes
  useEffect(() => {
    if (sessions.length > 0) {
      setTermData(getActiveTermData());
    }
  }, [sessions, getActiveTermData]);

  // Calculate progress
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

  // Calculate days left for subscription
  const [daysLeft, setDaysLeft] = useState<number>(0);
  useEffect(() => {
    if (school?.SchoolSubscription?.length) {
      const endDate = new Date(school.SchoolSubscription[0].endDate);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    }
  }, [school]);

  // console.log(school)

  if (isLoading || isFetchingSchool) {
    return (
      <div className='w-full px-3 py-5 bg-white rounded-lg shadow-md'>
        {/* Title Skeleton */}
        <div className='flex items-center justify-between'>
          <div className='flex flex-col'>
            <div className='h-7 w-48 bg-gray-200 rounded-md animate-pulse mb-2'></div>
            {/* Current Date Skeleton */}
            <div className='h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-4'></div>
          </div>
          <div className='relative group'>
            <div className='w-12 h-12 rounded-full bg-gray-200 animate-pulse'></div>
            <div className='h-4 w-12 bg-gray-200 rounded-md animate-pulse mt-1 mx-auto'></div>
          </div>
        </div>
        {/* Week Information Skeleton */}
        <div className='flex items-center gap-2 mb-4'>
          <div className='flex-1'>
            <div className='h-4 w-20 bg-gray-200 rounded-md animate-pulse mb-1'></div>
            <div className='h-5 w-16 bg-gray-200 rounded-md animate-pulse'></div>
          </div>
          <div className='flex-1'>
            <div className='h-4 w-20 bg-gray-200 rounded-md animate-pulse mb-1'></div>
            <div className='h-5 w-16 bg-gray-200 rounded-md animate-pulse'></div>
          </div>
        </div>
        {/* Term Dates and Progress Bar Skeleton */}
        <div className='flex items-center gap-4'>
          <div className='h-5 w-24 bg-gray-200 rounded-md animate-pulse'></div>
          <div className='flex-1 h-4 bg-gray-200 rounded-full animate-pulse'></div>
          <div className='h-5 w-24 bg-gray-200 rounded-md animate-pulse'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full px-3 py-5 bg-white rounded-lg shadow-md'>
      {/* Title */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-col'>
          {" "}
          <h2 className='text-lg font-semibold text-gray-700 mb-2'>
            {termData.title}
          </h2>
          {/* Current Date */}
          <p className='text-sm text-gray-500 mb-4'>
            Today,{" "}
            {new Date(termData.currentDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className='relative group'>
          <div
            className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
              daysLeft <= 10
                ? "bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.7)]"
                : "bg-green-500 text-white shadow-[0_0_5px_rgba(0,255,0,0.5)]"
            }`}
          >
            {daysLeft}
          </div>
          <p className='text-xs text-gray-600 text-center mt-1'>Days Left</p>
          <div className='absolute top-30 left-1/2 transform -translate-x-1/2 -translate-y-full mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            Days remaining on your subscription plan
          </div>
        </div>
      </div>
      {/* Week Information */}
      <div className='flex items-center gap-2 mb-4'>
        <WeekInfo
          label='Current Week'
          value={`${termData.currentWeek}${
            termData.currentWeek === 1
              ? "st"
              : termData.currentWeek === 2
              ? "nd"
              : termData.currentWeek === 3
              ? "rd"
              : "th"
          } week`}
        />
        <WeekInfo
          label='Remaining Week'
          value={`${termData.remainingWeeks} week${
            termData.remainingWeeks !== 1 ? "s" : ""
          }`}
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
