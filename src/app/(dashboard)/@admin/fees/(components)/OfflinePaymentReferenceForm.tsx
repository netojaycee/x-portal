"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface OfflinePaymentReferenceFormProps {
  onClose: () => void;
}

const OfflinePaymentReferenceForm: React.FC<
  OfflinePaymentReferenceFormProps
> = ({ onClose }) => {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reference.trim()) {
      alert("Please enter an invoice reference");
      return;
    }

    setIsLoading(true);

    try {
      // Navigate to the offline payment form with the reference
      router.push(
        `/fees/offline-payment/create/${encodeURIComponent(reference)}`
      );
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='reference'>Invoice Reference</Label>
        <Input
          id='reference'
          type='text'
          placeholder='Enter invoice reference (e.g., INV-001)'
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className='w-full'
          required
        />
        <p className='text-sm text-gray-500'>
          Enter the reference number of the invoice for which you want to record
          an offline payment.
        </p>
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default OfflinePaymentReferenceForm;
