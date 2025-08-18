"use client";

import React, { useState, useMemo } from "react";
import CustomTable, {
  AdvancedFilterValues,
} from "@/app/(dashboard)/components/CustomTable";
import {
  useGetStudentPaymentSummaryQuery,
  useGetSessionsQuery,
  useGetTermsQuery,
  useGetClassesQuery,
  useGetClassArmsQuery,
} from "@/redux/api";

interface StudentPaymentSummary {
  id: string;
  studentName: string;
  class: string;
  totalAmount: number;
  discount: number;
  expected: number;
  paid: number;
  outstanding: number;
  status: "paid" | "partial" | "unpaid";
}

const StudentListTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValues>({
    sessionId: "",
    termId: "",
    classId: "",
    classArmId: "",
    status: "",
  });

  // Fetch filter data
  const { data: sessionsData } = useGetSessionsQuery({});
  const { data: termsData } = useGetTermsQuery({});
  const { data: classesData } = useGetClassesQuery({});
  const { data: classArmsData } = useGetClassArmsQuery({});

  // Fetch student payment summary with filters
  const { data: studentSummaryData, isLoading } =
    useGetStudentPaymentSummaryQuery({
      page: currentPage,
      limit: rowsPerPage,
      q: searchTerm,
      sessionId: advancedFilters.sessionId,
      termId: advancedFilters.termId,
      classId: advancedFilters.classId,
      classArmId: advancedFilters.classArmId,
    });

  const sessions = useMemo(
    () =>
      sessionsData?.data?.map((session: any) => ({
        id: session.id,
        name: session.name,
      })) || [],
    [sessionsData]
  );

  const terms = useMemo(
    () =>
      termsData?.data?.map((term: any) => ({ id: term.id, name: term.name })) ||
      [],
    [termsData]
  );

  const classes = useMemo(
    () =>
      classesData?.data?.map((classItem: any) => ({
        id: classItem.id,
        name: classItem.name,
      })) || [],
    [classesData]
  );

  const classArms = useMemo(
    () =>
      classArmsData?.data?.map((arm: any) => ({
        id: arm.id,
        name: arm.name,
      })) || [],
    [classArmsData]
  );

  const statusOptions = [
    { value: "paid", label: "Fully Paid" },
    { value: "partial", label: "Partially Paid" },
    { value: "unpaid", label: "Unpaid" },
  ];

  const columns = [
    {
      key: "serialNumber",
      label: "S/N",
    },
    {
      key: "studentName",
      label: "Student Name",
    },
    {
      key: "class",
      label: "Class",
    },
    {
      key: "totalAmount",
      label: "Total Amount",
    },
    {
      key: "discount",
      label: "Discount",
    },
    {
      key: "expected",
      label: "Expected",
    },
    {
      key: "paid",
      label: "Paid",
    },
    {
      key: "outstanding",
      label: "Outstanding",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  const data = useMemo(() => {
    if (!studentSummaryData?.data) return [];

    return studentSummaryData.data.map((student: any, index: number) => ({
      ...student,
      serialNumber: (currentPage - 1) * rowsPerPage + index + 1,
    }));
  }, [studentSummaryData?.data, currentPage, rowsPerPage]);

  const getActionOptions = (item: StudentPaymentSummary) => [
    {
      label: "View Payment History",
      type: "custom" as const,
      handler: () => {
        console.log("View payment history:", item);
      },
      key: "history",
    },
    {
      label: "Record Payment",
      type: "custom" as const,
      handler: () => {
        console.log("Record payment:", item);
      },
      key: "record",
    },
    {
      label: "Send Payment Reminder",
      type: "custom" as const,
      handler: () => {
        console.log("Send reminder:", item);
      },
      key: "reminder",
    },
  ];

  const handleAdvancedFilterChange = (newFilters: AdvancedFilterValues) => {
    setAdvancedFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!studentSummaryData?.data) return null;

    const totalStudents = studentSummaryData.data.length;
    const totalExpected = studentSummaryData.data.reduce(
      (sum: number, student: any) => sum + student.expected,
      0
    );
    const totalPaid = studentSummaryData.data.reduce(
      (sum: number, student: any) => sum + student.paid,
      0
    );
    const totalOutstanding = studentSummaryData.data.reduce(
      (sum: number, student: any) => sum + student.outstanding,
      0
    );

    return {
      totalStudents,
      totalExpected,
      totalPaid,
      totalOutstanding,
      collectionRate: totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0,
    };
  }, [studentSummaryData?.data]);

  return (
    <div className='space-y-4'>
      {/* Summary Cards */}
      {summaryStats && (
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-6'>
          <div className='bg-white p-4 rounded-lg border'>
            <div className='text-sm text-gray-600'>Total Students</div>
            <div className='text-2xl font-bold'>
              {summaryStats.totalStudents}
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg border'>
            <div className='text-sm text-gray-600'>Expected Amount</div>
            <div className='text-2xl font-bold text-blue-600'>
              ₦{summaryStats.totalExpected.toLocaleString()}
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg border'>
            <div className='text-sm text-gray-600'>Amount Paid</div>
            <div className='text-2xl font-bold text-green-600'>
              ₦{summaryStats.totalPaid.toLocaleString()}
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg border'>
            <div className='text-sm text-gray-600'>Outstanding</div>
            <div className='text-2xl font-bold text-red-600'>
              ₦{summaryStats.totalOutstanding.toLocaleString()}
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg border'>
            <div className='text-sm text-gray-600'>Collection Rate</div>
            <div className='text-2xl font-bold text-purple-600'>
              {summaryStats.collectionRate.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      <CustomTable
        title='Student Payment Summary'
        columns={columns}
        data={data}
        filters={{
          showSearch: true,
          showFilter: false,
          showAdvancedFilters: true,
          showSessionFilter: true,
          showTermFilter: true,
          showClassFilter: true,
          showClassArmFilter: true,
          showStatusFilter: true,
        }}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalItems={studentSummaryData?.total || 0}
        getActionOptions={getActionOptions}
        isSearching={isLoading}
        // Advanced filter props
        advancedFilterValues={advancedFilters}
        onAdvancedFilterChange={handleAdvancedFilterChange}
        sessions={sessions}
        terms={terms}
        classes={classes}
        classArms={classArms}
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default StudentListTab;
