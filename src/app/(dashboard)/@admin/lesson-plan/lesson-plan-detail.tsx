import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function LessonPlanDetail() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ChevronLeft className="w-5 h-5 text-blue-600" />
        <span className="text-blue-600">My Lesson Plan/View</span>
      </div>

      {/* Week Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-1">Week 2</h1>
          <p className="text-sm text-gray-600">Subject: Mathematics</p>
          <p className="text-sm text-gray-600">Class: JSS1 Gold</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Approve</Button>
          <Button variant="outline" className="text-gray-600 bg-transparent">
            Reject
          </Button>
        </div>
      </div>

      {/* Lesson Details Table */}
      <div className="bg-white rounded-lg shadow mb-6">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">Topic</th>
              <th className="text-left p-4 font-medium text-gray-700">Sub-Topic</th>
              <th className="text-left p-4 font-medium text-gray-700">Period</th>
              <th className="text-left p-4 font-medium text-gray-700">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4">Algebra</td>
              <td className="p-4">Algebra</td>
              <td className="p-4">2nd</td>
              <td className="p-4">7 minute</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lesson Plan Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-700">Lesson Plan Content</h3>
        </div>
        <table className="w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">Step</th>
              <th className="text-left p-4 font-medium text-gray-700">Teacher Activity</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4">Introduce the topic to the student</td>
              <td className="p-4">teacher activity will be here</td>
            </tr>
            <tr className="border-t">
              <td className="p-4">Introduce the topic to the student</td>
              <td className="p-4">teacher activity will be here</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
