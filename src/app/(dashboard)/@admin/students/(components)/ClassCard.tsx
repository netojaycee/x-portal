// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// interface ClassArmStat {
//   id: string;
//   name: string;
//   stats: {
//     totalStudents: number;
//     maleStudents: number;
//     femaleStudents: number;
//   };
// }

// interface ClassStat {
//   id: string;
//   name: string;
//   armsCount: number;
//   totalStudents: number;
//   males: number;
//   females: number;
//   classArms: ClassArmStat[];
// }

// interface ClassCardProps {
//   classData: ClassStat;
// }

// export default function ClassCard({ classData }: ClassCardProps) {
//   const router = useRouter();

//   // Generate class code/acronym based on name (e.g., "jss1" -> "JSS1", "Junior Secondary School 1" -> "JSS1")
//   const generateClassCode = (name: string) => {
//     // Handle simple cases like "jss1", "sss2"
//     if (name.length <= 5 && /^[a-z]+\d+$/i.test(name)) {
//       return name.toUpperCase();
//     }

//     // Handle full names like "Junior Secondary School 1"
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase();
//   };

//   // Handle card click to navigate to class details
//   const handleCardClick = () => {
//     router.push(`/students/class/${classData.id}`);
//   };

//   return (
//     <div
//       className='bg-[#F2F5FC] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100'
//       onClick={handleCardClick}
//     >
//       <div className='flex p-4 items-center'>
//         <div className='w-1/3 border-r pr-4'>
//           <div className='bg-blue-50 text-blue-700 font-bold text-2xl rounded-lg p-6 flex justify-center items-center'>
//             {generateClassCode(classData.name)}
//           </div>
//         </div>

//         <div className='w-2/3 pl-4'>
//           <div className='flex justify-between items-center mb-2'>
//             <h3 className='text-xl font-semibold text-gray-800'>
//               {classData.totalStudents} Students
//             </h3>
//             <Link
//               href={`/students/class/${classData.id}`}
//               className='text-blue-600 hover:text-blue-800 text-sm flex items-center'
//             >
//               View More
//               <svg
//                 className='w-4 h-4 ml-1'
//                 fill='none'
//                 stroke='currentColor'
//                 viewBox='0 0 24 24'
//                 xmlns='http://www.w3.org/2000/svg'
//               >
//                 <path
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                   strokeWidth='2'
//                   d='M9 5l7 7-7 7'
//                 ></path>
//               </svg>
//             </Link>
//           </div>

//           <div className='text-sm text-gray-600'>
//             <div className='flex justify-between border-b border-gray-100 py-1'>
//               <span>{classData.armsCount} Arms</span>
//             </div>
//             <div className='flex items-center mt-2'>
//               <div className='flex items-center mr-4'>
//                 <svg
//                   className='w-4 h-4 text-blue-600 mr-1'
//                   fill='currentColor'
//                   viewBox='0 0 20 20'
//                   xmlns='http://www.w3.org/2000/svg'
//                 >
//                   <path d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'></path>
//                 </svg>
//                 <span>{classData.males} Males</span>
//               </div>
//               <div className='flex items-center'>
//                 <svg
//                   className='w-4 h-4 text-pink-500 mr-1'
//                   fill='currentColor'
//                   viewBox='0 0 20 20'
//                   xmlns='http://www.w3.org/2000/svg'
//                 >
//                   <path d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'></path>
//                 </svg>
//                 <span>{classData.females} Females</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ClassArmStat {
  id: string;
  name: string;
  stats: {
    totalStudents: number;
    maleStudents: number;
    femaleStudents: number;
  };
}

interface ClassStat {
  id: string;
  name: string;
  class?: string;
  classId?: string; // Added classId for navigation 
  armsCount: number;
  totalStudents: number;
  males: number;
  females: number;
  classArms: ClassArmStat[];
  sessionId: string; // Added sessionId for navigation
  percentage?: number; // Optional percentage for arms
}

interface ClassCardProps {
  classData: ClassStat;
  type: "arm" | "class";
}

export default function ClassCard({ classData, type }: ClassCardProps) {
  const router = useRouter();

 

  // Handle card click to navigate to class details
  const handleCardClick = () => {
    router.push(`/students/class/${classData.id}`);
  };

  return (
    <div
      className='bg-[#F2F5FC] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow duration-300 cursor-pointer border border-[#CAD6F5] flex items-center px-4 py-5 gap-0 min-w-[320px] max-w-[350px]'
      onClick={handleCardClick}
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      {/* Left: Class Code */}
      <div className='flex flex-col   mr-4'>
        <span className='text-[32px] font-bold text-[#4A6CF7] leading-none'>
          {/* {generateClassCode(classData.name)} */}
          {classData.name}
        </span>
        {type === "class" ? (
          <span className='text-xs text-[#8F9BBA] mt-2 justify-end flex'>
            {classData.armsCount} Arms.
          </span>
        ) : (
          <span className='text-xs text-[#8F9BBA] mt-2 justify-end flex'>
            {classData?.percentage}% Of {classData?.class} Students
          </span>
        )}
      </div>

      {/* Separator */}
      <div
        className='h-full border-r border-dashed border-[#CAD6F5] mx-4'
        style={{ height: "65px" }}
      ></div>

      {/* Right: Stats */}
      <div className='flex-1 flex flex-col justify-between h-full'>
        <div className='flex items-baseline gap-2 justify-end'>
          <span className='text-[28px] font-bold text-[#232E3E] leading-none'>
            {classData.totalStudents}
          </span>
          <span className='text-lg text-[#232E3E] font-medium leading-none'>
            Students
          </span>
        </div>
        <div className='flex items-center gap-2 mt-1 justify-end'>
          <div className='flex items-center gap-1 text-xs text-[#8F9BBA]'>
            {/* Male icon */}
            <svg
              className='w-4 h-4 text-[#4A6CF7]'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                fill='#4A6CF7'
              />
            </svg>
            <span>{classData.males} Males.</span>
          </div>
          <div className='flex items-center gap-1 text-xs text-[#8F9BBA]'>
            {/* Female icon */}
            <svg
              className='w-4 h-4 text-[#F857A6]'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                fill='#F857A6'
              />
            </svg>
            <span>{classData.females} Females.</span>
          </div>
        </div>
        <div className='flex justify-end mt-3'>
            <Link
            href={type === "class" 
              ? `/students/class/${classData.sessionId}/${classData.id}` 
              : `/students/class/${classData.sessionId}/${classData.classId}/${classData.id}`}
            className='text-[#4A6CF7] hover:text-[#232E3E] text-base font-medium flex items-center gap-1'
            onClick={(e) => e.stopPropagation()} // Prevent parent click
            tabIndex={-1}
            >
            View More
            {/* Double Arrow Icon */}
            <svg
              className='w-5 h-5 ml-1'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13 5l7 7-7 7'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5 5l7 7-7 7'
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}