import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLinkParentStudentMutation } from "@/redux/api";
import { toast } from "sonner";

type LinkedChildrenCardProps = {
  id: string;
  image: string;
  name: string;
  className: string;
  classArm: string;
  parentId: string;
};

const LinkedChildrenCard: React.FC<LinkedChildrenCardProps> = ({
  id,
  image,
  name,
  className,
  classArm,
  parentId,
}) => {
  const [open, setOpen] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [linkParentStudent] = useLinkParentStudentMutation();

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  const handleConfirm = async () => {
    try {
      setUnlinking(true);
      // Call the mutation with unlink flag
      const data = {
        parentId,
        studentId: id,
        unlink: true,
      };
      await linkParentStudent(data).unwrap();
      toast.success("Student unlinked successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to unlink student. Please try again."
      );
    } finally {
      setUnlinking(false);
    }
  };

  return (
    <>
      <div className='rounded-2xl bg-white shadow p-3 relative w-40 h-40 flex flex-col items-center justify-center'>
        <button
          className='absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200'
          onClick={handleRemoveClick}
          aria-label='Remove'
        >
          <span className='text-xl font-bold text-gray-400'>×</span>
        </button>
        <div className='w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center mb-4 overflow-hidden'>
          {image ? (
            <Image src={image} alt={name} width={80} height={80} />
          ) : (
            // fallback svg icon as in your sample
            <svg width='56' height='56' viewBox='0 0 56 56' fill='none'>
              <circle
                cx='28'
                cy='28'
                r='28'
                fill='none'
                stroke='#BABABA'
                strokeWidth='2'
              />
              <path
                d='M28 34c-6 0-12 3-12 6v2h24v-2c0-3-6-6-12-6z'
                stroke='#BABABA'
                strokeWidth='2'
              />
              <circle cx='28' cy='22' r='6' stroke='#BABABA' strokeWidth='2' />
            </svg>
          )}
        </div>
        <div className='text-base font-semibold text-gray-900'>{name}</div>
        <div className='text-gray-500'>
          {className}. {classArm}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-md w-full'>
          <DialogHeader>
            <DialogTitle>Unlink Child</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlink <b>{name}</b>?
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-end gap-2 mt-4'>
            <Button
              variant='outline'
              onClick={handleCloseModal}
              disabled={unlinking}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleConfirm}
              disabled={unlinking}
            >
              {unlinking ? "Unlinking..." : "Unlink"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkedChildrenCard;
