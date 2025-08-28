import React from "react";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { Plus, Percent } from "lucide-react";
// import { Button } from "@/components/ui/button";

export interface FeesHeaderCardProps {
  sessions: { id: string; label: string }[];
  selectedSessionId: string;
  onSessionChange: (sessionId: string) => void;
  onInvoiceClick?: () => void;
  onDiscountClick?: () => void;
}

export default function FeesHeaderCard({
  // sessions,
  // selectedSessionId,
  // onSessionChange,
  // onInvoiceClick,
  // onDiscountClick,
}: FeesHeaderCardProps) {
  return (
    <div className='w-full rounded-[18px] bg-[#E9EEF8] flex items-center px-12 py-8 justify-between'>
      {/* Left */}
      <div>
        <div className='text-[2rem] font-bold text-[#4A6CF7]'>Fees</div>
        {/* <div className='mt-2'>
          <Select value={selectedSessionId} onValueChange={onSessionChange}>
            <SelectTrigger className='w-[200px] bg-[#E9EEF8] border-gray-400 border text-[#B2B2B2] text-base font-medium shadow-none hover:bg-[#E9EEF8] focus:bg-[#E9EEF8] focus:ring-0'>
              <SelectValue placeholder='Select session' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {sessions.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </div>
      {/* Right: Invoice and Discount buttons */}
      <div className='flex flex-col items-end gap-3'>
        {/* <div className='flex gap-3'>
          <Button onClick={onInvoiceClick} variant='default'>
            <Plus className='w-4 h-4' />
            Invoice
          </Button>
          <Button
            onClick={onDiscountClick}
            variant='outline'
            className='border-[#4A6CF7] text-[#4A6CF7] hover:bg-[#4A6CF7] hover:text-white'
          >
            <Percent className='w-4 h-4' />
            Discount
          </Button>
        </div> */}
      </div>
    </div>
  );
}
