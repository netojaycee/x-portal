"use client";
import React, { useState } from "react";
import { ChevronLeft, Edit, Info, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import LoaderComponent from "@/components/local/LoaderComponent";
import AssessmentSchemeForm from "../(components)/AssessmentSchemeForm";
import { useGetAssessmentSchemesQuery } from "@/redux/api";
import { useRouter } from "next/navigation";


export default function ContinuousAssessmentPage() {
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [showAssessmentSchemeForm, setShowAssessmentSchemeForm] =
    useState(false);
  const router = useRouter();

  // Fetch assessment schemes from API
  const { data, isLoading, refetch, isFetching } = useGetAssessmentSchemesQuery(
    {}
  );


  const assessmentSchemes = data?.data || [];

  // Handle edit assessment scheme
  const handleEditScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowAssessmentSchemeForm(true);
  };

  // Handle create new assessment scheme
  const handleCreateNew = () => {
    router.push("/configuration/marking-scheme");
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-4'>
      {/* Breadcrumb Navigation */}
      <div className='flex items-center space-x-0 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href='/configuration' className='text-primary'>
            Account Settings
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>Continuous Assessment</p>
      </div>

      {/* Header with Create Button */}
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
        <h1 className='text-2xl font-semibold'>Assessment Schemes</h1>
        {/* <Button onClick={handleCreateNew} className='flex items-center'>
          <Plus className='h-4 w-4 mr-2' />
          Create New Assessment Scheme
        </Button> */}
      </div>

      {/* Loading overlay during fetch */}
      {isFetching && (
        <div className='relative min-h-[200px] rounded-md bg-gray-50/80 flex items-center justify-center'>
          <LoaderComponent />
        </div>
      )}

      {/* No results message */}
      {!isFetching && assessmentSchemes.length === 0 && (
        <div className='flex flex-col items-center justify-center py-12 bg-gray-50 rounded-md'>
          <p className='text-lg text-gray-500 mb-4'>
            No assessment schemes found. You can create a new marking scheme to
            get started.
          </p>
          <Button onClick={handleCreateNew} variant='outline'>
            <Plus className='h-4 w-4 mr-2' />
            Create New Marking Scheme
          </Button>
        </div>
      )}

      {/* Assessment Schemes Grid */}
      {!isFetching && assessmentSchemes.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {assessmentSchemes.map((scheme: any, index: number) => (
            <Card key={index} className='overflow-hidden'>
              <CardHeader className='bg-gray-50 pb-3'>
                <div className='flex justify-between items-center'>
                  <div>
                    <CardTitle className='text-lg font-medium'>
                      {scheme?.markingSchemeComponent?.name}
                    </CardTitle>
                    <Badge
                      variant='outline'
                      className={`mt-1 bg-blue-50 text-blue-700 border-blue-200`}
                    >
                      CA
                    </Badge>
                  </div>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => handleEditScheme(scheme)}
                      >
                        Edit
                      </DropdownMenuItem>

                     
                    </DropdownMenuContent>
                  </DropdownMenu> */}

                  <Edit
                    className='h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleEditScheme(scheme)}
                  />
                </div>
              </CardHeader>
              <CardContent className='p-4'>
                {/* Progress Bar showing score distribution */}
                <div className='mb-3'>
                  <div className='flex justify-between items-center mb-1'>
                    <div className='text-sm font-medium'>
                      <span>Total Score:</span>
                      <span>{scheme?.markingSchemeComponent?.score}</span>
                    </div>
                  </div>
                    <div className='h-2 w-full bg-gray-200 rounded-full overflow-hidden'>
                    {scheme?.components && scheme.components.length > 0 ? (
                      scheme.components.map((assessment: any, i: number) => {
                      // Extended color palette for up to 10 components
                      const colors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-amber-500",
                        "bg-red-500",
                        "bg-purple-500",
                        "bg-pink-500",
                        "bg-indigo-500",
                        "bg-teal-500",
                        "bg-orange-500",
                        "bg-cyan-500",
                      ];
                      return (
                        <div
                        key={i}
                        className={`h-full ${colors[i % colors.length]}`}
                        style={{
                          width: `${(assessment.score / scheme?.markingSchemeComponent?.score) * 100}%`,
                          float: "left",
                        }}
                        ></div>
                      );
                      })
                    ) : (
                      <div
                      className={`h-full bg-primary`}
                      style={{ width: "100%" }}
                      ></div>
                    )}
                    </div>
                </div>

                {/* Assessment Items */}
                <div className='space-y-2'>
                  {scheme.components && scheme.components.length > 0 ? (
                    scheme.components.map((assessment: any, i: number) => {
                      // Use different colors for different assessment items
                      const dotColors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-amber-500",
                        "bg-red-500",
                        "bg-purple-500",
                      ];
                      return (
                        <div
                          key={i}
                          className='flex items-center justify-between text-sm'
                        >
                          <div className='flex items-center'>
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                dotColors[i % dotColors.length]
                              }`}
                            ></span>
                            <span>{assessment.name}</span>
                          </div>
                          <span className='font-medium'>{assessment.score}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className='flex flex-col items-center justify-center py-4 text-center'>
                      <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3'>
                        <Info className='h-6 w-6 text-gray-400' />
                      </div>
                      <p className='text-sm font-medium text-gray-600 mb-1'>
                        No Components Configured
                      </p>
                      <p className='text-xs text-gray-500'>
                        Click edit to add assessment components
                      </p>
                    </div>
                  )}
                </div>

                {/* Assign Classes Section */}
                {/* <div className='mt-4 pt-4 border-t'>
                  <div className='flex justify-between items-center mb-2'>
                    <h3 className='text-sm font-medium'>Assigned Classes</h3>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleAssignClasses(scheme)}
                      className='h-6 p-0'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {scheme.classes.map((cls: any, i: number) =>
                      cls.arms.map((arm: string, j: number) => (
                        <Badge
                          key={`${i}-${j}`}
                          variant='outline'
                          className='bg-gray-100 text-xs'
                        >
                          {cls.name} {arm}
                        </Badge>
                      ))
                    )}
                    {scheme.classes.length === 0 && (
                      <span className='text-xs text-gray-500'>
                        No classes assigned
                      </span>
                    )}
                  </div>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Assessment Scheme Form Modal */}
      {showAssessmentSchemeForm && (
        <AssessmentSchemeForm
          scheme={selectedScheme}
          isOpen={showAssessmentSchemeForm}
          onClose={() => setShowAssessmentSchemeForm(false)}
          onSuccess={() => {
            setShowAssessmentSchemeForm(false);
            refetch(); // Refresh the data
          }}
        />
      )}
    </div>
  );
}
