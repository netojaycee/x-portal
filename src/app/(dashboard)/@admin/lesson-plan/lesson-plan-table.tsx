import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, MoreHorizontal, Download } from "lucide-react"

export function LessonPlanTable() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ChevronLeft className="w-5 h-5 text-blue-600" />
        <span className="text-blue-600">Lesson Plan/Mathematics</span>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Submitted By</label>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teacher1">Teacher 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Subject</label>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="math">Mathematics</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download All Plans
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">SN</th>
              <th className="text-left p-4 font-medium text-gray-700">Subject</th>
              <th className="text-left p-4 font-medium text-gray-700">Class</th>
              <th className="text-left p-4 font-medium text-gray-700">Arm</th>
              <th className="text-left p-4 font-medium text-gray-700">Submitted By</th>
              <th className="text-left p-4 font-medium text-gray-700">Approved By</th>
              <th className="text-left p-4 font-medium text-gray-700">Approved On</th>
              <th className="text-left p-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }, (_, i) => (
              <tr key={i} className="border-t">
                <td className="p-4">1.</td>
                <td className="p-4">Mathematics</td>
                <td className="p-4">JSS1</td>
                <td className="p-4">Gold</td>
                <td className="p-4">Mr Adewara</td>
                <td className="p-4">Mr Mayoewa</td>
                <td className="p-4">10/11/2024</td>
                <td className="p-4">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
