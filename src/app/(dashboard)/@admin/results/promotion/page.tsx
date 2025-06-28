"use client";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useGetStudentsPromotionQuery } from "@/redux/api";
import { useSearchParams } from "next/navigation";
import React from "react";
import PromotionTable from "../(components)/PromotionTable";

export default function Promotion() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const classArmId = encodeURIComponent(searchParams.get("classArmId") || "");
  const sessionId = encodeURIComponent(searchParams.get("sessionId") || "");

  const { data, isLoading, error, refetch } = useGetStudentsPromotionQuery({
    sessionId,
    classId,
    classArmId,
  });

  console.log(data && data, "promotion");

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>Error Loading Students</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>No Student Found</h2>
          <p>No student found for this Class.</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <PromotionTable data={data} onSuccess={refetch} />
    </div>
  );
}
