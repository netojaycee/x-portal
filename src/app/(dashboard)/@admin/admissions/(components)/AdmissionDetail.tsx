"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetAdmissionByIdQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

interface AdmissionDetailProps {
  id: string;
}

// This would be replaced with your actual API call
// const useGetAdmissionByIdQuery = (id: string) => {
//   // Mocked data for demonstration
//   return {
//     data: {
//       id,
//       status: "pending", // Can be 'pending', 'approved', 'rejected'
//       rejectionReason: "Documents incomplete", // Only available if status is 'rejected'
//       student: {
//         firstname: "John",
//         lastname: "Doe",
//         email: "john.doe@example.com",
//         gender: "male",
//         dateOfBirth: "2010-05-15T00:00:00.000Z",
//         sessionId: "session123",
//         sessionName: "2023/2024",
//         presentClassId: "class123",
//         presentClassName: "JSS 2",
//         classApplyingForId: "class234",
//         classApplyingForName: "JSS 3",
//         homeAddress: "123 Main St, City",
//         contact: "08012345678",
//         religion: "Christianity",
//         nationality: "Nigerian",
//         stateOfOrigin: "Lagos",
//         lga: "Eti-Osa",
//         imageUrl: "/avatar.png", // URL to student image
//       },
//       guardian: {
//         lastName: "Doe",
//         firstName: "Jane",
//         otherName: "Mary",
//         address: "123 Main St, City",
//         tel: "08023456789",
//         email: "jane.doe@example.com",
//         relationship: "mother",
//       },
//       formerSchool: {
//         name: "Previous School Academy",
//         address: "456 School Road, City",
//         contact: "07034567890",
//       },
//       otherInfo: {
//         specialHealthProblems: "None",
//         howHeardAboutUs: "From friends",
//       },
//       createdAt: "2023-09-01T10:30:00.000Z",
//     },
//     isLoading: false,
//     error: null,
//   };
// };

const AdmissionDetail: React.FC<AdmissionDetailProps> = ({ id }) => {
  // Fetch admission data
const { data: admission, isLoading } = useGetAdmissionByIdQuery(id, {
    skip: !id
});

 
     if (isLoading) {
       return <LoaderComponent />;
     }

  if (!admission) {
    return <div className='p-4 text-center'>Admission not found</div>;
  }
  console.log(admission)

  // Helper function for status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    }
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-md'>
      {/* Navigation */}
      <div className='flex items-center space-x-1 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href='/admissions' className='text-primary'>
            Admissions
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>{`${admission.student.firstname} ${admission.student.lastname}`}</p>
      </div>

      {/* Status Section */}
      <div className='mb-6'>
        <div className='flex items-center gap-4 mb-2'>
          <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
            Admission Status
          </h2>
          <Separator className='flex-1 border border-gray-300' />
        </div>
        <div className='flex items-center gap-2'>
          <Badge className={cn("capitalize", getStatusColor(admission.status))}>
            {admission.status}
          </Badge>
          <span className='text-sm text-gray-500'>
            Applied on {format(new Date(admission.createdAt), "PPP")}
          </span>
        </div>
        {admission.status === "rejected" && (
          <p className='mt-2 text-red-500 text-sm'>
            Reason: {admission.rejectionReason}
          </p>
        )}
      </div>

      {/* Student Information */}
      <div>
        <div className='flex items-center gap-4 my-5'>
          <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
            Student Information
          </h2>
          <Separator className='flex-1 border border-gray-300' />
        </div>
        <div className='grid md:grid-cols-[1fr_3fr] gap-4'>
          <div className='p-4 flex flex-col'>
            <div className='flex flex-col items-center'>
              <div className='w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                <Image
                  height={128}
                  width={128}
                  src={admission.student.imageUrl}
                  alt='Student Image'
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Academic Year</span>
              <span className='font-medium'>
                {admission.student.sessionName}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Present Class</span>
              <span className='font-medium'>
                {admission.student.presentClassName}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Class Applying For</span>
              <span className='font-medium'>
                {admission.student.classApplyingForName}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Last Name</span>
              <span className='font-medium'>{admission.student.lastname}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>First Name</span>
              <span className='font-medium'>{admission.student.firstname}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Gender</span>
              <span className='font-medium capitalize'>
                {admission.student.gender}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Home Address</span>
              <span className='font-medium'>
                {admission.student.homeAddress}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Tel</span>
              <span className='font-medium'>{admission.student.contact}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Email</span>
              <span className='font-medium'>{admission.student.email}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Date of Birth</span>
              <span className='font-medium'>
                {format(new Date(admission.student.dateOfBirth), "PPP")}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Religion</span>
              <span className='font-medium'>{admission.student.religion}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Nationality</span>
              <span className='font-medium'>
                {admission.student.nationality}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>State of Origin</span>
              <span className='font-medium'>
                {admission.student.stateOfOrigin}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>LGA</span>
              <span className='font-medium'>{admission.student.lga}</span>
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className='flex items-center gap-4 my-5'>
          <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
            Guardian&apos;s Information
          </h2>
          <Separator className='flex-1 border border-gray-300' />
        </div>
        <div className='grid md:grid-cols-[1fr_3fr] gap-4'>
          <div className='hidden md:block p-4'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Last Name</span>
              <span className='font-medium'>{admission.guardian.lastName}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>First Name</span>
              <span className='font-medium'>
                {admission.guardian.firstName}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Other Name</span>
              <span className='font-medium'>
                {admission.guardian.otherName || "-"}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Address</span>
              <span className='font-medium'>{admission.guardian.address}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Tel</span>
              <span className='font-medium'>{admission.guardian.tel}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Email</span>
              <span className='font-medium'>{admission.guardian.email}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Relationship</span>
              <span className='font-medium capitalize'>
                {admission.guardian.relationship}
              </span>
            </div>
          </div>
        </div>

        {/* Former School Information */}
        <div className='flex items-center gap-4 my-5'>
          <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
            Former School&apos;s Information
          </h2>
          <Separator className='flex-1 border border-gray-300' />
        </div>
        <div className='grid md:grid-cols-[1fr_3fr] gap-4'>
          <div className='hidden md:block p-4'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>School Name</span>
              <span className='font-medium'>{admission.formerSchool.name}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>School Address</span>
              <span className='font-medium'>
                {admission.formerSchool.address}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>School Contact</span>
              <span className='font-medium'>
                {admission.formerSchool.contact}
              </span>
            </div>
          </div>
        </div>

        {/* Other Information */}
        <div className='flex items-center gap-4 my-5'>
          <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
            Other Information
          </h2>
          <Separator className='flex-1 border border-gray-300' />
        </div>
        <div className='grid md:grid-cols-[1fr_3fr] gap-4'>
          <div className='hidden md:block p-4'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>
                Special Health Problems (if any)
              </span>
              <span className='font-medium'>
                {admission.otherInfo.specialHealthProblems || "None"}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>
                How did you hear about us?
              </span>
              <span className='font-medium'>
                {admission.otherInfo.howHeardAboutUs}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionDetail;
