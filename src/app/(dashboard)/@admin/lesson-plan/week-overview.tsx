"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface WeekOverviewProps {
  onAddWeek?: () => void
}

export function WeekOverview({ onAddWeek }: WeekOverviewProps) {
  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Class</label>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jss1">JSS1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Arm</label>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Arm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gold">Gold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onAddWeek}>
            <Plus className="w-4 h-4 mr-2" />
            Add Week
          </Button>
        </div>
      </div>

      {/* Week Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Week 1</h2>
          <p className="text-sm text-gray-600 mb-1">0 Lesson Plans</p>
          <p className="text-sm text-gray-600">First Term 2023/2024</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>START DATE</span>
            <span>END DATE</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>01/09/2024</span>
            <span>01/09/2024</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit Week
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            View Week
          </Button>
        </div>
      </div>
    </div>
  )
}
