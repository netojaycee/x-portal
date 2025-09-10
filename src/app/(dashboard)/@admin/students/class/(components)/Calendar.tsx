import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type AttendanceStats = {
  present: number;
  absent: number;
  late: number;
  students?: {
    present: any[];
    absent: any[];
    late: any[];
  };
};

export type CalendarDay = {
  date: Date | null;
  stats?: AttendanceStats;
};

export type AttendanceCalendarProps = {
  year: number;
  month: number;
  data: { [day: number]: AttendanceStats };
  onMonthChange?: (year: number, month: number) => void;
  filterYears: number[];
  filterMonths: number[];
  yearMonthMap: Record<number, number[]>;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function buildCalendar(
  year: number,
  month: number,
  data: { [day: number]: AttendanceStats }
): CalendarDay[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const weeks: CalendarDay[][] = [];
  let week: CalendarDay[] = [];
  for (let i = 0; i < firstDay; i++) week.push({ date: null });
  for (let day = 1; day <= daysInMonth; day++) {
    week.push({
      date: new Date(year, month, day),
      stats: data[day] ?? { present: 0, absent: 0, late: 0 },
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push({ date: null });
    weeks.push(week);
  }
  return weeks;
}

export default function AttendanceCalendar({
  year,
  month,
  data,
  onMonthChange,
  filterYears,
  // filterMonths,
  yearMonthMap,
}: AttendanceCalendarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<null | {
    date: Date;
    stats: AttendanceStats;
  }>(null);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);

  useEffect(() => {
    setSelectedYear(year);
    setSelectedMonth(month);
  }, [year, month]);

  // Filter months for selected year
  const monthsForYear = yearMonthMap[selectedYear] || [];

  // Disable arrows if at session start/end
  const minYear = Math.min(...filterYears);
  const maxYear = Math.max(...filterYears);
  const minMonth = Math.min(...monthsForYear) - 1;
  const maxMonth = Math.max(...monthsForYear) - 1;
  const atStart = selectedYear === minYear && selectedMonth === minMonth;
  const atEnd = selectedYear === maxYear && selectedMonth === maxMonth;

  function handleDayClick(day: CalendarDay) {
    if (!day.date) return;
    setSelectedDay({ date: day.date, stats: day.stats! });
    setDrawerOpen(true);
  }

  function handleArrow(delta: number) {
    let newYear = selectedYear;
    let newMonth = selectedMonth + delta;
    const monthsForCurrentYear = yearMonthMap[selectedYear] || [];
    const minMonthCurrent = Math.min(...monthsForCurrentYear) - 1;
    const maxMonthCurrent = Math.max(...monthsForCurrentYear) - 1;
    if (delta < 0 && newMonth < minMonthCurrent) {
      // Go to previous year if possible
      const prevYearIdx = filterYears.indexOf(selectedYear) - 1;
      if (prevYearIdx >= 0) {
        newYear = filterYears[prevYearIdx];
        const prevMonths = yearMonthMap[newYear];
        newMonth = Math.max(...prevMonths) - 1;
      } else {
        return;
      }
    }
    if (delta > 0 && newMonth > maxMonthCurrent) {
      // Go to next year if possible
      const nextYearIdx = filterYears.indexOf(selectedYear) + 1;
      if (nextYearIdx < filterYears.length) {
        newYear = filterYears[nextYearIdx];
        const nextMonths = yearMonthMap[newYear];
        newMonth = Math.min(...nextMonths) - 1;
      } else {
        return;
      }
    }
    // Strict: only allow valid year/month
    if (
      !filterYears.includes(newYear) ||
      !(yearMonthMap[newYear] || []).includes(newMonth + 1)
    )
      return;
    setSelectedYear(newYear);
    setSelectedMonth(newMonth);
    if (onMonthChange) onMonthChange(newYear, newMonth);
  }

  function handleYearChange(val: string) {
    const y = parseInt(val, 10);
    setSelectedYear(y);
    // Set month to first valid month in year
    const validMonthsForYear = yearMonthMap[y] || [];
    const m = validMonthsForYear.includes(selectedMonth + 1)
      ? selectedMonth
      : validMonthsForYear[0] - 1;
    setSelectedMonth(m);
    if (onMonthChange) onMonthChange(y, m);
  }

  function handleMonthChange(val: string) {
    const m = parseInt(val, 10) - 1;
    setSelectedMonth(m);
    if (onMonthChange) onMonthChange(selectedYear, m);
  }

  const weeks = buildCalendar(selectedYear, selectedMonth, data);

  return (
    <div className='w-full bg-white rounded-xl border border-[#EFEFEF] overflow-hidden'>
      {/* Header Filter Controls */}
      <div className='flex justify-between items-center px-6 py-4 border-b'>
        <div className='flex items-center gap-2'>
          <Select value={String(selectedYear)} onValueChange={handleYearChange}>
            <SelectTrigger className='w-24'>
              <SelectValue placeholder='Year' />
            </SelectTrigger>
            <SelectContent>
              {filterYears.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(selectedMonth + 1)}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='Month' />
            </SelectTrigger>
            <SelectContent>
              {monthsForYear.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {MONTHS[m - 1]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-3'>
          <button
            className='p-2 rounded hover:bg-gray-100'
            onClick={() => handleArrow(-1)}
            aria-label='Previous Month'
            disabled={atStart}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className='p-2 rounded hover:bg-gray-100'
            onClick={() => handleArrow(1)}
            aria-label='Next Month'
            disabled={atEnd}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      {/* Calendar Table */}
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr className='bg-[#F8F9FB]'>
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <th key={day} className='py-2 font-medium text-gray-500'>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <td
                  key={di}
                  className={clsx(
                    "align-top h-[80px] px-2 py-1 border-b border-[#F0F0F0] cursor-pointer transition hover:bg-[#F7F7FC]",
                    day.date ? "" : "bg-[#F8F9FB] cursor-default"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  {day.date && (
                    <div>
                      <div className='font-semibold text-base text-gray-800'>
                        {day.date.getDate()}
                      </div>
                      <div className='mt-1 space-y-[2px]'>
                        <div className='text-xs text-[#4A6CF7] flex gap-1 items-center'>
                          <span className='w-2 h-2 bg-[#4A6CF7] rounded-full inline-block'></span>
                          Present{" "}
                          <span className='ml-1'>
                            {day.stats?.present ?? 0}
                          </span>
                        </div>
                        <div className='text-xs text-[#F857A6] flex gap-1 items-center'>
                          <span className='w-2 h-2 bg-[#F857A6] rounded-full inline-block'></span>
                          Absent{" "}
                          <span className='ml-1'>{day.stats?.absent ?? 0}</span>
                        </div>
                        <div className='text-xs text-[#8F9BBA] flex gap-1 items-center'>
                          <span className='w-2 h-2 bg-[#8F9BBA] rounded-full inline-block'></span>
                          Late{" "}
                          <span className='ml-1'>{day.stats?.late ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Drawer for Day Details */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className='rounded-t-xl'>
          <DrawerHeader className='pb-0'>
            <DrawerTitle>
              {selectedDay && (
                <span>
                  {selectedDay.date.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </DrawerTitle>
          </DrawerHeader>
          <div className='pt-2 pb-6 px-4'>
            <Tabs defaultValue='present' className='w-full'>
              <TabsList className='grid grid-cols-3 gap-2 mb-4'>
                <TabsTrigger value='present'>Present</TabsTrigger>
                <TabsTrigger value='absent'>Absent</TabsTrigger>
                <TabsTrigger value='late'>Late</TabsTrigger>
              </TabsList>
              <TabsContent value='present'>
                <div className='text-center text-[#4A6CF7] text-lg font-semibold'>
                  {selectedDay?.stats.present ?? 0} Present
                </div>
                {/* Render present students list/details if available */}
              </TabsContent>
              <TabsContent value='absent'>
                <div className='text-center text-[#F857A6] text-lg font-semibold'>
                  {selectedDay?.stats.absent ?? 0} Absent
                </div>
                {/* Render absent students list/details if available */}
              </TabsContent>
              <TabsContent value='late'>
                <div className='text-center text-[#8F9BBA] text-lg font-semibold'>
                  {selectedDay?.stats.late ?? 0} Late
                </div>
                {/* Render late students list/details if available */}
              </TabsContent>
            </Tabs>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
