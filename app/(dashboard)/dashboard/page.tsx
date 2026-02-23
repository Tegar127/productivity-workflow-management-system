import { createClient } from '@/utils/supabase/server'
import { DashboardCharts } from '@/components/DashboardCharts'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users,
  Activity
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all tasks for stats
  const { data: tasks } = await supabase.from('tasks').select('*')
  
  // Fetch profiles for member count
  const { data: profiles } = await supabase.from('profiles').select('id')

  // Fetch recent logs
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*, user:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t.status === 'Completed').length || 0,
    pending: tasks?.filter(t => t.status === 'Pending').length || 0,
    inProgress: tasks?.filter(t => t.status === 'In Progress').length || 0,
    review: tasks?.filter(t => t.status === 'Review').length || 0,
    critical: tasks?.filter(t => t.priority === 'Critical').length || 0,
  }

  // Calculate weekly completed tasks for chart
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const weeklyData = daysInWeek.map(day => {
    const completedOnDay = tasks?.filter(t => 
      t.status === 'Completed' && t.updated_at && isSameDay(new Date(t.updated_at), day)
    ).length || 0
    return completedOnDay
  })

  const kpis = [
    { label: 'Total Tasks', value: stats.total, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Critical Tasks', value: stats.critical, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Team Members', value: profiles?.length || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome back to your productivity overview</p>
        </div>
        <div className="hidden text-sm text-gray-500 sm:block">
          Last updated: {format(new Date(), 'PPpp')}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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

      <DashboardCharts statusData={stats} weeklyData={weeklyData} />

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {logs?.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              <div className="mt-0.5 rounded-full bg-indigo-50 p-1.5">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{log.user?.full_name || 'System'}</span> {log.action.replace('_', ' ').toLowerCase()}
                </p>
                <p className="text-xs text-gray-500">{format(new Date(log.created_at), 'PPp')}</p>
              </div>
            </div>
          ))}
          {(!logs || logs.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity logs found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
