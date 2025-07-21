import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LinkChildForm from "./LinkChildForm";

const LinkChildrenCard: React.FC<{parentId: string}> = ({parentId}) => {
  const [open, setOpen] = useState(false);
  // Get parentId from user state (assuming parent is logged in)


  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className='rounded-2xl bg-white shadow p-3 w-40 h-40 flex flex-col items-center justify-center cursor-pointer'
        onClick={() => setOpen(true)}
      >
        <div className='w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4'>
          <span className='text-2xl text-gray-400 font-light'>+</span>
        </div>
        <div className='text-xl font-semibold text-gray-400'>Link Children</div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-md w-full'>
          <DialogHeader>
            <DialogTitle>Link a Child</DialogTitle>
            <DialogDescription>
              Select a student and relationship to link as your child.
            </DialogDescription>
          </DialogHeader>
          {parentId && (
            <LinkChildForm
              parentId={parentId}
              onSuccess={handleSuccess}
              onCancel={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkChildrenCard;
