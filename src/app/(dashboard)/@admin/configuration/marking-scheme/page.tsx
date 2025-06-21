
"use client";
import React, { useState } from "react";
import { ChevronLeft, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
} from "@/components/ui/card";
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
import MarkingSchemeForm from "../(components)/MarkingSchemeForm";
import {
  useGetMarkingSchemesQuery,
} from "@/redux/api";
import AssignMarkingSchemeModal from "../(components)/AssignMarkingScheme";



// Define colors for different component types/divisions
const getProgressBarColor = (index: number) => {
  const colors = [
    "bg-blue-500", // First division
    "bg-orange-500", // Second division
    "bg-red-300", // Third division
    "bg-green-500", // Fourth division (if needed)
    "bg-purple-500", // Fifth division (if needed)
  ];
  return colors[index] || "bg-gray-500";
};

const getIndicatorColor = (index: number) => {
  const colors = [
    "bg-blue-500", // First division
    "bg-orange-500", // Second division
    "bg-red-300", // Third division
    "bg-green-500", // Fourth division (if needed)
    "bg-purple-500", // Fifth division (if needed)
  ];
  return colors[index] || "bg-gray-500";
};

export default function MarkingSchemePage() {
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [showMarkingSchemeForm, setShowMarkingSchemeForm] = useState(false);
  const [showAssignMarkingSchemeModal, setShowAssignMarkingSchemeModal] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch marking schemes from API
  const { data = [], isLoading, refetch } = useGetMarkingSchemesQuery({});


  const markingSchemes = data?.data;

  const handleEditScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowMarkingSchemeForm(true);
  };

  // Handle delete marking scheme
  const handleDeleteScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowDeleteModal(true);
  };

  // Handle assign classes
  const handleAssignClasses = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowAssignMarkingSchemeModal(true);
  };

  // Handle create new marking scheme
  const handleCreateNew = () => {
    setSelectedScheme(null);
    setShowMarkingSchemeForm(true);
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
        <p className='text-gray-500 text-sm lg:text-base'>Marking Scheme</p>
      </div>

      {/* Header with Create Button */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Marking Schemes</h1>
        <Button onClick={handleCreateNew} className='flex items-center'>
          <Plus className='h-5 w-5' />
          <span className='hidden sm:inline'>Create Marking Scheme</span>
          <span className='sm:hidden'>Create</span>
        </Button>
      </div>

      {/* Marking Schemes Grid */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
        {markingSchemes.map((scheme: any) => (
          <Card key={scheme.id} className='overflow-hidden py-2'>
            {/* Left Side - Progress and components */}
            <div className='flex md:flex-row flex-col'>
              <div className='flex-1 p-4'>
                <div className='flex justify-between items-start mb-4'>
                  <CardTitle className='text-base font-medium'>
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

                {/* Progress Bar */}
                <div className='mb-6'>
                  <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden flex'>
                    {scheme.components.map((component: any, i: number) => (
                      <div
                        key={i}
                        className={`h-full ${getProgressBarColor(i)}`}
                        style={{ width: `${component.score}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* components List */}
                <div className='space-y-3'>
                  {scheme.components.map((component: any, i: number) => (
                    <div key={i} className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <div
                          className={`h-3 w-3 rounded-full mr-3 ${getIndicatorColor(
                            i
                          )}`}
                        ></div>
                        <span className='text-sm font-medium'>
                          {component.name}
                        </span>
                      </div>
                      <span className='font-semibold text-sm'>
                        {component.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Terms and Classes */}
              <div className='w-70 bg-gray-50 p-4 border-l'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-medium text-sm'>Assign Class</h3>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleAssignClasses(scheme)}
                    className='h-6 w-6 p-0 bg-blue-500 text-white hover:bg-blue-600 rounded'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>

                {/* Terms Section */}
                {/* <div className='mb-6'>
                  <div className='flex flex-wrap gap-2'>
                    {scheme.classAssignments.map((assignment: any, i: number) => (
                      <Badge
                        key={i}
                        variant='outline'
                        className='bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-1 flex items-center'
                      >
                        {assignment.termDefinition.name}
                       
                        <X className='h-3 w-3 ml-1' />
                      </Badge>
                    ))}
                  </div>
                </div> */}

                {/* Classes Section */}
                {/* <div>
                  <h4 className='text-sm font-medium mb-3 text-gray-600'>
                    Assign Class
                  </h4>
                  <div className='grid grid-cols-4 gap-1'>
                    {scheme.classAssignments.map((cls: any, i: number) =>
                      <div key={i}>
                        <Badge
                          key={i}
                          variant='outline'
                          className='bg-yellow-100 w-[50px] text-yellow-800 border-yellow-500 text-xs py-1 px-2 flex items-center justify-center'
                        >
                          {cls.class.name}
                          <X className='h-3 w-3 ml-1' />
                        </Badge>
                      </div>
                    )}
                  </div>
                </div> */}
                {/* Compact Summary Section */}
                <div className='space-y-3'>
                  {/* Summary Stats */}
                  <div className='flex items-center justify-between text-xs text-gray-600'>
                    <span>
                      {
                        Array.from(
                          new Set(
                            scheme.classAssignments?.map((a: any) => a.class.id)
                          )
                        ).length
                      }{" "}
                      Classes
                    </span>
                    <span>
                      {
                        Array.from(
                          new Set(
                            scheme.classAssignments?.map(
                              (a: any) => a.termDefinition.id
                            )
                          )
                        ).length
                      }{" "}
                      Terms
                    </span>
                  </div>

                  {/* Compact Class List */}
                  <div className='flex flex-wrap gap-1'>
                    {Array.from(
                      new Set(
                        scheme.classAssignments?.map((a: any) => a.class.id)
                      )
                    )
                      .slice(0, 6) // Show max 6 classes
                      .map((classId: any, i: number) => {
                        const assignment = scheme.classAssignments?.find(
                          (a: any) => a.class.id === classId
                        );
                        return (
                          <Badge
                            key={i}
                            variant='outline'
                            className='bg-yellow-50 text-yellow-700 border-yellow-300 text-xs px-1.5 py-0.5'
                          >
                            {assignment?.class.name}
                          </Badge>
                        );
                      })}
                    {Array.from(
                      new Set(
                        scheme.classAssignments?.map((a: any) => a.class.id)
                      )
                    ).length > 6 && (
                      <Badge
                        variant='outline'
                        className='bg-gray-50 text-gray-600 border-gray-300 text-xs px-1.5 py-0.5'
                      >
                        +
                        {Array.from(
                          new Set(
                            scheme.classAssignments?.map((a: any) => a.class.id)
                          )
                        ).length - 6}
                      </Badge>
                    )}
                  </div>

                  {/* Compact Terms List */}
                  <div className='flex flex-wrap gap-1'>
                    {Array.from(
                      new Set(
                        scheme.classAssignments?.map(
                          (a: any) => a.termDefinition.id
                        )
                      )
                    )
                      .slice(0, 3) // Show max 3 terms
                      .map((termId: any, i: number) => {
                        const assignment = scheme.classAssignments?.find(
                          (a: any) => a.termDefinition.id === termId
                        );
                        return (
                          <Badge
                            key={i}
                            variant='outline'
                            className='bg-blue-50 text-blue-600 border-blue-300 text-xs px-1.5 py-0.5'
                          >
                            {assignment?.termDefinition.name}
                          </Badge>
                        );
                      })}
                    {Array.from(
                      new Set(
                        scheme.classAssignments?.map(
                          (a: any) => a.termDefinition.id
                        )
                      )
                    ).length > 3 && (
                      <Badge
                        variant='outline'
                        className='bg-gray-50 text-gray-600 border-gray-300 text-xs px-1.5 py-0.5'
                      >
                        +
                        {Array.from(
                          new Set(
                            scheme.classAssignments?.map(
                              (a: any) => a.termDefinition.id
                            )
                          )
                        ).length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Marking Scheme Form Modal */}
      {showMarkingSchemeForm && (
        <MarkingSchemeForm
          scheme={selectedScheme}
          isOpen={showMarkingSchemeForm}
          onClose={() => setShowMarkingSchemeForm(false)}
          onSuccess={() => {
            setShowMarkingSchemeForm(false);
            refetch(); // Refresh the data
          }}
        />
      )}

      {/* Assign Class Modal */}
      {showAssignMarkingSchemeModal && (
        <AssignMarkingSchemeModal
          scheme={selectedScheme}
          isOpen={showAssignMarkingSchemeModal}
          onClose={() => setShowAssignMarkingSchemeModal(false)}
          onSuccess={() => {
            setShowAssignMarkingSchemeModal(false);
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
          status={"delete"}
          type={ENUM_MODULES.MARKING_SCHEME} // Using MARKING_SCHEME as a placeholder until we have a proper module type
          selectedRow={selectedScheme}
          description={`Are you sure you want to delete "${selectedScheme?.name}" marking scheme?`}
         
        />
      )}
    </div>
  );
}
