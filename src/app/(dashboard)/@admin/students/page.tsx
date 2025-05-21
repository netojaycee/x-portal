"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsTab from "./(components)/StudentsTab";
import ParentsTab from "./(components)/ParentsTab";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Students() {
  const userData = useSelector((state: RootState) => state.user.user);


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
          <StudentsTab schoolId={userData?.schoolId || null} />
        </TabsContent>
        <TabsContent value='parents'>
          <ParentsTab schoolId={userData?.schoolId || null} />
        </TabsContent>
        <TabsContent value='alumni'>Alumni</TabsContent>
      </Tabs>
    </div>
  );
}
