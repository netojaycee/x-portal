"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, ModalType} from "@/lib/types";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useGetResultsQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import { Switch } from "@/components/ui/switch";

export default function TerminalTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [debouncedSearchTerm] = useDebounce(search, 500);
  const router = useRouter();

 
  const { data: results, isLoading: resultsLoading } = useGetResultsQuery(
    {
      page,
      limit,
      q: debouncedSearchTerm,
      all: true,
      type: "EXAM",
    },
  );

  console.log(results && results, "hhh")
  // const [toggleActive] = useToggleSchoolActiveMutation();

  const resultsData = results?.results || [];

  if (resultsLoading) {
    return <LoaderComponent />;
  }
  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (result: any) => {
    const toggleOption = {
      key: "result",
      label: result.isApproved ? (
      <div className="flex items-center gap-2">
        <Switch checked disabled />
        <span>Approved</span>
      </div>
      ) : "Approve Result",
      type: "confirmation" as const,
      disabled: result.isApproved,
      handler: result.isApproved ? () => {} : () => openModal("status", result),
    };
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

    return [toggleOption, ...otherOptions];
  };

  const handleViewResult = (row: any) => {
    const urlTitle = row.title?.replace(/[\s\/]/g, '-') || '';
    router.push(`/results/${urlTitle}/${row.id}`);
  };
  const handleViewScore = (row: any) => {
    router.push(`/results/broadsheet/score/${row.id}`);
  };
  const handleViewGrade = (row: any) => {
    router.push(`/results/broadsheet/grade/${row.id}`);
  };
  const handleViewPerformanceAnalytics = (row: any) => {
    router.push(`/results/analytics/${row.id}`);
  };

  return (
    <div className='space-y-4'>
      <CustomTable
        title='Results'
        columns={[
          { key: "sn", label: "SN" },
          { key: "classArmName", label: "Class Arm" },
          { key: "term", label: "Term" },
          { key: "className", label: "Class" },
          { key: "session", label: "Session" },
          { key: "resultScope", label: "Type" },
          { key: "submittedBy", label: "Submitted By" },
          { key: "date", label: "Date" },
          { key: "isApproved", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={resultsData} // Show only 5 rows as per Subscriber List
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
        filters={{ showSearch: false, showFilter: true }}
        showActionButton={false}
        // actionButtonText='Add New Student'
        // actionButtonIcon={<Plus className='h-4 w-4' />}
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
}
