"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface SubjectClassCardProps {
  subject: {
    id: string;
    name: string;
    classes: {
      id: string;
      name: string;
    }[];
  };
}

const SubjectClassCard: React.FC<SubjectClassCardProps> = ({ subject }) => {
  const router = useRouter();
  const classes = ['JSS1', 'JSS2', 'JSS2', 'JSS2', 'JSS1', 'JSS1', 'JSS1', 'JSS2', 'JSS2', 'JSS2'];
console.log(subject)
  return (
    <div
      onClick={() => router.push(`/cbt/subjects/${subject.id}`)}
      className='p-4 bg-[#FFFFEA] rounded-lg cursor-pointer hover:shadow-md transition-shadow'
    >
      <h2 className='text-base font-semibold text-gray-800'>{subject?.name}</h2>
      <div className='mt-2'>
        <p className='text-xs text-gray-500'>Class</p>
        <div className='grid grid-cols-4 gap-1 mt-2'>
          {classes.slice(0, 8).map((class_, index) => (
            <div
              key={index}
              className='bg-yellow-100 text-yellow-800 text-xs font-medium p-1 rounded-lg text-center'
            >
              {class_}
            </div>
          ))}
        </div>
        {classes.length > 8 && (
          <div className='bg-yellow-400 text-yellow-800 text-xs font-medium p-1 rounded-lg w-1/3'>
            +{classes.length - 8} more
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectClassCard;
