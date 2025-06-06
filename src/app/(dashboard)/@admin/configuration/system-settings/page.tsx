"use client";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import SystemSettingsForm from '../(components)/SystemSettingsForm';

export default function SystemSettings() {
  return (
    <div>
      {" "}
      <div className='flex items-center space-x-0 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href={"/configuration"} className='text-primary'>
            Account Settings
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>System Settings</p>
      </div>


      <SystemSettingsForm />
    </div>
  );
}
