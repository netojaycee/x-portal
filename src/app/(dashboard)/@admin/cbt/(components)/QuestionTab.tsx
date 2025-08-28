import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";
import { Search, Plus, Upload } from "lucide-react";

import BulkUploadForm from "./BulkUploadForm";
import AddQuestionForm from "./AddQuestionForm";
import SubjectClassCard from "./SubjectClassCard";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import { useGetSubjectQuery } from "@/redux/api";

export default function QuestionTab() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const { data: subjects } = useGetSubjectQuery({});

  console.log(debouncedSearch)

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-2'>
        <div className='relative w-64'>
          <Input
            placeholder='Search questions...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10 rounded-2xl'
          />
          <Search className='absolute top-1/2 left-3 w-5 h-5 transform -translate-y-1/2 text-gray-400' />
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='rounded-md flex items-center gap-2 border border-primary text-primary'
            onClick={() => setShowBulkUpload(true)}
          >
            <Upload className='h-4 w-4' />
            Bulk Upload Question
          </Button>

          <Button
            className='rounded-md flex items-center gap-2 bg-primary text-white'
            onClick={() => setShowAddQuestion(true)}
          >
            <Plus className='h-4 w-4' />
            Add Question
          </Button>
        </div>
      </div>

      <CustomModal
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        type={ENUM_MODULES.CBT}
        status='create'
        title='Create Bulk Questions'
        description='Select your excel file from your computer to upload it using that
          uploader provided for you below.'
      >
        <BulkUploadForm onClose={() => setShowBulkUpload(false)} />
      </CustomModal>

      <CustomModal
        size='lg'
        open={showAddQuestion}
        onOpenChange={setShowAddQuestion}
        type={ENUM_MODULES.CBT}
        status='create'
        title='Create Question'
        description='Create questions by filling in the details below. You can add multiple questions at once.'
      >
        <AddQuestionForm onClose={() => setShowAddQuestion(false)} />
      </CustomModal>

      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {subjects?.map((subject: any) => (
          <SubjectClassCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
