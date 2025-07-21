import React from "react";

interface ClassHeaderCardProps {
  classCode: string;          // E.g. "JSS1"
  className: string;          // E.g. "Junior secondary school"
  totalStudents: number;      // E.g. 40
  males: number;              // E.g. 10
  females: number;            // E.g. 30
  // type: "arm" | "class";     // E.g. "arm"
}

export default function ClassHeaderCard({
  classCode,
  className,
  totalStudents,
  males,
  females,
}: ClassHeaderCardProps) {
  return (
    <div
      className="bg-[#E9EEF8] rounded-[18px] flex items-center px-8 py-6 min-h-[72px] w-full"
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)",
        border: "1px solid #D7DEEA"
      }}
    >
      {/* Left Section */}
      <div className="flex flex-col justify-center" style={{ minWidth: 200 }}>
        <span className="text-[36px] font-bold text-[#4A6CF7] leading-none">{classCode}</span>
        <span className="text-base text-[#8F9BBA] mt-2">{className}</span>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-end justify-center h-full">
        <div className="flex items-baseline gap-2">
          <span className="text-[32px] font-bold text-[#232E3E] leading-none">{totalStudents}</span>
          <span className="text-lg text-[#232E3E] font-medium leading-none">Total Number of student</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-base text-[#8F9BBA]">
            {/* Male icon */}
            <svg className="w-5 h-5 text-[#4A6CF7]" fill="none" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="#4A6CF7"/>
            </svg>
            <span>{males} Males.</span>
          </div>
          <div className="flex items-center gap-1 text-base text-[#8F9BBA]">
            {/* Female icon */}
            <svg className="w-5 h-5 text-[#F857A6]" fill="none" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="#F857A6"/>
            </svg>
            <span className="text-[#F857A6]">{females} Females.</span>
          </div>
        </div>
      </div>
    </div>
  );
}