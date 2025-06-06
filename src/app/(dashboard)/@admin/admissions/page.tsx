"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ApplicationList from "./(components)/ApplicationList";
import AcceptedAdmissionsList from "./(components)/AcceptedAdmissionsList";
import RejectedAdmissionsList from "./(components)/RejectedAdmissionsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Admissions() {
  const router = useRouter();
  return (
    <div>
      <div className='flex justify-between items-center bg-[#E1E8F8] rounded-md p-5 h-20'>
        <div className=''>
          {" "}
          <h2 className='text-2xl font-bold text-gray-800'>Admission</h2>
          {/* <p className=''>
                  Click the text link below to input scores of your choice or use the
                  button
                </p> */}
        </div>

        <Button
          onClick={() => router.push("/admissions/create-admission")} // Empty session for create mode
          className='bg-primary text-white'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add New Student
        </Button>
      </div>
      <div className=''>
        <Tabs defaultValue='application' className=''>
          <div className='w-full relative'>
            <div className='border-b-2 absolute bottom-0 w-full'></div>

            <TabsList className={`bg-transparent shadow-none space-x-5  `}>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='application'
              >
                Application List{" "}
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='admission'
              >
                Admission List{" "}
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='rejected'
              >
                {" "}
                Rejected List{" "}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='application'>
            <ApplicationList />
          </TabsContent>
          <TabsContent value='admission'>
            <AcceptedAdmissionsList />
          </TabsContent>
          <TabsContent value='rejected'>
            <RejectedAdmissionsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
