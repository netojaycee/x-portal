"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import ClassTab from "./(components)/ClassTab";
import ClassArmTab from "./(components)/ClassArmTab";
import ClassCategoryTab from "./(components)/ClassCategoryTab";

export default function Classes() {
  return (
    <div>
      {" "}
      <div className='flex items-center space-x-0 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href={"/configuration"} className='text-primary'>
            Account Settings
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>Classes</p>
      </div>
      <div className=''>
        <Tabs defaultValue='category' className=''>
          <div className='w-full relative'>
            <div className='border-b-2 absolute bottom-0 w-full'></div>

            <TabsList className={`bg-transparent shadow-none space-x-5  `}>
              <TabsTrigger
                className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='category'
              >
                Class Category
              </TabsTrigger>
              <TabsTrigger
                className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='class'
              >
                Class Level
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='classarm'
              >
                Class Arm
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='category'>
            <ClassCategoryTab />
          </TabsContent>
          <TabsContent value='class'>
            <ClassTab />
          </TabsContent>
          <TabsContent value='classarm'>
            <ClassArmTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
