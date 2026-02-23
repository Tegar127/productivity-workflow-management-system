import { Profile } from '@/types/database'
import { Bell, User } from 'lucide-react'

interface NavbarProps {
  user: Profile | null
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-800 md:hidden">ProWorkflow</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  )
}
