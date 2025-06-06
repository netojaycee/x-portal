"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
import { useRouter } from "next/navigation";
import LoaderComponent from "@/components/local/LoaderComponent";

// Sample data for rejected admissions
const rejectedAdmissionsData = [
  {
    id: "1",
    photo: "/avatar.png",
    firstname: "James",
    lastname: "Wilson",
    dateOfBirth: "05/12/2011",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 7",
    appliedClass: "Basic 8",
    status: "rejected",
    rejectedDate: "2023-06-05T10:30:00.000Z",
    rejectedBy: "Emma Brown",
    rejectionReason: "Incomplete documentation",
  },
  {
    id: "2",
    photo: "/avatar.png",
    firstname: "Amina",
    lastname: "Ibrahim",
    dateOfBirth: "08/22/2010",
    gender: "F",
    session: "2023/2024",
    currentClass: "Basic 5",
    appliedClass: "Basic 6",
    status: "rejected",
    rejectedDate: "2023-06-04T14:20:00.000Z",
    rejectedBy: "Samuel Johnson",
    rejectionReason: "Failed entrance examination",
  },
  {
    id: "3",
    photo: "/avatar.png",
    firstname: "Daniel",
    lastname: "Okafor",
    dateOfBirth: "11/15/2009",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 8",
    appliedClass: "Basic 9",
    status: "rejected",
    rejectedDate: "2023-06-03T09:15:00.000Z",
    rejectedBy: "Sarah Williams",
    rejectionReason: "Behavior issues in previous school",
  },
  {
    id: "4",
    photo: "/avatar.png",
    firstname: "Fatima",
    lastname: "Mohammed",
    dateOfBirth: "02/28/2011",
    gender: "F",
    session: "2023/2024",
    currentClass: "Basic 6",
    appliedClass: "Basic 7",
    status: "rejected",
    rejectedDate: "2023-06-02T11:45:00.000Z",
    rejectedBy: "Michael Adams",
    rejectionReason: "Application submitted after deadline",
  },
  {
    id: "5",
    photo: "/avatar.png",
    firstname: "Chidi",
    lastname: "Nnamdi",
    dateOfBirth: "07/19/2010",
    gender: "M",
    session: "2023/2024",
    currentClass: "Basic 7",
    appliedClass: "Basic 8",
    status: "rejected",
    rejectedDate: "2023-06-01T13:30:00.000Z",
    rejectedBy: "Jessica Smith",
    rejectionReason: "Class capacity reached",
  },
];

export default function RejectedAdmissionsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
//   const [debouncedSearchTerm] = useDebounce(search, 500);
  const router = useRouter();

  // This would be replaced with an actual RTK query in production
  const isLoading = false;
  const data = {
    admissions: rejectedAdmissionsData,
    total: rejectedAdmissionsData.length,
  };

  // Uncomment and modify this section when connecting to actual API
  // const { data, isLoading } = useGetAdmissionsQuery({
  //   page,
  //   limit,
  //   q: debouncedSearchTerm,
  //   status: "rejected"
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
    //     label: "Reconsider",
    //     type: "custom" as const,
    //     handler: () => openModal("reconsider", admission),
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
        title='Rejected Admissions'
        columns={[
          { key: "sn", label: "SN", sortable: false },
          { key: "photo", label: "Photo", sortable: false },
          { key: "fullname", label: "Name" },
          { key: "dateOfBirth", label: "Date of Birth" },
          { key: "gender", label: "Gender" },
          { key: "session", label: "Session" },
          { key: "appliedClass", label: "Applied Class" },
          {
            key: "rejectedDate",
            label: "Rejected Date",
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
