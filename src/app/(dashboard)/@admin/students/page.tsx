"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsTab from "./(components)/StudentsTab";
import ParentsTab from "./(components)/ParentsTab";
import ClassTab from "./(components)/ClassTab";
import { usePersistentTab } from "@/hooks/usePersistentTab";
import AlumniTab from "./(components)/AlumniTab";

export default function Students() {
  // const userData = useSelector((state: RootState) => state.user.user);
  const TAB_KEY = `students-page-tabs`;
  const tabOptions = ["classes", "students", "parents", "alumni"];
  const [activeTab, setActiveTab] = usePersistentTab(
    TAB_KEY,
    tabOptions,
    tabOptions[0]
  );

  return (
    <div className=''>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
          <ClassTab />
        </TabsContent>
        <TabsContent value='students'>
          <StudentsTab />
        </TabsContent>
        <TabsContent value='parents'>
          <ParentsTab />
        </TabsContent>
        <TabsContent value='alumni'>
          {" "}
          <AlumniTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
