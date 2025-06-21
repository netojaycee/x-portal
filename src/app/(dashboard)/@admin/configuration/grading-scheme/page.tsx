

"use client";
import React, { useState } from "react";
import { ChevronLeft, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import LoaderComponent from "@/components/local/LoaderComponent";
import GradingSchemeForm from "../(components)/GradingSchemeForm";
import {
  useGetGradingSystemQuery,
} from "@/redux/api";
import AssignGradingSystemModal from "../(components)/AssignGradingSystemModal";

export default function GradingSchemesPage() {
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [showGradingSchemeForm, setShowGradingSchemeForm] = useState(false);
  const [showAssignClassModal, setShowAssignClassModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // Fetch grading schemes from API
  const { data, isLoading, refetch } = useGetGradingSystemQuery({
  });

  const gradingSchemes = data?.data || [];

  console.log(gradingSchemes)

  // Handle edit grading scheme
  const handleEditScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowGradingSchemeForm(true);
  };

  // Handle delete grading scheme
  const handleDeleteScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowDeleteModal(true);
  };

  // Handle assign classes
  const handleAssignClasses = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowAssignClassModal(true);
  };

  // Handle create new grading scheme
  const handleCreateNew = () => {
    setSelectedScheme(null);
    setShowGradingSchemeForm(true);
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
        <p className='text-gray-500'>Grading Schemes</p>
      </div>

      {/* Header with Create Button */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Grading Schemes</h1>
      
        <Button onClick={handleCreateNew} className='flex items-center'>
          <Plus className='h-5 w-5' />
          <span className='hidden sm:inline'>Create New Grading System</span>
          <span className='sm:hidden'>Create</span>
        </Button>
      </div>

      {/* Grading Schemes Grid */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {gradingSchemes.map((scheme: any) => (
          <Card key={scheme.id} className='overflow-hidden'>
            {/* Left Side - Progress and Grades */}
            <div className='flex md:flex-row flex-col'>
              <div className='flex-1 p-6'>
                <div className='flex justify-between items-start mb-6'>
                  <CardTitle className='text-lg font-medium'>
                    {scheme.name}
                  </CardTitle>
                  <DropdownMenu>
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
                      <DropdownMenuItem
                        onClick={() => handleDeleteScheme(scheme)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Grade Badges */}
                <div className='flex flex-wrap gap-2 mb-6'>
                  {scheme.grades.slice(0, 4).map((grade: any, i: number) => (
                    <Badge
                      key={i}
                      variant='outline'
                      className={`border text-xs ${
                        grade.scoreStartPoint < 50
                          ? "border-red-500 text-red-700 bg-red-50"
                          : grade.scoreStartPoint < 70
                          ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                          : "border-green-500 text-green-700 bg-green-50"
                      }`}
                    >
                      {grade.name} ({grade.scoreStartPoint}-
                      {grade.scoreEndPoint})
                    </Badge>
                  ))}
                  {scheme.grades.length > 4 && (
                    <Badge
                      variant='outline'
                      className='text-xs border-gray-300 text-gray-600'
                    >
                      +{scheme.grades.length - 4} more
                    </Badge>
                  )}
                </div>

                {/* Grades List */}
                <div className='space-y-3'>
                  {scheme.grades.slice(0, 3).map((grade: any, i: number) => (
                    <div key={i} className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <div
                          className={`h-3 w-3 rounded-full mr-3 ${
                            grade.scoreStartPoint < 50
                              ? "bg-red-500"
                              : grade.scoreStartPoint < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <div>
                          <span className='text-sm font-medium'>
                            {grade.name}
                          </span>
                          <span className='text-xs text-gray-500 ml-2'>
                            ({grade.remark})
                          </span>
                        </div>
                      </div>
                      <span className='font-semibold text-sm'>
                        {grade.scoreStartPoint}-{grade.scoreEndPoint}
                      </span>
                    </div>
                  ))}
                  {scheme.grades.length > 3 && (
                    <div className='text-center'>
                      <span className='text-xs text-gray-500'>
                        +{scheme.grades.length - 3} more grades
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Classes */}
              <div className='w-50 bg-gray-50 p-6 border-l'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-medium text-sm'>Assigned Classes</h3>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleAssignClasses(scheme)}
                    className='h-6 w-6 p-0 bg-blue-500 text-white hover:bg-blue-600 rounded'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>

                {/* Classes Section */}
                <div>
                  {scheme.classAssignments &&
                  scheme.classAssignments.length > 0 ? (
                    <div className='space-y-3'>
                      {/* Summary Stats */}
                      <div className='flex items-center justify-between text-xs text-gray-600'>
                        <span>
                          {
                            Array.from(
                              new Set(
                                scheme.classAssignments?.map(
                                  (a: any) => a.classId
                                )
                              )
                            ).length
                          }{" "}
                          Classes
                        </span>
                      </div>

                      {/* Classes List */}
                      <div className='grid grid-cols-3 gap-2'>
                        {Array.from(
                          new Set(
                            scheme.classAssignments?.map((a: any) => a.classId)
                          )
                        )
                          .slice(0, 9) // Show max 9 classes
                          .map((classId: any, i: number) => {
                            const assignment = scheme.classAssignments?.find(
                              (a: any) => a.classId === classId
                            );
                            return (
                              <Badge
                                key={i}
                                variant='outline'
                                className='bg-yellow-100 w-[50px] text-yellow-800 border-yellow-500 text-xs py-1 px-2 flex items-center justify-center'
                              >
                                {assignment?.class?.name}
                              </Badge>
                            );
                          })}
                        {Array.from(
                          new Set(
                            scheme.classAssignments?.map((a: any) => a.classId)
                          )
                        ).length > 9 && (
                          <Badge
                            variant='outline'
                            className='bg-gray-100 text-gray-600 border-gray-300 text-xs py-1 px-2 flex items-center justify-center'
                          >
                            +
                            {Array.from(
                              new Set(
                                scheme.classAssignments?.map(
                                  (a: any) => a.classId
                                )
                              )
                            ).length - 9}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      <p className='text-sm'>No classes assigned</p>
                      <p className='text-xs mt-1'>Click + to assign classes</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Grading Scheme Form Modal */}
      {showGradingSchemeForm && (
        <GradingSchemeForm
          scheme={selectedScheme}
          isOpen={showGradingSchemeForm}
          onClose={() => setShowGradingSchemeForm(false)}
          onSuccess={() => {
            setShowGradingSchemeForm(false);
            refetch(); // Refresh the data
          }}
        />
      )}

      {/* Assign Class Modal */}
      {showAssignClassModal && (
        <AssignGradingSystemModal
          scheme={selectedScheme}
          isOpen={showAssignClassModal}
          onClose={() => setShowAssignClassModal(false)}
          onSuccess={() => {
            setShowAssignClassModal(false);
            refetch(); // Refresh the data
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <CustomModal
          open={showDeleteModal}
          onOpenChange={() => setShowDeleteModal(false)}
          isEditMode={false}
          type={ENUM_MODULES.GRADING_SYSTEM}
          selectedRow={selectedScheme}
          status={"delete"}
          description={`Are you sure you want to delete "${selectedScheme?.name}" grading system?`}
        />
      )}
    </div>
  );
}