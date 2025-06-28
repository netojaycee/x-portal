"use client";
import React from "react";
import ClassBroadsheetReport from "../../../(components)/ClassBroadsheetReport";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useGetBroadsheetResultByIdQuery } from "@/redux/api";

export default function Main({ id }: { id: string }) {
  const { data, isLoading, error } = useGetBroadsheetResultByIdQuery({
    id,
    type: "scores",
  });

  console.log(data && data);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>Error Loading Results</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>No Data Found</h2>
          <p>Result batch data is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ClassBroadsheetReport data={data} />
    </div>
  );
}
