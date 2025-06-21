"use client";
import React, { useState } from "react";
// import { classData } from "@/lib/data";
import { Plus } from "lucide-react";
import { useGetClassesQuery } from "@/redux/api";
import { rowsPerPageOptions } from "@/lib/utils";
import { ENUM_MODULES } from "@/lib/types/enums";
import LoaderComponent from "@/components/local/LoaderComponent";
import { ModalState, ModalType } from "@/lib/types";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";

// above your component

export default function ClassTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });

  // Pass them into your RTK hook
  const { data, isLoading } = useGetClassesQuery({
    page,
    limit,
  });
  // const [toggleActive] = useToggleSchoolActiveMutation();

  if (isLoading) {
    return <LoaderComponent />;
  }
  //   console.log(data && data);
    //  const classData = data?.data || [];
  const classData = data || [];

  console.log("classData", classData);

  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (classs: any) => {
    const otherOptions = [
      {
        key: "class",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", classs),
      },
      {
        key: "class",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", classs),
      },
    ];

    return [...otherOptions];
  };

  return (
    <div>
      <CustomTable
        title='Class List'
        columns={[
          { key: "sn", label: "Order" },
          { key: "classCategory", label: "Category" },
          { key: "name", label: "Class Name" },
          //   { key: "no_of_arms", label: "No. of Arms" },
          { key: "isActive", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={classData}
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
        actionButtonText='Add New Class'
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
          type={ENUM_MODULES.CLASS}
        />
      )}

      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.CLASS}
          status={"delete"}
        />
      )}
    </div>
  );
}
