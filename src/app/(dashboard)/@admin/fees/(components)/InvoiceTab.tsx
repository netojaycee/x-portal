"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { Plus } from "lucide-react";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, ModalType } from "@/lib/types";
import { useDebounce } from "use-debounce";
import { useGetInvoicesQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";

export default function InvoiceTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [debouncedSearchTerm] = useDebounce(search, 500);

  // Fetch invoices from API
  const {
    data: invoicesData,
    isLoading: invoicesLoading,
    // error: invoicesError,
  } = useGetInvoicesQuery({
    q: debouncedSearchTerm,
    page,
    limit,
  });

  console.log(invoicesData, "invoicesData");

  if (invoicesLoading) {
    return <LoaderComponent />;
  }

  // Handle the response structure - invoicesData might be an array directly or wrapped in data property
  const invoices = Array.isArray(invoicesData)
    ? invoicesData
    : invoicesData?.data || [];
  const totalItems = invoicesData?.totalItems || invoices.length;

  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (invoice: any) => {
    const otherOptions = [
      //   {
      //     key: "student",
      //     label: "View Profile",
      //     type: "custom" as const,
      //     handler: () => handleViewStudent(student),
      //   },
      // {
      //   key: "invoice",
      //   label: "Edit",
      //   type: "edit" as const,
      //   handler: () => openModal("edit", invoice),
      // },
      // {
      //   key: "student",
      //   label: "Assign Parent/Guardian",
      //   type: "custom" as const,
      //   handler: () => openModal("permission", student),
      // },

      {
        key: "invoice",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", invoice),
      },
    ];

    return [...otherOptions];
  };

  //   const handleViewStudent = (row: User) => {
  //     router.push(`/students/profile/${row.id}`);
  //   };
  return (
    <div className='space-y-4'>
      <CustomTable
        title='Invoice List'
        columns={[
          { key: "sn", label: "SN" },
          { key: "reference", label: "Invoice ID" },
          { key: "title", label: "Invoice Title" },
          // { key: "description", label: "Description" },
          { key: "amount", label: "Amount (₦)" },
          { key: "type", label: "Type" },
          { key: "date", label: "Generated Date" },
          { key: "createdByUser", label: "Created By" },
          { key: "session", label: "Session" },
          { key: "term", label: "Term" },
          // { key: "status", label: "Status" },
          // { key: "actions", label: "Actions" },
        ]}
        data={invoices}
        totalItems={totalItems || 0}
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
        filters={{ showSearch: true, showFilter: false }}
        showActionButton={true}
        actionButtonText='Add Invoice'
        actionButtonIcon={<Plus className='h-4 w-4' />}
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
          type={ENUM_MODULES.INVOICE}
        />
      )}

      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.INVOICE}
          status={"delete"}
        />
      )}
    </div>
  );
}
