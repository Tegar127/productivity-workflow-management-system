'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface DashboardChartsProps {
  statusData: {
    pending: number
    inProgress: number
    review: number
    completed: number
  }
  weeklyData?: number[]
}

export function DashboardCharts({ statusData, weeklyData }: DashboardChartsProps) {
  const doughnutData = {
    labels: ['Pending', 'In Progress', 'Review', 'Completed'],
    datasets: [
      {
        data: [statusData.pending, statusData.inProgress, statusData.review, statusData.completed],
        backgroundColor: [
          '#94a3b8', // slate-400
          '#60a5fa', // blue-400
          '#fbbf24', // amber-400
          '#34d399', // emerald-400
        ],
        borderWidth: 1,
      },
    ],
  }

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: weeklyData || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#6366f1',
        borderRadius: 4,
      },
    ],
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Task Status Distribution</h3>
        <div className="h-64">
          <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Weekly Productivity</h3>
        <div className="h-64">
          <Bar data={barData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  )
}
