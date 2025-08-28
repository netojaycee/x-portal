"use client";

import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
}

interface CalendarProps {
  events: Event[];
  selectedDate: Date;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  selectedDate,
  onDateClick,
  onEventClick,
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return events.filter((event) => {
      // Check if the date falls between start and end dates (inclusive)
      const eventStart = format(event.start, "yyyy-MM-dd");
      const eventEnd = format(event.end, "yyyy-MM-dd");
      return dateString >= eventStart && dateString <= eventEnd;
    });
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className='bg-white rounded-lg border shadow-sm'>
      {/* Calendar Header */}
      <div className='p-4 border-b'>
        <h2 className='text-xl font-semibold text-gray-900'>
          {format(selectedDate, "MMMM yyyy")}
        </h2>
      </div>

      {/* Day Names */}
      <div className='grid grid-cols-7 border-b'>
        {dayNames.map((day) => (
          <div
            key={day}
            className='p-3 text-center text-sm font-medium text-gray-600 border-r last:border-r-0'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className='grid grid-cols-7'>
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors",
                !isCurrentMonth && "bg-gray-50 text-gray-400"
              )}
              onClick={() => onDateClick?.(day)}
            >
              {/* Date Number */}
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 text-sm font-medium mb-1",
                  isCurrentDay && "bg-blue-600 text-white rounded-full",
                  !isCurrentDay && isCurrentMonth && "text-gray-900",
                  !isCurrentDay && !isCurrentMonth && "text-gray-400"
                )}
              >
                {format(day, "d")}
              </div>

              {/* Events */}
              <div className='space-y-1'>
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className='text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate'
                    style={{
                      backgroundColor: event.color + "20",
                      color: event.color,
                      borderLeft: `3px solid ${event.color}`,
                    }}
                    title={`${event.title} (${format(event.start, "MMM d")} - ${format(event.end, "MMM d")})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                  >
                    <div className='font-medium truncate'>{event.title}</div>
                    {event.description && (
                      <div className='text-xs opacity-75 truncate'>
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <div className='text-xs text-gray-500 font-medium pl-1'>
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
