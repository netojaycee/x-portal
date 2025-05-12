"use client";

import Image from "next/image";
import React from "react";

interface IconContainerProps {
  src: string;
  alt: string;
}

const IconContainer = ({ src, alt }: IconContainerProps) => {
  return (
    <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center'>
      <Image
        src={src}
        alt={alt}
        width={48}
        height={48}
        className='object-contain'
      />
    </div>
  );
};

interface RevenueCardProps {
  title: string;
  amount: string;
  icon: string;
}

export default function RevenueCard(revenue: RevenueCardProps) {
  const { title, icon, amount } = revenue;
  return (
    <div className='bg-[#FFF8E1] border border-gray-200 rounded-lg p-4 flex items-center space-x-4 max-w-md'>
      <IconContainer src={icon} alt={`${title} icon`} />
      <div>
        <h3 className='text-sm font-medium text-gray-600'>{title}</h3>
        <p className='text-2xl font-bold text-gray-900'>
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          })
            .format(Number(amount))
            .replace("NGN", "")
            .trim()}
        </p>
      </div>
    </div>
  );
}
