"use client";
import React, { useState } from "react";
// import { classCategoryData } from "@/lib/data";
import { Plus } from "lucide-react";
import { useGetClassesQuery } from "@/redux/api";
import { rowsPerPageOptions } from "@/lib/utils";
import { ENUM_MODULES } from "@/lib/types/enums";
import LoaderComponent from "@/components/local/LoaderComponent";
import { ModalState, ModalType } from "@/lib/types";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";

// above your component

export default function ClassCategoryTab() {
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
    //  const classCategoryData = data?.data || [];
  const classCategoryData = data || [];

  console.log("classCategoryData", classCategoryData);

  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (classCategory: any) => {
    const otherOptions = [
      {
        key: "classCategory",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", classCategory),
      },
      {
        key: "classCategory",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", classCategory),
      },
    ];

    return [...otherOptions];
  };

  return (
    <div>
      <CustomTable
        title='Class Category List'
        columns={[
          { key: "sn", label: "Order" },
          { key: "name", label: "Class Name" },
          //   { key: "no_of_arms", label: "No. of Arms" },
          { key: "isActive", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={classCategoryData}
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
        actionButtonText='Add New Class Category'
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
          type={ENUM_MODULES.CLASS_CATEGORY}
        />
      )}

      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.CLASS_CATEGORY}
          status={"delete"}
        />
      )}
    </div>
  );
}
