"use client";

import React, { useState, useMemo } from "react";
import CustomTable, {
  AdvancedFilterValues,
} from "@/app/(dashboard)/components/CustomTable";
import {
  useGetPaymentLogsQuery,
  useGetSessionsQuery,
  useGetTermsQuery,
  useGetClassesQuery,
  useGetClassArmsQuery,
} from "@/redux/api";

interface PaymentLog {
  id: string;
  studentName: string;
  class: string;
  invoiceNumber: string;
  amountPaid: number;
  paymentChannel: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  updatedAt: string;
}

const PaymentLogsTab: React.FC = () => {
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

  // Fetch payment logs with filters
  const { data: paymentLogsData, isLoading } = useGetPaymentLogsQuery({
    page: currentPage,
    limit: rowsPerPage,
    q: searchTerm,
    sessionId: advancedFilters.sessionId,
    termId: advancedFilters.termId,
    classId: advancedFilters.classId,
    classArmId: advancedFilters.classArmId,
    status: advancedFilters.status,
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
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
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
      key: "invoiceNumber",
      label: "Invoice Number",
    },
    {
      key: "amountPaid",
      label: "Amount Paid",
    },
    {
      key: "paymentChannel",
      label: "Payment Channel",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  const data = useMemo(() => {
    if (!paymentLogsData?.data) return [];

    return paymentLogsData.data.map((log: any, index: number) => ({
      ...log,
      serialNumber: (currentPage - 1) * rowsPerPage + index + 1,
    }));
  }, [paymentLogsData?.data, currentPage, rowsPerPage]);

  const getActionOptions = (item: PaymentLog) => [
    {
      label: "View Details",
      type: "custom" as const,
      handler: () => {
        console.log("View payment details:", item);
      },
      key: "view",
    },
    {
      label: "Download Receipt",
      type: "custom" as const,
      handler: () => {
        console.log("Download receipt:", item);
      },
      key: "download",
    },
  ];

  const handleAdvancedFilterChange = (newFilters: AdvancedFilterValues) => {
    setAdvancedFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className='space-y-4'>
      <CustomTable
        title='Payment Logs'
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
        totalItems={paymentLogsData?.total || 0}
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

export default PaymentLogsTab;
