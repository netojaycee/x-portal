"use client";

import { Button } from "@/components/ui/button";
import {  Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

// Mocked props type
type StudentProfileProps = {
  name: string;
  status: "Active" | "Inactive";
  className: string;
  arm: string;
  role: string | null;
  parent: string;
  avatarUrl?: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpload?: () => void;
};

export function StudentProfileCard(props: StudentProfileProps) {
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
                width={96}
                height={96}
                className='rounded-full object-cover'
              />
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width={56}
                height={56}
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
          <div className='grid grid-cols-2 gap-x-8 gap-y-1 mt-3 text-[15px] w-full max-w-md'>
            <div className="flex flex-col gap-1">
              <span className='text-muted-foreground font-medium'>Class:</span>
              <span className=''>{props.className}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className='text-muted-foreground font-medium'>Arms:</span>
              <span className=''>{props.arm}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className='text-muted-foreground font-medium'>Role</span>
              <span className=''>{props.role ?? "Null"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className='text-muted-foreground font-medium'>Parent:</span>
              <span className=''>{props.parent}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-4 items-end'>
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
        </div>
      </div>
    </div>
  );
}
