"use client";
import React, { useState } from "react";
import CustomTable from "@/app/(dashboard)/components/CustomTable";
import { rowsPerPageOptions } from "@/lib/utils";
import { useGetLogsQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

export default function ActivityLogPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0] || 10);

  

  const { data: logs, isLoading: isLoadingLogs } = useGetLogsQuery(
    {
      page,
      limit,
    },
  );
  if (isLoadingLogs) {
    return <LoaderComponent />;
  }

  const logsData = logs?.logs || [];
  return (
    
    <div className='p-4'>
      <CustomTable
        title='Activities'
        columns={[
          { key: "sn", label: "SN", sortable: true },
          { key: "action", label: "Activity", sortable: false },
          { key: "ipAddress", label: "IP Address" },
          { key: "date", label: "Date" },
          { key: "time", label: "Time" },
          { key: "device", label: "Device" },
          { key: "location", label: "Location" },
        ]}
        data={logsData} // Show only 5 rows as per Subscriber List
        totalItems={logs?.total || 0}
        currentPage={page}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        filters={{ showSearch: false, showFilter: false }}
        showActionButton={false}
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
      />
    </div>
  );
}



//     action: "update_subrole_permissions"
    // ​​​
    // device: null
    // ​​​
    // id: "fc873c1d-7f95-4517-89b9-6ca6330d1ed8"
    // ​​​
    // ipAddress: null
    // ​​​
    // isDeleted: false
    // ​​​
    // location: null
    // ​​​
    // meta: Object {  }
    // ​​​
    // school: Object { id: "370b8eec-40bc-4ef1-a1c9-6525370ebc08", name: "Riverside High School" }
    // ​​​
    // schoolId: "370b8eec-40bc-4ef1-a1c9-6525370ebc08"
    // ​​​
    // target: "SubRolePermission"
    // ​​​
    // targetId: "40c10f16-5126-490e-8528-de89aac58fc0"
    // ​​​
    // timestamp: "2025-05-21T00:35:09.272Z"