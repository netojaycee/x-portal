"use client";

import React from "react";
import { useParams } from "next/navigation";
import ClassCard from "../../(components)/ClassCard";
import { useGetSubjectQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

// const dummyData = {
//   subject: {
//     id: "1",
//     name: "Mathematics",
//   },
//   class_: {
//     id: "1",
//     name: "JSS1",
//     questionCount: 25,
//     lastUpdated: "2023-08-21",
//     questions: [
//       {
//         id: "q1",
//         text: "What is the value of π (pi) to 2 decimal places?",
//         options: [
//           { id: "o1", text: "3.14", isCorrect: true },
//           { id: "o2", text: "3.12", isCorrect: false },
//           { id: "o3", text: "3.15", isCorrect: false },
//           { id: "o4", text: "3.16", isCorrect: false }
//         ]
//       },
//       {
//         id: "q2",
//         text: "Solve for x: 2x + 5 = 13",
//         options: [
//           { id: "o5", text: "x = 4", isCorrect: true },
//           { id: "o6", text: "x = 6", isCorrect: false },
//           { id: "o7", text: "x = 3", isCorrect: false },
//           { id: "o8", text: "x = 5", isCorrect: false }
//         ]
//       }
//     ]
//   }
// };

export default function SubjectQuestionsPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const { data: subject, isLoading } = useGetSubjectQuery({ id: subjectId });

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{subject?.name} Questions</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {subject?.classes?.map((class_: any) => (
          <ClassCard key={class_.id} subject={subject} class_={class_} />
        ))}
        {/* <ClassCard subject={dummyData.subject} class_={dummyData.class_} /> */}
      </div>
    </div>
  );
}
