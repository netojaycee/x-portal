"use client";

import React, { useState } from "react";
import { useGetSchoolAttendanceSummaryQuery } from "@/redux/api";
import { AttendanceStats } from "./(components)/AttendanceStats";
import { CustomModal } from "../../components/modals/CustomModal";
import { AttendanceForm } from "./(components)/AttendanceForm";
import { ENUM_MODULES } from "@/lib/types/enums";

export default function Attendance() {
  const [openModal, setOpenModal] = useState(false);
  const { data: schoolAttendanceSummary } = useGetSchoolAttendanceSummaryQuery({});

  const handleMarkAttendance = () => {
    setOpenModal(true);
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Attendance Management</h1>

      <AttendanceStats
        totalStudents={schoolAttendanceSummary?.totalStudents ?? 0}
        presentCount={schoolAttendanceSummary?.present ?? 0}
        absentCount={schoolAttendanceSummary?.absent ?? 0}
        lateCount={schoolAttendanceSummary?.late ?? 0}
        notTakenCount={schoolAttendanceSummary?.notTaken ?? 0}
        onMarkAttendance={handleMarkAttendance}
      />

      <CustomModal
        open={openModal}
        onOpenChange={setOpenModal}
        type={ENUM_MODULES.ATTENDANCE}
        status='mark'
        title='Mark Attendance'
        description='Please fill out the form to mark attendance for students.'
      >
        <AttendanceForm onClose={() => setOpenModal(false)} />
      </CustomModal>
    </div>
  );
}
