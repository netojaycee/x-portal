"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
// import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import LoaderComponent from "@/components/local/LoaderComponent";

// Sample data for accepted admissions
const acceptedAdmissionsData = [
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
    status: "approved",
    approvedDate: "2023-05-15T10:30:00.000Z",
    approvedBy: "John Doe",
  },
  {
    id: "2",
    photo: "/avatar.png",
    firstname: "Sarah",
    lastname: "Johnson",
    dateOfBirth: "03/15/2010",
    gender: "F",
    session: "2023/2024",
    currentClass: "Basic 6",
    appliedClass: "Basic 7",
    status: "approved",
    approvedDate: "2023-05-16T11:20:00.000Z",
    approvedBy: "Jane Smith",
  },
  {
    id: "3",
    photo: "/avatar.png",
    firstname: "Michael",
    lastname: "Brown",
    dateOfBirth: "07/22/2009",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 8",
    appliedClass: "Basic 9",
    status: "approved",
    approvedDate: "2023-05-14T09:45:00.000Z",
    approvedBy: "Robert Wilson",
  },
  {
    id: "4",
    photo: "/avatar.png",
    firstname: "Blessing",
    lastname: "Okonkwo",
    dateOfBirth: "11/05/2011",
    gender: "F",
    session: "2023/2024",
    currentClass: "Basic 5",
    appliedClass: "Basic 6",
    status: "approved",
    approvedDate: "2023-05-17T14:15:00.000Z",
    approvedBy: "Mary Johnson",
  },
  {
    id: "5",
    photo: "/avatar.png",
    firstname: "David",
    lastname: "Olawale",
    dateOfBirth: "09/30/2010",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 7",
    appliedClass: "Basic 8",
    status: "approved",
    approvedDate: "2023-05-18T10:00:00.000Z",
    approvedBy: "Samuel Adams",
  },
];

export default function AcceptedAdmissionsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
//   const [debouncedSearchTerm] = useDebounce(search, 500);
  const router = useRouter();

  // This would be replaced with an actual RTK query in production
  const isLoading = false;
  const data = {
    admissions: acceptedAdmissionsData,
    total: acceptedAdmissionsData.length,
  };

  // Uncomment and modify this section when connecting to actual API
  // const { data, isLoading } = useGetAdmissionsQuery({
  //   page,
  //   limit,
  //   q: debouncedSearchTerm,
  //   status: "approved"
  // });

  if (isLoading) {
    return <LoaderComponent />;
  }

  

  

  const getActionOptions = (admission: any) => {
    const otherOptions = [
      {
        key: "admission",
        label: "View Details",
        type: "custom" as const,
        handler: () => handleViewAdmission(admission),
      },
      {
        key: "admission",
        label: "Download",
        type: "custom" as const,
        handler: () => handleDownload(admission),
      },
    //   {
    //     key: "admission",
    //     label: "Enroll Student",
    //     type: "custom" as const,
    //     handler: () => openModal("enroll", admission),
    //   },
    ];

    return [...otherOptions];
  };

  const handleViewAdmission = (row: any) => {
    router.push(`/admissions/${row.id}`);
  };

  const handleDownload = (row: any) => {
    // Implement download functionality in the future
    console.log("Download admission details for:", row.id);
  };



  return (
    <div className='space-y-4'>
      <CustomTable
        title='Accepted Admissions'
        columns={[
          { key: "sn", label: "SN", sortable: false },
          { key: "photo", label: "Photo", sortable: false },
          { key: "fullname", label: "Name" },
          { key: "dateOfBirth", label: "Date of Birth" },
          { key: "gender", label: "Gender" },
          { key: "session", label: "Session" },
          { key: "appliedClass", label: "Admitted Class" },
          {
            key: "approvedDate",
            label: "Approved Date",
          },
          { key: "actions", label: "Actions" },
        ]}
        data={data.admissions}
        totalItems={data.total || 0}
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

    
    </div>
  );
}
