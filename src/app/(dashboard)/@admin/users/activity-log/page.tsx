"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { useGetUsersQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ActivityLogPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm] = useDebounce(search, 500);
  const userData = useSelector((state: RootState) => state.user.user);
  const schoolId = userData?.schoolId || null;

  // Pass them into your RTK hook
  const { data, isLoading } = useGetUsersQuery(
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
  return (
    <div className='p-4'>
      <CustomTable
        title='Activities'
        columns={[
          // { key: "sn", label: "SN", sortable: true },
          { key: "activity", label: "Activity", sortable: true },
          { key: "ip", label: "IP Address" },
          { key: "date", label: "Date" },
          { key: "time", label: "Time" },
          { key: "device", label: "Device" },
          { key: "location", label: "Location" },
        ]}
        data={usersData} // Show only 5 rows as per Subscriber List
        totalItems={data?.total || 0}
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
      />
    </div>
  );
}
