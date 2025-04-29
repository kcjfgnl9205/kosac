export interface ScheduleItem {
  id: string
  category: string
  categoryName: string
  item: string
  startTime: string
  endTime: string
  startHour: number
  endHour: number
  startMinute: number // Added for minute precision
  endMinute: number // Added for minute precision
}
