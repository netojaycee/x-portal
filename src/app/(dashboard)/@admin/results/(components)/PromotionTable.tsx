"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromotionModal } from "./PromotionModal";

interface Student {
  id: string;
  fullName: string;
  admissionNumber: string;
  gender: string;
  firstTermAverage: number;
  secondTermAverage: number;
  thirdTermAverage: number;
  cumulativeResult: number;
  promotionStatus: boolean;
}

interface PromotionData {
  sessionId: string;
  classId: string;
  classArmId: string;
  totalStudents: number;
  studentsEligibleForPromotion: number;
  students: Student[];
}

interface PromotionTableProps {
  data: PromotionData;
  onSuccess?: () => void;
}

const promotionSchema = z.object({
  graduated: z.boolean(),
  students: z.array(
    z.object({
      id: z.string(),
      promoted: z.boolean(),
    })
  ),
});

export default function PromotionTable({
  data,
  onSuccess,
}: PromotionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof promotionSchema>>({
    defaultValues: {
      graduated: false,
      students: data.students.map((s) => ({
        id: s.id,
        promoted: s.promotionStatus,
      })),
    },
    resolver: zodResolver(promotionSchema),
  });

  const formValues = watch();
  const studentPromotes = formValues.students;

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return data.students;

    return data.students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.students, searchTerm]);

  const onSubmit = () => {
    // Open the promotion modal instead of directly calling onPromoteClass
    setIsPromotionModalOpen(true);
  };

  const handlePromotionModalClose = () => {
    setIsPromotionModalOpen(false);
  };

  // Helper to get promotion status for UI
  const getPromotionStatus = (promoted: boolean) => {
    return (
      <span
        className={`flex items-center gap-1 ${
          promoted ? "text-green-600" : "text-gray-500"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            promoted ? "bg-green-400" : "bg-gray-400"
          }`}
        ></span>
        {promoted ? "Promoted" : "Not Promoted"}
      </span>
    );
  };

  // Helper to format term averages
  const formatAverage = (average: number) => {
    return average === 0 ? "-- --" : average.toFixed(2);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full bg-[#fcfcfc] py-4 px-1'
    >
      <div className='flex items-center justify-between mb-2'>
        <Controller
          name='graduated'
          control={control}
          render={({ field }) => (
            <div className='flex items-center gap-2'>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id='graduated-switch'
              />
              <label
                htmlFor='graduated-switch'
                className='text-sm font-medium text-[#6A7A99] select-none'
              >
                Graduated/Alumni
              </label>
            </div>
          )}
        />
        <Button
          type='submit'
          className='bg-[#5C6AC4] text-white rounded-2xl px-7 py-2 text-base font-semibold shadow-none'
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Promote Class"}
        </Button>
      </div>

      {/* Search Input */}
      <div className='mb-4'>
        <Input
          placeholder='Search by student name or admission number...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-md'
        />
      </div>

      {/* Students Summary */}
      <div className='mb-4 text-sm text-[#6A7A99]'>
        <span>Total Students: {data.totalStudents}</span> |
        <span className='ml-2'>
          Eligible for Promotion: {data.studentsEligibleForPromotion}
        </span>{" "}
        |
        <span className='ml-2'>
          Showing: {filteredStudents.length} students
        </span>
      </div>

      <div className='rounded-2xl bg-white border overflow-x-auto'>
        <Table>
          <TableHeader className='bg-[#E1E8F8]'>
            <TableRow>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                SN
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                Name
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                Admission Number
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                Gender
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                First Term
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                Second Term
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                Third Term
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                Cumulative Result
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                Promotion Status
              </TableHead>
              <TableHead className='text-[#6A7A99] font-semibold text-[15px]'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, idx) => {
              // Find the index in the original students array for the form control
              const originalIndex = data.students.findIndex(
                (s) => s.id === student.id
              );
              return (
                <TableRow key={student.id}>
                  <TableCell className='text-gray-700'>{idx + 1}.</TableCell>
                  <TableCell className='text-gray-700'>
                    {student.fullName}
                  </TableCell>
                  <TableCell className='text-gray-700'>
                    {student.admissionNumber}
                  </TableCell>
                  <TableCell className='text-gray-700 capitalize'>
                    {student.gender}
                  </TableCell>
                  <TableCell className='text-gray-700'>
                    {formatAverage(student.firstTermAverage)}
                  </TableCell>
                  <TableCell className='text-gray-700'>
                    {formatAverage(student.secondTermAverage)}
                  </TableCell>
                  <TableCell className='text-gray-700'>
                    {formatAverage(student.thirdTermAverage)}
                  </TableCell>
                  <TableCell className='text-gray-700'>
                    {student.cumulativeResult.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getPromotionStatus(
                      studentPromotes?.[originalIndex]?.promoted ??
                        student.promotionStatus
                    )}
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`students.${originalIndex}.promoted`}
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label='Promote'
                          className='data-[state=checked]:bg-green-400'
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between mt-3'>
        <span className='text-sm text-[#6A7A99]'>
          To migrate students to the next class/session Click{" "}
          <Button
            variant='link'
            className='p-0 h-auto min-h-0 text-[#5C6AC4] text-sm font-semibold align-baseline'
            type='button'
            tabIndex={-1}
          >
            Promote Class
          </Button>
        </span>
        <Controller
          name='graduated'
          control={control}
          render={({ field }) => (
            <div className='flex items-center gap-2'>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id='graduated-switch-bottom'
              />
              <label
                htmlFor='graduated-switch-bottom'
                className='text-sm font-medium text-[#6A7A99] select-none'
              >
                Graduated/Alumni
              </label>
            </div>
          )}
        />
      </div>

      {/* Promotion Modal */}
      <PromotionModal
        isOpen={isPromotionModalOpen}
        onClose={handlePromotionModalClose}
        currentSessionId={data.sessionId}
        currentClassId={data.classId}
        currentClassArmId={data.classArmId}
        graduated={formValues.graduated}
        students={formValues.students}
        onSuccess={onSuccess}
      />
    </form>
  );
}
