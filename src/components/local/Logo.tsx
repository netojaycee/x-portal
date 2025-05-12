import Image from "next/image";
import React from "react";

export default function Logo({ white = false }: { white?: boolean }) {
  return (
    <div className='w-[142px] h-[48px] mx-auto'>
      <Image
        src={white ? "/logo_white.png" : "/logo.png"}
        alt='XPortal Logo'
        width={142}
        height={48}
        className='w-[142px] h-[48px] object-fit'

        priority
      />
    </div>
  );
}
