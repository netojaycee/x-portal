"use client";
import React from "react";
import { ScoreForm } from "./(components)/ScoresForm";
import {
  BookOpen,
  BarChart4,
  GraduationCap,
  ClipboardCheck,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Scores() {
  return (
    <div className='space-y-6'>
      {/* Header with descriptive title */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Student Scores</h1>
          <p className='text-muted-foreground mt-1'>
            Record and manage student academic performance data
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium flex items-center'>
            <Info className='h-4 w-4 mr-1' />
            Scores feed directly into report cards
          </div>
        </div>
      </div>

      <Separator />

      {/* Information cards */}
      <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
        <Card className='border-l-4 border-l-blue-500'>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <div className='p-1.5 rounded-full bg-blue-100'>
                <BookOpen className='h-4 w-4 text-blue-700' />
              </div>
              <CardTitle className='text-lg'>Subject Scores</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Enter scores for a specific subject across all students in a class
            </CardDescription>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-indigo-500'>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <div className='p-1.5 rounded-full bg-indigo-100'>
                <GraduationCap className='h-4 w-4 text-indigo-700' />
              </div>
              <CardTitle className='text-lg'>Class Scores</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Enter scores for all subjects for a single student at a time
            </CardDescription>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-emerald-500'>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <div className='p-1.5 rounded-full bg-emerald-100'>
                <BarChart4 className='h-4 w-4 text-emerald-700' />
              </div>
              <CardTitle className='text-lg'>Score Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              View class performance statistics and analytics
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Score Entry Form */}
      <Card className='border border-blue-100 shadow-sm'>
        <CardHeader className='bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100'>
          <div className='flex items-center gap-2'>
            <ClipboardCheck className='h-5 w-5 text-blue-700' />
            <CardTitle>Score Entry Form</CardTitle>
          </div>
          <CardDescription>
            Select the parameters below to begin entering student scores
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <ScoreForm />
        </CardContent>
      </Card>
    </div>
  );
}
