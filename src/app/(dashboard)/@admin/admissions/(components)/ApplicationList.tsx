"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, ModalType, User } from "@/lib/types";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";

// Sample data aligned with your provided table
const admissionsData = [
  {
    id: "1",
    photo: "/avatar.png",
    firstname: "Tolu",
    lastname: "Adebayo",
    dateOfBirth: "12/9/2011",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 7",
    appliedClass: "Basic 8",
  },
  {
    id: "2",
    photo: "/avatar.png",
    firstname: "Tolu",
    lastname: "Adebayo",
    dateOfBirth: "12/9/2011",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 7",
    appliedClass: "Basic 8",
  },
  {
    id: "3",
    photo: "/avatar.png",
    firstname: "Tolu",
    lastname: "Adebayo",
    dateOfBirth: "12/9/2011",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 7",
    appliedClass: "Basic 8",
  },
  {
    id: "4",
    photo: "/avatar.png",
    firstname: "Tolu",
    lastname: "Adebayo",

    dateOfBirth: "12/9/2011",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 7",
    appliedClass: "Basic 8",
  },
  {
    id: "5",
    photo: "/avatar.png",
    firstname: "Tolu",
    lastname: "Adebayo",
    dateOfBirth: "12/9/2011",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 7",
    appliedClass: "Basic 8",
  },
];

export default function ApplicationList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [debouncedSearchTerm] = useDebounce(search, 500);
  const router = useRouter();

  const { data, isLoading } = useGetUsersQuery({
    page,
    limit,
    q: debouncedSearchTerm,
  });

  if (isLoading) {
    return <LoaderComponent />;
  }

  //   const admissionsDataFromApi = data?.users || [];
  //   const totalItems = data?.total || admissionsDataFromApi.length;

  console.log("admissions data:", data);

  const openModal = (type: Exclude<ModalType, "">, row: User) => {
    setModal({ type, data: row });
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    console.log("ApplicationList handleModalOpenChange called with:", isOpen);
    if (!isOpen) {
      setModal({ type: null });
    }
  };

  const getActionOptions = (admission: any) => {
    const otherOptions = [
      {
        key: "admission",
        label: "View Application",
        type: "custom" as const,
        handler: () => handleViewadmission(admission),
      },
      {
        key: "admission",
        label: "Download",
        type: "custom" as const,
        // put a download function here, create in util reuse here using table data
        handler: () => handleViewadmission(admission),
      },
      {
        key: "admission",
        label: "Approve",
        type: "custom" as const,
        // put a download function here, create in util reuse here using table data
        handler: () => openModal("approve", admission),
      },
      {
        key: "admission",
        label: "Reject",
        type: "custom" as const,
        // put a download function here, create in util reuse here using table data
        handler: () => openModal("reject", admission),
      },
    ];

    return [...otherOptions];
  };

  const handleViewadmission = (row: any) => {
    router.push(`/admissions/${row.id}`); // Using sn as a fallback ID
  };

  return (
    <div className='space-y-4'>
      <CustomTable
        title='Application List'
        columns={[
          { key: "sn", label: "SN", sortable: false },
          { key: "photo", label: "Photo", sortable: false }, // Assuming photo is an image URL
          { key: "fullname", label: "Name" },
          { key: "dateOfBirth", label: "Date of Birth" },
          { key: "gender", label: "Gender" },
          { key: "session", label: "Session" },
          { key: "adClass", label: "Class" },
          { key: "actions", label: "Actions" },
        ]}
        data={admissionsData} // Fallback to sample data
        totalItems={admissionsData.length || 0}
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
        showActionButton={false}
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        getActionOptions={getActionOptions}
      />

      {modal.type && ["approve", "reject"].includes(modal.type) && (
        <CustomModal
          open={modal.type !== null}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.ADMISSION}
          status={modal.type}
        />
      )}
    </div>
  );
}
