"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useGetAdmissionsQuery } from "@/redux/api";



export default function AcceptedAdmissionsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm] = useDebounce(search, 500);
  const router = useRouter();

   const { data, isLoading } = useGetAdmissionsQuery({
      page,
      limit,
      q: debouncedSearchTerm,
      status: "accepted",
    });
  
    if (isLoading) {
      return <LoaderComponent />;
    }
  
      const admissionsDataFromApi = data?.data || [];
      const totalItems = data?.total || admissionsDataFromApi.length;


console.log(admissionsDataFromApi);
  

  

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
          { key: "imageUrl", label: "Photo", sortable: false },
          { key: "fullname", label: "Name" },
          { key: "dateOfBirth", label: "Date of Birth" },
          { key: "gender", label: "Gender" },
          { key: "session", label: "Session" },
          { key: "assignedClass", label: "Admitted Class" },
          {
            key: "date",
            label: "Approved Date",
          },
          { key: "actions", label: "Actions" },
        ]}
        data={admissionsDataFromApi}
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
        showActionButton={false}
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        getActionOptions={getActionOptions}
      />
    </div>
  );
}
