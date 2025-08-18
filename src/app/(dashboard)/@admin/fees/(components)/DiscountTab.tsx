"use client";
import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import CustomTable from "../../../components/CustomTable";
import { CustomModal } from "../../../components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import InvoiceReferenceForm from "./InvoiceReferenceForm";
import { useGetDiscountsQuery } from "@/redux/api";

export default function DiscountTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [modal, setModal] = useState<{ type: string | null; data?: any }>({
    type: null,
  });

  // Fetch discounts data
  const { data: discountsData } = useGetDiscountsQuery({
    page: currentPage,
    limit: limit,
    q: searchQuery,
  });

  const discounts = useMemo(
    () => discountsData?.data?.discounts || [],
    [discountsData]
  );

  const totalItems = useMemo(
    () => discountsData?.data?.totalItems || discounts.length,
    [discountsData, discounts]
  );

  // Table columns for discounts
  const columns = [
    { key: "reference", label: "Invoice Reference" },
    { key: "invoiceTitle", label: "Invoice Title" },
    { key: "discountAmount", label: "Discount Amount" },
    { key: "originalAmount", label: "Original Amount" },
    { key: "newAmount", label: "New Amount" },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = (type: string, row?: any) => {
    setModal({ type, data: row });
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  // Get action options for each row
  const getActionOptions = (discount: any) => [
    {
      label: "Edit",
      type: "edit" as const,
      handler: () => openModal("edit", discount),
      key: "edit",
    },
    {
      label: "Delete",
      type: "confirmation" as const,
      handler: () => openModal("delete", discount),
      key: "delete",
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Table */}
      <CustomTable
        columns={columns}
        data={discounts}
        totalItems={totalItems || 0}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setCurrentPage(1);
        }}
        searchTerm={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        filters={{ showSearch: true, showFilter: false }}
        showActionButton={true}
        actionButtonText='Create Discount'
        actionButtonIcon={<Plus className='h-4 w-4' />}
        onActionButtonClick={() => setOpenCreateModal(true)}
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        getActionOptions={getActionOptions}
        title='Discount List'
      />

      {/* Create Discount Modal */}
      <CustomModal
        open={openCreateModal}
        onOpenChange={setOpenCreateModal}
        type={ENUM_MODULES.DISCOUNT}
        status='create'
        title='Create Discount'
        description='Enter the invoice reference to proceed with discount creation.'
      >
        <InvoiceReferenceForm onClose={() => setOpenCreateModal(false)} />
      </CustomModal>

      {/* Edit Modal */}
      {modal.type === "edit" && (
        <CustomModal
          open={modal.type === "edit"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          isEditMode={true}
          type={ENUM_MODULES.DISCOUNT}
        />
      )}

      {/* Delete Modal */}
      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.DISCOUNT}
          status='delete'
        />
      )}
    </div>
  );
}
