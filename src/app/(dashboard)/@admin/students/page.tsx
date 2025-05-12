"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "../../components/StatsCard";
import { Plus } from "lucide-react";
import { parentsData, studentsData } from "@/lib/data";
import CustomTable from "../../components/CustomTable";
import { Parent, Student } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Students() {
  const router = useRouter();

  const handleEditStudent = () => {
    // Trigger delete confirmation modal (handled in CustomTable)
  };

  const handleViewStudent = (row: Student) => {
    router.push(`/students/${row.name}`);
  };

  const handleEditParent = () => {
    // Trigger delete confirmation modal (handled in CustomTable)
  };

  const handleViewParent = (row: Parent) => {
    router.push(`/students/${row.name}`);
  };

  // const handleLinkStudent = () => {
  //   // Trigger delete confirmation modal (handled in CustomTable)
  // };

  return (
    <div className=''>
      <Tabs defaultValue='classes' className=''>
        <div className='w-full relative'>
          <div className='border-b-2 absolute bottom-0 w-full'></div>

          <TabsList className={`bg-transparent shadow-none space-x-5  `}>
            <TabsTrigger
              className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='classes'
            >
              Classes
            </TabsTrigger>
            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='students'
            >
              All Students
            </TabsTrigger>
            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='parents'
            >
              Parent/Guardian
            </TabsTrigger>
            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='alumni'
            >
              {" "}
              Alumni
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='classes'>
          Make changes to your account here.
        </TabsContent>
        <TabsContent value='students'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <StatsCard
                title='Total Students'
                number='400'
                image='/student-group.png'
                imagePosition='left'
                male='250'
                female='150'
                // url='/details'
              />
            </div>
            <CustomTable
              title='Students List'
              columns={[
                { key: "sn", label: "SN", sortable: true },
                { key: "name", label: "Name", sortable: true },
                { key: "gender", label: "Gender" },
                { key: "class", label: "Class" },
                { key: "arms", label: "Arms" },
                { key: "parentGuardian", label: "Parent/Guardian" },
                { key: "createdDate", label: "Created Date" },
                { key: "status", label: "Status" },
                { key: "actions", label: "Actions" },
              ]}
              data={studentsData} // Show only 5 rows as per Subscriber List
              filters={{ showSearch: true, showFilter: true }}
              showActionButton={true}
              actionButtonText='Add Student'
              actionButtonIcon={<Plus className='h-4 w-4' />}
              showRowsPerPage={true}
              pagination={true}
              showResultsInfo={true}
              actionOptions={[
                {
                  key: "student",

                  label: "View",
                  type: "custom",
                  handler: handleViewStudent,
                },
                {
                  key: "student",

                  label: "Edit",
                  type: "edit",
                  handler: handleEditStudent,
                },
              ]}
            />
          </div>
        </TabsContent>
        <TabsContent value='parents'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <StatsCard
                title='Total Students'
                number='400'
                image='/student-group.png'
                imagePosition='left'
                male='250'
                female='150'
                // url='/details'
              />
            </div>
            <CustomTable
              title='Students List'
              columns={[
                { key: "sn", label: "SN", sortable: true },
                { key: "name", label: "Name", sortable: true },
                { key: "emailAddress", label: "Email Address" },
                { key: "contact", label: "Contact" },
                { key: "occupation", label: "Occupation" },
                { key: "createdDate", label: "Created Date" },
                {
                  key: "status",
                  label: "Status",
                  // render: (row: Parent) => (
                  //   <span
                  //     className={`px-2 py-1 rounded-sm text-xs font-medium ${
                  //       row.status === "Linked"
                  //         ? "bg-green-100 text-green-800"
                  //         : "bg-red-100 text-red-800"
                  //     }`}
                  //   >
                  //     {row.status}
                  //   </span>
                  // ),
                },
                { key: "actions", label: "Actions" },
              ]}
              data={parentsData} // Show only 5 rows as per Subscriber List
              filters={{ showSearch: true, showFilter: true }}
              showActionButton={true}
              actionButtonText='Add Parent'
              actionButtonIcon={<Plus className='h-4 w-4' />}
              showRowsPerPage={true}
              pagination={true}
              showResultsInfo={true}
              actionOptions={[
                {
                  key: "parent",

                  label: "View",
                  type: "custom",
                  handler: handleViewParent,
                },
                {
                  key: "parent",

                  label: "Edit",
                  type: "edit",
                  handler: handleEditParent,
                },
              ]}
            />
          </div>
        </TabsContent>
        <TabsContent value='alumni'>Alumni</TabsContent>
      </Tabs>
    </div>
  );
}
