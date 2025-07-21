"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatParentDetails,
  formatStudentDetails,
} from "@/lib/utils";

// type StudentDetail = {
//   label: string;
//   value: string | null | undefined;
//   className?: string;
// };

interface StudentBioProps {
  studentDetails: any;
}

export default function StudentBio({ studentDetails }: StudentBioProps) {
  if (!studentDetails) {
    return <div>No student data available</div>;
  }

  // Extract parent data if available
  const parentData = studentDetails.parentData || {};

  // console.log(parentData);

  // Build an array of student details from the API data
  const bioDetails = formatStudentDetails(studentDetails);

  // Parent information
  const parentDetails = formatParentDetails(studentDetails.parentData) || [];

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

      {Object.keys(parentData).length > 0 && (
        <Card>
          <CardContent className='pt-6'>
            <h3 className='text-lg font-semibold mb-4'>
              Parent/Guardian Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {parentDetails.map((detail, index) => (
                <div key={index} className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>
                    {detail.label}
                  </p>
                  <p className={`font-medium`}>
                    {detail.value || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {studentDetails.formerSchool && (
        <Card>
          <CardContent className='pt-6'>
            <h3 className='text-lg font-semibold mb-4'>
              Former School Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>School Name</p>
                <p className='font-medium'>
                  {studentDetails.formerSchool.name || "N/A"}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>School Address</p>
                <p className='font-medium'>
                  {studentDetails.formerSchool.address || "N/A"}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>School Contact</p>
                <p className='font-medium'>
                  {studentDetails.formerSchool.contact || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
