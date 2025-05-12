"use client";
import clsx from "clsx";
import Image from "next/image";

export default function Loader() {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-[100] h-screen w-screen flex flex-col justify-center items-center bg-transparent"
      )}
    >
      <Image
        className='outline-none outline-0 border-none border-0 animate-bounce duration-500 transition-transform'
        src={"/logo.png"}
        alt='loader'
        width={142}
        height={48}
        priority
      />
      {/* <div className='text-violet-500 text-2xl font-semibold'>X-Portal</div> */}
    </div>
  );
}
