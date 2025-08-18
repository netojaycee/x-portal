"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { Plus } from "lucide-react";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, ModalType, User } from "@/lib/types";
import { useGetSubscriptionPackagesQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";

export default function Subscription() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [modal, setModal] = useState<ModalState>({ type: null });

  // Pass them into your RTK hook
  const { data, isLoading } = useGetSubscriptionPackagesQuery({
    page,
    limit,
  });

  if (isLoading) {
    return <LoaderComponent />;
  }
  const subscriptionsData = data?.data || [];
  

  const openModal = (type: Exclude<ModalType, "">, row: User) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (subscription: User) => {
    const otherOptions = [
      {
        key: "subscription",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", subscription),
      },
      {
        key: "subscription",
        label: "Assign School",
        type: "custom" as const,
        handler: () => openModal("status", subscription),
      },
      {
        key: "subscription",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", subscription),
      },
    ];

    return [...otherOptions];
  };

  return (
    <div>
      {" "}
      <CustomTable
        title='Subscription Plans'
        columns={[
          { key: "sn", label: "SN", sortable: false },
          { key: "name", label: "Package", sortable: false },
          { key: "duration", label: "Duration" },
          { key: "studentLimit", label: "Student Limit" },
          { key: "isActive", label: "Sub. Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={subscriptionsData}
        totalItems={data?.meta?.total || 0}
        currentPage={page}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        filters={{ showSearch: false, showFilter: false }}
        showActionButton={true}
        actionButtonText='Add New Subscription'
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        actionButtonIcon={<Plus className='h-4 w-4' />}
        getActionOptions={getActionOptions}
      />
      {modal.type === "edit" && (
        <CustomModal
          open={modal.type === "edit"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          isEditMode={true}
          type={ENUM_MODULES.SUBSCRIPTION}
        />
      )}
      {modal.type === "status" && (
        <CustomModal
          open={modal.type === "status"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SUBSCRIPTION}
          status={"custom"}
        />
      )}
      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SUBSCRIPTION}
          status={"delete"}
        />
      )}
    </div>
  );
}
