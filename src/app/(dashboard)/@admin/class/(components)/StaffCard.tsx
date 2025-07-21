import React from "react";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

export interface StaffCardProps {
  name: string;
  email: string;
  gender: string;
  role: string;
  phone: string;
  status?: "active" | "inactive";
  avatarUrl?: string;
  onMenuClick?: () => void;
}

export default function StaffCard({
  name,
  email,
  gender,
  role,
  phone,
  status = "active",
  avatarUrl,
  onMenuClick,
}: StaffCardProps) {
  return (
    <div
      className='bg-[#F8F8F8] rounded-xl border border-[#E4E4E4] flex items-center px-6 py-6 min-w-[350px]  shadow-sm'
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      {/* Avatar */}
      <div className='w-[80px] h-[80px] flex items-center justify-center rounded-full border border-[#E4E4E4] bg-white mr-6'>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            className='w-16 h-16 rounded-full object-cover'
            width={64}
            height={64}
          />
        ) : (
          <svg
            className='w-14 h-14 text-gray-400'
            viewBox='0 0 24 24'
            fill='none'
          >
            <circle
              cx='12'
              cy='8'
              r='4'
              stroke='currentColor'
              strokeWidth='2'
            />
            <path
              d='M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6'
              stroke='currentColor'
              strokeWidth='2'
            />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className='flex-1 flex flex-col justify-center'>
        <div className='flex items-center gap-3 mb-2'>
          <span className='text-[1.5rem] font-bold text-[#232E3E]'>{name}</span>
          {status === "active" && (
            <span className='px-3 py-1 rounded-full bg-[#D7F5E9] text-[#23C16B] text-xs font-medium flex items-center gap-1'>
              <span className='w-2 h-2 bg-[#23C16B] rounded-full inline-block'></span>
              Active
            </span>
          )}
          {status === "inactive" && (
            <span className='px-3 py-1 rounded-full bg-[#F8D7DA] text-[#C82333] text-xs font-medium flex items-center gap-1'>
              <span className='w-2 h-2 bg-[#C82333] rounded-full inline-block'></span>
              Inactive
            </span>
          )}
        </div>
        <div className='grid grid-cols-2 gap-x-6 gap-y-2 text-[1rem]'>
          <div>
            <span className='text-[#B2B2B2] font-medium'>Email Address:</span>
            <div className='text-[#232E3E]'>{email}</div>
          </div>
          <div>
            <span className='text-[#B2B2B2] font-medium'>Role:</span>
            <div className='text-[#232E3E]'>{role}</div>
          </div>
          <div>
            <span className='text-[#B2B2B2] font-medium'>Gender:</span>
            <div className='text-[#232E3E]'>{gender}</div>
          </div>
          <div>
            <span className='text-[#B2B2B2] font-medium'>Phone Number</span>
            <div className='text-[#232E3E]'>{phone}</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className='ml-4 flex items-start h-full'>
        <button
          className='p-2 rounded-full hover:bg-gray-200'
          onClick={onMenuClick}
          aria-label='Options'
        >
          <MoreVertical size={22} className='text-[#B2B2B2]' />
        </button>
      </div>
    </div>
  );
}
