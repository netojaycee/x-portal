"use client";
import React from "react";
import StatsCard from "../../components/StatsCard";
import TermProgressWrapper from "./components/TermProgressWrapper";
import { useGetPaymentSummaryQuery } from "@/redux/api";
import { LearnersDistribution } from "./components/LearnersDistribution";
import { PaymentDistribution } from "./components/PaymentDistribution";
import { stats } from "@/lib/data";
import ActivityBoardWrapper from "./components/ActivityBoardWrapper";
import AttendanceStats from "./components/AttendanceStatus";
import RevenueCard from "./components/RevenueCard";

export default function AdminPage() {
  const { data: paymentSummary } = useGetPaymentSummaryQuery({});

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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 '>
          <StatsCard
            title='No. of Students'
            number='400'
            image='/student-group.png'
            imagePosition='left'
            url='/students'
          />

          <StatsCard
            title='No. of Alumni'
            number='15'
            image='/alumni.png'
            imagePosition='left'
            url='/subscription'
          />

          <StatsCard
            title='No. of Parents'
            number='15'
            image='/parent-icon.png'
            imagePosition='left'
            url='/subscription'
          />

          <StatsCard
            title='No. of Staff'
            number='15'
            image='/staff.png'
            imagePosition='left'
            url='/staff'
          />
        </div>
      </div>
      {/* Activity Board with upcoming events */}
      <ActivityBoardWrapper />
      <LearnersDistribution />
      <AttendanceStats total='400' statuses={stats} viewMoreUrl='/attendance' />
      <div className='space-y-3 bg-white rounded-lg shadow-md px-3 py-5'>
        <h2 className='font-lato text-base text-[#4A4A4A]'>Financial Report</h2>
        <div className='grid grid-cols-1 md:grid-cols-3  gap-4 '>
          {dashboardRevenueData.map((revenue, index) => (
            <RevenueCard key={index} {...revenue} />
          ))}
        </div>
      </div>
      <PaymentDistribution />
    </div>
  );
}
