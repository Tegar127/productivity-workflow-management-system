import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'

export default async function ApprovalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single()

  if (!profile || !['Admin', 'Manager'].includes(profile.role)) {
    redirect('/dashboard')
  }

  const { data: pendingApprovals } = await supabase
    .from('tasks')
    .select('*, profiles!creator_id(full_name)')
    .eq('status', 'Review')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Pending Approvals</h2>
        <p className="text-sm text-gray-500">Tasks waiting for your review</p>
      </div>

      <div className="grid gap-6">
        {pendingApprovals?.map((task) => (
          <div key={task.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{task.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Requested by: {task.profiles?.full_name}</span>
                  <span>Priority: {task.priority}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors">
                  <XCircle className="mr-1.5 h-4 w-4" />
                  Reject
                </button>
                <button className="flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!pendingApprovals || pendingApprovals.length === 0) && (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
            No pending approvals found.
          </div>
        )}
      </div>
    </div>
  )
}
