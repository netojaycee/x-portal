"use client";
import React, { useMemo } from "react";
import StatsCard from "../../components/StatsCard";
import TermProgressWrapper from "./components/TermProgressWrapper";
import { useGetSchoolSummaryQuery, useGetPaymentSummaryQuery, useGetSchoolClassSummaryQuery, useGetSchoolAttendanceSummaryQuery } from "@/redux/api";
import { LearnersDistribution } from "./components/LearnersDistribution";
import { PaymentDistribution } from "./components/PaymentDistribution";
import ActivityBoardWrapper from "./components/ActivityBoardWrapper";
import AttendanceStats from "./components/AttendanceStatus";
import RevenueCard from "./components/RevenueCard";

export default function AdminPage() {
  const { data: paymentSummary } = useGetPaymentSummaryQuery({});
  const { data: schoolSummary } = useGetSchoolSummaryQuery({});
  const { data: schoolClassSummary } = useGetSchoolClassSummaryQuery({});
  const { data: schoolAttendanceSummary } = useGetSchoolAttendanceSummaryQuery({});
  console.log("schoolAttendanceSummary", schoolAttendanceSummary);

    // Transform class stats data for the chart
    const classRevenueData = useMemo(() => 
      paymentSummary?.classStats?.map((stat: any) => ({
        name: stat.className,
        expected: stat.totalAmount,
        paid: stat.paidAmount,
      })) || [], [paymentSummary?.classStats]
    );

  const dashboardRevenueData = [
    {
      title: "Total Revenue",
      amount: paymentSummary?.summary?.expectedRevenue?.toString() || "0",
      icon: "/expected.png",
    },
    {
      title: "Total Collected",
      amount: paymentSummary?.summary?.generatedRevenue?.toString() || "0",
      icon: "/generated.png",
    },
    {
      title: "Outstanding Fees",
      amount: paymentSummary?.summary?.outstandingRevenue?.toString() || "0",
      icon: "/outstanding.png",
    },
  ];

  return (
    <div className='space-y-4'>
      <div className=''>
        <TermProgressWrapper />
      </div>
      <div className='space-y-3 bg-white rounded-lg shadow-md px-3 py-5'>
        <h2 className='font-lato text-base text-[#4A4A4A]'>School Community</h2>
            <div className='grid grid-cols-2 lg:grid-cols-4  gap-4 '>
          <StatsCard
            title='No. of Students'
            number={schoolSummary?.totalStudents?.toString() || "0"}
            image='/student-group.png'
            imagePosition='left'
            url='/students'
          />

          <StatsCard
            title='No. of Alumni'
            number={schoolSummary?.totalAlumni?.toString() || "0"}
            image='/alumni.png'
            imagePosition='left'
            url='/subscription'
          />

          <StatsCard
            title='No. of Parents'
            number={schoolSummary?.totalParents?.toString() || "0"}
            image='/parent-icon.png'
            imagePosition='left'
            url='/subscription'
          />

          <StatsCard
            title='No. of Staff'
            number={schoolSummary?.totalStaff?.toString() || "0"}
            image='/staff.png'
            imagePosition='left'
            url='/staff'
          />
        </div>
      </div>
      {/* Activity Board with upcoming events */}
      <ActivityBoardWrapper />
      <LearnersDistribution schoolClassSummary={schoolClassSummary} />
      <AttendanceStats
        total={schoolAttendanceSummary?.totalStudents?.toString() || "0"}
        statuses={[
          {
            label: "Present",
            count: schoolAttendanceSummary?.present ?? 0,
            percentage: schoolAttendanceSummary?.presentPercent ?? 0,
            color: "#4CAF50",
          },
          {
            label: "Absent",
            count: schoolAttendanceSummary?.absent ?? 0,
            percentage: schoolAttendanceSummary?.absentPercent ?? 0,
            color: "#F44336",
          },
          {
            label: "Late",
            count: schoolAttendanceSummary?.late ?? 0,
            percentage: schoolAttendanceSummary?.latePercent ?? 0,
            color: "#FFC107",
          },
          {
            label: "Not Taken",
            count: schoolAttendanceSummary?.notTaken ?? 0,
            percentage: schoolAttendanceSummary?.notTakenPercent ?? 0,
            color: "#BDBDBD",
          },
        ]}
        viewMoreUrl='/attendance'
      />
      <div className='space-y-3 bg-white rounded-lg shadow-md px-3 py-5'>
        <h2 className='font-lato text-base text-[#4A4A4A]'>Financial Report</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
          {dashboardRevenueData.map((revenue, index) => (
            <RevenueCard key={index} {...revenue} />
          ))}
        </div>
      </div>
      <PaymentDistribution classRevenueData={classRevenueData} />
    </div>
  );
}
