"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, 
  // ModalType, User
 } from "@/lib/types";
import { useDebounce } from "use-debounce";
// import { useRouter } from "next/navigation";
import { useGetClassSubjectsQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";

export const SubjectListTabContent: React.FC<any> = ({
  classId,
  classArmId,
//   termId,
//   subjects,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [debouncedSearchTerm] = useDebounce(search, 500);
  // const router = useRouter();

  // Pass them into your RTK hook
  const {
    data: subjectsData,
    isLoading: subjectsLoading,
    // error: studentsError,
  } = useGetClassSubjectsQuery(
    { q: debouncedSearchTerm, page, limit, classId, classArmId },
    { skip: !classId || !classArmId }
  );
  // const [toggleActive] = useToggleSchoolActiveMutation();
  console.log(subjectsData, "subjectsData");

  if (subjectsLoading) {
    return <LoaderComponent />;
  }
  console.log(subjectsData && subjectsData);
  //   const studentsData = studentsData?.users || [];

  // const openModal = (type: Exclude<ModalType, "">, row: any) =>
  //   setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  // const getActionOptions = (subject: any) => {
  //   const otherOptions = [
  //     {
  //       key: "subject",
  //       label: "View Profile",
  //       type: "custom" as const,
  //       handler: () => handleViewStudent(subject),
  //     },
  //     {
  //       key: "subject",
  //       label: "Edit",
  //       type: "edit" as const,
  //       handler: () => openModal("edit", subject),
  //     },
  //     // {
  //     //   key: "subject",
  //     //   label: "Assign Parent/Guardian",
  //     //   type: "custom" as const,
  //     //   handler: () => openModal("permission", subject),
  //     // },
  //   ];

  //   return [...otherOptions];
  // };

  // const handleViewStudent = (row: User) => {
  //   router.push(`/students/profile/${row.id}`);
  // };

  const subjectsArray = subjectsData?.data?.subjects || [];

  console.log(subjectsArray, "subjectsArray");

  return (
    <div className='p-4'>
      <CustomTable
        title='Subjects List'
        columns={[
          { key: "sn", label: "SN" },
          { key: "name", label: "Subject" },
          { key: "teacher", label: "SubjectTeacher" },

          // { key: "actions", label: "Actions" },
        ]}
        data={subjectsArray} // Show only 5 rows as per Subscriber List
        totalItems={subjectsData?.data?.total || 0}
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
        // actionButtonText='Add New Student'
        // actionButtonIcon={<Plus className='h-4 w-4' />}
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        // getActionOptions={getActionOptions}
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
};
