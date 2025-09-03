import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

export function RejectionModal() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Reason for Rejection</h2>
          <Button variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <Textarea placeholder="Write a comment" className="min-h-24 resize-none" />

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Send</Button>
        </div>
      </div>
    </div>
  )
}
