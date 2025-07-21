"use client";
import React from "react";
import LoaderComponent from "@/components/local/LoaderComponent";
import { useGetParentByIdQuery } from "@/redux/api";
import { StudentProfileCard } from "../../../(components)/StudentProfileCard";
import LinkedChildrenCard from "../../../(components)/LinkedChildrenCard";
import LinkChildrenCard from "../../../(components)/LinkChildrenCard";

export default function Main({ id }: { id: string }) {
  const { data, isLoading } = useGetParentByIdQuery(id, { skip: !id });
  if (isLoading) return <LoaderComponent />;
  const students = data?.students || [];
  console.log(data, "parentDataNewNew");
  return (
    <div className='space-y-4'>
      <StudentProfileCard
        name={`${data?.user?.firstname} ${data?.user?.lastname}`}
        status={data?.user?.isActive ? "Active" : "Inactive"}
        avatarUrl={data?.user?.avatar?.imageUrl || null}
        // onEdit={() => alert("Edit Clicked")}
        // onDelete={() => alert("Delete Clicked")}
        // onUpload={() => alert("Upload Clicked")}
        type={"parent"}
        email={data?.user?.email}
        occupation={data?.occupation}
        contact={data?.contact}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {students.map((student: any) => (
          <LinkedChildrenCard
        key={student.id}
        id={student.id}
        image={student?.user?.avatar?.imageUrl || ""}
        name={`${student?.user?.firstname} ${student?.user?.lastname}`}
        className={student?.class?.name}
        classArm={student?.classArm?.name}
        parentId={data?.id}
        // onRemove={(id) => alert(`Remove id: ${id}`)}
          />
        ))}
        <LinkChildrenCard parentId={data?.id} />
      </div>
    </div>
  );
}
