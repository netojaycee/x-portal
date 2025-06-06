"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { ChevronLeft, Plus } from "lucide-react";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, ModalType } from "@/lib/types";
import { useGetSubjectQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import Link from "next/link";

export default function Subject() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });

  // Pass them into your RTK hook
  const { data, isLoading } = useGetSubjectQuery({
    page,
    limit,
  });
  // const [toggleActive] = useToggleSchoolActiveMutation();

  if (isLoading) {
    return <LoaderComponent />;
  }
  console.log(data && data);
  const subjectsData = data || [];

  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (subject: any) => {
    const otherOptions = [
      {
        key: "subject",
        label: "Assign Class",
        type: "custom" as const,
        handler: () => openModal("status", subject),
      },
      {
        key: "subject",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", subject),
      },
      {
        key: "subject",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", subject),
      },
    ];

    return [...otherOptions];
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-0 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href={"/configuration"} className='text-primary'>
            Account Settings
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>Subject</p>
      </div>

      <CustomTable
        title='Subject List'
        columns={[
          { key: "sn", label: "SN", sortable: false },
          { key: "name", label: "Subject" },
          { key: "code", label: "Short Code" },
          { key: "offering", label: "Class Offering" },
          { key: "actions", label: "Actions" },
        ]}
        data={subjectsData} // Show only 5 rows as per Subscriber List
        totalItems={data.length || 0}
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
        showActionButton={true}
        actionButtonText='Add New Subject'
        actionButtonIcon={<Plus className='h-4 w-4' />}
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        getActionOptions={getActionOptions}
      />

      {/* {modal.type === "edit" && (
        <CustomModal
          open={modal.type === "edit"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          isEditMode={true}
          type={ENUM_MODULES.SUBJECT}
        />
      )}

      {modal.type === "status" && (
        <CustomModal
          open={modal.type === "status"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SUBJECT}
          status='custom'
        />
      )}

      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SUBJECT}
          status='delete'
        />
      )} */}

      {modal.type && ["edit", "status", "delete"].includes(modal.type) && (
        <CustomModal
          open={modal.type !== null}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          isEditMode={modal.type === "edit"}
          type={ENUM_MODULES.SUBJECT}
          status={
            modal.type === "status"
              ? "custom"
              : modal.type === "delete"
              ? "delete"
              : undefined
          }
        />
      )}
    </div>
  );
}
