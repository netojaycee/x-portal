"use client";
import React from "react";
import { SubscriptionReport } from "./components/SubscriptionReport";
import CustomTable from "../../components/CustomTable";
import { subscribersData } from "@/lib/data";
import { Plus } from "lucide-react";
import StatsCard from "../../components/StatsCard";

export default function SuperAdminPage() {
  return (
    <div className=''>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
     
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
          { key: "dueDate", label: "Due Date" },
          { key: "status", label: "Status" },
        ]}
        data={subscribersData.slice(0, 5)}
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
