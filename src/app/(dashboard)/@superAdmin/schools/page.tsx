"use client";
import React, { useState } from "react";
import CustomTable from "../../components/CustomTable";
// import { schoolsData } from "@/lib/data";
import { Plus } from "lucide-react";
import { useGetSchoolsQuery } from "@/redux/api";
import { rowsPerPageOptions } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { School } from "@/lib/types/school";
import { CustomModal } from "../../components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import LoaderComponent from "@/components/local/LoaderComponent";
import { ModalState, ModalType } from "@/lib/types";

// above your component


export default function Schools() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [debouncedSearchTerm] = useDebounce(search, 500);

  // Pass them into your RTK hook
  const { data, isLoading } = useGetSchoolsQuery({
    page,
    limit,
    search: debouncedSearchTerm,
  });
  // const [toggleActive] = useToggleSchoolActiveMutation();

  if (isLoading) {
    return <LoaderComponent />;
  }
  // console.log(data && data);
  const schoolsData = data?.schools || [];
  console.log("schoolsData", schoolsData);

  const openModal = (type: Exclude<ModalType, "">, row: School) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (school: School) => {
    const toggleOption = {
      key: "school",
      label: school.isActive ? "Deactivate" : "Activate",
      type: "confirmation" as const,
      // handler: () => toggleActive(school.id),
      handler: () => openModal("status", school),
    };

    const otherOptions = [
      {
        key: "school",
        label: "Assign Permission",
        type: "custom" as const,
        handler: () => openModal("permission", school),
      },
      {
        key: "school",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", school),
      },
      {
        key: "school",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", school),
      },
    ];

    return [toggleOption, ...otherOptions];
  };

  return (
    <div>
      <CustomTable
        title='Schools List'
        columns={[
          { key: "sn", label: "SN", sortable: true },
          { key: "name", label: "School Name", sortable: true },
          { key: "email", label: "Email Address" },
          { key: "contact", label: "Contact" },
          { key: "subPlan", label: "Sub. Plan" },
          { key: "dueDate", label: "Due Date" },
          // { key: "subStatus", label: "Sub. Status" },
          { key: "isActive", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={schoolsData}
        totalItems={data?.total || 0}
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
        filters={{ showSearch: true, showFilter: true }}
        showActionButton={true}
        actionButtonText='Add New School'
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
          type={ENUM_MODULES.SCHOOL}
        />
      )}

      {modal.type === "status" && (
        <CustomModal
          open={modal.type === "status"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SCHOOL}
          status={"confirmation"}
        />
      )}
      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SCHOOL}
          status={"delete"}
        />
      )}
    </div>
  );
}
