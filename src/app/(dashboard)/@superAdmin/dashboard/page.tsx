"use client";
import React from "react";
import { SubscriptionReport } from "./components/SubscriptionReport";
import CustomTable from "../../components/CustomTable";
import { subscribersData } from "@/lib/data";
import { Plus } from "lucide-react";
import StatsCard from "../../components/StatsCard";
// import LoaderComponent from "@/components/local/LoaderComponent";

export default function SuperAdminPage() {
  // const { data, isLoading } = useGetUsersQuery(
  //     {
  //       page,
  //       limit,
  //       q: debouncedSearchTerm,
  //       subRoleFlag: "student",
  //       schoolId: schoolId || null,
  //     },
  //     { skip: !schoolId }
  //   );
    // const [toggleActive] = useToggleSchoolActiveMutation();
  
    // if (isLoading) {
    //   return <LoaderComponent />;
    // }
    // console.log(data && data);
    // const studentsData = data?.users || [];
  return (
    <div className=''>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3'>
        <StatsCard
          title='Total Schools'
          number='400'
          image='/cap.svg'
          imagePosition='right'
          url='/schools'
        />

        <StatsCard
          title='Subscription'
          number='15'
          image='/sub.svg'
          imagePosition='right'
          url='/subscription'
        />
      </div>
      <SubscriptionReport />
      <CustomTable
        title='Subscriber List'
        columns={[
          { key: "sn", label: "SN", sortable: true },
          { key: "school", label: "School", sortable: true },
          { key: "email", label: "Email Address" },
          { key: "plan", label: "Plan" },
          { key: "startedDate", label: "Started Date" },
          { key: "date", label: "Due Date" },
          { key: "status", label: "Status" },
        ]}
        data={subscribersData.slice(0, 5)}
        totalItems={subscribersData?.length || 0}
        filters={{ showSearch: false, showFilter: false }}
        showActionButton={false}
        actionButtonText='Add Subscriber'
        actionButtonIcon={<Plus className='h-4 w-4' />}
        showRowsPerPage={false}
        pagination={false}
        showResultsInfo={false}
      />
    </div>
  );
}
