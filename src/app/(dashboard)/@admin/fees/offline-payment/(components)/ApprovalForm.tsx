"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ApprovalFormProps {
  paymentId: string;
  onClose: () => void;
  onApprove: () => Promise<void>;
  isProcessing: boolean;
}

const ApprovalForm: React.FC<ApprovalFormProps> = ({
  onClose,
  onApprove,
  isProcessing,
}) => {
  return (
    <div className='p-6 space-y-4'>
      <p>Are you sure you want to approve this offline payment?</p>
      <div className='flex justify-end space-x-2'>
        <Button variant='outline' onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={onApprove}
          disabled={isProcessing}
          className='bg-green-600 hover:bg-green-700'
        >
          {isProcessing ? "Processing..." : "Approve"}
        </Button>
      </div>
    </div>
  );
};

export default ApprovalForm;
