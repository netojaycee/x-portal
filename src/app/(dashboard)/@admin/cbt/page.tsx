"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersistentTab } from "@/hooks/usePersistentTab";
import React from "react";
import QuestionTab from "./(components)/QuestionTab";

export default function CBT() {
  const TAB_KEY = `fees-page-tabs`;
  const tabOptions = ["question", "exam", "results"];
  const [activeTab, setActiveTab] = usePersistentTab(
    TAB_KEY,
    tabOptions,
    tabOptions[0]
  );

  return (
    <div>
      {" "}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className='w-full relative'>
          <div className='border-b-2 absolute bottom-0 w-full'></div>

          <TabsList className={`bg-transparent shadow-none space-x-5  `}>
            <TabsTrigger
              className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='question'
            >
              Question Bank
            </TabsTrigger>
            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='exam'
            >
              Exam
            </TabsTrigger>
            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='results'
            >
              Results
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='question'>
          <QuestionTab />
        </TabsContent>
        <TabsContent value='exam'>exam</TabsContent>
        <TabsContent value='results'>results</TabsContent>
      </Tabs>
    </div>
  );
}
