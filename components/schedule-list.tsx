"use client"

import type { ScheduleItem } from "@/types/schedule"
import { Trash2 } from "lucide-react"

interface ScheduleListProps {
  schedules: ScheduleItem[]
  onDeleteSchedule: (id: string) => void
}

export default function ScheduleList({ schedules, onDeleteSchedule }: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg text-center">
        <p className="text-gray-500">추가된 일정이 없습니다.</p>
        <p className="text-sm text-gray-400 mt-2">일과 추가하기 탭에서 일정을 추가해보세요.</p>
      </div>
    )
  }

  // Helper function to calculate time difference including minutes
  const calculateTimeDifference = (schedule: ScheduleItem) => {
    // Convert hours and minutes to total minutes for easier calculation
    const startTotalMinutes = schedule.startHour * 60 + (schedule.startMinute || 0)
    const endTotalMinutes = schedule.endHour * 60 + (schedule.endMinute || 0)

    // Calculate difference in minutes
    let diffMinutes = endTotalMinutes - startTotalMinutes

    // Handle cases where end time is earlier than start time (crossing midnight)
    if (diffMinutes < 0) {
      diffMinutes = 24 * 60 + diffMinutes // Add 24 hours in minutes
    }

    // Convert back to hours and minutes
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    // Format the result
    if (hours === 0) {
      return `${minutes}분`
    } else if (minutes === 0) {
      return `${hours}시간`
    } else {
      return `${hours}시간 ${minutes}분`
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">항목</th>
            <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">세부항목</th>
            <th className="py-2 px-3 text-left text-sm font-medium text-gray-700">시간</th>
            <th className="py-2 px-3 text-center text-sm font-medium text-gray-700 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-3 text-sm">{schedule.categoryName}</td>
              <td className="py-3 px-3 text-sm">{schedule.item}</td>
              <td className="py-3 px-3 text-sm">{calculateTimeDifference(schedule)}</td>
              <td className="py-3 px-3 text-center">
                <button
                  onClick={() => onDeleteSchedule(schedule.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label="삭제"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
