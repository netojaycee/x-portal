"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetQuestionsQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

export default function ViewQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const classId = params.classId as string;

  const { data: questionsData, isLoading } = useGetQuestionsQuery({
    subjectId,
    classId,
  });

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.back()}
          className='gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </Button>
        <h1 className='text-2xl font-semibold'>
          {questionsData?.subject?.name} - {questionsData?.class?.name}{" "}
          Questions
        </h1>
      </div>

      <div className='space-y-6'>
        {questionsData?.questions.map((question: any, qIndex: number) => (
          <div
            key={question.id}
            className='space-y-4 p-6 border rounded-lg bg-white'
          >
            <div className='space-y-2'>
              <h3 className='font-medium text-sm'>Question {qIndex + 1}</h3>
              <div
                className='prose max-w-none text-sm'
                dangerouslySetInnerHTML={{ __html: question.text }}
              />
            </div>
            <div className='space-y-2'>
              <h4 className='font-medium text-xs'>Options</h4>
              <div className='space-y-2'>
                {question.options.map((option: any) => (
                  <div
                    key={option.id}
                    className={`p-3 rounded text-sm ${
                      option.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {option.text}
                    {option.isCorrect && (
                      <span className='ml-2 text-green-600 text-xs font-medium'>
                        (Correct Answer)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
