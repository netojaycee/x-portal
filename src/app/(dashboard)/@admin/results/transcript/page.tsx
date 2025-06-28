"use client";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useGetTranscriptQuery } from "@/redux/api";
import { useSearchParams } from "next/navigation";
import React from "react";
import TranscriptReportCard from "../(components)/TranscriptReportCard";

export default function Transcript() {
  const searchParams = useSearchParams();
  const classCategoryId = searchParams.get("categoryId");
  const studentIdentifier = encodeURIComponent(searchParams.get("name") || "");

  const { data, isLoading, error } = useGetTranscriptQuery({
    studentIdentifier,
    classCategoryId,
  });

  console.log(data && data);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>Error Loading Transcript</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data || !data.transcriptData || data.transcriptData.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-500 text-center'>
          <h2 className='text-2xl font-bold mb-2'>No Transcript Found</h2>
          <p>No transcript found for this user in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TranscriptReportCard data={data} />
    </div>
  );
}
