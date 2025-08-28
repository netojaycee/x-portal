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

export default function BulkUploadForm({ onClose }: { onClose: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery(
    {}
  );
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectQuery(
    {}
  );

  console.log(classesData, subjectsData)

  const classes = classesData || [];
  const subjects = subjectsData || [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedClass || !selectedSubject) {
      return;
    }
    // Implement upload logic here
  };

  const handleDownloadTemplate = () => {
    // Create a sample template
    const template = [
      [
        "Question",
        "Option A",
        "Option B",
        "Option C",
        "Option D",
        "Correct Answer",
        "Mark",
      ],
      ["What is 2+2?", "3", "4", "5", "6", "B", "5"],
      ["", "", "", "", "", "", ""],
    ];

    // Convert to CSV
    const csvContent = template.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (classesLoading || subjectsLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-4'>
      {/* <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Bulk Upload Question</h2>
        <Button variant='ghost' size='icon' onClick={onClose}>
          <X className='h-4 w-4' />
        </Button>
      </div> */}

      <div className='space-y-4'>
        {/* <p className='text-sm text-gray-500'>
          Select your excel file from your computer to upload it using that
          uploader provided for you below.
        </p> */}

        <div className='space-y-4'>
          <div className='flex items-center gap-5 w-full'>
            <div className='space-y-2 w-full'>
              <Label htmlFor='subject'>
                Subject<span className='text-red-500'>*</span>
              </Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className='w-full'>
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
              <Label htmlFor='class'>
                Class<span className='text-red-500'>*</span>
              </Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className='w-full'>
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
          <div className='border-2 border-dashed rounded-lg p-8 text-center space-y-4'>
            <div className='flex justify-center'>
              <div className='h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center'>
                <svg
                  className='h-6 w-6 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                  />
                </svg>
              </div>
            </div>
            <div className='space-y-2'>
              <p className='text-sm font-medium'>Drag and Drop files here</p>
              <p className='text-xs text-gray-500'>
                Select your Excel file Click &quot;HERE&quot;
              </p>
              <input
                type='file'
                accept='.xlsx,.xls,.csv'
                onChange={handleFileChange}
                className='hidden'
                id='file-upload'
              />
              <label
                htmlFor='file-upload'
                className='cursor-pointer text-primary hover:text-primary/80 text-sm font-medium'
              >
                Browse Files
              </label>
            </div>
            {selectedFile && (
              <p className='text-sm text-gray-600'>
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        <div className='space-y-4'>
          <Button
            onClick={handleUpload}
            className='w-full'
            disabled={!selectedFile || !selectedClass || !selectedSubject}
          >
            Upload Excel File
          </Button>

          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>
              Don&apos;t Have an Excel format file ?
            </h3>
            <p className='text-xs text-gray-500'>
              Don&apos;t worry we get you covered click the button and also
              fellow the step below
            </p>
            <Button onClick={handleDownloadTemplate} className=''>
              Download Excel Template
            </Button>
          </div>

          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>Steps</h3>
            <ol className='list-decimal list-inside space-y-1 text-sm text-gray-600'>
              <li className=''>
                Click the button below to download the student bulk create excel
                file.
              </li>
              <li>Open the file on your computer</li>
              <li>Skip sample Data and start filling from the next line</li>
              <li>
                Fill all sections provided in the specified format using the
                sample provided as a guide, then save
              </li>
              <li>
                Click on the &apos;Browse File&apos; button to select the filled
                template saved on your computer
              </li>
              <li>
                To add all the students in the file to a particular class,
                select a class above, else skip to Step 7
              </li>
              <li>
                Click on the &apos;Upload Excel File&apos; button to upload
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
