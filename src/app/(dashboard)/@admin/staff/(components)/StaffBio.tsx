"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatStaffDetails,
} from "@/lib/utils";

// type StudentDetail = {
//   label: string;
//   value: string | null | undefined;
//   className?: string;
// };

interface StaffBioProps {
  staffDetails: any;
}

export default function StaffBio({ staffDetails }: StaffBioProps) {
  if (!staffDetails) {
    return <div>No staff data available</div>;
  }


  const bioDetails = formatStaffDetails(staffDetails);


  return (
    <div className='space-y-6 mt-6'>
      <Card>
        <CardContent className='pt-6'>
          <h3 className='text-lg font-semibold mb-4'>Student Information</h3>

          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {bioDetails.map((detail, index) => (
              <div key={index} className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{detail.label}</p>
                <p className={`font-medium ${detail.className || ""}`}>
                  {detail.value || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
