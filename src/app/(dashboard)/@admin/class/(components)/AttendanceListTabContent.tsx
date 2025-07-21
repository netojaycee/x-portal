import { useGetAttendanceSummaryQuery } from "@/redux/api";
import AttendanceCalendar from "./Calendar";
import LoaderComponent from "@/components/local/LoaderComponent";
import React from "react";

export const AttendanceListTabContent: React.FC<any> = ({
  sessionId,
  classId,
  classArmId,
  termId,
}) => {
  const { data, isLoading } = useGetAttendanceSummaryQuery({
    sessionId,
    classId,
    classArmId,
    termId,
  });

  // Local state for filter controls
  const [year, setYear] = React.useState<number | undefined>(undefined);
  const [month, setMonth] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (data?.selectedYear) setYear(data.selectedYear);
    if (data?.selectedMonth) setMonth(data.selectedMonth);
  }, [data?.selectedYear, data?.selectedMonth]);

  // Use yearMonths from API for strict year/month filtering
  const yearMonthMap = data?.yearMonths || {};
  const validYears = Object.keys(yearMonthMap).map(Number);
  const validMonths = year ? yearMonthMap[year] || [] : [];

  // Handle filter change
  const handleMonthChange = (newYear: number, newMonth: number) => {
    if (!validYears.includes(newYear) || !validMonths.includes(newMonth + 1))
      return;
    setYear(newYear);
    setMonth(newMonth + 1);
  };

  if (isLoading || !data) {
    return <LoaderComponent />;
  }

  console.log(data, data?.yearMonths, "Attendance Data");

  // Map summary by day of month for calendar
  const calendarData: { [day: number]: any } = {};
  (data.summary || []).forEach((d: any) => {
    const day = new Date(d.date).getDate();
    calendarData[day] = {
      present: d.present,
      absent: d.absent,
      late: d.late,
      students: d.students,
    };
  });

  return (
    <div className='p-4'>
      <AttendanceCalendar
        year={year ?? data.selectedYear}
        month={(month ?? data.selectedMonth) - 1}
        data={calendarData}
        onMonthChange={handleMonthChange}
        filterYears={validYears}
        filterMonths={validMonths}
        yearMonthMap={data?.yearMonths}
      />
    </div>
  );
};
