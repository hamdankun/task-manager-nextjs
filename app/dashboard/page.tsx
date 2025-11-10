import Link from 'next/link'
import { DashboardLayout } from '@/src/presentation/components/dashboard/DashboardLayout'
import { getAuthUser, getUserFullName, getUserEmail } from '@/src/lib/auth'
import { CheckCircle2, ListTodo } from 'lucide-react'

/**
 * Dashboard Page
 *
 * Placeholder for authenticated users
 * Will be populated in later phases with task management features
 */

// Mark this route as dynamic because it uses cookies
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getAuthUser()
  const userName = await getUserFullName()
  const userEmail = await getUserEmail()

  // If no user in cookies, they should be redirected by middleware in Phase 3
  // For now, show placeholder data
  if (!user) {
    return (
      <DashboardLayout userName="User" userEmail="user@example.com">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Welcome! Please log in to continue.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userName={userName} userEmail={userEmail}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {userName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Manage your tasks and stay productive
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tasks Link */}
          <Link
            href="/dashboard/tasks"
            className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Tasks
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Create and manage your tasks
                </p>
              </div>
              <ListTodo className="w-6 h-6 text-gray-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>

          {/* Profile Link */}
          <Link
            href="/dashboard/profile"
            className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Profile
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Edit your profile information
                </p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-gray-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>

          {/* Settings Link */}
          <Link
            href="/dashboard/settings"
            className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Change your password
                </p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-gray-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
