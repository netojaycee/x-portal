"use client";

import React, { useState, useMemo } from "react";
import CustomTable, {
  AdvancedFilterValues,
} from "@/app/(dashboard)/components/CustomTable";
import {
  useGetStudentPaymentSummaryQuery,
  useGetSessionsQuery,
  useGetTermsQuery,
  useGetSessionClassesQuery,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useDebounce } from "use-debounce";

interface StudentPaymentSummary {
  id: string;
  invoiceId: string;
  studentId: string;
  status: string;
  paid: number | null;
  outstanding: number;
  student: {
    id: string;
    studentRegNo: string;
    user: {
      firstname: string;
      lastname: string;
    };
    class: {
      id: string;
      name: string;
    };
    classArm: {
      id: string;
      name: string;
    };
  };
  invoice: {
    id: string;
    amount: number;
    title: string;
    reference: string;
    discounts: Array<{
      id: string;
      amount: number;
      status: string;
    }>;
    session: {
      id: string;
      name: string;
    };
    term: {
      id: string;
      name: string;
    };
  };
}

const StudentListTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

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
  const { data: classesData, isFetching: isClassesFetching } =
    useGetSessionClassesQuery(advancedFilters.sessionId || "", {
      skip: !advancedFilters.sessionId,
      // Ensure we refetch when session changes
      refetchOnMountOrArgChange: true,
    });

  console.log(classesData);

  // Fetch student payment summary with filters
  const {
    data: studentSummaryData,
    isLoading,
    isFetching,
  } = useGetStudentPaymentSummaryQuery(
    {
      page: currentPage,
      limit: rowsPerPage,
      q: debouncedSearchTerm,
      sessionId: advancedFilters.sessionId || undefined,
      termId: advancedFilters.termId || undefined,
      classId: advancedFilters.classId || undefined,
      classArmId: advancedFilters.classArmId || undefined,
      status: advancedFilters.status || undefined,
    },
    {
      // Ensure we refetch when filters change
      refetchOnMountOrArgChange: true,
    }
  );

  console.log(studentSummaryData, "ffffffffffff");

  console.log(sessionsData);

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

  const { classes, classArms } = useMemo(() => {
    try {
      // Check if we have the classes array in the nested structure
      const classesArray = classesData?.data?.classes;
      if (!classesArray || !Array.isArray(classesArray)) {
        return { classes: [], classArms: [] };
      }

      // Map classes with their category info
      const classOptions = classesArray.map((classItem: any) => ({
        id: classItem.id,
        name: `${classItem.name} (${classItem.category.name})`,
      }));

      // Find selected class and get its arms
      const selectedClass = classesArray.find(
        (c: any) => c.id === advancedFilters.classId
      );

      // Map arms from the selected class
      const armOptions =
        selectedClass?.classArms?.map((arm: any) => ({
          id: arm.id,
          name: arm.name,
        })) || [];

      return {
        classes: classOptions,
        classArms: armOptions,
      };
    } catch (error) {
      console.error("Error processing class data:", error);
      return { classes: [], classArms: [] };
    }
  }, [classesData?.data?.classes, advancedFilters.classId]);

  const statusOptions = [
    { value: "paid", label: "Fully Paid" },
    { value: "partial", label: "Partially Paid" },
    { value: "unpaid", label: "Unpaid" },
  ];

  const columns = [
    {
      key: "sn",
      label: "S/N",
      // render: (row: any) => {
      //   console.log(row, "hhjjh");
      //   return row.serialNumber;
      // },
    },
    {
      key: "studentName",
      label: "Student Name",
      render: (row: any) =>
        `${row?.student?.user?.firstname} ${row?.student?.user?.lastname}`,
    },
    {
      key: "class",
      label: "Class",
      render: (row: any) =>
        `${row.student?.class?.name} ${row.student?.classArm?.name || ""}`,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (row: any) =>
        row.invoice?.amount.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }),
    },
    {
      key: "discount",
      label: "Discount",
      render: (row: any) =>
        (row.invoice?.discounts[0]?.amount || 0).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }),
    },
    {
      key: "expected",
      label: "Expected",
      render: (row: any) =>
        (
          row.invoice?.amount - (row.invoice?.discounts[0]?.amount || 0)
        ).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }),
    },
    {
      key: "paid",
      label: "Paid",
      render: (row: any) =>
        (row?.paid || 0).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }),
    },
    {
      key: "outstanding",
      label: "Outstanding",
      render: (row: any) =>
        (row?.outstanding || 0).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <div className={`status-pill status-${row.status}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </div>
      ),
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

  // Show loader when initially loading or when fetching new data
  if (isLoading || isFetching || isClassesFetching) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-4'>
      <style jsx global>{`
        .status-pill {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          width: fit-content;
        }
        .status-paid {
          background-color: #e6f4ea;
          color: #1e8e3e;
        }
        .status-partial {
          background-color: #fef7e0;
          color: #f9a825;
        }
        .status-unpaid {
          background-color: #fce8e6;
          color: #d93025;
        }
      `}</style>

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
