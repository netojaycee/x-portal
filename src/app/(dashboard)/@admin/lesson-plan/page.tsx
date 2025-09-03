"use client"

import { useState } from "react"
// import { LessonPlanTable } from "../lesson-plan/lesson-plan-table"
import { AddWeekModal } from "../lesson-plan/add-week-modal"
// import { LessonPlanDetail } from "../lesson-plan/lesson-plan-detail"
import { MyLessonPlans } from "../lesson-plan/my-lesson-plans"
import { WeekOverview } from "../lesson-plan/week-overview"
// import { RejectionModal } from "../lesson-plan/rejection-modal"
// import { CreateLessonPlan } from "../lesson-plan/create-lesson-plan"
import { AwaitingApprovals } from "../lesson-plan/awaiting-approvals"
import { ApprovedLessons } from "../lesson-plan/approved-lessons"

export default function LessonPlan() {
  const [activeTab, setActiveTab] = useState("my-lesson-plan")
  const [showAddWeekModal, setShowAddWeekModal] = useState(false)

  const mainTabs = [
    {
      key: "all-plans",
      label: "All Plans",
      component: <WeekOverview onAddWeek={() => setShowAddWeekModal(true)} />,
    },
    {
      key: "my-lesson-plan",
      label: "My Lesson Plan",
      component: <MyLessonPlans />,
    },
    {
      key: "awaiting-approvals",
      label: "Awaiting Approvals",
      component: <AwaitingApprovals />,
    },
    {
      key: "approved-lessons",
      label: "Approved Lessons Plans",
      component: <ApprovedLessons />,
    },
  ]

//   const views = [
//     { key: "table", label: "Lesson Plan Table", component: <LessonPlanTable /> },
//     { key: "detail", label: "Lesson Plan Detail (All States)", component: <LessonPlanDetail /> },
//     { key: "my-plans", label: "My Lesson Plans", component: <MyLessonPlans /> },
//     {
//       key: "week-overview",
//       label: "Week Overview",
//       component: <WeekOverview onAddWeek={() => setShowAddWeekModal(true)} />,
//     },
//     { key: "rejection-modal", label: "Rejection Modal", component: <RejectionModal /> },
//     { key: "create-plan", label: "Create Lesson Plan", component: <CreateLessonPlan /> },
//     { key: "awaiting", label: "Awaiting Approvals", component: <AwaitingApprovals /> },
//     { key: "approved", label: "Approved Lessons", component: <ApprovedLessons /> },
//   ]

  return (
    <div className="">
      <div className="">
        <div className="px-6 pt-6">
          <div className="flex border-b overflow-x-auto">
            {mainTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div>{mainTabs.find((tab) => tab.key === activeTab)?.component}</div>
      </div>

      {showAddWeekModal && <AddWeekModal onClose={() => setShowAddWeekModal(false)} />}
    </div>
  )
}
