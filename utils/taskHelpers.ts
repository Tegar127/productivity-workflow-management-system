import { TaskPriority, TaskStatus } from '@/types/database'
import { differenceInDays, isPast } from 'date-fns'

export function calculateSmartPriority(
  currentPriority: TaskPriority,
  status: TaskStatus,
  dueDate: string | null,
  createdAt: string
): TaskPriority {
  if (status === 'Completed') return currentPriority

  const now = new Date()
  
  // Rule: Task overdue -> Critical
  if (dueDate && isPast(new Date(dueDate))) {
    return 'Critical'
  }

  // Rule: Deadline ≤ 2 days -> High
  if (dueDate) {
    const daysToDeadline = differenceInDays(new Date(dueDate), now)
    if (daysToDeadline <= 2) {
      return 'High'
    }
  }

  // Rule: Task pending > 3 days -> bump priority
  if (status === 'Pending') {
    const daysSinceCreation = differenceInDays(now, new Date(createdAt))
    if (daysSinceCreation > 3) {
      if (currentPriority === 'Low') return 'Medium'
      if (currentPriority === 'Medium') return 'High'
      if (currentPriority === 'High') return 'Critical'
    }
  }

  return currentPriority
}
