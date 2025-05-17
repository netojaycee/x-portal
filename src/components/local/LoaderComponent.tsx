import React from "react";

export default function LoaderComponent() {
  return (
    <div className='flex justify-center p-4 h-[30vh] items-center'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
    </div>
  );
}
