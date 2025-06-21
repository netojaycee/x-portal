"use client";
import React from "react";
import { StudentProfileCard } from "../../(components)/StudentProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentBio from "../../(components)/StudentBio";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useGetUserByIdQuery } from "@/redux/api";

export default function Main({ id }: { id: string }) {
  const { data, isLoading } = useGetUserByIdQuery(id, { skip: !id });
  if (isLoading) return <LoaderComponent />;
  console.log(data);
  return (
    <div className='space-y-4'>
      <StudentProfileCard
        name={`${data?.firstname} ${data?.lastname}`}
        status={data?.isActive ? "Active" : "Inactive"}
        className={data?.class}
        arm={data?.classArm}
        role={data?.subRole}
        parent={`${data?.parent?.firstname} ${data?.parent?.lastname}`}
        avatarUrl={data?.avatar}
        onEdit={() => alert("Edit Clicked")}
        onDelete={() => alert("Delete Clicked")}
        onUpload={() => alert("Upload Clicked")}
      />

      <div className=''>
        <Tabs defaultValue='bio' className=''>
          <div className='w-full relative'>
            <div className='border-b-2 absolute bottom-0 w-full'></div>

            <TabsList className={`bg-transparent shadow-none space-x-5  `}>
              <TabsTrigger
                className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='bio'
              >
                Bio
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='fees'
              >
                Fees
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='payment'
              >
                Payment History
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='result'
              >
                {" "}
                Result
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='bio'>
            <StudentBio studentDetails={data} />{" "}
          </TabsContent>
          <TabsContent value='fees'>
            <div>Fees Information</div>
          </TabsContent>
          <TabsContent value='payment'>
            <div>Payment History</div>
          </TabsContent>
          <TabsContent value='result'>
            <div>Result</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
