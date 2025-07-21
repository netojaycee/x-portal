"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState } from "@/lib/types";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useGetResultsQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";

export const ResultListTabContent: React.FC<{
  sessionId?: string;
  classId?: string;
  classArmId?: string;
  studentId?: string;
}> = ({
  sessionId,
  classId,
  classArmId,
  studentId,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [debouncedSearchTerm] = useDebounce(search, 500);
  const router = useRouter();

  const { data: results, isLoading: resultsLoading } = useGetResultsQuery({
    page,
    limit,
    q: debouncedSearchTerm,
    sessionId,
    classId,
    classArmId,
    studentId,
  });

  if (resultsLoading) {
    return <LoaderComponent />;
  }
  console.log(results && results, "hhh");

  const resultsData = results?.results || [];

  if (resultsLoading) {
    return <LoaderComponent />;
  }

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (result: any) => {
    const otherOptions = [
      {
        key: "result",
        label: "View Result",
        type: "custom" as const,
        handler: () => handleViewResult(result),
      },
      {
        key: "result",
        label: "View broadsheet by score",
        type: "custom" as const,
        handler: () => handleViewScore(result),
      },
      {
        key: "result",
        label: "View broadsheet by grade",
        type: "custom" as const,
        handler: () => handleViewGrade(result),
      },
      {
        key: "result",
        label: "View Performance Analytics",
        type: "custom" as const,
        handler: () => handleViewPerformanceAnalytics(result),
      },
    ];

    return [...otherOptions];
  };

  // const handleViewResult = (row: any) => {
  //   const urlTitle = row.title?.replace(/[\s\/]/g, "-") || "";
  //   router.push(`/results/${urlTitle}/${row.id}`);
  // };
  // const handleViewScore = (row: any) => {
  //   router.push(`/results/broadsheet/score/${row.id}`);
  // };
  // const handleViewGrade = (row: any) => {
  //   router.push(`/results/broadsheet/grade/${row.id}`);
  // };
  // const handleViewPerformanceAnalytics = (row: any) => {
  //   router.push(`/results/analytics/${row.id}`);
  // };

  // ...existing code...

  const handleViewResult = (row: any) => {
    const urlTitle = row.title?.replace(/[\s\/]/g, "-") || "";
    let url = `/results/${urlTitle}/${row.id}`;
    if (studentId) url += `?sId=${studentId}`;
    router.push(url);
  };
  const handleViewScore = (row: any) => {
    let url = `/results/broadsheet/score/${row.id}`;
    if (studentId) url += `?sId=${studentId}`;
    router.push(url);
  };
  const handleViewGrade = (row: any) => {
    let url = `/results/broadsheet/grade/${row.id}`;
    if (studentId) url += `?sId=${studentId}`;
    router.push(url);
  };
  const handleViewPerformanceAnalytics = (row: any) => {
    let url = `/results/analytics/${row.id}`;
    if (studentId) url += `?sId=${studentId}`;
    router.push(url);
  };

  // ...existing

  return (
    <div className='space-y-4'>
      <CustomTable
        title='Results'
        columns={[
          { key: "sn", label: "SN" },
          { key: "term", label: "Term" },
          { key: "session", label: "Session" },
          { key: "resultScope", label: "Type" },
          { key: "actions", label: "Actions" },
        ]}
        data={resultsData}
        totalItems={results?.total || 0}
        currentPage={page}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        filters={{ showSearch: false, showFilter: false }}
        showActionButton={false}
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        getActionOptions={getActionOptions}
      />

      {modal.type === "edit" && (
        <CustomModal
          open={modal.type === "edit"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          isEditMode={true}
          type={ENUM_MODULES.STUDENT}
        />
      )}

      {modal.type === "status" && (
        <CustomModal
          open={modal.type === "status"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.RESULT}
          status={"confirmation"}
        />
      )}
    </div>
  );
};
