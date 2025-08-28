"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import AddQuestionForm from "./AddQuestionForm";

interface ClassCardProps {
  subject: {
    id: string;
    name: string;
  };
  class_: {
    id: string;
    name: string;
  };
}

const ClassCard: React.FC<ClassCardProps> = ({ subject, class_ }) => {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleView = () => {
    router.push(`/cbt/subjects/${subject.id}/classes/${class_.id}`);
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleDelete = () => {
    setShowDelete(true);
  };

  return (
    <>
      <div className='p-4 bg-white rounded-lg border shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>{class_.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={handleView}>
                <Eye className='mr-2 h-4 w-4' /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit2 className='mr-2 h-4 w-4' /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
                <Trash2 className='mr-2 h-4 w-4' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className='text-sm text-gray-500'>{subject.name}</p>
        <div className='mt-4 flex justify-end'>
          <Button variant='outline' size='sm' onClick={handleView}>
            View Questions
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <CustomModal
        size='xl'
        open={showEdit}
        onOpenChange={setShowEdit}
        type={ENUM_MODULES.CBT}
        status='edit'
        title={`Edit Questions - ${subject.name} (${class_.name})`}
        description='Edit the questions for this class.'
      >
        <AddQuestionForm
          onClose={() => setShowEdit(false)}
          initialData={{
            id: `${subject.id}-${class_.id}`,
            classId: class_.id,
            subjectId: subject.id,
            questions: [], // You'll need to fetch the actual questions here
          }}
        />
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={showDelete}
        onOpenChange={setShowDelete}
        type={ENUM_MODULES.CBT}
        status='delete'
        title={`Delete Questions - ${subject.name} (${class_.name})`}
        description='Are you sure you want to delete all questions for this class? This action cannot be undone.'
      >
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              // Handle delete logic here
              setShowDelete(false);
            }}
          >
            Delete
          </Button>
        </div>
      </CustomModal>
    </>
  );
};

export default ClassCard;
