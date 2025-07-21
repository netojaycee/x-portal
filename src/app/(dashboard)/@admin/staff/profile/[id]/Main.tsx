"use client";
import React from "react";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useGetStaffByIdQuery } from "@/redux/api";
import { StudentProfileCard } from "../../../students/(components)/StudentProfileCard";
import StaffBio from "../../(components)/StaffBio";

export default function Main({ id }: { id: string }) {
  const { data: staffDetails, isLoading } = useGetStaffByIdQuery(id, {
    skip: !id,
  });
  if (isLoading) return <LoaderComponent />;

  if (!staffDetails) return <div>No staff data available</div>;

  return (
    <div className='space-y-4'>
      <StudentProfileCard
        name={`${staffDetails.firstname} ${staffDetails.lastname}`}
        status={staffDetails.isActive ? "Active" : "Inactive"}
        avatarUrl={staffDetails.avatar}
        type='staff'
        staffRegNo={staffDetails.staffRegNo || staffDetails.regNo}
        email={staffDetails.email}
        contact={staffDetails.contact}
        qualifications={staffDetails.qualifications}
        assignedClasses={staffDetails.assignedClasses?.map((cls: any) => ({
          className: cls.className,
          classArmName: cls.classArmName,
        }))}
        assignedSubjects={staffDetails.assignedSubjects?.map((subj: any) => ({
          subjectName: subj.subjectName,
          className: subj.className,
          classArmName: subj.classArmName,
        }))}
      />

      <div className=''>
        <StaffBio staffDetails={staffDetails} />
      </div>
    </div>
  );
}
