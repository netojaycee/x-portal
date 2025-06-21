"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import ApplicationList from "./(components)/ApplicationList";
import AcceptedAdmissionsList from "./(components)/AcceptedAdmissionsList";
import RejectedAdmissionsList from "./(components)/RejectedAdmissionsList";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Check, Share2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { Badge } from "@/components/ui/badge";

export default function Admissions() {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.user);
  const [copied, setCopied] = useState(false);

  // Generate the admission form link using the school ID as slug
  const schoolSlug = userData?.schoolSlug || "unknown-school";
  const admissionLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/admissions/school/${schoolSlug}`
      : `/admissions/school/${schoolSlug}`;

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(admissionLink);
      setCopied(true);
      toast.success("Admission link copied to clipboard!");

      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  // Handle share functionality (if supported)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "School Admission Form",
          text: "Apply for admission to our school",
          url: admissionLink,
        });
      } catch (error) {
        console.error("Failed to share:", error);
        // Fallback to copy
        handleCopyLink();
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  return (
    <TooltipProvider>
      <div>
        {/* Header Section with improved layout */}
        <div className='bg-gradient-to-r from-[#E1E8F8] to-[#F0F4FE] rounded-xl p-6 mb-6 shadow-sm border border-blue-100'>
          <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4'>
            {/* Title Section */}
            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Admissions
              </h1>
              <p className='text-gray-600 text-sm'>
                Manage student applications and share your admission form link with prospective students
              </p>
            </div>

            {/* Action Section */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              {/* Share Admission Link Component */}
              <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4 min-w-[280px]'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs text-gray-500 uppercase font-semibold tracking-wider'>
                    🔗 Admission Link{" "}
                    {/* <Badge variant='secondary' className='text-xs'>
                      Public
                    </Badge> */}
                  </span>
                  <Button
                    onClick={() => router.push("/admissions/create-admission")}
                    className='bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-3 h-auto'
                    size='sm'
                  >
                    <Plus className='h-5 w-5 mr-2' />
                    Add New Student
                  </Button>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='flex-1 bg-gray-50 rounded-md px-3 py-2 border'>
                    <code className='text-xs text-gray-700 font-mono'>
                  {admissionLink}
                    </code>
                  </div>

                  <div className='flex items-center gap-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleCopyLink}
                          variant='outline'
                          size='sm'
                          className={`h-9 w-9 p-0 transition-all duration-200 ${
                            copied
                              ? "bg-green-50 border-green-200 hover:bg-green-100"
                              : "hover:bg-blue-50 hover:border-blue-200"
                          }`}
                        >
                          {copied ? (
                            <Check className='h-4 w-4 text-green-600' />
                          ) : (
                            <Copy className='h-4 w-4 text-gray-600' />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copied ? "Copied!" : "Copy link"}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleShare}
                          variant='outline'
                          size='sm'
                          className='h-9 w-9 p-0 hover:bg-blue-50 hover:border-blue-200'
                        >
                          <Share2 className='h-4 w-4 text-gray-600' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share link</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => window.open(admissionLink, "_blank")}
                          variant='outline'
                          size='sm'
                          className='h-9 w-9 p-0 hover:bg-blue-50 hover:border-blue-200'
                        >
                          <ExternalLink className='h-4 w-4 text-gray-600' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open in new tab</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Add New Student Button */}
              {/* <Button
                onClick={() => router.push("/admissions/create-admission")}
                className='bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-3 h-auto'
                size='lg'
              >
                <Plus className='h-5 w-5 mr-2' />
                Add New Student
              </Button> */}
            </div>
          </div>
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
    </TooltipProvider>
  );
}
