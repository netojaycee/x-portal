"use client";
import React from "react";
import CustomTable from "../../components/CustomTable";
// import { schoolsData } from "@/lib/data";
import { Plus } from "lucide-react";
import { useGetSchoolsQuery } from "@/redux/api";
import Loader from "@/app/loading";

export default function Schools() {
  const { data, isLoading } = useGetSchoolsQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return <Loader />;
  }

  const schoolsData = data?.schools || [];
  // const total = data?.total || 0;

  const handleActivateSchool = () => {
    // Trigger activate confirmation modal (handled in CustomTable)
  };

  const handleDeactivateSchool = () => {
    // Trigger deactivate confirmation modal (handled in CustomTable)
  };

  const handleAssignPermission = () => {
    // Trigger assign permission modal (handled in CustomTable)
  };

  const handleEditSchool = () => {
    // Trigger edit modal (handled in CustomTable)
  };

  const handleDeleteSchool = () => {
    // Trigger delete confirmation modal (handled in CustomTable)
  };
  return (
    <div>
      <CustomTable
        title='Schools List'
        columns={[
          { key: "sn", label: "SN", sortable: true },
          { key: "name", label: "School Name", sortable: true },
          { key: "email", label: "Email Address" },
          { key: "contact", label: "Contact" },
          { key: "subPlan", label: "Sub. Plan" },
          { key: "dueDate", label: "Due Date" },
          { key: "subStatus", label: "Sub. Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={schoolsData}
        filters={{ showSearch: true, showFilter: true }}
        showActionButton={true}
        actionButtonText='Add New School'
        showRowsPerPage={true}
        pagination={true}
        showResultsInfo={true}
        actionButtonIcon={<Plus className='h-4 w-4' />}
        actionOptions={[
          {
            key: "school",

            label: "Activate",
            type: "confirmation",
            handler: handleActivateSchool,
          },
          {
            key: "school",

            label: "Deactivate",
            type: "confirmation",
            handler: handleDeactivateSchool,
          },
          {
            key: "school",

            label: "Assign Permission",
            type: "custom",
            handler: handleAssignPermission,
          },
          {
            key: "school",
            label: "Edit",
            type: "edit",
            handler: handleEditSchool,
          },
          {
            key: "school",
            label: "Delete",
            type: "confirmation",
            handler: handleDeleteSchool,
          },
        ]}
      />
    </div>
  );
}
