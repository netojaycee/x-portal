"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetClassesQuery, useGetSubjectQuery } from "@/redux/api";
import { Label } from "@/components/ui/label";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
import { PlusCircle, X } from "lucide-react";

const Editor = dynamic(
  () => import("@/components/ui/editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className='min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background animate-pulse' />
    ),
  }
);

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id?: string;
  text: string;
  options: QuestionOption[];
}

interface InitialDataType {
  id?: string;
  classId: string;
  subjectId: string;
  questions: {
    id: string;
    text: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

export default function AddQuestionForm({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData?: InitialDataType;
}) {
  const [selectedClass, setSelectedClass] = useState(
    initialData?.classId || ""
  );
  const [selectedSubject, setSelectedSubject] = useState(
    initialData?.subjectId || ""
  );
  const [showPreview, setShowPreview] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions
      ? initialData.questions.map((q) => ({
          id: q.id,
          text: q.text,
          options: q.options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        }))
      : [
          {
            text: "",
            options: [
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
            ],
          },
        ]
  );

  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery(
    {}
  );
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectQuery(
    {}
  );

  const classes = classesData || [];
  const subjects = subjectsData || [];

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    optionIndex: number
  ) => {
    const newQuestions = [...questions];
    // Uncheck all other options
    newQuestions[questionIndex].options.forEach((option, idx) => {
      option.isCorrect = idx === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    // Don't remove if there are only 2 options
    if (newQuestions[questionIndex].options.length <= 2) return;
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (questionIndex: number) => {
    if (questions.length <= 1) {
      alert("You must have at least one question");
      return;
    }
    const newQuestions = [...questions];
    newQuestions.splice(questionIndex, 1);
    setQuestions(newQuestions);
  };

  const addNewOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedSubject) {
      // You might want to add proper error handling/notification here
      alert("Please select both class and subject");
      return;
    }

    // Validate questions
    const hasInvalidQuestions = questions.some(
      (q) =>
        !q.text || q.options.length < 2 || !q.options.some((o) => o.isCorrect)
    );

    if (hasInvalidQuestions) {
      alert(
        "Please ensure all questions have text, at least 2 options, and one correct answer"
      );
      return;
    }

    const payload = {
      id: initialData?.id,
      classId: selectedClass,
      subjectId: selectedSubject,
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options.map((o) => ({
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    };

    try {
      // You'll need to implement these API calls in your redux api file
      if (initialData) {
        // Update existing questions
        // await updateQuestions(payload);
        console.log("Updating questions:", payload);
      } else {
        // Create new questions
        // await createQuestions(payload);
        console.log("Creating questions:", payload);
      }
      onClose();
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Failed to save questions. Please try again.");
    }
  };

  if (classesLoading || subjectsLoading) {
    return <LoaderComponent />;
  }

  if (showPreview) {
    return (
      <div className='space-y-2 bg-[#F5F5F5] rounded-lg shadow'>
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <div>
              <h3 className='font-medium text-sm'>Subject</h3>
              <p className='text-xs text-gray-500'>
                {subjects.find((s: any) => s.id === selectedSubject)?.name}
              </p>
            </div>
            <div>
              <h3 className='font-medium text-sm'>Class</h3>
              <p className='text-xs text-gray-500'>
                {classes.find((c: any) => c.id === selectedClass)?.name}
              </p>
            </div>
          </div>
        </div>
        <hr className='border-gray-300' />
        {questions.map((question, qIndex) => (
          <div key={qIndex} className='space-y-4 p-4 border rounded-lg'>
            <div className='flex justify-between items-start'>
              <div className='space-y-2 flex-1'>
                <h3 className='font-medium text-sm'>{qIndex + 1}. Question</h3>
                <div
                  className='prose max-w-none text-xs'
                  dangerouslySetInnerHTML={{ __html: question.text }}
                />
              </div>
              <button
                type='button'
                onClick={() => removeQuestion(qIndex)}
                className='p-2 text-gray-400 hover:text-gray-600'
                title='Remove question'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
            <div className='space-y-2'>
              <h4 className='font-medium text-xs'>Options</h4>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className='flex items-center gap-2'>
                  <div
                    className={`p-2 rounded text-xs ${
                      option.isCorrect ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {option.text}
                    {option.isCorrect && (
                      <span className='ml-2 text-green-600'>
                        (Correct Answer)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setShowPreview(false)}>
            Back to Edit
          </Button>
          <Button onClick={handleSave}>Save Question</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2 bg-[#F5F5F5] rounded-lg shadow'>
      <div className='flex items-center gap-5 w-full'>
        <div className='space-y-2 w-full'>
          <Label htmlFor='subject' className='text-sm'>
            Subject<span className='text-red-500'>*</span>
          </Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className='w-full h-9 text-sm'>
              <SelectValue placeholder='Select Subject' />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject: any) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2 w-full'>
          <Label htmlFor='class' className='text-sm'>
            Class<span className='text-red-500'>*</span>
          </Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className='w-full h-9 text-sm'>
              <SelectValue placeholder='Select Class' />
            </SelectTrigger>
            <SelectContent>
              {classes.map((class_: any) => (
                <SelectItem key={class_.id} value={class_.id}>
                  {class_.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {questions.map((question, questionIndex) => (
        <div
          key={questionIndex}
          className='space-y-4 p-4 border rounded-lg bg-white'
        >
          <div className='space-y-2'>
            <Label className='text-sm'>Question {questionIndex + 1}</Label>
            <Editor
              value={question.text}
              onChange={(value) => handleQuestionChange(questionIndex, value)}
              placeholder='Write your question here...'
            />
          </div>

          <div className='space-y-2 w-3/4'>
            <Label className='text-sm'>Options</Label>
            <div className='space-y-2'>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className='flex items-center gap-2'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 w-full'>
                      <input
                        type='text'
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            e.target.value
                          )
                        }
                        placeholder='Write option'
                        className='flex-1 px-3 py-2 h-8 border rounded-md text-xs'
                      />
                      <button
                        type='button'
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className='p-2 text-red-500 hover:text-gray-600'
                        aria-label='Delete option'
                      >
                        <X className='w-4 h-4' />
                      </button>
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={() =>
                          handleCorrectAnswerChange(questionIndex, optionIndex)
                        }
                        id={`correct-${questionIndex}-${optionIndex}`}
                      />
                      <Label
                        htmlFor={`correct-${questionIndex}-${optionIndex}`}
                        className='text-[9px] text-gray-500'
                      >
                        Correct answer
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type='button'
                onClick={() => addNewOption(questionIndex)}
                className='flex items-center gap-2 text-sm text-primary hover:text-primary/80'
              >
                <span className='text-sm '>
                  <PlusCircle className='w-4 h-4' />
                </span>{" "}
                Add Options
              </button>
            </div>
          </div>
        </div>
      ))}

      <Button size='sm' className='' onClick={addNewQuestion}>
        <PlusCircle className='w-4 h-4 mr-2' />
        Add Question
      </Button>

      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => setShowPreview(true)}>Preview Question</Button>
      </div>
    </div>
  );
}
