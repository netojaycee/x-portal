"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import StatsCard from "@/app/(dashboard)/components/StatsCard";
import { Plus } from "lucide-react";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, ModalType } from "@/lib/types";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useGetAllStaffQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import AssignClassroomForm from "./(components)/AssignClassroomForm";
import { ENUM_MODULES } from "@/lib/types/enums";
import AssignSubjectForm from "./(components)/AssignSubjectForm";

export default function Staff() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [openAssignClassroom, setOpenAssignClassroom] = useState(false);
  const [openAssignSubject, setOpenAssignSubject] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [debouncedSearchTerm] = useDebounce(search, 500);
  const router = useRouter();

  const {
    data,
    isLoading: staffLoading,
    // error: staffError,
  } = useGetAllStaffQuery({
    q: debouncedSearchTerm,
    page,
    limit,
  });

  if (staffLoading) {
    return <LoaderComponent />;
  }
  console.log(data && data, "staffDataaa");
  const staffData = data?.staff || [];
  const totalItems = data?.total || staffData.length;
  const totalFemales = data?.totalFemales || 0;
  const totalMales = data?.totalMales || 0;
  const totalStaff = data?.totalStaff || 0;

  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (staff: any) => {
    const otherOptions = [
      {
        key: "staff",
        label: "View Profile",
        type: "custom" as const,
        handler: () => handleViewStaff(staff),
      },
      {
        key: "staff",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", staff),
      },
      {
        key: "staff",
        label: "Assign Classroom",
        type: "custom" as const,
        handler: () => {
          setSelectedStaff(staff);
          setOpenAssignClassroom(true);
        },
      },
      {
        key: "staff",
        label: "Assign Subject",
        type: "custom" as const,
        handler: () => {
          setSelectedStaff(staff);
          setOpenAssignSubject(true);
        },
      },
    ];
    return [...otherOptions];
  };

  const handleViewStaff = (row: any) => {
    router.push(`/staff/profile/${row.id}`);
  };

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <StatsCard
          title='Total Staff'
          number={totalStaff || 0}
          image='/student-group.png'
          imagePosition='left'
          male={totalMales || 0}
          female={totalFemales || 0}
          // url='/details'
        />
      </div>

      <CustomTable
        title='Staff List'
        columns={[
          { key: "sn", label: "SN" },
          { key: "fullname", label: "Name" },
          { key: "gender", label: "Gender" },
          { key: "contact", label: "Contact" },
          { key: "email", label: "Email" },
          // { key: "parentGuardian", label: "Parent/Guardian" },
          // { key: "date", label: "Created Date" },
          // { key: "status", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={staffData} // Show only 5 rows as per Subscriber List
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
        actionButtonText='Add New Staff'
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
          type={ENUM_MODULES.STAFF}
        />
      )}

      {/* Assign Classroom Modal using CustomModal */}
      <CustomModal
        open={openAssignClassroom}
        onOpenChange={setOpenAssignClassroom}
        type={ENUM_MODULES.STAFF}
        title='Assign Classroom'
        description='Assign this staff to classes and arms.'
        status={"custom" as const}
      >
        {selectedStaff && (
          <AssignClassroomForm
            staffId={selectedStaff.id}
            assignments={selectedStaff.assignedClass || []}
            onSuccess={() => setOpenAssignClassroom(false)}
          />
        )}
      </CustomModal>

      {/* Assign Subject Modal using CustomModal (placeholder, use AssignClassroomForm for now) */}
      <CustomModal
        open={openAssignSubject}
        onOpenChange={setOpenAssignSubject}
        type={ENUM_MODULES.STAFF}
        title='Assign Subject'
        description='Assign this staff to subjects.'
        status={"custom" as const}
      >
        {selectedStaff && (
          <AssignSubjectForm
            staffId={selectedStaff.id}
            assignments={selectedStaff.assignedSubjects || []}
            onSuccess={() => setOpenAssignSubject(false)}
          />
        )}
      </CustomModal>
    </div>
  );
}
