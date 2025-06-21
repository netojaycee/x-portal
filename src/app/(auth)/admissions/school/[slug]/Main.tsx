"use client";
import React from "react";
import AdmissionPublicForm from "../../../../(dashboard)/@admin/admissions/(components)/AdmissionPublicForm";
import { useGetSchoolByIdQuery } from "@/redux/api";
import NoData from "@/app/(dashboard)/components/NoData";
import LoaderComponent from "@/components/local/LoaderComponent";

export default function Main({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useGetSchoolByIdQuery(slug);

  console.log(data && data)

  if (isLoading) {
    return <LoaderComponent />;
  }
  if (isError) {
    return <NoData text="School not found or an error occurred." />;
  }
  return (
    <div className='max-w-5xl mx-auto p-4'>
      <AdmissionPublicForm
        schoolId={data?.id || "custom-school-id"}
        schoolHeader={{
          schoolName: data?.name || "CUSTOM HIGH SCHOOL",
          leftLogoSrc:
            data?.configuration?.logo?.imageUrl || "/custom-logo-left.png",
          rightLogoSrc:
            data?.configuration?.logo?.imageUrl || "/custom-logo-right.png",
          address:
            data?.address || "123 Custom Street, Custom City, Custom State",
          email: data?.email || "info@customschool.edu",
          phone: data?.contact || "123-456-7890",
          schoolNameColor: data?.configuration?.color || "#2563eb",
        }}
      />
    </div>
  );
}
