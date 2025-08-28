"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import StatsCard from "@/app/(dashboard)/components/StatsCard";
import { Plus } from "lucide-react";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, ModalType, User } from "@/lib/types";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useGetStudentsQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";

export default function StudentsTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [debouncedSearchTerm] = useDebounce(search, 500);
  const router = useRouter();

  // Pass them into your RTK hook
  const {
    data,
    isLoading: studentsLoading,
    // error: studentsError,
  } = useGetStudentsQuery({
    q: debouncedSearchTerm,
    page,
    limit,
    gender: true,
  });

  if (studentsLoading) {
    return <LoaderComponent />;
  }
  console.log(data && data?.data, "kkk");
  const studentsData = data?.data?.students || [];
  const totalItems = data?.data?.totalStudents || studentsData.length;
  const totalFemales = data?.data?.totalFemales || 0;
  const totalMales = data?.data?.totalMales || 0;

  const openModal = (type: Exclude<ModalType, "">, row: User) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (student: User) => {
    const otherOptions = [
      {
        key: "student",
        label: "View Profile",
        type: "custom" as const,
        handler: () => handleViewStudent(student),
      },
      {
        key: "student",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", student),
      },
      // {
      //   key: "student",
      //   label: "Assign Parent/Guardian",
      //   type: "custom" as const,
      //   handler: () => openModal("permission", student),
      // },
    ];

    return [...otherOptions];
  };

  const handleViewStudent = (row: User) => {
    router.push(`/students/profile/${row.id}`);
  };
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <StatsCard
          title='Total Students'
          number={totalItems || 0}
          image='/student-group.png'
          imagePosition='left'
          male={totalMales || 0}
          female={totalFemales || 0}
          // url='/details'
        />
      </div>

      <CustomTable
        title='Students List'
        columns={[
          { key: "sn", label: "SN" },
          { key: "fullname", label: "Name" },
          { key: "gender", label: "Gender" },
          { key: "className", label: "Class" },
          { key: "classArmName", label: "Arm" },
          { key: "parentGuardian", label: "Parent/Guardian" },
          // { key: "date", label: "Created Date" },
          // { key: "status", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={studentsData} // Show only 5 rows as per Subscriber List
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
        filters={{ showSearch: true, showFilter: true }}
        showActionButton={true}
        actionButtonText='Add New Student'
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
          type={ENUM_MODULES.STUDENT}
        />
      )}
    </div>
  );
}
