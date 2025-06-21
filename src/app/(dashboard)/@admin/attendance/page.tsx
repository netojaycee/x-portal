"use client";

import React, { useState } from "react";
import { AttendanceStats } from "./(components)/AttendanceStats";
import { CustomModal } from "../../components/modals/CustomModal";
import { AttendanceForm } from "./(components)/AttendanceForm";
import { ENUM_MODULES } from "@/lib/types/enums";

export default function Attendance() {
  const [openModal, setOpenModal] = useState(false);

  const handleMarkAttendance = () => {
    setOpenModal(true);
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Attendance Management</h1>

      <AttendanceStats
        totalStudents={400}
        presentCount={250}
        absentCount={0}
        lateCount={0}
        notTakenCount={0}
        onMarkAttendance={handleMarkAttendance}
      />

      <CustomModal
        open={openModal}
        onOpenChange={setOpenModal}
        type={ENUM_MODULES.ATTENDANCE} // You might need to add this to your CustomModal types
        status='mark'
        title='Mark Attendance'
        description='Please fill out the form to mark attendance for students.'
      >
        <AttendanceForm onClose={() => setOpenModal(false)} />
      </CustomModal>
    </div>
  );
}
