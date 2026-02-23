import { createClient } from '@/utils/supabase/server'
import { DashboardCharts } from '@/components/DashboardCharts'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users 
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: tasks } = await supabase.from('tasks').select('*')
  
  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t.status === 'Completed').length || 0,
    pending: tasks?.filter(t => t.status === 'Pending').length || 0,
    inProgress: tasks?.filter(t => t.status === 'In Progress').length || 0,
    review: tasks?.filter(t => t.status === 'Review').length || 0,
    critical: tasks?.filter(t => t.priority === 'Critical').length || 0,
  }

  const kpis = [
    { label: 'Total Tasks', value: stats.total, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Critical Tasks', value: stats.critical, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Team Members', value: 8, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' }, // Dummy for now
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">System Dashboard</h2>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <div className={`rounded-lg ${kpi.bg} p-3`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <DashboardCharts statusData={stats} />

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Recent Activity</h3>
        <div className="space-y-4">
          {/* Activity list would go here */}
          <p className="text-sm text-gray-500 text-center py-4">No recent activity logs found.</p>
        </div>
      </div>
    </div>
  )
}
