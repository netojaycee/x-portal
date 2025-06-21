"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import CATab from "./(components)/CATab";
import TerminalTab from "./(components)/TerminalTab";
import { ResultSubmissionForm } from "./(components)/ResultSubmissionForm";
import { ViewAnalyticsForm } from "./(components)/ViewAnalyticsForm";
import { ViewTranscriptForm } from "./(components)/ViewTranscriptForm";
import { PromoteStudentsForm } from "./(components)/PromoteStudentsForm";

export default function Results() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  const handleSubmitSuccess = () => {
    // You can add any additional logic here after successful result computation
    // For example, refresh the results data, show a success message, etc.
  };

  return (
    <div>
      <h1 className='text-2xl font-bold font-lato'>All Results</h1>
      <div className='grid grid-cols-4 gap-2'>
        <Button 
          variant={"outline"} 
          size={"sm"} 
          className=' text-sm'
          onClick={() => setIsAnalyticsModalOpen(true)}
        >
          View Analytics{" "}
        </Button>
        <Button 
          variant={"outline"} 
          size={"sm"} 
          className=' text-sm'
          onClick={() => setIsTranscriptModalOpen(true)}
        >
          View Transcript{" "}
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className=' text-sm'
          onClick={() => setIsSubmitModalOpen(true)}
        >
          Submit Result
        </Button>
        <Button 
          variant={"outline"} 
          size={"sm"} 
          className=' text-sm'
          onClick={() => setIsPromoteModalOpen(true)}
        >
          Promote Students
        </Button>
      </div>

      <div className='mt-4'>
        <Tabs defaultValue='ca' className=''>
          <div className='w-full relative'>
            <div className='border-b-2 absolute bottom-0 w-full'></div>

            <TabsList className={`bg-transparent shadow-none space-x-5  `}>
              <TabsTrigger
                className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='ca'
              >
                CA Results{" "}
              </TabsTrigger>
              <TabsTrigger
                className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
                value='terminal'
              >
                Terminal Results
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='ca'>
            <CATab />{" "}
          </TabsContent>
          <TabsContent value='terminal'>
            <TerminalTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Submit Result Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Submit Result for Computation</DialogTitle>
            <DialogDescription>
              Select the academic session, term, class, class arm, and marking
              scheme to compute student results.
            </DialogDescription>
          </DialogHeader>

          <ResultSubmissionForm
            onClose={() => setIsSubmitModalOpen(false)}
            onSuccess={handleSubmitSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* View Analytics Modal */}
      <Dialog open={isAnalyticsModalOpen} onOpenChange={setIsAnalyticsModalOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>View Analytics</DialogTitle>
            <DialogDescription>
              Select the academic session, term, class, class arm, and marking
              scheme component to view analytics.
            </DialogDescription>
          </DialogHeader>

          <ViewAnalyticsForm
            onClose={() => setIsAnalyticsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Transcript Modal */}
      <Dialog open={isTranscriptModalOpen} onOpenChange={setIsTranscriptModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>View Student Transcript</DialogTitle>
            <DialogDescription>
              Enter the student&apos;s name or registration number and select a category
              to view their transcript.
            </DialogDescription>
          </DialogHeader>

          <ViewTranscriptForm
            onClose={() => setIsTranscriptModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Promote Students Modal */}
      <Dialog open={isPromoteModalOpen} onOpenChange={setIsPromoteModalOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Promote Students</DialogTitle>
            <DialogDescription>
              Select the academic session, class, and class arm to promote
              students to the next level.
            </DialogDescription>
          </DialogHeader>

          <PromoteStudentsForm
            onClose={() => setIsPromoteModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
