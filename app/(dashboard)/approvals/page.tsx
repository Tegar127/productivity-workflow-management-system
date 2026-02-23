'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ApprovalsPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setUserProfile(profile)

    if (!profile || !['Admin', 'Manager'].includes(profile.role)) {
      router.push('/dashboard')
      return
    }

    const { data: pendingTasks } = await supabase
      .from('tasks')
      .select('*, creator:profiles!creator_id(full_name)')
      .eq('status', 'Review')

    setTasks(pendingTasks || [])
    setLoading(false)
  }

  const handleApproval = async (taskId: string, status: 'Approved' | 'Rejected') => {
    const { error: taskError } = await supabase
      .from('tasks')
      .update({ status: status === 'Approved' ? 'Completed' : 'In Progress' })
      .eq('id', taskId)

    if (taskError) {
      alert(taskError.message)
      return
    }

    // Record in approvals table
    await supabase.from('approvals').insert({
      task_id: taskId,
      approver_id: userProfile.id,
      level: userProfile.role,
      status: status,
      notes: status === 'Approved' ? 'Approved by ' + userProfile.full_name : 'Rejected by ' + userProfile.full_name
    })

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: userProfile.id,
      action: status === 'Approved' ? 'APPROVE_TASK' : 'REJECT_TASK',
      target_id: taskId,
      details: { task_id: taskId, status: status }
    })

    fetchData()
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Pending Approvals</h2>
        <p className="text-sm text-gray-500">Tasks waiting for your review</p>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-lg font-bold text-gray-900">{task.title}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    task.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    Requested by: <span className="ml-1 font-medium text-gray-900">{task.creator?.full_name}</span>
                  </span>
                  <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0">
                <button 
                  onClick={() => handleApproval(task.id, 'Rejected')}
                  className="flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </button>
                <button 
                  onClick={() => handleApproval(task.id, 'Approved')}
                  className="flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
              <CheckCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
            <p className="mt-1 text-sm text-gray-500">No tasks currently require your approval.</p>
          </div>
        )}
      </div>
    </div>
  )
}
