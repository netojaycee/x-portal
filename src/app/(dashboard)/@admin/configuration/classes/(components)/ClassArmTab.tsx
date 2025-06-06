"use client";
import React, { useState } from "react";
// import { classArmData } from "@/lib/data";
import { Plus } from "lucide-react";
import { useGetClassArmsQuery } from "@/redux/api";
import { rowsPerPageOptions } from "@/lib/utils";
import { ENUM_MODULES } from "@/lib/types/enums";
import LoaderComponent from "@/components/local/LoaderComponent";
import { ModalState, ModalType } from "@/lib/types";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";

// above your component

export default function ClassArmTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });

  // Pass them into your RTK hook
  const { data, isLoading } = useGetClassArmsQuery({
    page,
    limit,
  });
  // const [toggleActive] = useToggleSchoolActiveMutation();

  if (isLoading) {
    return <LoaderComponent />;
  }
  //   console.log(data && data);
  //  const classArmData = data?.data || [];
  const classArmData = data || [];

  console.log("classArmData", classArmData);

  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (classArm: any) => {
    const otherOptions = [
      {
        key: "classArm",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", classArm),
      },
      {
        key: "classArm",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", classArm),
      },
    ];

    return [...otherOptions];
  };

  return (
    <div>
      <CustomTable
        title='ClassArm List'
        columns={[
          { key: "sn", label: "Order" },
          { key: "name", label: "Class Name" },
          { key: "date", label: "Created Date" },
          { key: "isActive", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={classArmData}
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
        actionButtonText='Add New ClassArm'
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
          type={ENUM_MODULES.CLASS_ARM}
        />
      )}

      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.CLASS_ARM}
          status={"delete"}
        />
      )}
    </div>
  );
}
