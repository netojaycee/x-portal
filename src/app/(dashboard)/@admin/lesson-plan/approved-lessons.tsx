"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { CreateLessonPlan } from "./create-lesson-plan"

interface ApprovedLessonsProps {
  onCreatePlan?: () => void
}

export function ApprovedLessons({ onCreatePlan }: ApprovedLessonsProps) {

  if (onCreatePlan) console.log(onCreatePlan())
    
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")

  const approvedLessons = [
    {
      id: 1,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 2,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 3,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 4,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 5,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 6,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 7,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 8,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 9,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
    {
      id: 10,
      subject: "Mathematics",
      class: "JSS1",
      arm: "Gold",
      submittedBy: "Mr Mayowa",
      approvedOn: "12/08/2024",
    },
  ]

  return (
    <div className="p-4 md:p-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="search by topic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subject</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="science">Science</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select Class</SelectItem>
              <SelectItem value="jss1">JSS1</SelectItem>
              <SelectItem value="jss2">JSS2</SelectItem>
              <SelectItem value="jss3">JSS3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download All Lesson Plans</span>
            <span className="sm:hidden">Download</span>
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Plan</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved On
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvedLessons.map((lesson, index) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}.</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.subject}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.class}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.arm}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.submittedBy}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.approvedOn}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-white border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show Rows</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Showing 1-10 of 100 Results</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-700">1</span>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Lesson Plan Modal */}
      {showCreateModal && <CreateLessonPlan onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
