import { ChevronsRight } from "lucide-react";
import Image from "next/image";
import React from "react";

interface StatsCardProps {
  title: string;
  number: string;
  image: string;
  imagePosition: "left" | "right";
  male?: string;
  female?: string;
  url?: string;
}

const StatsCard = ({
  title,
  number,
  image,
  imagePosition = "right",
  male,
  female,
  url,
}: StatsCardProps) => {
  return (
    <div
      className={`relative overflow-hidden flex items-center  p-4 bg-[#D8E2FC] rounded-lg shadow-md max-w-md mx-auto w-full hover:scale-105 transition-transform duration-300 ${
        imagePosition === "left" ? "justify-end" : "justify-start"
      }`}
    >
      {imagePosition === "left" && (
        <div className='absolute -top-3 -left-3 w-25 h-25 bg-white rounded-full p-4'>
          <Image
            width={80}
            height={80}
            src={image}
            alt='icon'
            className='w-full h-full object-contain'
          />
        </div>
      )}
      <div
        className={`flex flex-col  ${
          imagePosition === "left" ? "items-end" : "items-start"
        }`}
      >
        <h2 className='text-base font-semibold text-gray-700'>{title}</h2>
        <p className='text-4xl font-bold text-gray-900'>{number}</p>
        {(male || female) && (
          <div className='flex gap-4 mt-2 text-sm text-gray-600'>
            {male && (
              <span className='flex items-center'>
                <span className='inline-block w-4 h-4 mr-1 bg-blue-500 rounded-full'></span>
                {male} Males
              </span>
            )}
            {female && (
              <span className='flex items-center'>
                <span className='inline-block w-4 h-4 mr-1 bg-pink-500 rounded-full'></span>
                {female} Females
              </span>
            )}
          </div>
        )}
        {url && (
          <div>
            <a
              href={url}
              className='inline-flex items-center mt-2 text-blue-600 hover:underline'
            >
              View Details
              <ChevronsRight className='w-5 h-5 ml-1' />
            </a>
          </div>
        )}
      </div>
      {imagePosition === "right" && (
        <div className='absolute -top-3 -right-3 w-25 h-25 bg-white rounded-full p-4'>
          <Image
            width={80}
            height={80}
            src={image}
            alt='icon'
            className='w-full h-full object-contain'
          />
        </div>
      )}
    </div>
  );
};

export default StatsCard;
