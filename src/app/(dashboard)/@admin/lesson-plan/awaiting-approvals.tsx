import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Download, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

export function AwaitingApprovals() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  return (
    <div className="p-6">
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

        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="text-blue-600 border-blue-600 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download All Lesson Plans
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Plan</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">SN</th>
              <th className="text-left p-4 font-medium text-gray-700">Subject</th>
              <th className="text-left p-4 font-medium text-gray-700">Class</th>
              <th className="text-left p-4 font-medium text-gray-700">Arm</th>
              <th className="text-left p-4 font-medium text-gray-700">Submitted By</th>
              <th className="text-left p-4 font-medium text-gray-700">Submitted On</th>
              <th className="text-left p-4 font-medium text-gray-700">Status</th>
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
                <td className="p-4">Mr Adeyara</td>
                <td className="p-4">12/09/2024</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Awaiting Approval
                  </span>
                </td>
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show Rows</span>
          <Select>
            <SelectTrigger className="w-16">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</span>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <span className="text-sm text-gray-600">Showing 1-10 Of 100 Results</span>
      </div>
    </div>
  )
}
