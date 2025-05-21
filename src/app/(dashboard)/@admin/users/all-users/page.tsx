"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { Plus } from "lucide-react";
import { rowsPerPageOptions } from "@/lib/utils";
import { ModalState, ModalType, User } from "@/lib/types";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function AllUsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [debouncedSearchTerm] = useDebounce(
    search,
    500
  );
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.user);
  const schoolId = userData?.schoolId || null;

  // Pass them into your RTK hook
  const { data, isLoading, isFetching: isSearching } = useGetUsersQuery(
    {
      page,
      limit,
      q: debouncedSearchTerm,
      schoolId: schoolId || null,
    },
    { skip: !schoolId }
  );
  // const [toggleActive] = useToggleSchoolActiveMutation();
console.log(data && data);
  if (isLoading) {
    return <LoaderComponent />;
  }
  // console.log(data && data);
  const usersData = data?.users || [];

  const openModal = (type: Exclude<ModalType, "">, row: User) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (user: User) => {
    const otherOptions = [
      {
        key: "users",
        label: "View Profile",
        type: "custom" as const,
        handler: () => handleViewUser(user),
      },
      {
        key: "users",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", user),
      },
      {
        key: "users",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", user),
      },
    ];

    return [...otherOptions];
  };

  const handleViewUser = (row: User) => {
      router.push(`/users/all-users/profile/${row.id}`);
    };
  return (
    <div className='p-4'>
      <CustomTable
        title='Users List'
        columns={[
          // { key: "sn", label: "SN", sortable: true },
          { key: "fullname", label: "Name" },
          { key: "email", label: "Email" },
          { key: "gender", label: "Gender" },
          { key: "phone", label: "Contact" },
          { key: "subRole", label: "Role" },
          { key: "plainPassword", label: "Password" },
          { key: "createdDate", label: "Created Date" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={usersData} // Show only 5 rows as per Subscriber List
        totalItems={data?.total || 0}
        currentPage={page}
        onPageChange={setPage}
        rowsPerPage={limit}
        isSearching={isSearching}
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
        actionButtonText='Add New User'
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
          type={ENUM_MODULES.USER}
        />
      )}

      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.USER}
          status={"delete"}
        />
      )}
    </div>
  );
}
