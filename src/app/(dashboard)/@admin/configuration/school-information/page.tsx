"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import SchoolInfoForm from "../(components)/SchoolInfoForm";
import SchoolStaffForm from "../(components)/SchoolStaffForm";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useGetSchoolConfigurationQuery } from "@/redux/api";

export default function SchoolInformation() {
  const {data, isLoading} = useGetSchoolConfigurationQuery({})

  const configuration = data && data?.school ||[];
  console.log(configuration && configuration, "congif");

  if(isLoading) {
    return <LoaderComponent />
  }
  return (
    <div>
        {/* back button with role name */}
        <div className='flex items-center space-x-0 text-sm mb-3'>
          <span className='cursor-pointer flex items-center'>
            <ChevronLeft className='h-4 w-4 text-primary' />
            <Link href={"/configuration"} className='text-primary'>
              Account Settings
            </Link>
          </span>
          <span>/</span>
          <p className='text-gray-500'>School Information</p>
        </div>
        <div className=''>
          <Tabs defaultValue='school' className=''>
            <div className='w-full relative'>
              <div className='border-b-2 absolute bottom-0 w-full'></div>

              <TabsList className={`bg-transparent shadow-none space-x-5  `}>
                <TabsTrigger
                  className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                  value='school'
                >
                  School Information{" "}
                </TabsTrigger>
                <TabsTrigger
                  className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                  value='management'
                >
                  Management Information{" "}
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value='school'><SchoolInfoForm data={configuration} /></TabsContent>
            <TabsContent value='management'>
              <SchoolStaffForm data={configuration} />
            </TabsContent>
          </Tabs>
        </div>

    </div>
  );
}
