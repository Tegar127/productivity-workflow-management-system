import { useState } from 'react'
import { Task } from '@/types/database'
import { Calendar, Clock, AlertTriangle, User, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { TaskDetailModal } from './TaskDetailModal'

interface TaskCardProps {
  task: Task
  currentUserId?: string
  onUpdateStatus?: (id: string, status: any) => void
}

const statusColors = {
  'Pending': 'bg-gray-100 text-gray-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Review': 'bg-amber-100 text-amber-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
}

const priorityColors = {
  'Low': 'bg-slate-100 text-slate-700',
  'Medium': 'bg-indigo-100 text-indigo-700',
  'High': 'bg-orange-100 text-orange-700',
  'Critical': 'bg-red-100 text-red-700',
}

export function TaskCard({ task, currentUserId, onUpdateStatus }: TaskCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  return (
    <>
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
      >
        <div className="mb-3 flex items-start justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        
        <div className="flex items-start justify-between">
          <h4 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {task.title}
          </h4>
          <ExternalLink className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-col space-y-2 border-t pt-4">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="mr-1.5 h-4 w-4" />
            Due: {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No deadline'}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <User className="mr-1.5 h-4 w-4" />
            Assignee: {task.assignee?.full_name || 'Unassigned'}
          </div>
        </div>

        {task.status !== 'Completed' && (
          <div className="mt-4 flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <select 
              onChange={(e) => onUpdateStatus?.(task.id, e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue={task.status}
            >
              <option value="Pending">Move to Pending</option>
              <option value="In Progress">Start Work</option>
              <option value="Review">Send for Review</option>
              <option value="Completed">Mark Complete</option>
            </select>
          </div>
        )}
      </div>

      {currentUserId && (
        <TaskDetailModal 
          task={task}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          currentUserId={currentUserId}
        />
      )}
    </>
  )
}
