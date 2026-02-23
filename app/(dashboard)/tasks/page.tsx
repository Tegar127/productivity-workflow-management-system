'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Task, Profile } from '@/types/database'
import { TaskCard } from '@/components/TaskCard'
import { calculateSmartPriority } from '@/utils/taskHelpers'
import { Plus, Search, Filter } from 'lucide-react'
import { CreateTaskModal } from '@/components/CreateTaskModal'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    const [tasksRes, profilesRes] = await Promise.all([
      supabase
        .from('tasks')
        .select('*, assignee:profiles!assignee_id(*)')
        .order('created_at', { ascending: false }),
      supabase.from('profiles').select('*')
    ])

    if (tasksRes.data) {
      // Apply smart priority on the fly for display
      const processedTasks = tasksRes.data.map(task => ({
        ...task,
        priority: calculateSmartPriority(task.priority, task.status, task.due_date, task.created_at)
      }))
      setTasks(processedTasks)
    }
    if (profilesRes.data) setProfiles(profilesRes.data)
    setLoading(false)
  }

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (error) alert(error.message)
    else fetchData()
  }

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tasks Management</h2>
          <p className="text-sm text-gray-500">Manage and track your team's progress</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </button>
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        profiles={profiles}
        currentUserId={user?.id}
      />

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              currentUserId={user?.id}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
          {filteredTasks.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No tasks found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
