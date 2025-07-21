"use client";

// import { Button } from "@/components/ui/button";
// import {  Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

// Mocked props type
type StudentProfileProps = {
  name: string;
  status: "Active" | "Inactive";
  className?: string;
  arm?: string;
  role?: string | null;
  parent?: string;
  avatarUrl?: string | null;
  yearOfGraduation?: Date | string;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpload?: () => void;
  email?: string;
  occupation?: string;
  contact?: string;
  type?: "student" | "parent" | "alumni" | "staff";
  staffRegNo?: string;
  assignedClasses?: { className: string; classArmName: string }[];
  assignedSubjects?: { subjectName: string; className: string; classArmName:
    string }[];
  qualifications?: string | string[];
};

export function StudentProfileCard({
  type = "student",
  ...props
}: StudentProfileProps) {
  return (
    <div className='border-2 border-blue-400 rounded-lg p-6 bg-muted/40 max-w-4xl mx-auto mt-4'>
      <div className='flex flex-row items-center justify-between gap-8'>
        {/* Avatar & Upload */}
        <div className='flex flex-col items-center gap-4'>
          <div className='w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white'>
            {props.avatarUrl ? (
              <Image
                src={props.avatarUrl}
                alt={props.name}
                width={24}
                height={24}
                className='rounded-full object-cover'
              />
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width={24}
                height={24}
                fill='none'
                viewBox='0 0 24 24'
                className='text-gray-300'
              >
                <circle
                  cx='12'
                  cy='8'
                  r='4'
                  stroke='currentColor'
                  strokeWidth={1.5}
                />
                <path
                  stroke='currentColor'
                  strokeWidth={1.5}
                  d='M6 20c0-3 12-3 12 0'
                />
              </svg>
            )}
          </div>

          {type === "alumni" && (
            <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white text-xs font-semibold shadow'>
              <svg
                width='18'
                height='18'
                viewBox='0 0 20 20'
                fill='none'
                className='inline-block mr-1'
              >
                <path
                  d='M10 2L2 6.5L10 11L18 6.5L10 2Z'
                  fill='#fff'
                  fillOpacity='.7'
                />
                <path
                  d='M4 8.5V13.5C4 14.3284 4.67157 15 5.5 15H14.5C15.3284 15 16 14.3284 16 13.5V8.5'
                  stroke='#fff'
                  strokeWidth='1.2'
                  strokeLinecap='round'
                />
                <circle cx='10' cy='17' r='1' fill='#fff' />
              </svg>
              Graduated
              <span className='ml-2 font-normal opacity-90'>
                |
                {(() => {
                  let year = "2023";
                  if (props.yearOfGraduation) {
                    if (typeof props.yearOfGraduation === "string") {
                      year = props.yearOfGraduation.slice(0, 4);
                    } else if (props.yearOfGraduation instanceof Date) {
                      year = props.yearOfGraduation.getFullYear().toString();
                    }
                  }
                  return year;
                })()}
              </span>
            </span>
          )}
          {/* <Button
            variant='outline'
            className='text-blue-500 border-blue-300'
            onClick={props.onUpload}
            type='button'
          >
            <UploadCloud className='w-4 h-4 mr-2' />
            Upload Image
          </Button> */}
        </div>

        {/* Details */}
        <div className='flex-1 flex flex-col items-start'>
          <div className='flex items-start gap-3'>
            <h2 className='text-2xl font-bold'>{props.name}</h2>
            <span className='bg-green-100 text-green-700 text-xs rounded-full px-3 py-1 flex items-center gap-1'>
              <span className='w-2 h-2 rounded-full bg-green-500 inline-block'></span>
              {props.status}
            </span>
          </div>
          {type === "student" && (
            <div className='grid grid-cols-2 gap-x-8 gap-y-1 mt-3 text-[15px] w-full max-w-md'>
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground font-medium'>
                  Class:
                </span>
                <span className=''>{props.className}</span>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground font-medium'>Arms:</span>
                <span className=''>{props.arm}</span>
              </div>
              {/* <div className="flex flex-col gap-1">
              <span className='text-muted-foreground font-medium'>Role</span>
              <span className=''>{props.role ?? "Null"}</span>
            </div> */}
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground font-medium'>
                  Parent:
                </span>
                <span className=''>{props.parent}</span>
              </div>
            </div>
          )}
          {type === "staff" && (
            <div className='space-y-3 mt-3 w-full max-w-2xl'>
              {/* <div className='grid grid-cols-2 gap-x-8 gap-y-1 text-[15px]'>
                <div className='flex flex-col gap-1'>
                  <span className='text-muted-foreground font-medium'>
                    Staff Reg No:
                  </span>
                  <span className=''>{props.staffRegNo}</span>
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='text-muted-foreground font-medium'>
                    Email:
                  </span>
                  <span className=''>{props.email}</span>
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='text-muted-foreground font-medium'>
                    Contact:
                  </span>
                  <span className=''>{props.contact}</span>
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='text-muted-foreground font-medium'>
                    Qualifications:
                  </span>
                  <span className=''>
                    {Array.isArray(props.qualifications)
                      ? props.qualifications.join(", ")
                      : props.qualifications}
                  </span>
                </div>
              </div> */}
              {/* Assigned Classes */}
              {props.assignedClasses && props.assignedClasses.length > 0 && (
                <div>
                  <span className='block text-muted-foreground font-medium mb-1'>
                    Assigned Classes:
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {props.assignedClasses.map((cls, idx) => (
                      <span
                        key={idx}
                        className='px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs'
                      >
                        {cls.className} - {cls.classArmName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Assigned Subjects */}
              {props.assignedSubjects && props.assignedSubjects.length > 0 && (
                <div>
                  <span className='block text-muted-foreground font-medium mb-1 mt-2'>
                    Assigned Subjects:
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {props.assignedSubjects.map((subj, idx) => (
                      <span
                        key={idx}
                        className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs'
                      >
                        {subj.subjectName} ({subj.className} -{" "}
                        {subj.classArmName})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {type === "parent" && (
            <div className='grid grid-cols-2 gap-x-8 gap-y-1 mt-3 text-[15px] w-full max-w-md'>
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground font-medium'>
                  Email:
                </span>
                <span className=''>{props.email}</span>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground font-medium'>
                  Occupation:
                </span>
                <span className=''>{props.occupation}</span>
              </div>
              {/* <div className="flex flex-col gap-1">
              <span className='text-muted-foreground font-medium'>Role</span>
              <span className=''>{props.role ?? "Null"}</span>
            </div> */}
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground font-medium'>
                  Contact:
                </span>
                <span className=''>{props.contact}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {/* <div className='flex flex-col gap-4 items-end'>
          <Button
            className='bg-blue-600 text-white font-semibold rounded-lg px-8 py-2 shadow-none text-base hover:bg-blue-700'
            onClick={props.onEdit}
            type='button'
          >
            <Pencil className='w-4 h-4 mr-2' />
            Edit
          </Button>
          <Button
            variant='outline'
            className='text-blue-600 border-blue-400 font-semibold rounded-lg px-8 py-2 text-base hover:bg-blue-50'
            onClick={props.onDelete}
            type='button'
          >
            <Trash2 className='w-4 h-4 mr-2' />
            Delete
          </Button>
        </div> */}
      </div>
    </div>
  );
}
