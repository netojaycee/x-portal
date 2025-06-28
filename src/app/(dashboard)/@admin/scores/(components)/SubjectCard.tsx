"use client";

import React from "react";
import { cn } from "@/lib/utils"; // shadcn utility for classNames

interface SubjectCardProps {
  className?: string;
  topText: string; // e.g., "Basic 7, Diamond"
  subject: string; // e.g., "Mathematics"
  subText: string; // e.g., "First Term, 2023/2024 Session/ CA scores input"
  type?: "class" | "subject";
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  className,
  topText,
  subject,
  subText,
  type = "subject",
}) => {
  return (
    <div
      className={cn("rounded-2xl bg-[#e6ecfa] w-full px-12 py-8", className)}
    >
      <div className='space-y-2'>
        {type === "subject" && <div className='text-gray-600 text-base uppercase'>{topText}</div>}
        <div className='text-4xl font-bold text-[#5c6ac4] uppercase'>{type === "subject" ? subject : topText}</div>
        <div className='text-gray-400 text-sm'>{subText}</div>
      </div>
    </div>
  );
};

export default SubjectCard;
