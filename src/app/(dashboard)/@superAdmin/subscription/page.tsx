"use client";

import { subscriptionsData } from "@/lib/data";
import { Plus } from "lucide-react";
import React from "react";
import CustomTable from "../../components/CustomTable";

export default function Subscription() {
  const handleEditSubscription = () => {
    // Trigger edit modal (handled in CustomTable)
  };

  const handleDeleteSubscription = () => {
    // Trigger delete confirmation modal (handled in CustomTable)
  };
  return (
    <div>
      {" "}
      <CustomTable
        title='Subscription Plans'
        columns={[
          { key: "sn", label: "SN", sortable: true },
          { key: "package", label: "Package", sortable: true },
          { key: "duration", label: "Duration" },
          { key: "studentLimit", label: "Student Limit" },
          { key: "subStatus", label: "Sub. Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={subscriptionsData}
        filters={{ showSearch: false, showFilter: false }}
        showActionButton={true}
        actionButtonText='Add New Plan'
        actionButtonIcon={<Plus className='h-4 w-4' />}
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        rowsPerPageOptions={[10, 50, 100, 200, 1000]}
        actionOptions={[
          {
            key: "subscription",
            label: "Edit",
            type: "edit",
            handler: handleEditSubscription,
          },
          {
            key: "subscription",
            label: "Delete",
            type: "confirmation",
            handler: handleDeleteSubscription,
          },
        ]}
      />
    </div>
  );
}
