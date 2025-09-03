"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Calendar, Plus } from "lucide-react"

interface CreateLessonPlanProps {
  onClose: () => void
}

export function CreateLessonPlan({ onClose }: CreateLessonPlanProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Create Lesson Plan</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center justify-center">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Top Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Subject<span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Class<span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jss1">JSS1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium mb-2">
                Arm<span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Arm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Session and Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Session</label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Term</label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Week and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Week</label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week1">Week 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <div className="relative">
                <Input placeholder="DD/MM/YYYY" className="h-10 pr-10" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Topic and Sub-Topic */}
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <Input placeholder="Enter Topic" className="h-10" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sub- Topic</label>
            <Input placeholder="Enter Sub-topic" className="h-10" />
          </div>

          {/* Period and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Period</label>
              <Input placeholder="Enter Period" className="h-10" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (min)</label>
              <Input placeholder="Enter Duration in minute" className="h-10" />
            </div>
          </div>

          {/* Lesson Plan Content */}
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Lesson Plan Content</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Step</label>
                <Textarea placeholder="Enter Steps" className="min-h-20 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Teacher Activity</label>
                <Textarea placeholder="Enter Activity" className="min-h-20 resize-none" />
              </div>
            </div>

            <Button variant="outline" size="sm" className="text-blue-600 bg-transparent w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Role
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent h-10 sm:h-auto">
              Save As Draft
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-auto">
              Submit Lesson plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
