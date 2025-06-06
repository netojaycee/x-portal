"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils"; // If you use shadcn's cn utility or use classNames from 'classnames'
import { Card } from "@/components/ui/card"; // shadcn/ui
import { Button } from "@/components/ui/button"; // shadcn/ui

type AttendanceData = {
  [date: string]: {
    present: number;
    absent: number;
    late: number;
  };
};

type AttendanceCalendarProps = {
  year: number;
  month: number; // 0-indexed (0 = January)
  attendance: AttendanceData;
  onMonthChange?: (year: number, month: number) => void;
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function AttendanceCalendar({
  year,
  month,
  attendance,
  onMonthChange,
}: AttendanceCalendarProps) {
  const [curMonth, setCurMonth] = useState(month);
  const [curYear, setCurYear] = useState(year);

  const days = getDaysInMonth(curYear, curMonth);
  const firstDay = getFirstDayOfWeek(curYear, curMonth);

  const handlePrevMonth = () => {
    let newMonth = curMonth - 1;
    let newYear = curYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCurMonth(newMonth);
    setCurYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };

  const handleNextMonth = () => {
    let newMonth = curMonth + 1;
    let newYear = curYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurMonth(newMonth);
    setCurYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };

  // Build calendar structure
  const calendar: (number | null)[][] = [];
  let week: (number | null)[] = [];
  let day = 1;
  for (let i = 0; i < firstDay; i++) week.push(null);
  while (day <= days) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
    day++;
  }
  while (week.length < 7) week.push(null);
  if (week.some((d) => d !== null)) calendar.push(week);

  const monthYearStr = `${new Date(curYear, curMonth).toLocaleString(
    "default",
    {
      month: "long",
    }
  )} ${curYear}`;

  return (
    <div className='w-full max-w-3xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <Button size='sm' variant='outline' onClick={handlePrevMonth}>
          &lt;
        </Button>
        <h2 className='text-lg font-semibold'>{monthYearStr}</h2>
        <Button size='sm' variant='outline' onClick={handleNextMonth}>
          &gt;
        </Button>
      </div>
      <div className='grid grid-cols-7 border rounded overflow-hidden'>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className='text-xs font-medium bg-muted border-b border-r px-2 py-1 text-center'
          >
            {day}
          </div>
        ))}
        {calendar.map((week, idx) =>
          week.map((date, jdx) => {
            if (!date)
              return (
                <div
                  key={`empty-${idx}-${jdx}`}
                  className='border-b border-r h-20 bg-background'
                />
              );
            const key = `${curYear}-${String(curMonth + 1).padStart(
              2,
              "0"
            )}-${String(date).padStart(2, "0")}`;
            const stats = attendance[key] || { present: 0, absent: 0, late: 0 };
            return (
              <Card
                key={key}
                className={cn(
                  "border-b border-r px-2 py-1 h-20 flex flex-col gap-1 justify-start items-start",
                  "bg-background"
                )}
              >
                <div className='font-semibold text-xs'>{date}</div>
                <div className='text-xs text-blue-700'>
                  • Present <span className='underline'>{stats.present}</span>
                </div>
                <div className='text-xs text-red-600'>
                  • Absent <span className='underline'>{stats.absent}</span>
                </div>
                <div className='text-xs text-yellow-600'>
                  • Late <span className='underline'>{stats.late}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
