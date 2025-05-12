"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

interface ActivityEntryProps {
  icon: string;
  title: string;
  description: string;
  url: string;
}

const ActivityEntry = ({
  icon,
  title,
  description,
  url,
}: ActivityEntryProps) => {
  return (
    <div className='flex items-center justify-between py-4 border-t first:border-t-0'>
      <div className='flex items-center space-x-4'>
        <div className='w-6 h-6 bg-[#CBD8F2] rounded-md p-1'>
          <Image
            src={icon}
            alt={`${title} icon`}
            width={24}
            height={24}
            className='object-contain'
          />
        </div>
        <div>
          <h3 className='text-sm font-medium text-gray-600'>{title}</h3>
          <p className='text-xs text-gray-500'>{description}</p>
        </div>
      </div>
      <Button
        variant='link'
        className='text-blue-600 text-sm p-0 h-auto'
        asChild
      >
        <a href={url}>view more</a>
      </Button>
    </div>
  );
};

interface ActivityBoardProps {
  entries: ActivityEntryProps[];
}

export default function ActivityBoard({ entries }: ActivityBoardProps) {
  return (
    <div className='space-y-3 bg-white rounded-lg shadow-md px-3 py-5'>
      <h2 className='font-lato text-base text-[#4A4A4A]'>Activity Board</h2>
      {entries.map((entry, index) => (
        <ActivityEntry key={index} {...entry} />
      ))}
    </div>
  );
}
